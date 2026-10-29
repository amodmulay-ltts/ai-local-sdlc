// Hand-authored illustrative content for the Engineering Intelligence Factory concept.
// Nothing here calls the API — this route exists purely to visualize the
// end-to-end concept (Lifecycle, Playbooks, Agents, Gates, Evidence) before
// the real orchestration engine (M4+) exists.

export type Status = 'success' | 'running' | 'waiting' | 'escalated' | 'idle';

// The V-cycle (docs/FACTORY_DEMO_DESIGN.md §2.3): each stage is one playbook. The left arm
// specifies, the bottom builds, and the right arm verifies the left.
export const lifecycleStages = [
  { name: 'Requirements', playbook: 'U1', agents: ['Retrieval', 'SpecWriter', 'Judge', 'Human gate'] },
  { name: 'Architecture', playbook: 'U2', agents: ['SpecWriter', 'Reviewers'] },
  { name: 'Detailed design', playbook: 'U3', agents: ['SpecWriter', 'Reviewers'] },
  { name: 'Implementation', playbook: 'U4', agents: ['Builder', 'Reviewers'] },
  { name: 'Unit verification', playbook: 'U5–U6', agents: ['Builder', 'Gate: tests pass'] },
  { name: 'Integration verification', playbook: 'U7', agents: ['Builder', 'Gate: tests pass'] },
  { name: 'System validation', playbook: 'U8', agents: ['Judge', 'Human gate'] },
  { name: 'Change impact', playbook: 'U9', agents: ['Orchestrator', 'Judge', 'Human gate'] },
];

// Supporting terms, from docs/CONCEPT.md §3 and §8. Playbook, Agent, Gate, and Evidence are
// explained on the overview page itself.
export const coreTerms: Array<{ term: string; meaning: string }> = [
  { term: 'Project', meaning: 'The scope for knowledge, model policy, and runs. One product per project.' },
  { term: 'Run', meaning: 'One execution of a playbook. Each run keeps its source references and produces evidence.' },
  { term: 'Orchestrator', meaning: 'Runs playbook steps in order, routes work to agents, enforces gates, and caps rework.' },
  { term: 'Approver', meaning: 'Applies the project risk policy. Passes low risk automatically and escalates the rest. Never merges on its own.' },
];

// Illustrative numbers. Cost is $0 for local models; tokens are the real measure.
export const factoryStats = {
  runs: { total: 12, active: 3, waitingOnGate: 1, completed: 8 },
  agents: { total: 7, active: 3, idle: 4, failed: 0 },
  pendingApprovals: 1,
  autonomyRate: 0.72,
  medianCycleTime: '2h 40m',
  tokensThisWeek: 1840000,
  costThisWeek: 0,
  costRangeLabel: 'Local models: $0. Tokens are logged per call.',
};

export const recentActivity: Array<{
  project: string;
  playbook: string;
  status: Status;
  statusLabel: string;
  detail: string;
  meta: string;
  href: string;
}> = [
  {
    project: 'Field Service Mobile App',
    playbook: 'U1 intent-to-requirements',
    status: 'success',
    statusLabel: 'Done (2h)',
    detail: '237 requirements, 3 independent reviews, judge passed, human approved',
    meta: 'Approved by the Tech Lead 1h ago',
    href: '/factory/evidence/requirements-run',
  },
  {
    project: 'Field Service Mobile App',
    playbook: 'U4 design-to-implementation',
    status: 'running',
    statusLabel: 'Running',
    detail: 'Builder wrote the scheduling slice · Security and code reviews in progress',
    meta: 'Agents: Builder (done), Reviewers (2 of 4 done)',
    href: '/factory/runs/live',
  },
  {
    project: 'Billing Reconciliation Service',
    playbook: 'U5 unit-verification',
    status: 'waiting',
    statusLabel: 'Gate',
    detail: '587 unit tests, 99.1% pass',
    meta: 'Judge flagged 2 disagreements, awaiting decision',
    href: '/factory/gates/pending',
  },
  {
    project: 'Partner Integration Gateway',
    playbook: 'U9 change-impact',
    status: 'success',
    statusLabel: 'Done (4h)',
    detail: 'A changed requirement traced to 14 affected artifacts, 0 escalations',
    meta: 'Completed 6h ago',
    href: '/factory/traceability',
  },
];

