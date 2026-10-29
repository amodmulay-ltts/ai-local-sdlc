# Concept: the organisation-wide factory, lines, and the inbox

**Status:** Folded into [CONCEPT.md](CONCEPT.md) (§4.3, §8.1, §9.1, §12, §13). Kept for the wireframes and the detailed panel list. If the two differ, CONCEPT.md is the source.
**Written for:** stakeholders and engineers reviewing the organisation-level design.

---

## 1. What this adds

[CONCEPT.md](CONCEPT.md) describes one factory handling one product's requests. Three gaps remain.

1. **No name for one request, end to end.** A request starts intake (U0), then U1, then U2, and so on. Each is a separate run, but nothing represents the whole journey. There is nothing to put in a queue, assign to a person, or show as "waiting at the requirements gate".
2. **No organisation view.** An organisation has many products, each with its own rules and approvers. Leaders need one picture of where work is, where it waits, and why.
3. **"Project" is the wrong word.** It is generic, and it collides with Jira and GitHub projects, which intake has to read. It also says nothing about the idea that the concept is built on.

This document proposes four things: a **work order** (the unit that moves), an **inbox** (the queue of work orders), a **line** (what we now call a project), and the **floor** (the organisation-wide view).

---

## 2. Vocabulary

| Term | Meaning | Relates to |
|---|---|---|
| **Factory** | The organisation-wide system: all lines, the shared playbook library, shared policies, and the floor | The concept's "factory", now explicitly organisation-wide |
| **Line** | One product's production line: its knowledge, routing table, approvers, risk policy, and work orders | Replaces *Project* (CONCEPT §8, PLAN §2) |
| **Work order** | One request from intake to release, with every run it spawns | New. The source reference sits at its root |
| **Stage** | One step of the V-cycle on the line: one playbook (U1 requirements, U2 architecture, and so on) | Unchanged term |
| **Run** | One execution of one playbook | Unchanged. Each run belongs to one work order |
| **Gate** | A checkpoint with criteria and a recorded outcome | Unchanged |
| **Inbox** | The queue of work orders that need attention | New |
| **Floor** | The organisation-wide dashboard across all lines | New |

All of it comes from one picture: **a factory has lines, work orders move along a line from stage to stage, and quality gates stop what is not ready.**

---

## 3. Why "line"

| Option | For | Against |
|---|---|---|
| **Line** (recommended) | Means both *production line* and *product line*, which is exactly what a project is here. Short. Fits floor, stage, and work order | "Line of code" and "line item" are common phrases. Always write "the IVI development line" and the clash goes away |
| Cell | Lean manufacturing's "work cell": a team plus its tools | Bland, and collides with spreadsheet and biology uses |
| Bay | A workshop bay. Physical and memorable | Few people will recognise it as a unit of work |
| Works | As in ironworks. Suggests a whole site | Dated, and suggests the whole factory, not one product |
| Keep "Project" | Everyone knows it | Generic. Clashes with Jira and GitHub projects, which intake reads |

In use: "The IVI development line has 19 open work orders, and 3 are waiting at a gate."

A Jira project maps to a line. The mapping is configuration, so one line may read several trackers.

---

## 4. The work order

A **work order** is one request and everything that happens to it. It is created when intake accepts an event from a source system, and it is closed when the change is released, rejected, or cancelled.

**What it holds**
- The source reference: system, key, and link. It is the root of traceability.
- The line it belongs to, and its type: feature, defect, enhancement, or change request.
- Its risk level, set by the line's policy.
- The chain of runs it has spawned: U0, then U1, then U2, and so on, each with its parent.
- Its current stage, its state, and who it is waiting on.
- Its evidence, collected from all of its runs.

**States**

```
Received → Triaging (U0) → Queued → In progress → Needs a decision → In progress → Released → Closed
                                          │              │
                                          ├─ Blocked      └─ Rejected → Closed
                                          └─ On hold
```

| State | Meaning |
|---|---|
| Received | The event landed. Intake has not started |
| Triaging | U0 is running: normalising, classifying, routing |
| Queued | Routed, waiting for the next stage to start |
| In progress | A run is working at a stage |
| Needs a decision | A gate is open. A named person must decide |
| Blocked | Waiting on something outside the factory: missing source information, or a failed check that cannot be retried |
| On hold | Paused by a person, with a reason |
| Released | The change shipped |
| Rejected / Closed | Ended, with the reason recorded as evidence |

**Rules**
- A work order belongs to **exactly one line**. Lines are independent. A change that touches two products becomes two work orders, one per line, and they may be linked by a *depends on* relation (decision 3, §11).
- A work order is not a run. The work order is the whole journey. Runs are the steps of it.
- Duplicates are merged, not deleted. The merge is recorded as evidence.

---

## 5. The inbox

