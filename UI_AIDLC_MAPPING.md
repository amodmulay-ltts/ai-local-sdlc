# UI/UX — AIDLC Concepts Made Visible

## Overview

The UI must surface the core AIDLC concepts so users intuitively understand:
- **What playbooks are** (workflows, not isolated tasks)
- **What agents do** (execute within orchestrated contexts)
- **What the factory is** (connected lifecycle, not point solutions)
- **How evidence validates decisions** (not just AI confidence)
- **Where humans govern** (gates, approvals, escalation)

This document maps each AIDLC concept to UI screens and components.

---

## 1. Central Organizing Principle: The Lifecycle View

**The lifecycle is not buried in documentation. It is the homepage.**

### Current State (M0–M1)
Dashboard shows:
- Stats cards (projects, models, sources)
- Feature cards (scattered)
- No connection between concepts

### M10–M11 Redesign
**New primary view: "The Factory"**

```
┌─────────────────────────────────────────────────────────────┐
│  Engineering Intelligence Factory                              [⚙️ Settings] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Intent Definition → Requirements → Architecture → Code → Test → Deploy → Feedback
│        ○                   ○               ○           ○       ○        ○         ○
│        │                   │               │           │       │        │         │
│     Agents:          Agents:          Agents:     Agents:  Agents:  Agents:   Agents:
│     • Intent         • ReqSpec        • Design    • CodeGen • Tests  • Deploy  • Monitor
│     • Domain         • Structuring    • Planning  • Review  • Quality• Gate    • Feedback
│     • Analysis       • Review A       • Validate  • Refactor• Verify • Track   • Adapt
│                      • Review B
│                      • Review C
│
│
│  Recent Playbook Runs
│  ────────────────────────────────────────
│  [Project A] requirements-from-sources      ✅ Complete  (2h 14m)
│  [Project B] code-generation-from-spec      ⏳ Running   (27m elapsed)
│  [Project C] test-gen-and-validation        ⚠️  Uncertain (awaiting human gate)
│  [Project A] deployment-and-monitoring      ✅ Complete  (1h 8m)
│
└─────────────────────────────────────────────────────────────┘
```

**What this shows:**
- The AIDLC lifecycle is immediately visible
- Agents mapped to each stage
- Recent runs with status
- Clear visual progression

---

## 2. Playbooks: The Unit of Orchestration

**Playbooks are not hidden in a database. They are central.**