export interface LibraryPlaybook {
  id: string;
  code: string;
  title: string;
  vStage: string;
  description: string;
  agents: string[];
  gate: string;
  verifiedBy: string;
  href?: string;
}

// The V-cycle playbook library (docs/FACTORY_DEMO_DESIGN.md §2.3).
// Every entry is designed, not runnable: the orchestrator (M5) and playbook engine (M6) are not built.
// U1 is the first vertical slice (docs/CONCEPT.md §10.1).
export const playbookLibrary: { firstSlice: LibraryPlaybook; vCycle: LibraryPlaybook[] } = {
  firstSlice: {
    id: 'intent-to-requirements',
    code: 'U1',
    title: 'Intent to Requirements',
    vStage: 'Left · stakeholder needs → system requirements',
    description: 'Turns a stakeholder brief and knowledge sources into numbered requirements, checked by an independent judge.',
    agents: ['Retrieval (local-fast)', 'SpecWriter (local-strong)', 'Judge (different model family)', 'Approver'],
    gate: 'Human approval when uncertainty is above threshold',
    verifiedBy: 'U8 system-validation',
    href: '/factory/playbooks/requirements-from-mixed-sources',
  },
  vCycle: [
    {
      id: 'requirements-to-architecture',
      code: 'U2',
      title: 'Requirements to Architecture',
      vStage: 'Left · system → architecture',
      description: 'Proposes components and interfaces for the adaptive cruise control (ACC) function, and allocates requirements to them.',
      agents: ['SpecWriter (local-strong)', 'Reviewers (local-fast)'],
      gate: 'Reviewer pass, capped at max_iterations',
      verifiedBy: 'U7 integration-verification',
    },
    {
      id: 'architecture-to-design',
      code: 'U3',
      title: 'Architecture to Design',
      vStage: 'Left · architecture → detailed design',
      description: 'Writes the detailed design for each component: state machine, timing, and limits.',
      agents: ['SpecWriter (local-strong)', 'Reviewers (local-fast)'],
      gate: 'Reviewer pass',
      verifiedBy: 'U6 design-test-plan',
    },
    {
      id: 'design-to-implementation',
      code: 'U4',
      title: 'Design to Implementation',
      vStage: 'Bottom · implementation',
      description: 'The Builder writes one component slice. Reviewers check security, UX, UI, and code.',
      agents: ['Builder (local-strong)', 'Reviewers ×4 (local-fast)'],
      gate: 'All reviewers pass, capped at max_iterations',
      verifiedBy: 'U5 unit-verification',
    },
    {
      id: 'unit-verification',
      code: 'U5',
      title: 'Unit Verification',
      vStage: 'Right · unit tests',
      description: 'Generates and runs unit tests against the detailed design.',
      agents: ['Builder (local-strong)'],
      gate: 'Tests pass',
      verifiedBy: 'Gate: tests pass',
    },
    {
      id: 'design-test-plan',
      code: 'U6',
      title: 'Design Test Plan',
      vStage: 'Right · unit test plan',
      description: 'Derives unit test cases from the detailed design, traceable to U3.',
      agents: ['SpecWriter (local-strong)', 'Reviewers (local-fast)'],
      gate: 'Reviewer pass',
      verifiedBy: 'Reviewer',
    },
    {
      id: 'integration-verification',
      code: 'U7',
      title: 'Integration Verification',
      vStage: 'Right · integration tests',
      description: 'Runs interface tests between components against the architecture.',
      agents: ['Builder (local-strong)'],
      gate: 'Tests pass',
      verifiedBy: 'Gate: tests pass',
    },
    {
      id: 'system-validation',
      code: 'U8',
      title: 'System Validation',
      vStage: 'Right · acceptance',
      description: 'Checks the built function against the original stakeholder intent and requirements.',
      agents: ['Judge (local-strong)', 'Human gate'],
      gate: 'Human approval',
      verifiedBy: 'Human gate',
    },
    {
      id: 'change-impact',
      code: 'U9',
      title: 'Change Impact',
      vStage: 'Cross-cutting · feedback loop',
      description: 'When a requirement changes, traces it through the V and lists the affected artifacts.',
      agents: ['Orchestrator', 'Judge (local-strong)', 'Human gate'],
      gate: 'Human approval',
      verifiedBy: 'Human gate',
    },
  ],
};

