# AI-SDLC Factory — Build Plan

A system that turns raw project material (PDFs, docs, spreadsheets, git repos) into a
governed knowledge base, uses that knowledge base to draft SDLC artifacts (starting
with requirements specs), self-checks its own output with an independent LLM judge,
and does all of this through declarative **playbooks** executed by **orchestrated AI
agents** — with a light, minimal UI and a choice of local or cloud LLMs per project.

This plan is written the way a V-Model project would be scoped: each capability has a
matching verification/validation step, and the system is architected so it can grow
from "left side of the V" (requirements) into the right side (design, test case
generation, verification) without a rewrite.

**Design principle — no black box, no lock-in:** the platform's value is the
*concepts* (playbooks, agent roles, judge rubrics, prompts), not a proprietary runtime
that traps them. Every generated prompt, agent config, and rubric must be visible,
diffable, and exportable as plain files a customer can run against any LLM API with no
dependency on this platform. See [§3.5](#35-transparency--portability--see-under-the-hood).

---

## 1. Where this sits in the V-Model

```
Concept of Ops ──────────────────────────────────────────────► Acceptance Test
      │  Requirements Spec (THIS SYSTEM: v1 scope)  ◄─────────────► Requirements-based Test
      │        │                                                          ▲
      │        ▼                                                          │
      │  Architecture / Design Spec  (v2 scope)     ◄─────────────► Integration Test
      │        │                                                          ▲
      │        ▼                                                          │
      │  Detailed Design            (v3 scope)      ◄─────────────► Unit Test
      │        │                                                          │
      └────────┴────────────────► Implementation ────────────────────────┘
```

- **v1 (this plan's main focus):** knowledge base + requirements generation + LLM-judge
  verification of requirements quality. This is the left-hand top rung and its
  verification counterpart (are the requirements complete, unambiguous, testable,
  traceable — i.e. "verified" before anything downstream depends on them).
- **v2/v3 (designed for, not built yet):** the same playbook/agent/judge pattern
  extends downward to design specs and test-case generation, closing the V. The data
  model and orchestration layer below are deliberately generic so this extension is a
  new playbook, not new architecture.

---

## 2. Core concepts & data model

| Entity | Purpose |
|---|---|
| **Project** | Top-level container. Has a knowledge-scope policy: `project-private`, `org-shared` (read from a shared pool), or `hybrid` (private + selected shared sources). Has an allowed-model policy (e.g. "local-only", "cloud-ok", specific providers). |
| **KnowledgeSource** | One ingested thing: a PDF, a DOCX, an XLSX, a git repo (by URL + ref), a Confluence/Jira export, a web page. Belongs to exactly one project OR to the org-shared pool. |
| **Document / Chunk / Embedding** | Parsed representation. Chunk carries provenance: `source_id`, page/section/commit/file path, so every generated sentence can be traced back. |
| **RequirementSpecRun** | One "generate requirements" job: inputs used, playbook used, model profile used, output artifact, status. |
| **RequirementItem** | Atomic requirement (EARS or IEEE-830 style), with `id`, `text`, `type` (functional/non-functional/constraint), `source_refs[]` (traceability), `status` (draft/judged/approved/rejected). |
| **JudgeEvaluation** | Output of the LLM-judge pass on a RequirementSpecRun or individual RequirementItem: rubric scores, flagged issues, suggested rewrite, pass/fail against threshold. |
| **Playbook** | Declarative, versioned YAML describing a multi-step workflow (steps, agent roles, model profile per step, gates, judge rubric). |
| **PlaybookRun** | An execution instance of a Playbook — the orchestration trace, all agent I/O, cost/latency, human approvals. |
| **ModelProfile** | Named config pointing at a concrete LLM (provider, endpoint, model id, temperature, context window, cost class) — `local` (a model in `LocalModelInstallation`, run on-box) or `cloud` (Anthropic/OpenAI/Azure OpenAI/Bedrock), switchable per project or per playbook step. |
| **LocalModelInstallation** | One downloaded-and-installed local model: `model_key` (e.g. `llama3.1:8b`), size on disk, download status (`not_installed/downloading/ready/error`), checksum, last-used timestamp. Drives the in-app "download and run" flow — see §3.4. |
| **PromptTemplate** | The actual system/user prompt text (with placeholders) behind an agent step — plain text/Jinja, versioned, owned by the Playbook, never hidden in application code. |
| **AgentConfig** | The fully-resolved config for one agent step: rendered prompt, tool/function schemas, model params, rubric (if a judge). This is what gets exported — see §3.5. |

Cross-project vs. project-only knowledge is modeled at the `KnowledgeSource` level, not
bolted on later: retrieval always filters by `project_id IN (project.private_sources) OR
source.visibility = 'org-shared' AND source.id IN project.linked_shared_sources`.

---

## 3. High-level architecture

```
┌──────────────────────────────── Frontend (React/Next.js) ────────────────────────────────┐
│  Project switcher · KB explorer · Playbook Studio · Requirement Editor · Judge panel       │
└───────────────────────────────────────────┬───────────────────────────────────────────────┘
                                             │ REST/GraphQL + WebSocket (live agent trace)
┌────────────────────────────────────────────▼──────────────────────────────────────────────┐
│                                    API Layer (FastAPI)                                     │
│  Projects · Sources · Playbooks · Runs · Auth/RBAC · Model Registry                        │
└──────┬───────────────────┬────────────────────┬───────────────────┬───────────────────────┘
       │                   │                    │                   │
┌──────▼──────┐  ┌─────────▼─────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│  Ingestion   │  │   Orchestrator     │  │  Model Router   │  │  Knowledge     │
│  Pipeline    │  │  (LangGraph-style  │  │  (LLM adapter    │  │  Store         │
│  (per-type   │  │   state machine)   │  │  local + cloud)  │  │  Postgres +    │
│  parsers)    │  │  runs Playbooks as │  │                  │  │  pgvector/     │
│              │  │  agent graphs      │  │                  │  │  Qdrant        │
└──────┬───────┘  └─────────┬─────────┘  └────────┬─────────┘  └───────┬────────┘
       │                    │                     │                   │
       └────────────────────┴─────────────────────┴───────────────────┘
                              Object storage (S3/MinIO) for raw files
```

### 3.1 Ingestion pipeline (per source type)
- **PDF:** layout-aware extraction (PyMuPDF/unstructured) → text + tables + headings.
- **DOCX/PPTX:** python-docx/unstructured, preserve heading hierarchy for chunking.
- **XLSX:** sheet-aware parsing — each table becomes structured rows, not flattened
  text, so numeric/tabular requirements (e.g. parameter tables) stay queryable.
- **Git repo:** clone (shallow), extract README/docs, code comments/docstrings, commit
  history, existing issue trackers if linked — treated as "as-built" evidence for
  reverse-engineering requirements from legacy systems.
- Common pipeline after type-specific extraction: clean → semantic chunk (heading- and
  token-aware, ~500–800 tokens with overlap) → embed (model from ModelProfile,
  swappable local/cloud embedder) → upsert to vector store with provenance metadata →
  status callback to UI (progress, per-file errors surfaced, not swallowed).

### 3.2 Orchestrator & agents
Use a graph-based orchestrator (LangGraph, or a small custom state machine if you want
zero extra dependency) so each Playbook step is a node with explicit inputs/outputs,
retries, and a visible trace. Baseline agent roles for the requirements playbook:

1. **Retrieval Agent** — hybrid search (vector + keyword) over the project's allowed
   knowledge sources, plus query decomposition for broad asks ("generate SRS for
   module X").
2. **Drafting Agent** — turns retrieved evidence + user-supplied input (e.g. a stated
   business goal, a stakeholder email, a ticket) into structured requirements
   (EARS syntax: "When <trigger>, the system shall <response>"), each tagged with
   `source_refs`.
3. **Structuring Agent** — normalizes into the target template (IEEE 830 / ISO 29148
   sections: scope, functional, non-functional, constraints, interfaces) and assigns
   requirement IDs.
4. **Judge Agent** — **a different model/provider than the drafting agent** (critical:
   avoids self-preference bias) scores each requirement and the set as a whole against
   a rubric — completeness, atomicity, unambiguity, verifiability/testability,
   consistency, traceability coverage — and returns pass/fail + specific rewrite
   suggestions, not just a number.
5. **Refinement Agent** — takes judge feedback, redrafts only the flagged items, capped
   at N iterations (default 2) to bound cost, then hands off to a human approval gate.
6. **Traceability Agent** — maintains the requirement ↔ source-chunk ↔ (later)
   test-case matrix as artifacts change.

Each agent step declares its own `ModelProfile`, so e.g. retrieval reranking can run on
a cheap local model while drafting uses a strong cloud model and judging uses a
different vendor's model — this is a deliberate architectural choice, not a detail.

### 3.3 Playbooks (the "software factory" layer)
Playbooks are versioned YAML, editable by users (not just developers), e.g.:

```yaml
name: requirements-from-mixed-sources
version: 1
inputs:
  - knowledge_sources        # selected in UI
  - stakeholder_input        # free text / uploaded brief
steps:
  - id: retrieve
    agent: retrieval
    model_profile: local-fast
  - id: draft
    agent: drafting
    model_profile: cloud-strong
    output_format: ears
  - id: structure
    agent: structuring
    template: ieee-830
  - id: judge
    agent: judge
    model_profile: cloud-alt-vendor   # different vendor than 'draft'
    rubric: requirements-quality-v1
    gate: auto-refine-then-human       # auto-loop, then always stop for human sign-off
    max_iterations: 2
  - id: publish
    agent: traceability
    outputs: [srs_document, traceability_matrix]
```

This is literally the "AI software factory" concept: playbooks = factory process
definitions, agents = factory stations, the orchestrator = the production line, the
judge/gate = QC checkpoints (mirroring V-model review gates). New playbooks (design-spec
generation, test-case generation, code-review-from-requirements) are added without
touching core infrastructure.

### 3.4 Model layer (local + cloud)
- Adapter interface (`LLMProvider.generate()`, `.embed()`) implemented per backend:
  a local runtime for on-box models; Claude API (Anthropic) as the flagship cloud
  adapter, with OpenAI/Azure OpenAI/Bedrock as additional cloud adapters behind the
  same interface.
- `ModelProfile` records are the only place a provider is chosen — switching a project,
  or a single playbook step, between a local model and Claude API is a config change
  in the UI, not a code change or a redeploy.
- Project-level policy enforcement: a project flagged "local-only" (e.g. for sensitive
  IP) must reject any step whose ModelProfile resolves to a cloud provider — enforced
  server-side, not just hidden in the UI.
- Cost/latency/token accounting per PlaybookRun for observability and budgeting.

**Local Model Manager — download and run a local LLM from inside the app.** This is a
first-class feature, not an assumption that the user already has a model server
running:
- The app manages a **local runtime process** (Ollama is the pragmatic default: it
  exposes a pull/list/delete/generate HTTP API, so the app can drive the whole
  lifecycle without shelling out to a separate CLI the user has to configure).
- **Model catalog:** a curated list of pullable local models (e.g. Llama, Mistral,
  Qwen, DeepSeek-Coder families) shown with size on disk, approximate RAM/VRAM need,
  and license — so the choice is informed, not a blind pull.
- **Download flow:** user picks a catalog entry → app triggers the pull → progress
  (percent, MB downloaded) streams live to the UI over the same WebSocket/SSE
  mechanism used for agent traces → on completion the model becomes a
  `LocalModelInstallation` with status `ready` and is immediately selectable as a
  `ModelProfile`.
- **Lifecycle management:** list installed models with disk usage, remove a model to
  free space, re-check runtime health (is the local daemon up, is a model actually
  loaded) and surface a clear, actionable status ("local runtime offline — start it" /
  "model not installed yet — download") instead of a raw connection error.
- **Switching, not choosing once:** any `ModelProfile` — including per-step overrides
  inside a playbook (§3.3) — can point at either a local installation or Claude API.
  A project can run entirely offline on local models, entirely on Claude API, or mix
  both per step (e.g. local for retrieval reranking, Claude API for drafting and
  judging) — the same policy enforcement above still applies.
- vLLM/LM Studio remain supported as *advanced* local backends for users who already
  run their own inference server, but they sit outside the app-managed download flow
  (the app talks to them as a pre-existing endpoint, the way it talks to any cloud
  adapter) — only the Ollama-backed path gets the in-app download experience in v1.

### 3.5 Transparency & portability — "see under the hood"
Many prospective customers will want the *concepts* (playbooks, prompts, judge
rubrics, orchestration patterns) without adopting the platform itself. This is treated
as a first-class capability, not a debug feature:

- **Nothing is a hidden system prompt.** Every `AgentConfig` — the exact rendered
  prompt sent to the model (system + user + injected context), tool/function schemas,
  temperature/params, and (for judges) the rubric text — is stored as data and visible
  in the UI, not buried in application code.
- **"Under the Hood" panel on every run.** Alongside the live agent trace (§3.2 / UI
  §4), each step has an expandable view showing: the exact prompt sent, the raw model
  response, retrieved chunks that were injected, and the resulting parsed output. This
  is the debugging view *and* the portability view — same data, two audiences.
- **One-click export, plain formats only.** A Playbook, or a single PlaybookRun,
  exports as a plain folder/zip: `playbook.yaml`, `prompts/*.md` (or `.jinja`),
  `rubrics/*.md`, `model_profile.json` (provider-agnostic schema: role, temperature,
  max_tokens — no platform-specific fields). No proprietary serialization — a customer
  should be able to `curl` these prompts straight into any LLM API themselves.
- **Playbooks are the DSL, and the DSL is the deliverable.** The YAML shown in §3.3 is
  not an internal representation compiled into something else — it *is* the portable
  artifact. Running it through this platform adds orchestration, judging, tracing, and
  UI; running the same YAML + prompt files by hand (or in the customer's own LangGraph/
  n8n/Airflow setup) reproduces the same steps, just without those conveniences.
- **Consequence for the roadmap:** the export format is designed in Phase 4 (Playbook
  engine) alongside the engine itself, not retrofitted later — see §7.

---

## 4. UI/UX — light, minimal design language

- **Visual system:** white/near-white surfaces, single accent color, generous
  whitespace, typography-led hierarchy (no heavy borders/shadows/gradients). Component
  base: Tailwind + shadcn/ui (or Radix primitives directly) — both default to this
  aesthetic and are easy to keep minimal.
- **Key screens:**
  1. **Project home** — knowledge sources, recent runs, health (ingestion status,
     token/cost this month).
  2. **Knowledge Base Explorer** — source list with type icons, ingestion status,
     scope badge (Project-only / Org-shared), quick preview of extracted chunks.
  3. **Playbook Studio** — visual DAG of the selected playbook's steps (read-only graph
     view is enough for v1; editable node graph is a v2 nicety), model profile per
     step, "Run" button.
  4. **Run view (live)** — streaming agent trace via WebSocket: current step, tokens
     used, intermediate output, so users watch the "factory line" move rather than
     stare at a spinner.
  5. **Requirement Editor** — generated SRS as structured, editable list; each item
     shows its judge score, flagged issues, and source citations inline (click → jump
     to source chunk); accept/edit/reject per item; export (Markdown/Word/ReqIF/Jira).
  6. **Judge report** — aggregate rubric scores, trend across runs, side-by-side
     before/after for refinement iterations.
  7. **Under the Hood panel** (attached to every run/step, see §3.5) — exact prompt
     sent, raw model response, injected context, model params; an **Export** button
     next to it that downloads the plain-file version (playbook YAML + prompt files +
     model profile JSON) — same panel serves debugging and take-it-with-you portability.
  8. **Model Manager** — catalog of pullable local models with a one-click **Download**
     (live progress bar), list of installed models with disk usage and a **Remove**
     action, runtime health indicator, and the Claude API connection (key entry,
     status check). This is where a `ModelProfile` gets created and where the
     local ↔ Claude API switch actually happens — kept as its own screen rather than
     buried in project settings, since it's a recurring action (new machine, low disk,
     trying a new model), not a one-time setup step.
- **Interaction principle:** every AI output is inspectable and reversible — show
  citations and judge rationale by default, never present a generated requirement as
  fact without its provenance one click away. Nothing the system does to produce an
  output is hidden from the user who wants to see it.

---

## 5. Tech stack recommendation

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js + TypeScript, Tailwind, shadcn/ui, TanStack Query | fast to build minimal UI, good WS support for live traces |
| API | FastAPI (Python) | same language as ingestion/LLM ecosystem, async-native |
| Orchestration | LangGraph (or custom asyncio state machine) | explicit graph, retries, visible state — fits "playbook as graph" model |
| Relational store | PostgreSQL | projects, runs, requirement items, RBAC |
| Vector store | pgvector (start) → Qdrant if scale demands | avoids extra infra for v1; easy migration path |
| Object storage | MinIO (self-host) / S3 | raw files |
| Local LLM runtime | Ollama (app-managed pull/list/delete/run), vLLM/LM Studio as advanced manual option | Ollama's HTTP lifecycle API is what makes in-app "download and run" possible without shelling out to a CLI |
| Cloud LLM | Claude API (Anthropic) as flagship adapter; OpenAI/Azure as additional adapters | judge uses a different vendor than drafting; Claude API is the primary supported cloud path |
| Parsing | unstructured.io, PyMuPDF, python-docx, openpyxl, GitPython | per-format best-of-breed |
| Auth | OAuth2/OIDC (Keycloak or Auth0) + project-level RBAC | multi-project, multi-tenant knowledge scoping |
| Observability | OpenTelemetry traces per PlaybookRun, Langfuse/Phoenix for LLM-specific tracing | needed to debug agent chains and judge disagreements |

---

## 6. Non-functional requirements (verification criteria for this system itself)

- **Traceability:** every generated sentence must resolve to ≥1 source chunk or be
  explicitly flagged "no source — user-asserted."
- **Determinism of judging:** judge rubric is versioned; re-running the same judge
  version on the same input must be stable within a defined tolerance (log
  temperature=0 for judge calls).
- **Data isolation:** project-private sources must be provably unreachable from other
  projects' retrieval calls — this needs a test, not just a code review (row-level
  security in Postgres is a strong option).