### Playbook List View
```
┌──────────────────────────────────────────────────────────┐
│ Playbooks                                   [+ New]       │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  [Search playbooks...]                                    │
│                                                            │
│  RECOMMENDED FOR YOUR PROJECT (Project A)                 │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Requirements from Mixed Sources                    │   │
│  │ Turn business intent + knowledge into spec         │   │
│  │ Agents: ReqSpec, IndependentReview×3, Judge       │   │
│  │ Gates: Human approval on uncertainty > threshold   │   │
│  │                                                     │   │
│  │ ✅ 47 successful runs | Last: 2 hours ago         │   │
│  │                    [View] [Run] [Edit] [Export]    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  STANDARD LIBRARY                                          │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Code Generation from Architecture                  │   │
│  │ Turn architecture design into working code         │   │
│  │ Agents: CodeGen, Review, Refactor, Tests          │   │
│  │ Gates: Test coverage >= 85%                        │   │
│  │                                                     │   │
│  │ ✅ 1,203 successful runs | Last: 1 hour ago       │   │
│  │                    [View] [Run] [Edit] [Export]    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Test Generation & Validation                       │   │
│  │ Generate comprehensive test suite from code        │   │
│  │ Agents: TestGen, Security, Quality, Judge         │   │
│  │ Gates: Security scan clear, complexity < N        │   │
│  │                                                     │   │
│  │ ✅ 892 successful runs | Last: 3 hours ago        │   │
│  │                    [View] [Run] [Edit] [Export]    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  YOUR CUSTOM PLAYBOOKS                                     │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Our Domain-Specific Flow                           │   │
│  │ (Custom playbook defined for this org)             │   │
│  │ Agents: CustomAnalysis, Domain-Specific-Review    │   │
│  │ Gates: Legal approval, Domain expert sign-off      │   │
│  │                                                     │   │
│  │ ✅ 12 successful runs | Last: 1 day ago           │   │
│  │                    [View] [Run] [Edit] [Export]    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

**What this shows:**
- Playbooks are discoverable, not hidden
- Purpose is clear (human-readable description)
- Agents in each playbook visible
- Gates shown explicitly
- Export option visible (portability)
- Success history (confidence signal)

### Playbook Detail / Editor View
```
┌──────────────────────────────────────────────────────────┐
│ Playbook: Requirements from Mixed Sources                 │
├──────────────────────────────────────────────────────────┤
│ Version: 2.3 | Last modified: 2 days ago | Owner: Team A │
│                                                            │
│ WORKFLOW VISUALIZATION                                    │
│                                                            │
│ Step 1: Understand Business Intent                        │
│ ┌────────────────────────────────────────────────────┐   │
│ │ Agent: Requirements Agent                          │   │
│ │ Model: claude-opus (drafting profile)              │   │
│ │ Input: Business intent, knowledge sources          │   │
│ │ Role: Analyze domain, extract scope, identify gaps │   │
│ │ Timeout: 300s                                       │   │
│ │ Output shape: UnderstandingOutput                   │   │
│ └────────────────────────────────────────────────────┘   │
│                           ↓                               │
│ Step 2: Generate Requirements Specification               │
│ ┌────────────────────────────────────────────────────┐   │
│ │ Agent: Requirements Agent                          │   │
│ │ Model: claude-opus (drafting profile)              │   │
│ │ Input: Understanding from Step 1                   │   │
│ │ Role: Draft complete requirements spec             │   │
│ │ Output shape: RequirementsOutput                    │   │
│ └────────────────────────────────────────────────────┘   │
│                           ↓                               │
│ Step 3: Parallel Independent Reviews                      │
│ ┌──────────────────┬──────────────────┬──────────────┐   │
│ │ Review A:        │ Review B:        │ Review C:    │   │
│ │ Compliance       │ Clarity          │ Traceability │   │
│ │ ─────────        │ ────────         │ ────────────  │   │
│ │ Agent: Review A  │ Agent: Review B  │ Agent: Review C
│ │ Check: Complete? │ Check: Clear?    │ Check: Sources?
│ └──────────────────┴──────────────────┴──────────────┘   │
│                           ↓                               │
│ Step 4: Compare & Analyze Disagreements                   │
│ ┌────────────────────────────────────────────────────┐   │
│ │ Agent: Judge Agent                                 │   │
│ │ Role: Identify conflicts, flag uncertainty         │   │
│ │ Output: ConflictAnalysis                           │   │
│ └────────────────────────────────────────────────────┘   │
│                           ↓                               │
│ GATE: Human Review (Conditional)                          │
│ ┌────────────────────────────────────────────────────┐   │
│ │ Trigger If: Uncertainty > 0.3                      │   │
│ │ Required Approvers: 1                              │   │
│ │ Escalation: Tech Lead → Architect                  │   │
│ │ Timeout: 24h                                        │   │
│ │                                                     │   │
│ │ Status: WAITING on Tech Lead approval              │   │
│ │                 [Approve] [Request Changes] [Skip] │   │
│ └────────────────────────────────────────────────────┘   │
│                           ↓ (if approved)                │
│ Step 5: Refine Based on Feedback                         │
│ ┌────────────────────────────────────────────────────┐   │
│ │ Agent: Requirements Agent                          │   │
│ │ Role: Address uncertainty flagged by reviewers     │   │
│ │ Conditional: Only run if gate above approved       │   │
│ │ Output shape: RequirementsOutput                    │   │
│ └────────────────────────────────────────────────────┘   │
│                           ↓                               │
│ FINAL OUTPUT                                              │
│ ├─ requirements_spec: RequirementsOutput                  │
│ ├─ review_evidence: ReviewOutput[]                       │
│ └─ uncertainty_analysis: ConflictAnalysis                │
│                                                            │
│ [View Prompts] [View Configs] [View Rubrics] [Export YAML]
│                                                            │
└──────────────────────────────────────────────────────────┘
```

**What this shows:**
- Complete workflow visible at a glance
- Agent name, model profile, role clear for each step
- Gates visible (human decision points)
- Parallelization shown
- Transparency (prompts, configs, rubrics accessible)
- Exportable (YAML visible option)

---

## 3. Agents: What They Do, When They Run

**Agents are not magical. They are executable components with clear inputs/outputs.**

### Agent Catalog View
```
┌──────────────────────────────────────────────────────────┐
│ Agents & Capabilities                                     │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  STAGE: Requirements Definition                           │
│  ──────────────────────────────────────────────────────  │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 🎯 Requirements Agent                              │   │
│  │    Understands intent, generates specifications    │   │
│  │    Runs in: 8 playbooks                            │   │
│  │    Success rate: 94% (412/438 runs)                │   │
│  │    Avg time: 2m 34s                                │   │
│  │    Models used: Claude Opus, Claude Sonnet         │   │
│  │                                         [Details]  │   │
│  └────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 📊 Domain Analysis Agent                           │   │
│  │    Extracts domain rules and constraints           │   │
│  │    Runs in: 3 playbooks                            │   │
│  │    Success rate: 100% (87/87 runs)                 │   │
│  │    Avg time: 1m 12s                                │   │
│  │                                         [Details]  │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  STAGE: Code Generation & Implementation                  │
│  ──────────────────────────────────────────────────────  │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 💻 Code Generation Agent                           │   │
│  │    Writes code from architecture + requirements    │   │
│  │    Runs in: 12 playbooks                           │   │
│  │    Success rate: 87% (1203/1381 runs)              │   │
│  │    Avg time: 3m 47s                                │   │
│  │    Models used: Claude Opus                        │   │
│  │    Failure modes: Syntax (31), Undefined refs (24) │   │
│  │                                         [Details]  │   │
│  └────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 🔄 Refactor Agent                                  │   │
│  │    Simplifies and optimizes code                   │   │
│  │    Runs in: 9 playbooks                            │   │
│  │    Success rate: 92% (674/732 runs)                │   │
│  │    Avg time: 1m 58s                                │   │
│  │                                         [Details]  │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  STAGE: Validation & Review (Independent)                 │
│  ──────────────────────────────────────────────────────  │
│  ┌────────────────────────────────────────────────────┐   │
│  │ ✅ Compliance Review Agent                         │   │
│  │    Verifies against requirements & standards       │   │
│  │    Runs in: 15 playbooks                           │   │
│  │    Success rate: 96% (2847/2961 runs)              │   │
│  │    Avg time: 1m 24s                                │   │
│  │    Disputes: 3.2% (inconsistency with others)      │   │
│  │                                         [Details]  │   │
│  └────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 🚨 Adversarial Review Agent                        │   │
│  │    Tries to break implementation, finds edge cases │   │
│  │    Runs in: 14 playbooks                           │   │
│  │    Success rate: 99% (3142/3167 runs)              │   │
│  │    Avg time: 2m 08s                                │   │
│  │    Findings: 847 edge cases, 142 serious issues    │   │
│  │    Disputes: 8.1% (often disagrees with Compliance)
│  │                                         [Details]  │   │
│  └────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 🏛️  Architecture Review Agent                      │   │
│  │    Checks compliance with system design            │   │
│  │    Runs in: 10 playbooks                           │   │
│  │    Success rate: 94% (1687/1793 runs)              │   │
│  │    Avg time: 1m 52s                                │   │
│  │    Disputes: 1.9%                                  │   │
│  │                                         [Details]  │   │
│  └────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 🔐 Security Review Agent                           │   │
│  │    Identifies vulnerabilities and attack surfaces  │   │
│  │    Runs in: 8 playbooks                            │   │
│  │    Success rate: 97% (584/601 runs)                │   │
│  │    Avg time: 2m 34s                                │   │
│  │    Critical findings: 2, High: 14, Medium: 48      │   │
│  │                                         [Details]  │   │
│  └────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 📋 Judge Agent                                     │   │
│  │    Compares independent reviews, identifies gaps   │   │
│  │    Runs in: 16 playbooks                           │   │
│  │    Success rate: 98% (3214/3281 runs)              │   │
│  │    Avg time: 1m 42s                                │   │
│  │    Escalations triggered: 847 (25.8%)              │   │
│  │                                         [Details]  │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