export const playbookDetail = {
  id: 'requirements-from-mixed-sources',
  title: 'U1 · Intent to Requirements',
  version: '2.3',
  lastModified: '2 days ago',
  owner: 'Team A',
  steps: [
    {
      kind: 'step' as const,
      title: 'Step 1 · Understand Business Intent',
      agent: 'Requirements Agent',
      model: 'local-strong (drafting profile)',
      input: 'Business intent, knowledge sources',
      role: 'Analyze domain, extract scope, identify gaps',
      timeout: '300s',
      output: 'UnderstandingOutput',
    },
    {
      kind: 'step' as const,
      title: 'Step 2 · Generate Requirements Specification',
      agent: 'Requirements Agent',
      model: 'local-strong (drafting profile)',
      input: 'Understanding from Step 1',
      role: 'Draft complete requirements specification',
      timeout: '600s',
      output: 'RequirementsOutput',
    },
    {
      kind: 'parallel' as const,
      title: 'Step 3 · Parallel Independent Reviews',
      lanes: [
        { name: 'Review A · Compliance', agent: 'Independent Reviewer A', check: 'Is it complete?' },
        { name: 'Review B · Clarity', agent: 'Independent Reviewer B', check: 'Is it unambiguous?' },
        { name: 'Review C · Traceability', agent: 'Independent Reviewer C', check: 'Does it trace to sources?' },
      ],
    },
    {
      kind: 'step' as const,
      title: 'Step 4 · Compare & Analyze Disagreements',
      agent: 'Judge Agent',
      model: 'local-strong (judge, different model family)',
      input: 'All three review outputs',
      role: 'Identify conflicts, flag uncertainty',
      timeout: '120s',
      output: 'ConflictAnalysis',
    },
    {
      kind: 'gate' as const,
      title: 'Gate · Human Review (Conditional)',
      trigger: 'Uncertainty score > 0.30',
      approvers: '1 required',
      escalation: 'Tech Lead → Architect',
      timeoutLabel: '24h',
      status: 'Waiting on Tech Lead approval',
    },
    {
      kind: 'step' as const,
      title: 'Step 5 · Refine Based on Feedback',
      agent: 'Requirements Agent',
      model: 'local-strong (drafting profile)',
      input: 'Original spec + judge conflict analysis',
      role: 'Address uncertainty flagged by reviewers',
      timeout: '400s',
      output: 'RequirementsOutput (conditional — only if gate approved)',
    },
  ],
  outputs: ['requirements_spec: RequirementsOutput', 'review_evidence: ReviewOutput[]', 'uncertainty_analysis: ConflictAnalysis'],
};

export interface AgentRole {
  name: string;
  responsibility: string;
  profile: string;
  milestone: string;
  rule?: string;
}

// Agent roles from docs/FACTORY_DEMO_DESIGN.md §2.2. They are planned as Python classes in
// src/orchestrator/ (M5–M9). None has run yet. The model layer they call (M2) is implemented.
export const agentRoles: Array<{ group: string; agents: AgentRole[] }> = [
  {
    group: 'Control',
    agents: [
      {
        name: 'Orchestrator',
        responsibility: 'Reads the playbook, runs steps in order, enforces gates, and queues work.',
        profile: 'None (deterministic)',
        milestone: 'M5',
        rule: 'Every agent call is one CallLog row tagged with run_id, step_id, agent, and model_profile.',
      },
      {
        name: 'Approver',
        responsibility: 'Applies the risk level. Auto-passes low risk and escalates the rest.',
        profile: 'None (rule-based)',
        milestone: 'M9',
        rule: 'Never merges on its own.',
      },
      {
        name: 'Human gate',
        responsibility: 'Blocks the run until a person approves in the dashboard.',
        profile: 'None',
        milestone: 'M9',
        rule: 'The run stops here and waits for an approval click.',
      },
    ],
  },
  {
    group: 'Work',
    agents: [
      {
        name: 'SpecWriter',
        responsibility: 'Turns a request into a spec: requirements and acceptance criteria.',
        profile: 'local-strong',
        milestone: 'M7',
      },
      {
        name: 'Builder',
        responsibility: 'Produces code or artifacts for one feature slice.',
        profile: 'local-strong, or an optional cloud profile later',
        milestone: 'M7',
        rule: 'A failed review sends its findings back here, capped at max_iterations.',
      },
    ],
  },
  {
    group: 'Verification',
    agents: [
      {
        name: 'Reviewers',
        responsibility: 'One per domain (security, UX, UI, code). Each returns pass or fail with findings.',
        profile: 'local-fast, one per domain',
        milestone: 'M8',
      },
      {
        name: 'Judge',
        responsibility: 'Compares independent reviews, flags disagreement, and scores uncertainty.',
        profile: 'local-strong, from a different model family than the drafter',
        milestone: 'M8',
        rule: 'Two model families keep the judge independent locally. Vendor independence comes with enterprise adapters.',
      },
    ],
  },
];

