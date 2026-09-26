# Architecture — AI-SDLC Factory

## Vision: From SDLC to AIDLC

This system is not "SDLC + AI agents." It is a **redesign of the development lifecycle from first principles for an AI-native world**.

**See:** [AIDLC Concept](./memory/aidlc_concept.md) — the foundational rethinking that shapes this architecture.

---

## 1. Architectural Thesis

### The Problem
Traditional SDLC phases exist because humans have limited:
- Memory and attention
- Reasoning bandwidth
- Ability to hold context across boundaries
- Ability to observe systems continuously

This creates sequential phases: Requirements → Design → Code → Test → Deploy

### The Shift
When AI becomes a primary participant in software creation:
- Context can be maintained continuously
- Information flows across boundaries without loss
- Systems can be analyzed holistically
- Feedback loops close rapidly

**Therefore:** The lifecycle should be redesigned, not automated.

### The Goal
> **Maximum software delivery velocity subject to acceptable risk, quality, and human governance.**

Not "maximum automation" or "maximum AI autonomy," but **maximum value delivery with humans retaining meaningful control.**

---

## 2. Core Architectural Principles

### 2.1 — Orchestration Over Agent Spaghetti
Don't create one autonomous agent per task.

Instead, model the system as:
- **Capabilities** — What can be computed?
- **Context** — What information is available?
- **Policies** — What constraints apply?
- **Evidence** — What validates decisions?
- **Risk** — What could go wrong?

Then **orchestrate** capabilities toward goals, not agents toward tasks.

### 2.2 — Intent-Driven, Not Task-Driven
Traditional: Requirement → Story → Task → Code
AIDLC: **Intent** → Understand → Design → Execute → Validate → Observe → Adapt

The system connects business outcome (intent) to engineering execution and back to telemetry.

### 2.3 — Risk-Based Delivery
Not every change deserves the same process.

**Level 0 (Informational):** Documentation
→ Automated validation. No human review.

**Level 1 (Low Risk):** Isolated UI changes, simple refactoring
→ AI review + tests.

**Level 2 (Medium Risk):** Business logic, API changes
→ Multiple specialist AI reviews + validation + human if uncertain.

**Level 3 (High Risk):** Authentication, security, financial
→ Independent analysis + extensive validation + human approval.

**Level 4 (Critical/Safety):** Vehicle control, braking, cybersecurity
→ Formal engineering processes, human accountability, regulatory governance.

### 2.4 — Evidence-Driven Decision-Making
Decisions are not based solely on "AI says so."

Backed by:
- **Tests** — passing or failing
- **Static analysis** — findings and scores
- **Telemetry** — observed production behavior
- **Simulations** — predicted outcomes
- **Historical incidents** — precedent
- **Requirements traceability** — correctness alignment
- **Architecture constraints** — compliance verification

Distinguish: Known | Observed | Inferred | Assumed | Unknown

### 2.5 — Humans Review Uncertainty, Not Everything
If 10 independent AIs agree, tests pass, blast radius is small, and the change is reversible:

**Why force a senior engineer to read 500 lines of code?**

Instead, humans focus on:
- Uncertainty and conflict
- Risk and consequence
- Intent clarification
- Trade-off decisions
- Organizational context
- Ethical considerations
- Escalation decisions

### 2.6 — Continuous Feedback Loops
Software does not move to production and stop.

Production behavior (incidents, performance, usage) continuously informs development:

```
Intent → Understand → Design → Execute → Validate → Observe → Learn → Adapt
                                                        ↑___________|
                                                   (feedback loop)
```

### 2.7 — Organizational Memory
The system maintains understanding of:
- Why decisions were made
- What happened when a similar change occurred before
- Which incidents involved this component
- What requirements depend on this behavior
- What assumptions are embedded

This knowledge shapes future decisions.

### 2.8 — Bottleneck Migration
When AI removes one bottleneck, another appears:

```
Human coding → AI coding → Review bottleneck → AI review → CI/CD bottleneck
→ Intelligent validation → Human exception handling bottleneck → Governance
```

Architecture continuously identifies and addresses the current constraint.

---

## 3. System Architecture

### 3.1 — Layered Design

```
┌─────────────────────────────── User Intent Layer ───────────────────────────┐
│ Human defines: business outcome, requirements, constraints, risk tolerance  │
│ Human governs: approval gates, escalation decisions, trade-offs             │
└──────────────────────────────────────────┬──────────────────────────────────┘
                                           │
┌──────────────────────────────── Orchestration Layer ───────────────────────┐
│ Playbooks: Declarative workflows (YAML, JSON, or UI-generated)             │
│ Agents: Execution units (plan, implement, test, review, refactor, etc.)    │
│ Gates: Verification points (validation, approval, escalation)              │
└──────────────────────────────────────────┬──────────────────────────────────┘
                                           │
┌──────────────────────────────── Context Layer ─────────────────────────────┐
│ Requirements, architecture, code, tests, domain rules, organizational      │
│ knowledge, production telemetry, incident history, design decisions        │
└──────────────────────────────────────────┬──────────────────────────────────┘
                                           │
┌──────────────────────────────── Execution Layer ────────────────────────────┐
│ Code generation, testing, analysis, simulation, validation, deployment     │
└──────────────────────────────────────────┬──────────────────────────────────┘
                                           │
┌──────────────────────────────── Tools Layer ───────────────────────────────┐
│ Git, CI/CD, PLM/ALM, simulation, testing, security, cloud platforms       │
│ (System plugs in; does not replace existing tools)                         │
└──────────────────────────────────────────┬──────────────────────────────────┘
                                           │
┌──────────────────────────────── Telemetry Loop ────────────────────────────┐
│ Production behavior, incidents, performance, customer usage → feeds back   │
│ to Context Layer for continuous system improvement                         │
└───────────────────────────────────────────────────────────────────────────┘
```

### 3.2 — The Playbook

A playbook is a **declarative, version-controlled workflow** that orchestrates agents and gates.

```yaml
name: requirements-from-mixed-sources
version: 1.0
description: |
  Generate requirements from business intent and knowledge sources.
  Independent reviewers validate completeness, clarity, traceability.

inputs:
  business_intent: string
  knowledge_sources: list[source_id]

steps:
  - name: understand
    agent: requirements-agent
    model_profile: drafting-model
    prompt_template: understand.jinja
    tools: [search_sources, analyze_domain]
    output_schema: UnderstandingOutput
    timeout: 300s

  - name: generate
    agent: requirements-agent
    model_profile: drafting-model
    input_from: understand.output
    prompt_template: generate.jinja
    tools: [chunk_sources, format_requirements]
    output_schema: RequirementsOutput
    timeout: 600s

  - name: review-compliance
    agent: independent-reviewer-a
    model_profile: review-model
    input_from: generate.output
    role: "Verify completeness against standard checklist"
    output_schema: ReviewOutput

  - name: review-clarity
    agent: independent-reviewer-b
    model_profile: review-model
    input_from: generate.output
    role: "Verify unambiguous language and clarity"
    output_schema: ReviewOutput

  - name: review-traceability
    agent: independent-reviewer-c
    model_profile: review-model
    input_from: generate.output
    role: "Verify each requirement traces to sources"
    output_schema: ReviewOutput

  - name: compare-reviews
    agent: orchestrator
    model_profile: judge-model
    input_from: [review-compliance.output, review-clarity.output, review-traceability.output]
    role: "Analyze disagreements, identify uncertain areas"
    output_schema: ConflictAnalysis

  - gate: human-review
    trigger_if: compare-reviews.output.uncertainty > threshold
    required_approvers: 1
    escalation_path: tech-lead → architect

  - name: refine
    agent: requirements-agent
    model_profile: drafting-model
    input_from: [generate.output, compare-reviews.output]
    role: "Address uncertainty flagged by reviewers"
    conditional: gate.needed
    output_schema: RequirementsOutput

outputs:
  requirements_spec: RequirementsOutput
  review_evidence: ReviewOutput[]
  uncertainty_analysis: ConflictAnalysis
```

