# Development Plan — Atomic, Test-Gated Build Order (Python)

Companion to [PLAN.md](PLAN.md). That document is the architecture; this document is
the **build order**: every feature broken into the smallest independently-testable
unit, done strictly in sequence. Nothing in step N+1 starts until step N's test is
green.

Stack decision (from prior discussion): **Python** for everything backend — API,
ingestion, orchestrator, model router, agents. TypeScript/Next.js frontend only starts
once the backend API contract is stable (Milestone 11), so early milestones don't
depend on UI at all.

---

## 0. Rules of engagement

1. **Atomic unit = one deliverable + one test that fails before it exists and passes
   after.** If you can't write the test first, the unit is still too big — split it.
2. **Test-first where the contract is known** (data models, adapters, parsers,
   schemas). Test-after is acceptable only for exploratory glue code, but the test
   still must exist before moving to the next unit.
3. **No live LLM/API calls in the regular test suite.** Mock at the HTTP boundary
   (`respx` for httpx, `vcrpy` for recorded cassettes). A separate, smaller **nightly**
   suite runs a handful of tests against a real local model (Ollama) to catch adapter
   drift — it never gates a commit.
4. **Every milestone ends with one integration test** that exercises everything built
   in that milestone end-to-end via the public API (`TestClient`), not just the unit
   tests in isolation. This is the "verification gate" — mirrors the V-model gates
   already defined in PLAN.md §7, just at finer granularity.
5. **Commit per atomic unit**, not per milestone. Small, reviewable, revertible.
6. **Definition of done for a unit:** test passes, `ruff`/`mypy` clean, committed. Only
   then move to the next row in the table.

Suggested tooling: `pytest` + `pytest-cov`, `respx`/`vcrpy` for HTTP mocking,
`factory_boy` or plain fixtures for test data, `testcontainers-python` (or a
docker-compose Postgres) for DB-backed tests, `ruff` + `mypy` + `pre-commit`.

---

## M0 — Repo & tooling bootstrap

| # | Deliverable | Test / Definition of Done |
|---|---|---|
| 0.1 | Repo skeleton: `/api`, `/ingestion`, `/orchestrator`, `/playbooks`, `/web` (empty placeholder), `/tests` | `pytest --collect-only` runs with no errors |
| 0.2 | `pyproject.toml` (uv or poetry), dependency pins, `src/` layout | `pip install -e .` succeeds in a clean venv |
| 0.3 | pytest + coverage config, `ruff` + `mypy` + `pre-commit` | Dummy `test_sanity.py::test_true` passes; `ruff check .` and `pre-commit run --all-files` pass on empty repo |
| 0.4 | `docker-compose.yml`: Postgres (+ pgvector extension) | Healthcheck script connects and runs `SELECT 1` |
| 0.5 | Alembic skeleton wired to the compose DB | `alembic upgrade head` runs clean against an empty DB (zero tables — baseline) |
| 0.6 | CI workflow (lint + test on push/PR) | CI green on a trivial commit; CI red demonstrated once on purpose (e.g. failing assert) then fixed, to prove the gate works |

---

## M1 — Core data model: Project, ModelProfile, KnowledgeSource

| # | Deliverable | Test / Definition of Done |
|---|---|---|
| 1.1 | `Project` SQLAlchemy model (id, name, knowledge_scope_policy enum, model_policy enum, timestamps) | Create/read round-trip against test DB (transactional rollback fixture) |
| 1.2 | Alembic migration for `Project` | `upgrade` then `downgrade` both run clean |
| 1.3 | Pydantic schemas: `ProjectCreate`, `ProjectRead`, `ProjectUpdate` | Invalid `knowledge_scope_policy` value raises `ValidationError` |
| 1.4 | Repository functions: `create_project`, `get_project`, `list_projects`, `update_project` | One unit test per function against test DB |
| 1.5 | FastAPI routes: `POST/GET /projects`, `GET /projects/{id}` | `TestClient` tests incl. the 404 case |
| 1.6 | `ModelProfile` model + migration + schemas + repo + routes (mirrors 1.1–1.5) | Same pattern; additionally: creating a cloud profile without an `endpoint`/`api_key_ref` fails validation |
| 1.7 | `KnowledgeSource` model + migration + schemas + repo + routes | Creating with an unknown `project_id` fails FK constraint (test asserts 4xx, not a 500) |
| 1.8 | **Milestone integration test** | Via `TestClient` only: create project → create model profile → create knowledge source scoped to it → list endpoints return correctly scoped, correctly shaped results |

---

## M2 — Model router / LLM adapter layer