export const liveRun = {
  playbook: 'requirements-from-mixed-sources',
  project: 'Field Service Mobile App',
  elapsed: '47m 23s',
  currentStepIndex: 2,
  completedSteps: [
    { title: 'Step 1 · Understand', agent: 'Requirements Agent', time: '5m 14s', output: '42 domain constraints identified' },
    { title: 'Step 2 · Generate', agent: 'Requirements Agent', time: '18m 47s', output: '237 requirements generated' },
  ],
  runningStep: {
    title: 'Step 3 · Parallel Reviews',
    elapsed: '23m 42s',
    lanes: [
      { name: 'Review A · Compliance', status: 'success' as Status, time: '2m', findings: 8 },
      { name: 'Review B · Clarity', status: 'success' as Status, time: '4m', findings: 5 },
      { name: 'Review C · Traceability', status: 'running' as Status, time: '3m elapsed', findings: null },
    ],
  },
  pendingSteps: ['Step 4 · Judge & Analyze — awaiting review completions', 'Step 5 · GATE — awaiting judge analysis', 'Step 6 · Refine — conditional, awaiting gate'],
  evidenceSoFar: [
    'Input: Business intent (4,200 chars)',
    'Input: 3 knowledge sources (47 chunks analyzed)',
    'Intermediate: 42 domain constraints',
    'Output so far: 237 requirements',
    'Review A findings: 8 compliance issues',
    'Review B findings: 5 clarity issues',
    'Review C: pending',
  ],
  logs: [
    { step: 'Step 1 · Understand', lines: ['[17:23:45] Agent started', '[17:23:46] Loaded 3 knowledge sources (47 chunks)', '[17:23:47] Analyzing domain…', '[17:28:56] Complete. 42 constraints identified'] },
    { step: 'Step 2 · Generate', lines: ['[17:29:00] Agent started with understanding', '[17:29:02] Generating from template…', '[17:45:30] Complete. 237 requirements generated', '[17:45:31] Queuing parallel reviews…'] },
  ],
};

const gateReviews: Array<{ reviewer: string; verdict: string; flagged?: boolean }> = [
  { reviewer: 'Review A (Compliance)', verdict: 'All 237 requirements clear' },
  { reviewer: 'Review B (Clarity)', verdict: 'All 237 requirements clear' },
  { reviewer: 'Review C (Traceability)', verdict: '47 requirements lack sources', flagged: true },
  { reviewer: 'Review D (Security)', verdict: '12 security implications noted', flagged: true },
];

export const gateDecision = {
  playbook: 'requirements-from-mixed-sources',
  project: 'Billing Reconciliation Service',
  waitingSince: '12 minutes ago',
  reviews: gateReviews,
  judgeAnalysis: {
    disagreementLevel: 'MEDIUM (Review C vs others)',
    uncertaintyScore: 0.38,
    threshold: 0.3,
    escalationTriggered: true,
  },
  recommendation: "Address Review C's traceability gaps before proceeding. May require source documentation.",
  approverNote:
    "Review C's concern is valid but non-blocking. The traceability gaps noted are low-risk: most requirements are linked to architecture docs or external specs that will be documented in Phase 2. Proceeding to implementation is safe.\n\n— Sarah Chen, Tech Lead",
};