**What this shows:**
- Agents grouped by lifecycle stage
- Clear purpose for each agent
- Telemetry (success rate, time, disputes)
- Models used
- Failure patterns visible
- Escalation signals visible

### Running Agents: Live View
```
┌──────────────────────────────────────────────────────────┐
│ Playbook Run: requirements-from-mixed-sources (RUNNING)   │
├──────────────────────────────────────────────────────────┤
│ Project: Enterprise Cloud Platform                        │
│ Status: STEP 3 (Parallel Reviews) — 47m 23s elapsed       │
│                                                            │
│ COMPLETED STEPS                                            │
│ ✅ Step 1: Understand — 5m 14s                           │
│    Agent: Requirements Agent                              │
│    Output: 42 domain constraints identified                │
│                                                            │
│ ✅ Step 2: Generate — 18m 47s                            │
│    Agent: Requirements Agent                              │
│    Output: 237 requirements generated                      │
│                                                            │
│ CURRENT STEP (RUNNING)                                    │
│ ⏳ Step 3: Parallel Reviews — 23m 42s elapsed            │
│    ┌──────────────────┬──────────────────┬──────────────┐ │
│    │ ✅ Review A:     │ ✅ Review B:     │ ⏳ Review C: │ │
│    │ Compliance       │ Clarity          │ Traceability│ │
│    │ Complete (2m)    │ Complete (4m)    │ 3m elapsed  │ │
│    │ Findings: 8      │ Findings: 5      │ Checking... │ │
│    └──────────────────┴──────────────────┴──────────────┘ │
│                                                            │
│ PENDING STEPS                                              │
│ ⬜ Step 4: Judge & Analyze — awaiting review completions │
│ ⬜ Step 5: GATE — awaiting judge analysis                │
│ ⬜ Step 6: Refine — conditional, awaiting gate           │
│                                                            │
│ EVIDENCE COLLECTED SO FAR                                  │
│ • Input: Business intent (4200 chars)                      │
│ • Input: 3 knowledge sources (47 chunks analyzed)          │
│ • Intermediate: 42 domain constraints                      │
│ • Output-so-far: 237 requirements                          │
│ • Review A findings: 8 compliance issues                   │
│ • Review B findings: 5 clarity issues                      │
│ • Review C: pending                                        │
│                                                            │
│ LOGS (expandable)                                          │
│ ▼ Step 1: Understand                                       │
│   [17:23:45] Agent started                                 │
│   [17:23:46] Loaded 3 knowledge sources (47 chunks)        │
│   [17:23:47] Analyzing domain...                           │
│   [17:28:56] Complete. 42 constraints identified           │
│                                                            │
│ ▼ Step 2: Generate                                         │
│   [17:29:00] Agent started with understanding              │
│   [17:29:02] Generating from template...                   │
│   [17:45:30] Complete. 237 requirements generated          │
│   [17:45:31] Queuing parallel reviews...                   │
│                                                            │
│                                                            │
│ [← Back] [Pause] [Stop] [Download Evidence] [View Code]   │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

**What this shows:**
- Current status at a glance
- Step-by-step progress
- Parallel execution visible
- Evidence accumulating in real-time
- Logs for debugging
- Ability to inspect/download evidence

---

## 4. Gates: Human Decision Points

**Gates are not buried. They are prominent and clear.**

### Gate Notification / Interface
```
┌──────────────────────────────────────────────────────────┐
│ PLAYBOOK RUN REQUIRES DECISION                            │
├──────────────────────────────────────────────────────────┤
│                                                            │
│ 🔔 Playbook: requirements-from-mixed-sources              │
│    Project: Enterprise Cloud Platform                     │
│    Waiting since: 12 minutes ago                          │
│                                                            │
│ WHY THIS GATE?                                             │
│ ─────────────────────────────────────────────────────────│
│ Step 3 (Parallel Reviews) identified disagreement:        │
│                                                            │
│   Review A (Compliance): "All 237 requirements clear"     │
│   Review B (Clarity): "All 237 requirements clear"        │
│   Review C (Traceability): "47 requirements lack sources" │
│   Review D (Security): "12 security implications noted"   │
│                                                            │
│ Judge Agent Analysis:                                     │
│   - Disagreement level: MEDIUM (Review C vs others)       │
│   - Uncertainty score: 0.38 (threshold: 0.30)             │
│   - Escalation triggered: YES                             │
│                                                            │
│ RECOMMENDATION: REVIEW REQUIRED                            │
│ Suggested decision: Address Review C's traceability gaps  │
│ before proceeding. May require source documentation.      │
│                                                            │
│ DECISION OPTIONS                                           │
│ ─────────────────────────────────────────────────────────│
│                                                            │
│ ○ [Approve & Proceed]                                     │
│   Accept output despite disagreement. Expert judgment      │
│   that Review C findings are acceptable.                   │
│   Requires approver note (mandatory).                      │
│                                                            │
│ ○ [Request Changes]                                       │
│   Send back to Requirements Agent to address specific      │
│   gaps flagged by reviews. Restart from Step 6.            │
│                                                            │
│ ○ [Escalate to Architect]                                 │
│   This requires higher-level decision. Route to:           │
│   ─ Tech Lead (immediate, ~1 hour)                        │
│   ─ Architect (thorough, ~4 hours)                        │
│   ─ Both (review + decision, ~6 hours)                    │
│                                                            │
│ APPROVER NOTE (if choosing Approve & Proceed)             │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ Review C's concern is valid but non-blocking.       │   │
│ │ The traceability gaps noted are low-risk:           │   │
│ │ most requirements are linked to architecture docs   │   │
│ │ or external specs that will be documented in Phase2.│   │
│ │ Proceeding to implementation is safe.               │   │
│ │                                                      │   │
│ │ — Sarah Chen, Tech Lead                             │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                            │
│ [Review All Evidence] [View Playbook] [Message Reviewer]  │
│                                                            │
│                        [Approve & Proceed]                │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

