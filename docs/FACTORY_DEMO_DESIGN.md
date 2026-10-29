# Visual Software Factory — Demo Design

**Status:** Designed / specified, not built. Its first slice is the U1 vertical slice in [CONCEPT.md §10.1](CONCEPT.md). Later slices are not yet scheduled in DEVELOPMENT_PLAN.md. Each run is recorded as a `PlaybookRun` (CONCEPT §8).
**Audience:** Internal demo for stakeholders; engineers building the factory.

## 1. Goal

A visual, live demo that shows how the factory should work. It is a library of use-case playbooks, each covering one step of the V-cycle for a mobility (automotive) program. A team of AI agents, coordinated by an orchestrator, runs each playbook. The V-cycle is the backbone: each playbook sits on one arm of the V, and the right arm verifies the left. The demo runs on local models on this machine (Llama, Gemma, or Qwen via Ollama). A dashboard shows each agent's state, each review gate's result, and token usage. The same playbook model later connects to an organisation-wide factory view.

Enterprise model APIs (for example Anthropic, OpenAI, or Azure) are a planned option, not part of the demo. The model layer must allow them to be added later as a provider, with no changes to the orchestrator, playbooks, or dashboard.

## 2. Layers

```
┌──────────────────── Org-wide factory view (later, M10) ────────────────────┐
│ Aggregates runs, token spend and gate outcomes across factory instances    │
└────────────────────────────────────▲──────────────────────────────────────┘
                                     │ run events (shared JSON schema)
┌──────────────────── Factory dashboard (demo, M11 slice) ───────────────────┐
│ Agent board · Playbook timeline · Gate results · Token & cost panel         │
└────────────────────────────────────▲──────────────────────────────────────┘
                                     │ SSE stream + REST
┌──────────────────── Orchestrator (M5) + Playbook engine (M6) ──────────────┐
│ Runs playbook steps, assigns agents, enforces gates, records every call    │
└────────────────────────────────────▲──────────────────────────────────────┘
                                     │ LLMProvider.generate()
┌──────────────────── Model router (M2) ─────────────────────────────────────┐
│ Ollama profiles: local-fast (small), local-strong (larger), each tagged    │
└────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Model layer (local now, enterprise API later)

- **Provider interface:** the orchestrator calls only `LLMProvider.generate()` (PLAN.md §3.4). Each backend is an adapter behind that interface. The demo ships one adapter: Ollama.
- **Enterprise adapters (later):** an Anthropic, OpenAI, or Azure adapter implements the same interface and returns the same token fields. Enterprise credentials come from config or a secrets store, never from the playbook. A playbook step picks a profile, and the profile picks a provider, so moving a step from local to enterprise is a config change.
- **Provider-neutral token fields:** every adapter maps its response to the same `input_tokens` / `output_tokens` / `total_tokens` fields. Enterprise adapters also fill a cost field from the provider's price list, so the dashboard's cost panel works for both.
- Provider: Ollama at `OLLAMA_BASE_URL` (already in `.env.example`). Ollama is the default runtime per PLAN.md §3.4.
- Model profiles map a role to a model, e.g. `local-fast` → small Qwen/Gemma, `local-strong` → Llama 3.x 8B. Profiles are configuration, so swapping models needs no code change.
- **Hardware constraint:** the GPU has about 4 GB VRAM and the machine has 61 GB RAM. 7–8B models will run partly on CPU and be slow. Plan the demo around 1–4B models for interactive speed, and use a larger model only for the judge step if latency is acceptable. Benchmark this before committing to a model lineup.
- **Token accounting is free for local models:** Ollama returns `prompt_eval_count` and `eval_count` in each response. These map directly to the existing `CallLog.input_tokens` / `output_tokens` / `total_tokens` columns (src/core/models.py). Tokens-per-second can be derived from the response's duration fields.

### 2.2 Orchestrator and agents

Agents are the roles from the reference architecture, implemented as Python classes in `src/orchestrator/`, not as Claude Code subagents. This keeps the product runnable without a vendor CLI.

| Agent | Responsibility | Default profile |
|---|---|---|
| Orchestrator | Reads the playbook, runs steps in order, enforces gates, queues work | none (deterministic) |
| SpecWriter | Turns a request into a spec (requirements, acceptance criteria) | local-strong |
| Builder | Produces code or artifacts for one feature slice | local-strong, or cloud (see §5) |
| Reviewers | Security, UX, UI, code review; each returns pass/fail + findings | local-fast, one per domain |
| Approver | Applies risk level; auto-passes low risk, escalates the rest | none (rule-based) |
| Human gate | Blocks until a person approves in the dashboard | — |

Rules for the demo:

- Each agent call is one `CallLog` row tagged with `run_id`, `step_id`, `agent`, and `model_profile`. Token charts are built from these rows, not from a separate counter.
- Rework loop: a failed review sends its findings back to the Builder, capped at `max_iterations` (from the playbook), as in PLAN.md §3.3.
- **Auto-merge stays off.** The CLAUDE.md rule that the user checks the running app after each feature still applies. The Approver escalates to a human; it never merges on its own in the demo.

### 2.3 Playbook: the demo blueprint

The demo is a library of playbooks, one per use case. Each playbook is a versioned YAML file in the same format as PLAN.md §3.3. The reference program is a mobility feature: an **adaptive cruise control (ACC)** function in a vehicle, with a related **battery charge-limit** function. Both are original, illustrative examples, not taken from any real OEM program.

**Use-case playbooks, in V-cycle order:**

| # | Playbook | V-cycle stage | What it does | Verified by |
|---|---|---|---|---|
| U1 | `intent-to-requirements` | Left: stakeholder needs → system requirements | Turns a stakeholder brief into numbered requirements (the §3.3 `requirements-from-mixed-sources` blueprint) | U8 (acceptance) |
| U2 | `requirements-to-architecture` | Left: system → architecture | Proposes components and interfaces for the ACC function, and allocates requirements to them | U7 (integration test plan) |
| U3 | `architecture-to-design` | Left: architecture → detailed design | Writes detailed design per component (state machine, timing, limits) | U6 (unit test plan) |
| U4 | `design-to-implementation` | Bottom: implementation | Builder writes one component slice; reviewers check security, UX, UI, and code | U5 (unit tests) |
| U5 | `unit-verification` | Right: unit tests | Generates and runs unit tests against the design | Gate: tests pass |
| U6 | `design-test-plan` | Right: unit test plan | Derives unit test cases from the detailed design (traceable to U3) | Reviewer |
| U7 | `integration-verification` | Right: integration tests | Runs interface tests between components against the architecture | Gate: tests pass |
| U8 | `system-validation` | Right: acceptance | Checks the built function against the original stakeholder intent and requirements | Human gate |
| U9 | `change-impact` | Cross-cutting | When a requirement changes, traces it through the V and lists affected artifacts | Human gate |

Each playbook has its own inputs, agents, gates, and profiles, and each is runnable on its own. U1 through U8 chained together is the full V-cycle demo. U9 shows the feedback loop back to the start of the V.

Trace links connect each artifact to the one on the other side of the V (requirement ↔ design ↔ test). These links are stored so the dashboard can show coverage. The mobility examples are about the factory's process, not safety claims. Any real automotive program would also need the applicable functional-safety and process-assessment standards applied by qualified engineers.

**Example: U1 `intent-to-requirements`** (the §3.3 blueprint):

Mapping to the factory roles:

| Playbook step | Factory role | Profile |
|---|---|---|
| `retrieve` | Builder-side context gathering | local-fast |
| `draft` | SpecWriter | local-strong |
| `structure` | SpecWriter (template fill) | local-fast |
| `judge` | Reviewer (rubric) | a different model family from `draft`, so the judge is independent |
| `publish` | Approver + artifact export | none |

Note: the playbook's `judge` step is meant to use a different vendor from `draft`. With local-only models, use two different model families (for example Qwen and Gemma) to keep that independence.

### 2.4 Dashboard

Panels, in priority order for the demo:

1. **Playbook timeline:** steps as nodes, colored by state (queued / running / passed / failed / waiting for human).
2. **Agent board:** each active agent, its model profile, current step, and iteration count.
3. **Gate results:** review outcomes per domain, with findings expandable.
4. **Token & cost panel:** input, output, and total tokens per run, broken down by agent and model; tokens/sec per model; cumulative totals. Cost is $0 for local models, so show tokens and time, not money. Keep a cloud-cost field so the same panel works when a cloud profile is used.
5. **Human approval queue:** items awaiting sign-off, with approve / reject.

Data path: orchestrator writes events (`run.started`, `step.finished`, `gate.result`, `call.completed`) and `CallLog` rows. The dashboard subscribes to an SSE stream and reads REST for history. The frontend is the Next.js app already in `frontend/`.

### 2.5 Tie-in to the organisation-wide factory

- Each factory instance emits the same run-event schema, so a later org view can aggregate runs across instances without knowing their internals.
- Org-level items (cross-project governance, auth, RBAC) are M10 in the roadmap. The demo should not depend on them. Treat the org view as a read-only aggregator on top of the event schema.
- Playbooks are versioned YAML, so an organisation can share blueprints between programs.

## 3. Proposed slices (each testable on its own, per CLAUDE.md)

1. **Model router, Ollama only:** profile config, `generate()` returns text plus token counts; record a `CallLog` row. Test against a mocked Ollama and one live call.
2. **Playbook loader:** parse the §3.3 YAML and validate it (steps, profiles, gates). Unit tests only.
3. **Orchestrator run loop:** run steps in order, emit events, enforce `max_iterations`. Test with stub agents.
4. **Reviewer + rework loop:** one reviewer, findings sent back to the Builder. Integration test with a small local model.
5. **Dashboard slice:** timeline plus token panel, fed by SSE. Start the app and check it in the browser before going further (CLAUDE.md).
6. **Agent board and approval queue.**
7. **Demo script:** one scripted run of the playbook, with a fixed input so the demo is repeatable.

Each slice ends with the tests green and the app started for a manual check.

## 4. Demo acceptance criteria

- A single run of the playbook completes end to end on local models with no cloud calls.
- The dashboard shows every agent call as it happens, with tokens and tokens/sec.
- A failed review visibly triggers a rework iteration, then a pass or an escalation.
- The run stops at the human gate and waits for an approval click.
- Re-running the same scripted input produces the same sequence of steps (the content may vary).

## 5. Risks and decisions

| Risk | Impact | Mitigation |
|---|---|---|
| Small local models produce weak code | Builder output fails review often | Keep demo tasks to small, verifiable artifacts; allow an optional cloud Builder profile |
| 4 GB VRAM makes models slow | Demo feels sluggish | Benchmark first; prefer 1–4B models; stream output so progress is visible |
| Judge is not independent with one model family | Weak review signal | Use two model families for drafter and judge |
| Scope creep toward the full M1–M11 roadmap | Demo slips | Build only slices 1–7 above; defer M10 |
| Local model JSON/tool output is unreliable | Orchestrator parsing fails | Constrain output with schemas (Ollama structured output) and retry once |

**Decisions needed from you:**

1. **Use-case list:** confirm U1–U9 in §2.3, or name the use cases you want added or removed.
2. **Builder:** fully local (slower, riskier for code), or local plus an optional cloud Builder?

## 6. Out of scope for the demo

- Enterprise model adapters and their credentials (designed for, not built). Their interface is covered in §2.1.
- Org-wide governance, auth, and RBAC (M10).
- Multi-project parallelism and git worktrees.
- Claude Code as a runtime dependency.