**Purpose.** One place that shows every work order that needs attention and where each one stands. It works like a good mail or support inbox: what needs me comes first, and what changed since I last looked is marked.

**Wireframe (list and detail)**

```
Inbox      [ Needs me 3 ]  [ All 27 ]  [ Stuck 2 ]  [ Mine ]        Line: All lines ▾    Search
────────────────────────────────────────────────────────────────────────────────────────────────
 ●  IVI-412  Charging stops on the map     IVI development New req.   U1 ▸ gate   Needs a decision   6m   IVI product owner
 ●  OTA-214  Download restarts on drop     OTA cloud      Defect      U4 ▸ review In progress        2h   -
 ○  IVI-420  Shorter boot splash           IVI development Enhancement U0 ▸        Triaging           1m   -
 ○  VD-61   Move ADAS camera 40 mm lower    Vehicle design Change req. U3 ▸        Needs a decision   4d   Chief engineer
────────────────────────────────────────────────────────────────────────────────────────────────
 IVI-412  Charging stops on the map                                            Medium risk · New requirement
 Stage    [U0 ✓] [U1 ◉] [U2] [U3] [U4] [U5–6] [U7] [U8]             Run: run_0142 · iteration 2 of 3
 Waiting on the Tech Lead · 6 minutes · due in 24h
 Evidence so far · Traceability · Runs (U0 → U1)
 [ Approve ] [ Approve with changes ] [ Send back ] [ Reject ]        More: Assign · Hold · Reroute · Merge
```

**Columns.** Source key and title, line, type, current stage, state, age in that state, and who it is waiting on.

**Views** (saved, shareable)
- **Needs me:** gates and tasks waiting on the signed-in person.
- **All:** every work order the person may see.
- **Stuck:** blocked, or in one state longer than the line's target.
- **Mine:** work orders I opened or own.
- **By line, by source, by risk, by stage.** A board layout that groups by stage is a second view of the same data.

**Actions.** Every action is recorded as evidence with who, when, and why.
- Decide a gate: approve, approve with changes, send back for rework, reject.
- Assign or reassign, hold, release a hold.
- Reroute: override the router's choice of playbook.
- Merge duplicates, split a work order, cancel.

**Rules**
- **Needs-action first.** The default sort puts open gates at the top, oldest first.
- **Changed since I looked.** Each row shows a mark until the person opens it.
- **A digest, not noise.** Notifications batch gates waiting and breaches of target time. Individual events stay in the inbox.
- **No write-back by default.** Changing the source system (a Jira status, a chat reply) goes through a gate, as in CONCEPT §4.1.

---

## 6. The floor: the organisation-wide dashboard

**Purpose.** Show leaders where work is across every line, where it waits, and what that costs. It is built from the same run events that feed the inbox.

**Panels**

| Panel | What it shows | Why it matters |
|---|---|---|
| **Flow by stage** | Work orders at each stage across the organisation, with queue length and average wait | Shows where queues form, especially at gates. This is the review-bottleneck story, measured |
| **Approval backlog** | Open gates by line, oldest first, and by approver | The main cause of delay once AI does the drafting |
| **Throughput** | Work orders released per week, by line and by type | Output, not activity |
| **Cycle time** | Median time from intake to release, by line and type | Speed of the whole chain, not of one stage |
| **Autonomy rate** | Share of gate decisions passed without escalation | How much the factory handles on evidence |
| **Rework rate** | Share of runs that needed rework, by stage | Where quality is lost early |
| **Resources** | Tokens and cost by profile, split by local model, automation, and cloud API | Whether the right resource is used (CONCEPT §4.2) |
| **Playbook health** | Versions in use, pass rates, and lines still on an old version | Keeps the library governed |
| **Change impact** | Requirement changes in the last period and the artifacts they touched | Shows how stable the requirements are |

**Wireframe**

```
Floor                                                      Organisation: Acme · Last 30 days ▾
────────────────────────────────────────────────────────────────────────────────────────────────
 Open work orders 63   Waiting on a person 9   Released 41   Cycle time 4.2d   Autonomy 71%
 Flow by stage   U0 ▌2   U1 ▌▌▌6   U2 ▌▌4   U3 ▌▌3   U4 ▌▌▌▌▌11   U5–6 ▌▌4   U7 ▌2   U8 ▌▌▌▌▌▌14 ← queue
 Lines             IVI development  19 open · 3 gates     OTA cloud  16 open · 2 gates     Data products  14 open · 2 gates     Vehicle design  14 open · 2 gates
 Oldest gates      VD-61 4d · DAT-101 3d · IVI-412 6m
```

**Drill path.** Floor, then a line, then a work order, then its evidence. Every number on the floor links to the work orders behind it.

**Visibility.** For now, everyone with access to the factory sees everything on the floor, including work order titles and evidence from every line. Narrowing this by line comes with roles and permissions (M10, decision 4).