**What this shows:**
- Why the gate triggered (clear, not mysterious)
- Disagreement surface explicitly
- Decision options clear
- Escalation paths visible
- Human judgment required and respected
- Accountability through notes

---

## 5. Evidence Packages: Why Decisions Were Made

**Evidence is not hidden in logs. It is an export.**

### Evidence Package View
```
┌──────────────────────────────────────────────────────────┐
│ Evidence Package: requirements-from-mixed-sources          │
│ Date: 2026-09-28 | Project: Enterprise Cloud | Status: ✅ │
├──────────────────────────────────────────────────────────┤
│                                                            │
│ EXECUTIVE SUMMARY                                          │
│ ────────────────────────────────────────────────────────│
│ Generated 237 requirements from business intent + sources  │
│ All verified by 3 independent reviewers                    │
│ 2 disagreements resolved, 0 critical issues               │
│ Approved by Sarah Chen (Tech Lead), 2h 12m ago            │
│ Ready for architecture & implementation phases             │
│                                                            │
│ INPUTS TO THIS PLAYBOOK RUN                                │
│ ────────────────────────────────────────────────────────│
│ Business Intent:                                           │
│   "Build cloud-native platform for 10K+ concurrent users" │
│                                                            │
│ Knowledge Sources Used:                                    │
│   1. customer-requirements.pdf (14 pages, shared)          │
│   2. technical-constraints.docx (8 pages, shared)         │
│   3. regulatory-requirements.xlsx (3 sheets, project)      │
│                                                            │
│ OUTPUTS FROM THIS PLAYBOOK RUN                             │
│ ────────────────────────────────────────────────────────│
│ Requirements Generated: 237                                │
│ - Functional: 187                                          │
│ - Non-functional: 50                                       │
│ - Traceability: 100% (all linked to sources)              │
│ - Completeness score: 94/100                              │
│                                                            │
│ VALIDATION RESULTS                                         │
│ ────────────────────────────────────────────────────────│
│ Tests Generated: 587 (from requirements)                   │
│ ✅ All tests pass (initial validation)                    │
│ ✅ No conflicts with architectural constraints             │
│ ⚠️  3 requirements flagged for scope clarification        │
│ ✅ Security analysis: 0 concerns                           │
│                                                            │
│ INDEPENDENT REVIEWS                                        │
│ ────────────────────────────────────────────────────────│
│ ✅ Review A (Compliance)                                  │
│    Verdict: PASS — All requirements meet standard format   │
│    Issues found: 0                                         │
│    Notes: "Well-structured, clear EARS format"            │
│                                                            │
│ ✅ Review B (Clarity)                                     │
│    Verdict: PASS — All requirements are unambiguous       │
│    Issues found: 2 minor wording suggestions              │
│    Notes: "REQ-042 could be more specific on timing"      │
│                                                            │
│ ⚠️  Review C (Traceability)                               │
│    Verdict: PASS WITH CONCERN — 47 reqs lack direct link │
│    Issues found: 47 traceability gaps                     │
│    Notes: "Most link via architecture, but some implicit" │
│                                                            │
│ DISAGREEMENTS & RESOLUTION                                │
│ ────────────────────────────────────────────────────────│
│ Disagreement: Compliance vs Traceability                   │
│   - Compliance: "format is clear, completeness sufficient" │
│   - Traceability: "direct source links missing"           │
│   - Resolution: Human decision—Approved. Traceability gaps │
│     acceptable because linked via architecture docs.      │
│                                                            │
│ DECISION GATE RESULT                                       │
│ ────────────────────────────────────────────────────────│
│ Decision: APPROVED                                         │
│ Approver: Sarah Chen (Tech Lead)                          │
│ Timestamp: 2026-09-28T14:32:15Z                           │
│ Note: "Traceability gaps are non-blocking. Gaps will be   │
│        resolved in Phase 2 documentation. Proceeding to   │
│        architecture is safe."                              │
│                                                            │
│ COST & METRICS                                             │
│ ────────────────────────────────────────────────────────│
│ Playbook execution time: 1h 47m                            │
│ LLM costs: $12.34 (Claude Opus × 6 steps)                │
│ Human review time: 12m (gate review)                       │
│ Total value: ~$847 (engineer time saved on manual spec)    │
│                                                            │
│ TRACEABILITY MATRIX                                        │
│ ────────────────────────────────────────────────────────│
│ All 237 requirements → Associated test cases               │
│ All 237 requirements → Source document references          │
│ All test cases → Requirements they validate                │
│                                                            │
│ [View Full Details] [View Traceability Matrix]             │
│ [View Playbook YAML] [View All Prompts] [View Logs]       │
│                                                            │
│ EXPORT OPTIONS                                             │
│ ────────────────────────────────────────────────────────│
│ [📄 Download as PDF] [📋 Download as Markdown]            │
│ [📊 Download as JSON] [🔗 Copy ShareLink]                 │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

**What this shows:**
- Complete traceability (input → process → output)
- Independent reviews shown
- Disagreements surfaced and resolved
- Human decision documented with rationale
- Exportable evidence (PDF, Markdown, JSON)
- No "trust us" — all backing visible

---

## 6. The Connection: Intent → Tests → Code → Cost

**Core AIDLC insight: Show the flow, not isolated stages.**

### Requirements Traceability Dashboard
```
┌──────────────────────────────────────────────────────────┐
│ Enterprise Cloud Platform — Traceability Matrix            │
├──────────────────────────────────────────────────────────┤
│ [Search Requirements] [Filter by Status] [Export Matrix]  │
│                                                            │
│ REQ-001: System shall support 10K concurrent users        │
│ ├─ Source: customer-requirements.pdf, page 3             │
│ ├─ Status: ✅ Implemented (Code ID: login-scalability)   │
│ ├─ Tests: TEST-001.1, TEST-001.2, TEST-001.3 (all pass)  │
│ ├─ Validation: ✅ Load test passed (9800 users sustained) │
│ ├─ Changed by: Code Refactor Agent (2h ago)              │
│ ├─ Cost impact: ~3h dev time, $2.14 compute cost          │
│ └─ Production telemetry: Achieved 11.2K concurrent ✅    │
│                                                            │
│ REQ-042: API response time < 200ms for 95th percentile    │
│ ├─ Source: technical-constraints.docx, section 2.3       │
│ ├─ Status: ⚠️  Implemented (Code ID: api-optimization)   │
│ ├─ Tests: TEST-042.1, TEST-042.2, TEST-042.3             │
│ │  └─ TEST-042.2: FAILING (1.3% failure rate)            │
│ ├─ Validation: ⚠️  99.7% percentile met, 95th at 215ms   │
│ ├─ Changed by: Code Gen Agent (3 days ago)                │
│ ├─ Cost impact: ~2h dev time, $1.87 compute              │
│ ├─ Incident: PROD-2847 (latency spikes on auth change)   │
│ ├─ Remediation: Implemented connection pooling            │
│ └─ Current status: Monitoring, trending toward 190ms      │
│                                                            │
│ REQ-089: Audit trail for all access                       │
│ ├─ Source: regulatory-requirements.xlsx, sheet 1          │
│ ├─ Status: ✅ Implemented (Code ID: audit-logging)       │
│ ├─ Tests: TEST-089.1, TEST-089.2, TEST-089.3 (all pass)  │
│ ├─ Validation: ✅ 100% event coverage, log integrity OK   │
│ ├─ Security review: ✅ No compliance gaps                 │
│ ├─ Cost impact: ~4h dev time, $3.02 compute              │
│ └─ Production: 847K+ audit events logged, system healthy  │
│                                                            │
│ [...237 requirements total, 234 passing, 3 attention]    │
│                                                            │
│ METRICS SUMMARY                                            │
│ ─────────────────────────────────────────────────────────│
│ Total Requirements: 237                                    │
│ Implemented: 237 (100%)                                    │
│ Tests Written: 587                                         │
│ Test Pass Rate: 99.1%                                     │
│ Requirements Tested: 234/237 (98.7%)                      │
│ ⚠️  Attention Needed: 3 (1 latency, 2 scope creep)        │
│                                                            │
│ Total Cost (Dev + Compute): $847.34                        │
│ Estimated Engineer Time: 92h                               │
│ Time Saved (vs manual spec): ~40h                          │
│ ROI: 1.8x (in developer productivity alone)               │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