**Every playbook is:**
- Version-controlled (Git, not black-box)
- Exportable as YAML (runnable outside this platform)
- Auditable (all prompts visible)
- Modifiable (no magic, no hidden steps)
- Testable (contract validation per agent, integration test per playbook)

### 3.3 — The Agent

An agent is an **execution unit with a clear contract**.

```python
class Agent(ABC):
    """Contract every agent must fulfill."""

    @abstractmethod
    async def run(
        self,
        context: ExecutionContext,
        input_data: BaseModel,
        **kwargs
    ) -> StepResult:
        """
        Execute the agent's task.

        Inputs:
          - context: Current state, knowledge, organizational memory
          - input_data: Typed input per step's input_schema
          - **kwargs: Additional params from playbook or user

        Returns:
          - StepResult: Typed output + evidence (tests run, analysis performed, etc.)

        Agents MUST:
          - Never mutate external state (no side effects except logging/telemetry)
          - Return evidence backing every claim (not just "AI says")
          - Handle errors explicitly (raise, never silent failure)
          - Record all calls to LLMs via CallLog (cost tracking)
        """
```

Agents are **not autonomous decision-makers.** They are **execution engines within guardrails.**

### 3.4 — The Gate

Gates are **human-controlled decision points** where uncertainty or risk requires escalation.

Gates enforce accountability:
- Verification gates (did we build it right?)
- Validation gates (did we build the right thing?)
- Approval gates (is this safe to proceed?)
- Escalation gates (is this outside normal bounds?)

**Human gates are not friction to optimize away. They are the reason the system is deployable.**

### 3.5 — The Evidence Package

Instead of "Please review my code," the system produces:

```json
{
  "change": { "files": [...], "impact": {...} },
  "why": { "requirement_id": "REQ-123", "rationale": "..." },
  "scope": { "affected_components": [...], "blast_radius": "..." },
  "validation": {
    "tests": { "passed": 847, "coverage": "89%" },
    "static_analysis": { "issues": 0, "new_findings": [] },
    "security": { "vulns": 0 },
    "architecture": { "violations": 0 },
    "domain": { "violations": 0 }
  },
  "reviews": [
    {
      "reviewer": "independent-reviewer-compliance",
      "verdict": "pass",
      "evidence": "All EARS rules satisfied"
    },
    {
      "reviewer": "independent-reviewer-adversarial",
      "verdict": "concern",
      "finding": "Edge case in leap-year handling uncovered"
    },
    {
      "reviewer": "independent-reviewer-regression",
      "verdict": "pass",
      "evidence": "No regression in historical test cases"
    }
  ],
  "disagreements": {
    "compliance vs adversarial": "Different handling of leap-year boundary",
    "escalation": "needs-human-judgment"
  },
  "uncertainty": {
    "areas": ["leap-year edge case", "international date formats"],
    "severity": "medium",
    "recommendation": "human-review recommended"
  }
}
```

Human reviews **uncertainty and risk**, not code volume.

---

## 4. Information Architecture

### 4.1 — The Lifecycle Visualization

UI should make the lifecycle and tool ecosystem visible:

```
Intent Definition → Requirements → Architecture → Implementation → Validation → Deployment → Feedback
      ○                  ○              ○              ○             ○            ○           ○
      │                  │              │              │             │            │           │
  Agents/Tools       Agents/Tools   Agents/Tools   Agents/Tools  Agents/Tools  Agents/Tools  Agents
  • Intent Agent    • ReqSpec     • Design      • CodeGen     • TestGen     • Deploy      • Observe
  • Domain Analysis • Structuring • Planning    • Refactor    • TestRun     • Gate        • Feedback
                    • Review A    • Constraint  • Review A    • Security    • Monitor     • Learn
                    • Review B    • Validation  • Review B    • Quality     • Verify      • Adapt
```