---

## 7. The organisation model

**Hierarchy**

```
Organisation
 └─ Factory                        shared library, shared policy, the floor
     └─ Line                       one product: knowledge, routing, approvers, risk policy
         └─ Work order             one request, from intake to release
             └─ Run                one playbook execution
```

**What is shared and what is per line**

| Shared across the factory | Per line |
|---|---|
| Playbook library, versioned. A line may pin a version or fork one under review | Knowledge sources and their visibility |
| Model profiles and resource policy (local, automation, cloud) | Routing table: which playbook handles which request type |
| Source connectors (chat, trackers) registered once | Approvers and escalation paths |
| Risk-policy templates and the minimum rules | Risk levels and gates, never looser than the factory minimum |
| Audit and the event schema | Targets for time in each state |

**Roles**

| Role | Can do |
|---|---|
| Factory admin | Manage lines, shared playbooks, connectors, and policy. See the floor in full |
| Line owner | Configure a line: routing, approvers, targets. See everything in the line |
| Approver | Decide gates for the lines and risk levels assigned to them |
| Contributor | Open and follow work orders in their lines |
| Viewer | Read-only access to everything, for now. Per-line scoping arrives with M10 |

**Independence.** Lines are independent. They do not share knowledge, prompts, routing, or approvers unless a source is explicitly shared (CONCEPT §8). Visibility is a separate matter: for now everyone with factory access can see every line (§6). A line may be stricter than the factory policy, never looser. For example, a line can require local-only models even where the factory allows cloud profiles.

---

## 8. Data model additions (concept level)

| Entity | Change |
|---|---|
| Organisation | New. Owns the factory |
| Line | Rename of Project. Adds routing table, targets, and a tracker mapping |
| WorkOrder | New. `id`, `line_id`, `source_ref`, `type`, `risk`, `state`, `current_stage`, `opened_at`, `closed_at` |
| PlaybookRun | Gains `work_order_id` and `parent_run_id` |
| Assignment | New. Who a work order or gate is waiting on, and since when |
| SavedView | New. A named inbox filter |
| Run events | `run.started`, `step.finished`, `gate.result`, `call.completed` gain `work_order_id` and `line_id` |

The inbox and the floor are **views over run events**, not separate stores. That keeps the organisation view a read-only aggregator, as FACTORY_DEMO_DESIGN §2.5 already states.

---

## 9. How this fits the existing concept

| Item | Effect |
|---|---|
| CONCEPT §8 project isolation | Unchanged in meaning. "Project" becomes "line" |
| CONCEPT §4.1 intake (U0) | U0 now creates the work order. Its handoff contract carries the work order's id |
| CONCEPT §6 traceability | The work order's source reference is the root of the evidence graph |
| FACTORY_DEMO_DESIGN §2.5 | "Factory instance" is replaced by "line". The factory is the organisation-wide system |
| PLAN M10 (auth, RBAC, cross-project governance) | Organisation roll-ups and cross-line views depend on it. A single-line inbox does not |
| Roadmap | None of this is scheduled. It follows the orchestrator (M5) and U0 |

---

## 10. Suggested build order (not scheduled)

Each slice can be built, tested, and checked on its own.

1. **Work order and links.** The `WorkOrder` entity, and the work order and parent links on runs. Tests only.
2. **Inbox, read-only, for one line.** List and detail, fed from run events.
3. **Inbox actions.** Decide a gate, assign, hold, reroute, each recorded as evidence.
4. **Floor for one line.** Flow by stage, approval backlog, cycle time.
5. **Organisation roll-ups.** Several lines, roles and permissions (needs M10).
6. **Cross-line links.** The *depends on* relation between work orders.

**Preconditions:** the orchestrator and run events (M5), and U0 (§4.1 of the concept).

---

## 11. Decisions made

1. **"Line" is the name** for what was called a project.
2. **"Stage" stays.** There is no separate word "station". The inbox and the floor say "stage".
3. **Lines are independent.** A work order belongs to exactly one line. Work that touches two products becomes two work orders, linked by a *depends on* relation.
4. **Visibility is open for now.** Everyone with access to the factory sees every line, including titles and evidence. Narrowing it by line is part of roles and permissions (M10).

## 12. Open questions for review

1. **"Work order."** Is it the right word for a request's whole journey? It has not been confirmed.
2. **Inbox ownership.** A personal queue, a shared queue per line, or both?
3. **Targets.** Who sets the time targets for each state: the factory, or each line?
4. **Default scopes at M10.** When visibility narrows, what is the default for each role?
5. **Tenancy.** One organisation per deployment, or several?
6. **Merging and splitting.** What rules decide that two requests are the same work order?
7. **Sizing.** How many lines should one factory expect? The answer sets how much the floor must filter.