**What this shows:**
- Every requirement → implementation → tests → production
- Status visible
- Cost transparent
- Incidents connected to requirements
- Value measurable
- Traceability unambiguous

---

## 7. The Factory Dashboard: Connected View

**The homepage shows the entire system, not scattered cards.**

### Redesigned Factory Homepage
```
┌──────────────────────────────────────────────────────────┐
│ Engineering Intelligence Factory                              [⚙️ Settings]│
├──────────────────────────────────────────────────────────┤
│                                                            │
│  THE LIFECYCLE                                             │
│  ──────────────────────────────────────────────────────   │
│                                                            │
│  Intent Definition → Requirements → Architecture → ...   │
│        ○                   ○               ○         ...  │
│        │                   │               │              │
│    Agents           Agents          Agents                │
│                                                            │
│                                                            │
│  SYSTEM STATUS AT A GLANCE                                │
│  ──────────────────────────────────────────────────────   │
│                                                            │
│  Active Playbooks: 5                                       │
│  ├─ 3 running                                              │
│  ├─ 1 waiting on gate                                      │
│  └─ 1 completed                                            │
│                                                            │
│  Total Agents: 12                                          │
│  ├─ 7 currently active                                     │
│  ├─ 5 idle                                                 │
│  └─ 0 failed                                               │
│                                                            │
│  Pending Decisions: 1                                      │
│  └─ Waiting on Tech Lead (47m) → View Gate                │
│                                                            │
│  Cost This Week: $847.34                                   │
│  Typical: $650-$800                                        │
│                                                            │
│                                                            │
│  RECENT ACTIVITY                                           │
│  ──────────────────────────────────────────────────────   │
│                                                            │
│  [Project A] requirements-from-sources      ✅ Done (2h)  │
│     237 requirements, 3 independent reviews, human OK      │
│     Sarah Chen approved 1h ago                             │
│                                                            │
│  [Project B] code-generation-from-spec      ⏳ Running   │
│     Generated 8,200 LOC, Review A done, Review B in 3m    │
│     Agents: CodeGen (done), Refactor (done), Review A-C   │
│                                                            │
│  [Project C] test-gen-and-validation        ⚠️  Gate     │
│     Generated 587 tests, 99.1% pass                        │
│     Judge flagged 2 disagreements, waiting on decision     │
│                                                            │
│  [Project D] deploy-and-monitor             ✅ Done (4h) │
│     47 agents ran, 0 escalations, production healthy       │
│                                                            │
│                                                            │
│  QUICK LINKS                                               │
│  ──────────────────────────────────────────────────────   │
│                                                            │
│  [View All Playbooks] [Browse Agents] [See Evidence]      │
│  [Start New Project] [Review Pending Gates] [Metrics]     │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

**What this shows:**
- Lifecycle is primary visual
- System health at a glance
- Active work visible
- Pending decisions surfaced
- Cost transparent
- Quick access to everything

---

## 8. Implementation Roadmap

### M0–M3 (Data Model & Basic UI)
**Surface basic concepts but keep UI simple:**
- Dashboard hero with Factory concept (text)
- Projects list shows basic model
- Models and sources discoverable
- No complex visualizations yet

### M4–M6 (Orchestration & Agents)
**Make agents visible and orchestration clear:**
- Add "Playbooks" section (basic list view)
- Add "Agents" section (catalog view with telemetry)
- Show playbook structure (simple)
- Evidence begins to accumulate

### M7–M9 (Governance & Traceability)
**Make gates, evidence, and connections visible:**
- Gates become primary UI (notifications, decision interface)
- Evidence packages exportable
- Traceability matrix visible
- Cost tracking apparent

### M10–M11 (Enterprise UI & Polish)
**Full Factory visualization and professional UX:**
- Lifecycle visualization as central view
- Playbook editor with step visualization
- Agent dashboard with real-time status
- Evidence packages fully featured
- Complete AIDLC concept visible in every screen

---

## 9. Design System Implementation

**Every screen reinforces AIDLC concepts:**

### Terminology Consistency
- ✅ "Playbooks" not "Workflows" or "Pipelines"
- ✅ "Agents" not "Tools" or "Workers"
- ✅ "Gates" not "Reviews" or "Approvals"
- ✅ "Evidence" not "Results" or "Data"
- ✅ "Lifecycle" not "Pipeline" or "Stages"
- ✅ "Factory" not "Platform" or "System"

### Visual Hierarchy
1. **The Lifecycle** — Always visible, center of page
2. **Agents in Context** — Under each lifecycle stage
3. **Playbooks** — Orchestration that connects agents
4. **Gates** — Human decision points (prominent)
5. **Evidence** — What validates decisions
6. **Metrics** — Showing value and cost

### Color Coding
- **Agent Status:**
  - Blue: Active
  - Green: Complete
  - Yellow: Waiting/Uncertain
  - Red: Escalation
  - Gray: Idle

- **Gate Status:**
  - Yellow: Pending decision
  - Green: Approved
  - Red: Rejected, needs rework
  - Blue: Escalated to higher authority

- **Evidence Quality:**
  - Green: All independent reviewers agree
  - Yellow: Some disagreement, human judgment applied
  - Red: Critical gaps requiring attention

---

## 10. Key Principles

1. **Concepts are visible, not buried** — AIDLC is the UI, not documentation
2. **Orchestration is central** — Show playbooks and how they connect agents
3. **Agents are transparent** — Show what they do, when they run, success rates
4. **Humans govern gates** — Decisions are prominent and require justification
5. **Evidence is accessible** — No "trust the AI"; show the backing
6. **Connections matter** — Show how intent flows to requirements to code to tests
7. **Cost is visible** — Engineering time, compute cost, value created
8. **Traceability is complete** — Every change tracks back to its requirement
9. **Feedback loops close** — Production telemetry informs future decisions
10. **Industry-agnostic** — No domain-specific terminology or examples

---

**The UI is not a tool to run playbooks. The UI is a teaching tool that shows users what the AIDLC Factory is and how it creates value.**

Every screen should answer: "What is happening, why is it happening, who decided it, and what is the evidence?"