(See [Design System](./memory/design_system.md) for LTTS-inspired visual language.)

### 4.2 — The Knowledge Graph

The system maintains organizational knowledge:

- Requirements → architecture decisions → code patterns → tests → incidents → feedback
- Each connection is traceable
- Queries answer: "Why was this design chosen?" "What broke last time?" "What depends on this?"

---

## 5. Data Model

See PLAN.md §2 and §3.2 for the full schema. Key entities:

| Entity | Purpose |
|--------|---------|
| **Project** | Container with knowledge scope + model policy |
| **KnowledgeSource** | Ingested artifact (PDF, DOCX, Git repo, etc.) |
| **Chunk** | Parsed fragment with provenance (source, page, section, commit) |
| **Playbook** | Versioned YAML workflow + agents + gates |
| **PlaybookRun** | Execution trace (step I/O, timing, evidence, human gates) |
| **Agent** | Execution unit: plan, implement, validate, review, refactor |
| **Gate** | Human escalation point (verification, approval) |
| **Evidence** | Tests, analysis, simulations, traces backing decisions |
| **CallLog** | Every LLM interaction (tokens, cost, latency, model, step) |
| **ModelProfile** | LLM config (provider, endpoint, model_id, temperature, etc.) |
| **LocalModelInstallation** | Downloaded model (status, checksum, last-used) |

---

## 6. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Backend** | Python 3.10+ | All backend code in one language |
| **API** | FastAPI | Type-safe, async-native, OpenAPI introspection |
| **Database** | PostgreSQL + pgvector | ACID transactions, vector search, extension system |
| **Orchestration** | LangGraph-inspired state machine | Typed, auditable, supports branching and retry |
| **LLM Adapters** | Anthropic Claude, Ollama, OpenAI (pluggable) | Local + cloud, zero lock-in |
| **Object Storage** | S3-compatible (MinIO, AWS) | Ingested files and exports |
| **Ingestion** | PyMuPDF, unstructured.io, python-docx | Accurate parsing per file type |
| **Search** | pgvector + BM25 hybrid | Semantic + keyword, scoped isolation |
| **Frontend** | TypeScript/Next.js (M11) | Starts after API contract stable |
| **Testing** | pytest + respx + fixtures | Fast, deterministic, no external dependencies |
| **CI/CD** | GitHub Actions (or generic) | Lint, test, build gates |

---

## 7. Design Decisions

### 7.1 — Why Playbooks (Not Agents)
Playbooks are the unit of reproducibility and transparency. They encode workflow, not just execution.

An agent alone is a black box. A playbook makes the entire workflow visible, auditable, and runnable outside this platform.

### 7.2 — Why Multiple Independent Reviewers
No single LLM is omniscient. Independent perspectives catch what individual models miss.

Compare findings, identify disagreement, escalate uncertainty — don't vote or average.

### 7.3 — Why Risk-Based Delivery
The cost of validation should match the consequence of failure.

A typo in a comment doesn't need formal verification. A change to authentication logic does.

### 7.4 — Why Organizational Memory
Context is the difference between generic and trustworthy output.

A system grounded in an org's own artifacts and history generates engineering, not plausible text.

### 7.5 — Why Feedback Loops
A system that doesn't improve is just a faster way to do what you already did.

Production behavior → insights → better design decisions → continuous improvement.

---

## 8. Non-Functional Requirements

| Requirement | Rationale |
|-------------|-----------|
| **Transparency** | Every prompt, agent config, rubric must be visible and exportable. Zero black boxes. |
| **Portability** | Playbooks runnable outside this platform with no dependency on the app. |
| **Auditability** | Full trace of every decision: which agent, which model, which evidence, which human gate. |
| **Isolation** | Project-private knowledge never leaks to other projects. Org-shared sources scoped correctly. |
| **Performance** | Playbook runs measure in seconds/minutes, not hours. Bottleneck identification immediate. |
| **Observability** | Every LLM call logged (tokens, cost, latency). Every playbook run traceable. |
| **Safety** | Human gates on safety-critical decisions. No autonomous rollback or deployment. |
| **Scalability** | Support 100+ projects, 1000+ playbook runs/day, millions of chunks. |
| **Interoperability** | Pluggable LLM adapters. Git, CI/CD, PLM tools integrate, not replace. |