| # | Deliverable | Test / Definition of Done |
|---|---|---|
| 2.1 | `LLMProvider` abstract interface: `generate(request) -> Response`, `embed(texts) -> list[vector]`; typed dataclasses for request/response | A `FakeProvider` implementation passes a shared **contract test suite** (mixin every adapter must pass) |
| 2.2 | Claude API adapter (Anthropic) | Passes contract suite against `respx`-mocked responses; no live call in default test run |
| 2.3 | Ollama adapter (local, points at an already-running daemon) | Passes contract suite against a mocked local HTTP endpoint |
| 2.4 | `ModelProfile` → provider factory/resolver | Given a `ModelProfile` row, returns a correctly configured adapter; unsupported provider raises a clear typed error, not `KeyError` |
| 2.5 | Policy enforcement: reject cloud `ModelProfile` on a `local-only` project | Unit test asserts `PermissionError`/403, enforced at resolver level (server-side), not just UI |
| 2.6 | Token/cost accounting wrapper (`CallLog` table) around every adapter call | Mocked response → wrapper writes a `CallLog` row with token counts and cost class |
| 2.7 | **Sub-milestone integration test** | Resolve a `ModelProfile` for a project, call `generate()` (mocked), assert `CallLog` written and local-only policy correctly blocks a cloud profile |

### Local Model Manager (download-and-run-from-the-app)

| # | Deliverable | Test / Definition of Done |
|---|---|---|
| 2.8 | `LocalModelInstallation` model + migration (model_key, size, status enum, checksum, last_used_at) | DB round-trip; status defaults to `not_installed` |
| 2.9 | Model catalog: static/versioned list of pullable models (key, display name, size, RAM need, license) + schema validation | Catalog loads; each entry validates against the schema; a malformed entry fails fast at load, not at request time |
| 2.10 | Ollama pull client wrapper: trigger `/api/pull`, parse the streamed progress JSON into a typed progress event | Given a mocked chunked response (partial % → 100% → success, and separately a mocked failure chunk), wrapper yields correctly parsed progress events and a correct terminal state for each case |
| 2.11 | Disk-space pre-check before starting a pull | Mocked "insufficient disk space" condition → pull is refused up front with a clear error, never started then left half-done |
| 2.12 | Download progress → SSE/WebSocket endpoint | Test client connected to the stream receives the expected ordered progress events end-to-end for a mocked pull |
| 2.13 | Checksum verification on pull completion; updates `LocalModelInstallation.status` to `ready` only on match, `error` (with reason) on mismatch or interruption | Unit tests for: matching checksum → `ready`; mismatched checksum → `error`, row never left at `downloading` |
| 2.14 | Remove/uninstall endpoint: calls Ollama delete + clears/updates the registry row | Mocked delete call → row removed (or marked `not_installed`); a second delete on an already-removed model is a clean no-op, not a 500 |
| 2.15 | Runtime health check (daemon reachable / model actually loaded) | Mocked reachable and unreachable cases each surface a specific, actionable status — never a generic connection-refused stack trace bubbling to the API caller |
| 2.16 | `ModelProfile` creation guard: a `local` profile must reference a `ready` installation | Creating a profile against a `not_installed` or `downloading` model returns a clear 4xx ("model not installed yet") rather than deferring the failure to first use |
| 2.17 | **Milestone integration test** | Browse catalog → trigger download (mocked stream to completion) → installation reaches `ready` → create a `ModelProfile` against it → resolver (2.4) returns a working adapter; separately, switching the same playbook step's `ModelProfile` to the Claude API adapter (2.2) round-trips through the same resolver with no code change |

---

## M3 — Ingestion pipeline

| # | Deliverable | Test / Definition of Done |
|---|---|---|
| 3.1 | Upload endpoint + object storage adapter (local disk now, MinIO-compatible interface) | Upload a small fixture file, retrieve identical bytes by key |
| 3.2 | PDF parser → `list[RawBlock]` (text + tables + headings) | Fixture PDF with known content; assert expected text/table extracted |
| 3.3 | DOCX parser (same `RawBlock` contract) | Fixture DOCX; assert heading hierarchy preserved in output |
| 3.4 | XLSX parser — sheet-aware, rows as structured dicts (not flattened text) | Fixture XLSX; assert rows come back as structured records, numeric types preserved |
| 3.5 | Git repo connector — shallow clone, extract README/docs/docstrings + commit metadata | Point at a small local bare-repo fixture; assert expected files + commit refs extracted |
| 3.6 | Text cleaner/normalizer (whitespace, boilerplate, encoding artifacts) | Table of known-bad inputs → expected clean outputs |
| 3.7 | Semantic chunker (heading-aware, token-bounded, overlap) | Known input → exact expected chunk boundaries/count/overlap |
| 3.8 | Chunk + provenance persistence (`source_id`, page/section/commit ref) | DB round-trip; provenance fields independently queryable |
| 3.9 | Ingestion orchestrator: dispatch by type → clean → chunk → persist; per-file errors surfaced, batch doesn't abort | Mixed batch incl. one corrupt file: good files succeed, bad file reports a specific error status, no crash |
| 3.10 | Ingestion status API (`pending → processing → done/error`) | Submit source, poll status, assert correct transitions |
| 3.11 | **Milestone integration test** | Upload one PDF + one XLSX to a project, run ingestion end-to-end via API, assert chunks in DB with correct scope + provenance |