- **Model swap safety:** switching a ModelProfile from cloud to local must not silently
  change output schema — enforce structured output (JSON schema/function-calling) at
  the adapter boundary regardless of backend.
- **Cost/latency budget per run**, surfaced to the user before a large playbook runs
  against a big knowledge base.
- **Portability / no lock-in:** any Playbook + its prompts + rubrics must be exportable
  to plain YAML/Markdown/JSON and be independently runnable against a bare LLM API,
  with no reference to this platform's runtime, IDs, or database — this should be an
  automated export test (export → run outside the platform → same result), not just a
  documentation promise.
- **Local model download integrity:** every model pull is checksum-verified before
  being marked `ready`; a failed or interrupted download must leave the installation
  in a clearly-`error` state, never a half-downloaded model silently offered as usable.

---

## 7. Phased delivery roadmap

| Phase | Scope | "V-model gate" to exit phase |
|---|---|---|
| **0 — Foundations** | Repo, auth, Project CRUD, ModelProfile registry (1 local + 1 cloud provider wired), Postgres schema | Design review: schema + API contract sign-off |
| **1 — Ingestion MVP** | PDF + DOCX + XLSX + Git repo connectors, chunk/embed pipeline, KB Explorer UI | Verification: ingest a real mixed-format sample set, confirm 100% traceable chunks |
| **2 — Requirements generation** | Retrieval + Drafting + Structuring agents, single hardcoded playbook, Requirement Editor UI | Validation: generated SRS reviewed by a human SME against source docs |
| **3 — Judge loop** | Judge Agent (separate vendor), rubric v1, auto-refine loop, judge report UI | Verification: judge scores correlate with human review on a labeled test set |
| **4 — Playbook engine** | YAML playbook parser, Playbook Studio UI, ability to define new playbooks without code, **export format + Under the Hood panel (§3.5)** | Design review: add a second playbook (e.g. "requirements from git-only") with no core changes; export a playbook and run it outside the platform to confirm portability |
| **5 — Cross-project knowledge & governance** | Org-shared sources, project policy (local-only/cloud-ok), RBAC | Security review: isolation tests pass |
| **6 — Extend the V** | Design-spec playbook, test-case-generation playbook reusing the same judge/orchestration pattern | Proves the architecture generalizes down the V-model |