export const evidencePackage = {
  playbook: 'requirements-from-mixed-sources',
  project: 'Enterprise Cloud Platform',
  date: '2026-09-28',
  status: 'success' as Status,
  summary:
    'Generated 237 requirements from business intent + sources. All verified by 3 independent reviewers. 2 disagreements resolved, 0 critical issues. Approved by Sarah Chen (Tech Lead), 2h 12m ago. Ready for architecture & implementation phases.',
  inputs: {
    intent: 'Build cloud-native platform for 10K+ concurrent users',
    sources: [
      'customer-requirements.pdf (14 pages, shared)',
      'technical-constraints.docx (8 pages, shared)',
      'regulatory-requirements.xlsx (3 sheets, project)',
    ],
  },
  outputs: {
    total: 237,
    functional: 187,
    nonFunctional: 50,
    traceability: '100% (all linked to sources)',
    completenessScore: 94,
  },
  validation: {
    testsGenerated: 587,
    testsPass: true,
    architectureConflicts: 0,
    scopeFlags: 3,
    securityConcerns: 0,
  },
  reviews: [
    { name: 'Review A (Compliance)', status: 'success' as Status, verdict: 'PASS — all requirements meet standard format', issues: 0, note: 'Well-structured, clear EARS format' },
    { name: 'Review B (Clarity)', status: 'success' as Status, verdict: 'PASS — all requirements are unambiguous', issues: 2, note: 'REQ-042 could be more specific on timing' },
    { name: 'Review C (Traceability)', status: 'waiting' as Status, verdict: 'PASS WITH CONCERN — 47 reqs lack direct link', issues: 47, note: 'Most link via architecture, but some implicit' },
  ],
  disagreement: {
    parties: 'Compliance vs Traceability',
    a: 'Compliance: format is clear, completeness sufficient',
    b: 'Traceability: direct source links missing',
    resolution: 'Human decision — approved. Traceability gaps acceptable because linked via architecture docs.',
  },
  decision: {
    verdict: 'APPROVED',
    approver: 'Sarah Chen (Tech Lead)',
    timestamp: '2026-09-28T14:32:15Z',
    note: 'Traceability gaps are non-blocking. Gaps will be resolved in Phase 2 documentation. Proceeding to architecture is safe.',
  },
  cost: {
    executionTime: '1h 47m',
    llmCost: 12.34,
    reviewTime: '12m',
    estimatedValue: 847,
  },
};

interface TraceabilityRow {
  id: string;
  text: string;
  source: string;
  status: Status;
  statusLabel: string;
  codeId: string;
  tests: string;
  validation: string;
  changedBy: string | null;
  cost: string;
  telemetry: string;
  incident?: string;
  remediation?: string;
}

export const traceabilityRows: TraceabilityRow[] = [
  {
    id: 'REQ-001',
    text: 'System shall support 10K concurrent users',
    source: 'customer-requirements.pdf, page 3',
    status: 'success' as Status,
    statusLabel: 'Implemented',
    codeId: 'login-scalability',
    tests: 'TEST-001.1, TEST-001.2, TEST-001.3 (all pass)',
    validation: 'Load test passed (9,800 users sustained)',
    changedBy: 'Code Refactor Agent (2h ago)',
    cost: '~3h dev time, $2.14 compute',
    telemetry: 'Achieved 11.2K concurrent in production',
  },
  {
    id: 'REQ-042',
    text: 'API response time < 200ms for 95th percentile',
    source: 'technical-constraints.docx, section 2.3',
    status: 'waiting' as Status,
    statusLabel: 'Attention needed',
    codeId: 'api-optimization',
    tests: 'TEST-042.1, TEST-042.2 (pass), TEST-042.3 FAILING (1.3% failure rate)',
    validation: '99.7th percentile met, 95th percentile at 215ms',
    changedBy: 'Code Gen Agent (3 days ago)',
    cost: '~2h dev time, $1.87 compute',
    incident: 'PROD-2847 (latency spikes on auth change)',
    remediation: 'Implemented connection pooling',
    telemetry: 'Monitoring — trending toward 190ms',
  },
  {
    id: 'REQ-089',
    text: 'Audit trail for all access',
    source: 'regulatory-requirements.xlsx, sheet 1',
    status: 'success' as Status,
    statusLabel: 'Implemented',
    codeId: 'audit-logging',
    tests: 'TEST-089.1, TEST-089.2, TEST-089.3 (all pass)',
    validation: '100% event coverage, log integrity OK',
    changedBy: null,
    cost: '~4h dev time, $3.02 compute',
    telemetry: '847K+ audit events logged, system healthy',
  },
];

export const traceabilitySummary = {
  totalRequirements: 237,
  implemented: 237,
  testsWritten: 587,
  testPassRate: 99.1,
  requirementsTested: '234/237 (98.7%)',
  attentionNeeded: 3,
  totalCost: 847.34,
  estimatedEngineerHours: 92,
  timeSaved: 40,
  roi: '1.8x (in developer productivity alone)',
};