---

## M4 — Embedding & retrieval

| # | Deliverable | Test / Definition of Done |
|---|---|---|
| 4.1 | Embedding adapter interface | `FakeEmbedder` passes contract test |
| 4.2 | pgvector table + migration for chunk embeddings | Migration applies; insert/query round-trip |
| 4.3 | Embedding pipeline: chunk → vector → upsert | Given N chunks, assert N vector rows with correct dimensionality |
| 4.4 | Retrieval: similarity search scoped by project + shared-source policy | Seed two projects (one private-only, one with a shared source); **assert project A's query never returns project B's private chunks** — this is the isolation NFR from PLAN.md §6, written as a test here, not deferred |
| 4.5 | Hybrid search: keyword/BM25 fallback merged with vector results | Query on an exact term embeddings under-rank; assert it's still surfaced |
| 4.6 | **Milestone integration test** | Ingest content into two projects, run retrieval against both; assert relevance *and* isolation in one pass |

---

## M5 — Orchestrator & agent framework

| # | Deliverable | Test / Definition of Done |
|---|---|---|
| 5.1 | Agent step contract: typed input schema, output schema, `run(context) -> StepResult` | A `NoOpAgent` passes the shared agent contract test suite |
| 5.2 | Sequential graph runner executing an ordered step list | Fake 2-step pipeline: step1's output is visibly step2's input |
| 5.3 | `PlaybookRun` persistence: per-step input/output, status, timing | Run fake pipeline; assert `PlaybookRun` + step records queryable afterward |
| 5.4 | Bounded retry/failure handling per step | Fake agent fails twice then succeeds; assert retry count recorded and run still succeeds; a step that never succeeds fails the run after N retries, not silently |
| 5.5 | WebSocket trace emitter | Run fake pipeline; test WS client receives the expected ordered sequence of trace events |
| 5.6 | **Milestone integration test** | Run a 3-step fake playbook via the public API; confirm `PlaybookRun` record and streamed WS events match expected sequence |

---

## M6 — Playbook engine

| # | Deliverable | Test / Definition of Done |
|---|---|---|
| 6.1 | Playbook YAML schema (Pydantic model matching PLAN.md §3.3 example) | Valid YAML parses; a YAML missing a required field raises a specific, readable validation error |
| 6.2 | Playbook loader: YAML → validated object → steps wired to registered agent classes | Load the `requirements-from-mixed-sources` example; assert correct agent classes resolved per step |
| 6.3 | Playbook registry (versioned, listable) + CRUD routes | Register, list, fetch-by-name+version all round-trip |
| 6.4 | Playbook lint: agent exists, model_profile exists, rubric exists if step is a judge, **judge model_profile ≠ drafting model_profile** | A playbook violating any rule fails lint with a specific error naming the violated rule |
| 6.5 | **Milestone integration test** | Load a real playbook file, run it via the orchestrator with fake agents standing in, confirm expected output shape |

---

## M7 — Requirements-generation agents

| # | Deliverable | Test / Definition of Done |
|---|---|---|
| 7.1 | Retrieval Agent (wraps M4 behind the agent contract) + query decomposition for broad asks | Broad query → assert multiple sub-queries issued (mocked retrieval, assert call args) |
| 7.2 | Drafting Agent: builds prompt from retrieved chunks + user input, calls LLM, parses `RequirementItem[]` with `source_refs` | Mocked LLM returns fixed JSON → correct `RequirementItem` objects; **an item with empty `source_refs` is auto-flagged**, never silently accepted (NFR from PLAN.md §6) |
| 7.3 | Structuring Agent: maps items into IEEE-830 sections, assigns IDs (`FR-001`, `NFR-001`, …) | Given typed items, assert correct section placement and ID format, no collisions |
| 7.4 | `RequirementSpecRun` persistence (inputs, playbook, output artifact) | DB round-trip |
| 7.5 | **Milestone integration test** | Real Retrieval→Draft→Structure chain (LLM mocked) over ingested fixture content produces a structured spec where every item has ≥1 `source_ref` |

---

## M8 — Judge agent & refinement loop

