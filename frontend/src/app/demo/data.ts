// Static, hand-authored demo content for the Engineering Intelligence Factory concept tour.
// Nothing here calls the API — this route exists purely to visualize the
// end-to-end concept (Lifecycle, Playbooks, Agents, Gates, Evidence) before
// the real orchestration engine (M4+) exists.

export type Status = 'success' | 'running' | 'waiting' | 'escalated' | 'idle';

export const lifecycleStages = [
  {
    name: 'Intent Definition',
    agents: ['Intent Agent', 'Domain Analysis'],
  },
  {
    name: 'Requirements',
    agents: ['Requirements Agent', 'Review A/B/C', 'Judge Agent'],
  },
  {
    name: 'Architecture',
    agents: ['Design Agent', 'Planning Agent', 'Architecture Review'],
  },
  {
    name: 'Implementation',
    agents: ['Code Gen Agent', 'Refactor Agent', 'Review Agent'],
  },
  {
    name: 'Validation',
    agents: ['Test Gen Agent', 'Security Review', 'Quality Gate'],
  },
  {
    name: 'Deployment',
    agents: ['Deploy Agent', 'Gate Agent', 'Verify Agent'],
  },
  {
    name: 'Feedback',
    agents: ['Observe Agent', 'Learn Agent', 'Adapt Agent'],
  },
];

export const factoryStats = {
  activePlaybooks: { total: 5, running: 3, waitingOnGate: 1, completed: 1 },
  agents: { total: 12, active: 7, idle: 5, failed: 0 },
  pendingDecisions: 1,
  costThisWeek: 847.34,
  costRangeLabel: 'Typical: $650–$800',
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
    project: 'Enterprise Cloud Platform',
    playbook: 'requirements-from-mixed-sources',
    status: 'success',
    statusLabel: 'Done (2h)',
    detail: '237 requirements, 3 independent reviews, human approved',
    meta: 'Sarah Chen approved 1h ago',
    href: '/demo/evidence/requirements-run',
  },
  {
    project: 'Field Service Mobile App',
    playbook: 'code-generation-from-spec',
    status: 'running',
    statusLabel: 'Running',
    detail: 'Generated 8,200 LOC · Review A done · Review B in 3m',
    meta: 'Agents: CodeGen (done), Refactor (done), Review A–C',
    href: '/demo/runs/live',
  },
  {
    project: 'Billing Reconciliation Service',
    playbook: 'test-gen-and-validation',
    status: 'waiting',
    statusLabel: 'Gate',
    detail: 'Generated 587 tests, 99.1% pass',
    meta: 'Judge flagged 2 disagreements — awaiting decision',
    href: '/demo/gates/pending',
  },
  {
    project: 'Partner Integration Gateway',
    playbook: 'deploy-and-monitor',
    status: 'success',
    statusLabel: 'Done (4h)',
    detail: '47 agent steps ran, 0 escalations, production healthy',
    meta: 'Completed 6h ago',
    href: '/demo/factory',
  },
];

export const playbookLibrary = {
  recommended: [
    {
      id: 'requirements-from-mixed-sources',
      title: 'Requirements from Mixed Sources',
      description: 'Turn business intent + knowledge sources into a reviewed requirements specification',
      agents: ['Requirements Agent', 'Independent Review ×3', 'Judge Agent'],
      gate: 'Human approval when uncertainty > threshold',
      runs: 47,
      lastRun: '2 hours ago',
    },
  ],
  standard: [
    {
      id: 'code-generation-from-architecture',
      title: 'Code Generation from Architecture',
      description: 'Turn an architecture design into working, reviewed code',
      agents: ['Code Gen Agent', 'Review Agent', 'Refactor Agent', 'Test Agent'],
      gate: 'Test coverage ≥ 85%',
      runs: 1203,
      lastRun: '1 hour ago',
    },
    {
      id: 'test-generation-and-validation',
      title: 'Test Generation & Validation',
      description: 'Generate a comprehensive test suite directly from code',
      agents: ['Test Gen Agent', 'Security Agent', 'Quality Agent', 'Judge Agent'],
      gate: 'Security scan clear, complexity below threshold',
      runs: 892,
      lastRun: '3 hours ago',
    },
  ],
  custom: [
    {
      id: 'org-domain-specific-flow',
      title: 'Our Domain-Specific Flow',
      description: 'Custom playbook defined for this organization',
      agents: ['Custom Analysis Agent', 'Domain-Specific Review'],
      gate: 'Legal approval, domain expert sign-off',
      runs: 12,
      lastRun: '1 day ago',
    },
  ],
};