---

## 8. Key risks & mitigations

- **Judge bias / collusion between drafting and judging models** → enforce different
  model families/vendors for draft vs. judge; periodically calibrate judge against
  human-labeled samples.
- **Hallucinated requirements with no real source** → hard requirement: structured
  output must include `source_refs`; empty `source_refs` is auto-flagged, never silently
  accepted.
- **Local model quality gap vs. cloud** → let project policy pick "local-only" only
  where acceptable, and make model profile swap-tested per playbook, not assumed
  equivalent.
- **Chunking losing tabular/Excel semantics** → treat spreadsheet rows as structured
  data (not just text blobs) at ingestion so numeric requirements aren't garbled.
- **Playbook sprawl / unmaintainable YAML zoo** → versioned playbooks with a schema
  validator and a "playbook lint" step in CI, same discipline as pipeline-as-code.
- **Customers hesitant to adopt due to perceived lock-in** → the transparency/export
  design in §3.5 is the mitigation itself: sell the concepts (playbooks, prompts,
  judge rubrics) as portable IP the customer owns, with the platform as the optional
  convenience layer (orchestration, tracing, UI) on top — not the only way to use them.
- **Local model downloads are large (multi-GB) and can fail mid-transfer, or exceed
  available disk/RAM** → resumable pulls where the runtime supports it, disk-space
  pre-check before starting a download, and a hard `error` state (never a silent
  partial-model) on failure — see the download-integrity NFR in §6.

---

## 9. Immediate next steps

1. ~~Confirm target stack~~ — **decided: Python** (FastAPI + orchestrator/ingestion) for
   the backend, Next.js/TypeScript for the frontend only, per the stack discussion.
2. Scaffold repo: `/api`, `/web`, `/orchestrator`, `/ingestion`, `/playbooks` (this
   plan's module boundaries).
3. Follow [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) — every feature above broken into
   atomic, individually-tested build steps (M0–M11), developed strictly one step at a
   time with a test gate before moving on.