---

## 9. The V-Model Alignment

AIDLC mirrors V-Model verification/validation:

```
Intent Definition ─────────────────────────────────────────────────► Acceptance Validation
         │
         ├─► Requirements Generation ◄──────────────────────► Requirements Validation
         │          │
         │          ├─► Architecture Design ◄──────────────── Architecture Validation
         │          │        │
         │          │        ├─► Implementation ◄────────── Implementation Validation
         │          │        │        │
         └──────────┴────────┴────────┴──────────► Feedback Loop ◄──── Production Telemetry
```

Left side (left-hand V):
- Intent Definition
- Requirements Generation
- Architecture Design
- Implementation

Right side (right-hand V):
- Requirements Validation (independent reviewers)
- Architecture Validation (compliance, traceability)
- Implementation Validation (tests, security, quality)
- Acceptance Validation (meets intent, customer feedback)

Feedback loops close the cycle.

---

## 10. Roadmap Alignment

### M0–M3: Foundation (AIDLC-Ready)
- Data model (projects, sources, profiles)
- Ingestion (parse diverse formats)
- Knowledge retrieval (semantic + keyword search)
- **Gate:** Core CRUD API stable, isolation verified

### M4–M6: Orchestration (Workflow Engine)
- Agent framework (contract, execution, tracing)
- Playbook engine (YAML parsing, validation, execution)
- Human gates (approval, escalation, verification)
- **Gate:** Can run a playbook end-to-end with mocked agents

### M7–M9: Agents (Execution)
- Requirements agent (understand, draft, refactor)
- Independent reviewers (compliance, adversarial, regression)
- Judge agent (compare, identify uncertainty, escalate)
- Traceability (source → requirement → test)

### M10–M11: Governance & UI
- Auth, RBAC, cross-project visibility
- Evidence package generation
- Enterprise UI (lifecycle visualization, playbook studio)
- Exports (YAML, JSON, markdown)

---

## 11. Success Criteria

After M11, an organization can:

✅ Define business intent
✅ Ingest knowledge from diverse sources
✅ Run playbooks with orchestrated agents
✅ Make decisions based on evidence (tests, analysis, reviews)
✅ Gate at human approval points
✅ Export playbooks for external use
✅ See end-to-end traceability (intent → output)
✅ Feed production data back into the system
✅ Continuously improve based on feedback

**That is the AIDLC factory.**

---

## 12. Open Questions for Design Phase

- **Playbook UX:** Drag-drop builder vs. YAML first?
- **Evidence aggregation:** How deep does the evidence package go? All tests run or a summary?
- **Bottleneck detection:** Real-time metrics or nightly analysis?
- **Org memory:** Semantic search or structured knowledge graph?
- **Safety levels:** How many risk levels and what gates for each domain?

These shape M10–M11 implementation but don't block M0–M9.

---

## 13. References

- [Factory Storyline](./memory/project_storyline.md) — The narrative: why orchestration, not copilots
- [AIDLC Concept](./memory/aidlc_concept.md) — First-principles redesign from SDLC to AI-native lifecycle
- [Design System](./memory/design_system.md) — LTTS-inspired UI/UX visual language
- [PLAN.md](./PLAN.md) — Full system architecture and data model
- [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) — Atomic build order M0–M11

---

**This architecture answers: "If we were designing software engineering from scratch for an AI-native world, what would we build?"**

The answer is not "SDLC + agents." It is an **orchestrated, evidence-driven, feedback-looped system where AI manages complexity and humans retain governance.**

That is the AIDLC factory.