export const playbookDetail = {
  id: 'requirements-from-mixed-sources',
  title: 'Requirements from Mixed Sources',
  version: '2.3',
  lastModified: '2 days ago',
  owner: 'Team A',
  steps: [
    {
      kind: 'step' as const,
      title: 'Step 1 · Understand Business Intent',
      agent: 'Requirements Agent',
      model: 'claude-opus (drafting profile)',
      input: 'Business intent, knowledge sources',
      role: 'Analyze domain, extract scope, identify gaps',
      timeout: '300s',
      output: 'UnderstandingOutput',
    },
    {
      kind: 'step' as const,
      title: 'Step 2 · Generate Requirements Specification',
      agent: 'Requirements Agent',
      model: 'claude-opus (drafting profile)',
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
      model: 'claude-opus (judge profile)',
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
      model: 'claude-opus (drafting profile)',
      input: 'Original spec + judge conflict analysis',
      role: 'Address uncertainty flagged by reviewers',
      timeout: '400s',
      output: 'RequirementsOutput (conditional — only if gate approved)',
    },
  ],
  outputs: ['requirements_spec: RequirementsOutput', 'review_evidence: ReviewOutput[]', 'uncertainty_analysis: ConflictAnalysis'],
};

interface AgentInfo {
  icon: string;
  name: string;
  description: string;
  runsIn: number;
  successRate: number;
  successCount: string;
  avgTime: string;
  models?: string;
  failureModes?: string;
  disputes?: string;
  findings?: string;
  escalations?: string;
  examplePrompt?: string;
  orchestration?: string;
}

export const agentCatalog: Array<{ stage: string; agents: AgentInfo[] }> = [
  {
    stage: 'Requirements Definition',
    agents: [
      {
        icon: '🎯',
        name: 'Requirements Agent',
        description: 'Understands intent, generates specifications',
        runsIn: 8,
        successRate: 94,
        successCount: '412/438',
        avgTime: '2m 34s',
        models: 'Claude Opus, Claude Sonnet',
        examplePrompt: 'You are a requirements analyst. Analyze the business intent and knowledge sources to generate clear, testable requirements. Use EARS format. Trace each requirement to its source.',
        orchestration: 'Runs first in sequence. Output feeds to independent reviewers (Compliance, Clarity, Traceability) in parallel.',
      },
      {
        icon: '📊',
        name: 'Domain Analysis Agent',
        description: 'Extracts domain rules and constraints',
        runsIn: 3,
        successRate: 100,
        successCount: '87/87',
        avgTime: '1m 12s',
        models: 'Claude Sonnet',
      },
    ],
  },
  {
    stage: 'Code Generation & Implementation',
    agents: [
      {
        icon: '💻',
        name: 'Code Generation Agent',
        description: 'Writes code from architecture + requirements',
        runsIn: 12,
        successRate: 87,
        successCount: '1203/1381',
        avgTime: '3m 47s',
        models: 'Claude Opus',
        failureModes: 'Syntax (31), Undefined refs (24)',
      },
      {
        icon: '🔄',
        name: 'Refactor Agent',
        description: 'Simplifies and optimizes code',
        runsIn: 9,
        successRate: 92,
        successCount: '674/732',
        avgTime: '1m 58s',
        models: 'Claude Sonnet',
      },
    ],
  },
  {
    stage: 'Validation & Review (Independent)',
    agents: [
      {
        icon: '✅',
        name: 'Compliance Review Agent',
        description: 'Verifies against requirements & standards',
        runsIn: 15,
        successRate: 96,
        successCount: '2847/2961',
        avgTime: '1m 24s',
        models: 'Claude Opus',
        disputes: '3.2%',
        examplePrompt: 'Review these requirements for completeness. Check: all functional requirements present, all non-functional requirements quantified, acceptance criteria defined, no ambiguity. Use standard rubric.',
        orchestration: 'Runs in parallel with Clarity and Traceability reviewers. Outputs feed to Judge Agent for conflict resolution.',
      },
      {
        icon: '🚨',
        name: 'Adversarial Review Agent',
        description: 'Tries to break implementation, finds edge cases',
        runsIn: 14,
        successRate: 99,
        successCount: '3142/3167',
        avgTime: '2m 08s',
        models: 'Claude Opus',
        disputes: '8.1% (often disagrees with Compliance)',
      },
      {
        icon: '🏛️',
        name: 'Architecture Review Agent',
        description: 'Checks compliance with system design',
        runsIn: 10,
        successRate: 94,
        successCount: '1687/1793',
        avgTime: '1m 52s',
        models: 'Claude Sonnet',
        disputes: '1.9%',
      },
      {
        icon: '🔐',
        name: 'Security Review Agent',
        description: 'Identifies vulnerabilities and attack surfaces',
        runsIn: 8,
        successRate: 97,
        successCount: '584/601',
        avgTime: '2m 34s',
        models: 'Claude Opus',
        findings: 'Critical: 2, High: 14, Medium: 48',
      },
      {
        icon: '📋',
        name: 'Judge Agent',
        description: 'Compares independent reviews, identifies gaps',
        runsIn: 16,
        successRate: 98,
        successCount: '3214/3281',
        avgTime: '1m 42s',
        models: 'Claude Opus',
        escalations: '847 (25.8%)',
        examplePrompt: 'Analyze these three independent reviews. Where do they agree? Where do they conflict? What uncertainty remains? Compute confidence score. Flag areas needing human judgment.',
        orchestration: 'Awaits all three parallel reviewers. Outputs analysis to conditional human gate. If uncertainty > threshold, gate triggers escalation.',
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