| # | Deliverable | Test / Definition of Done |
|---|---|---|
| 8.1 | Rubric schema (versioned, weighted criteria) | Parse a rubric file; validate structure, reject malformed weights (e.g. don't sum sanely) |
| 8.2 | Judge Agent: scores each `RequirementItem` against rubric → `JudgeEvaluation` | Mocked judge LLM response → correct per-criterion scores + flagged issues parsed |
| 8.3 | Config-level enforcement: judge step's model ≠ draft step's model (extends 6.4) | Playbook reusing the same `ModelProfile` for both fails lint |
| 8.4 | Aggregate scoring + pass/fail threshold | Mixed per-item scores → correct pass/fail determination at the boundary values (off-by-one tested) |
| 8.5 | Refinement Agent: redraft only flagged items, bounded iterations | Fake judge flags 2/5 items → only those 2 re-sent to drafting; loop stops at `max_iterations` even if still failing |
| 8.6 | Human approval gate API: approve/reject/edit per item | Status transitions correctly; editing then approving persists the edited text, not the original |
| 8.7 | **Milestone integration test** | Full draft→judge→refine→human-gate loop with mocked LLMs runs exactly 2 iterations then stops, matching PLAN.md Phase 3 gate |

---

## M9 — Traceability & portability export

| # | Deliverable | Test / Definition of Done |
|---|---|---|
| 9.1 | Traceability matrix builder: item → source chunk(s) | Given a spec run, matrix rows link correctly; an item with no source appears flagged, not omitted |
| 9.2 | Markdown/Word SRS export | Generated doc contains every approved item's text + ID, in ID order |
| 9.3 | ReqIF/Jira-shaped export (stub acceptable, no live Jira yet) | Output validates against the target schema for a sample spec |
| 9.4 | "Under the Hood" export bundle: `playbook.yaml` + `prompts/*.md` + `model_profile.json` (PLAN.md §3.5) | Export a bundle, then — in a **separate script with zero imports from this platform's DB/ORM** — load the bundle and replay the drafting prompt against a mocked bare LLM call. This *is* the portability NFR test from PLAN.md §6, not a manual check |
| 9.5 | **Milestone integration test** | Run playbook → approve items → export SRS + traceability matrix + under-the-hood bundle, all three validated |

---

## M10 — Auth, RBAC, cross-project governance

| # | Deliverable | Test / Definition of Done |
|---|---|---|
| 10.1 | OIDC login (dev IdP) | Login issues a valid JWT; a protected endpoint rejects missing/invalid tokens |
| 10.2 | Project-level RBAC (owner/editor/viewer) | Viewer role gets 403 on POST/PUT endpoints; owner does not |
| 10.3 | Org-shared `KnowledgeSource` linking | Hybrid-scope project sees shared + private sources; an unlinked project sees neither (extends M4.4) |
| 10.4 | Row-level security at the DB layer (defense in depth, not just app-layer filtering) | Raw SQL as a low-priv DB role attempting a cross-project read fails even if it bypasses application code entirely |
| 10.5 | **Milestone integration test** | Two projects, a shared pool, mixed roles: full isolation + access-control suite green — this is the Phase 5 security-review gate from PLAN.md §7 |

---

## M11 — Frontend (TypeScript/Next.js), thin vertical slices

Starts only once M1–M9 have a stable, documented API (OpenAPI schema exported from
FastAPI). Each row is a full slice: UI + wiring + e2e test, not UI alone.

| # | Deliverable | Test / Definition of Done |
|---|---|---|
| 11.1 | Project list/create screen → M1 endpoints | Playwright e2e: create a project in the UI, see it in the list |
| 11.2 | Knowledge Base Explorer → M3 ingestion | e2e: upload a file, observe status transition to done |
| 11.3 | Playbook Studio (read-only DAG) → M6 | e2e: loads and correctly displays a playbook's steps |
| 11.4 | Run view (live trace) → M5 WebSocket | e2e: trigger a run, streamed steps appear in the UI in order |
| 11.5 | Requirement Editor → M7/M8 | e2e: approve/edit/reject an item, status updates and persists on reload |
| 11.6 | Judge report + Under the Hood panel → M8/M9 | e2e: Export button downloads a bundle with the expected files present |

---

## How to use this plan day to day

1. Work top-to-bottom, one row at a time. Don't start row N+1 until row N's test is
   green in CI, not just locally.
2. Each row is small enough to be one commit and (roughly) one sitting. If a row is
   taking noticeably longer than the others around it, it's a sign to split it further
   before continuing, not to push through.
3. Milestone integration tests are the real gate — treat them the way the V-model
   treats a review: the milestone isn't "done" until its own row passes, independent of
   how many unit tests below it are green.
4. Track progress as a checklist (this table, or mirrored into issues/tickets one row
   = one ticket) so "what's next" is never a judgment call.
