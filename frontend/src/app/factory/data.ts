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

// Supporting terms, from docs/CONCEPT.md §3 and §8.1.
export const coreTerms: Array<{ term: string; meaning: string }> = [
  { term: 'Line', meaning: 'One product line, with its own knowledge, routing, approvers, and risk policy. Lines are independent.' },
  { term: 'Work order', meaning: 'One request from intake to release, with every run it spawns. It belongs to exactly one line.' },
  { term: 'Orchestrator', meaning: 'Runs playbook steps in order, routes work to agents, enforces gates, and caps rework.' },
  { term: 'Approver', meaning: 'Applies the line risk policy. Passes low risk automatically and escalates the rest. Never merges on its own.' },
];

// The floor: the organisation-wide view (docs/CONCEPT.md §9.1). Illustrative figures, last 30 days.
export const floorStats = {
  openWorkOrders: 63,
  waitingOnPerson: 9,
  released: 41,
  cycleTime: '4.2 days',
  autonomyRate: 0.71,
  reworkRate: 0.18,
  tokensThisMonth: 14200000,
  costThisMonth: 0,
  costRangeLabel: 'Local models: $0. Cloud API profiles are deferred.',
};

// Open work orders at each stage, across all lines. The counts add up to the open total.
export const flowByStage: Array<{ stage: string; count: number }> = [
  { stage: 'U0', count: 4 },
  { stage: 'U1', count: 8 },
  { stage: 'U2', count: 6 },
  { stage: 'U3', count: 5 },
  { stage: 'U4', count: 14 },
  { stage: 'U5–6', count: 7 },
  { stage: 'U7', count: 5 },
  { stage: 'U8', count: 14 },
];

export const lines: Array<{ name: string; open: number; gatesWaiting: number; owner: string; summary: string }> = [
  {
    name: 'IVI development',
    open: 19,
    gatesWaiting: 3,
    owner: 'IVI product owner',
    summary: 'In-vehicle infotainment: navigation, climate, media, and voice. Changes are checked against the HMI style guide.',
  },
  {
    name: 'OTA cloud systems',
    open: 16,
    gatesWaiting: 2,
    owner: 'OTA release manager',
    summary: 'Over-the-air updates: staged rollouts, rollbacks, and download resilience on the cloud side.',
  },
  {
    name: 'Data products',
    open: 14,
    gatesWaiting: 2,
    owner: 'Data governance lead',
    summary: 'Vehicle telemetry products for service, analytics, and reporting. Governed by data retention and privacy rules.',
  },
  {
    name: 'Vehicle design',
    open: 14,
    gatesWaiting: 2,
    owner: 'Chief engineer, vehicle design',
    summary: 'Vehicle-level design: sensor and camera placement, ECU allocation, and the architecture the software runs on.',
  },
];

export const lineSlug = (name: string) => name.toLowerCase().replace(/ /g, '-');

// Open work orders per stage, for each line. The columns add up to the floor's flow by stage.
export const lineFlow: Record<string, number[]> = {
  'IVI development': [1, 2, 2, 1, 4, 2, 2, 5],
  'OTA cloud systems': [1, 2, 1, 1, 5, 2, 1, 3],
  'Data products': [1, 2, 1, 2, 3, 2, 1, 2],
  'Vehicle design': [1, 2, 2, 1, 2, 1, 1, 4],
};
export const flowStages = ['U0', 'U1', 'U2', 'U3', 'U4', 'U5–6', 'U7', 'U8'];

// Gates waiting on a named person, oldest first.
export const approvalBacklog: Array<{ id: string; stage: string; waiting: string; approver: string; line: string }> = [
  { id: 'WO-061', stage: 'U3', waiting: '4 days', approver: 'Chief engineer', line: 'Vehicle design' },
  { id: 'WO-101', stage: 'U8', waiting: '3 days', approver: 'Data governance lead', line: 'Data products' },
  { id: 'WO-412', stage: 'U1', waiting: '6 minutes', approver: 'IVI product owner', line: 'IVI development' },
];

export type WorkOrder = {
  id: string;
  source: string;
  title: string;
  line: string;
  type: string;
  risk: string;
  stage: string;
  state: string;
  age: string;
  waitingOn: string;
  note?: string;
};

// The inbox. Needs-a-decision items come first, then the rest.
export const workOrders: WorkOrder[] = [
  { id: 'WO-412', source: 'IVI-412', title: 'Show charging stops on the navigation map when range is below 80 km', line: 'IVI development', type: 'New requirement', risk: 'Medium', stage: 'U1', state: 'Needs a decision', age: '6 min', waitingOn: 'IVI product owner', note: 'Run 0142, rework 2 of 3' },
  { id: 'WO-061', source: 'VD-61', title: 'Move the ADAS camera 40 mm lower', line: 'Vehicle design', type: 'Change request', risk: 'High', stage: 'U3', state: 'Needs a decision', age: '4 days', waitingOn: 'Chief engineer', note: 'Fails the wiper arc check' },
  { id: 'WO-101', source: 'DAT-101', title: 'Trip counts double after a tunnel reconnect', line: 'Data products', type: 'Bug', risk: 'Medium', stage: 'U8', state: 'Needs a decision', age: '3 days', waitingOn: 'Data governance lead' },
  { id: 'WO-214', source: 'OTA-214', title: 'Update download restarts from zero after a cellular drop', line: 'OTA cloud systems', type: 'Bug', risk: 'High', stage: 'U4', state: 'In progress', age: '2 h', waitingOn: '-' },
  { id: 'WO-057', source: 'VD-57', title: 'Adaptive cruise control: set-speed and following-distance limits', line: 'Vehicle design', type: 'New requirement', risk: 'High', stage: 'U1', state: 'In progress', age: '40 min', waitingOn: '-' },
  { id: 'WO-093', source: 'DAT-93', title: 'Publish battery state of health daily to the service team', line: 'Data products', type: 'New requirement', risk: 'Medium', stage: 'U1', state: 'In progress', age: '35 min', waitingOn: '-' },
  { id: 'WO-398', source: 'IVI-398', title: 'Climate panel freezes after a voice command', line: 'IVI development', type: 'Bug', risk: 'Medium', stage: 'U5–6', state: 'In progress', age: '1 day', waitingOn: '-' },
  { id: 'WO-220', source: 'OTA-220', title: 'Roll back to the previous ECU image within 24 hours', line: 'OTA cloud systems', type: 'Change request', risk: 'High', stage: 'U2', state: 'Blocked', age: '1 day', waitingOn: 'Architect', note: 'No rollback policy for this ECU family yet' },
];

// The work order open in the inbox detail pane. Its stages run in order.
export const selectedWorkOrder = {
  id: 'WO-412',
  opened: 'Today, 09:14',
  parentRun: 'run_0141 · U0 intake-and-triage · done',
  currentStage: 'U1',
  waitingFor: 'IVI product owner, 6 minutes. Decision due within 24h.',
  runs: [
    'run_0141 · U0 intake-and-triage · done',
    'run_0142 · U1 intent-to-requirements · iteration 2 of 3, judge running',
  ],
  changedSinceLastLook: true,
};

// Playbook versions in use across lines. Used on the floor.
export const playbookHealth: Array<{ playbook: string; version: string; lines: string; note: string }> = [
  { playbook: 'U0 intake-and-triage', version: '1.0', lines: 'All lines', note: 'Current' },
  { playbook: 'U1 intent-to-requirements', version: '0.3 (draft)', lines: 'IVI development, Data products, Vehicle design', note: 'OTA cloud systems pinned to 0.2' },
  { playbook: 'U8 system-validation', version: '0.1 (draft)', lines: 'IVI development, Data products', note: 'Not yet reviewed' },
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

// One traced example runs through the concept pages: an IVI feature, IVI-412, goes through U0
// intake and U1 requirements. IVI-377, an earlier item, shows a full chain to release.
// All figures are illustrative.

// The U1 playbook detail. Same shape as before, so the playbook detail page renders it unchanged.
export const playbookDetail = {
  id: 'intent-to-requirements',
  title: 'U1 · Intent to Requirements',
  version: '0.3 (draft)',
  lastModified: 'Illustrative',
  owner: 'Requirements lead',
  steps: [
    {
      kind: 'step' as const,
      title: 'Step 1 · Retrieve governed context',
      agent: 'Retrieval',
      model: 'local-fast',
      timeout: '120s',
      input: 'Stakeholder brief, linked tracker item, line knowledge',
      role: 'Find the relevant sources and rank them. No drafting.',
      output: 'ContextSet with source versions',
    },
    {
      kind: 'step' as const,
      title: 'Step 2 · Draft requirements',
      agent: 'SpecWriter',
      model: 'local-strong',
      timeout: '600s',
      input: 'ContextSet and the brief',
      role: 'Write numbered requirements, each with a source reference.',
      output: 'RequirementsDraft (version n)',
    },
    {
      kind: 'step' as const,
      title: 'Step 3 · Structure to template',
      agent: 'SpecWriter (template fill)',
      model: 'local-fast',
      timeout: '120s',
      input: 'RequirementsDraft',
      role: 'Apply the requirement template. Check IDs and required fields.',
      output: 'RequirementsSpec',
    },
    {
      kind: 'parallel' as const,
      title: 'Step 4 · Independent reviews',
      lanes: [
        { name: 'Review A · Compliance', agent: 'Reviewer', check: 'Is every required element present?' },
        { name: 'Review B · Clarity', agent: 'Reviewer', check: 'Is each requirement testable and unambiguous?' },
        { name: 'Review C · Traceability', agent: 'Reviewer', check: 'Does each requirement link to a source?' },
      ],
    },
    {
      kind: 'step' as const,
      title: 'Step 5 · Judge the reviews',
      agent: 'Judge',
      model: 'local-strong (second model family)',
      timeout: '180s',
      input: 'The three review outputs and the spec',
      role: 'Find where reviewers disagree. Score the uncertainty that remains.',
      output: 'ConflictAnalysis with uncertainty score',
    },
    {
      kind: 'gate' as const,
      title: 'Gate · Human review',
      trigger: 'Uncertainty score above 0.30',
      approvers: 'One named approver (line product owner)',
      escalation: 'Chief engineer, if no decision within 24h',
      timeoutLabel: '24h',
      status: 'Up to 3 rework iterations, then escalate',
    },
    {
      kind: 'step' as const,
      title: 'Step 6 · Publish with evidence',
      agent: 'Approver and exporter',
      model: 'none (rule-based)',
      timeout: '60s',
      input: 'Approved spec and its evidence',
      role: 'Store the approved version as a baseline and write the evidence package.',
      output: 'Requirements baseline and EvidencePackage',
    },
  ],
  outputs: ['requirements_spec: RequirementsSpec', 'review_evidence: ReviewOutput[]', 'uncertainty_analysis: ConflictAnalysis'],
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
        responsibility: 'Blocks the run until a person approves in the inbox.',
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

// Simulated runs across the four lines, all running at the same time. Nothing here executes.
// run_0142 is the run the gate and evidence pages refer to.
export type SimStep = { name: string; state: 'done' | 'running' | 'waiting' | 'pending' };

export type SimRun = {
  id: string;
  line: 'IVI development' | 'OTA cloud systems' | 'Data products' | 'Vehicle design';
  workOrder: string;
  source: string;
  title: string;
  stage: string;
  playbook: string;
  status: 'running' | 'waiting';
  elapsed: string;
  tokens: string;
  note?: string;
  steps: SimStep[];
  events: string[];
};

export const simulatedRuns: SimRun[] = [
  {
    id: 'run_0142',
    line: 'IVI development',
    workOrder: 'WO-412',
    source: 'IVI-412',
    title: 'Show charging stops on the navigation map',
    stage: 'U1',
    playbook: 'intent-to-requirements',
    status: 'running',
    elapsed: '11m 53s',
    tokens: '30,410',
    note: 'Rework 2 of 3',
    steps: [
      { name: 'Retrieve context', state: 'done' },
      { name: 'Draft requirements', state: 'done' },
      { name: 'Structure to template', state: 'done' },
      { name: 'Independent reviews', state: 'done' },
      { name: 'Judge the reviews', state: 'running' },
      { name: 'Human gate', state: 'pending' },
      { name: 'Publish with evidence', state: 'pending' },
    ],
    events: ['09:24:50  judge started, second model family', '09:24:49  reviews finished: B 4 issues, C 2 gaps'],
  },
  {
    id: 'run_0143',
    line: 'IVI development',
    workOrder: 'WO-398',
    source: 'IVI-398',
    title: 'Climate panel freezes after a voice command',
    stage: 'U5–6',
    playbook: 'unit-verification',
    status: 'running',
    elapsed: '38m',
    tokens: '96,100',
    steps: [
      { name: 'Derive test cases', state: 'done' },
      { name: 'Generate tests', state: 'done' },
      { name: 'Run tests', state: 'running' },
      { name: 'Report', state: 'pending' },
    ],
    events: ['Run started: 214 of 240 unit tests complete'],
  },
  {
    id: 'run_0151',
    line: 'OTA cloud systems',
    workOrder: 'WO-214',
    source: 'OTA-214',
    title: 'Update download restarts from zero after a cellular drop',
    stage: 'U4',
    playbook: 'design-to-implementation',
    status: 'running',
    elapsed: '2h 04m',
    tokens: '612,800',
    steps: [
      { name: 'Plan the slice', state: 'done' },
      { name: 'Build', state: 'done' },
      { name: 'Reviews: security, UX, UI, code', state: 'running' },
      { name: 'Publish', state: 'pending' },
    ],
    events: ['09:18:02  reviews started, 4 reviewers in parallel', '09:12:44  build finished, 6 files changed'],
  },
  {
    id: 'run_0153',
    line: 'OTA cloud systems',
    workOrder: 'WO-220',
    source: 'OTA-220',
    title: 'Roll back to the previous ECU image within 24 hours',
    stage: 'U2',
    playbook: 'requirements-to-architecture',
    status: 'waiting',
    elapsed: '1 day',
    tokens: '41,200',
    note: 'Waiting on the Architect: no rollback policy for this ECU family',
    steps: [
      { name: 'Retrieve context', state: 'done' },
      { name: 'Draft architecture', state: 'done' },
      { name: 'Structure to template', state: 'done' },
      { name: 'Independent reviews', state: 'done' },
      { name: 'Judge the reviews', state: 'done' },
      { name: 'Human gate', state: 'waiting' },
      { name: 'Publish with evidence', state: 'pending' },
    ],
    events: ['Gate opened: rollback window conflicts with the ECU storage limit'],
  },
  {
    id: 'run_0160',
    line: 'Data products',
    workOrder: 'WO-101',
    source: 'DAT-101',
    title: 'Trip counts double after a tunnel reconnect',
    stage: 'U8',
    playbook: 'system-validation',
    status: 'waiting',
    elapsed: '3 days',
    tokens: '204,500',
    note: 'Waiting on the Data governance lead',
    steps: [
      { name: 'Compare with stakeholder intent', state: 'done' },
      { name: 'Acceptance checks', state: 'done' },
      { name: 'Judge the result', state: 'done' },
      { name: 'Human gate', state: 'waiting' },
      { name: 'Publish with evidence', state: 'pending' },
    ],
    events: ['Gate opened: one acceptance check fails after a reconnect'],
  },
  {
    id: 'run_0162',
    line: 'Data products',
    workOrder: 'WO-093',
    source: 'DAT-93',
    title: 'Publish battery state of health daily to the service team',
    stage: 'U1',
    playbook: 'intent-to-requirements',
    status: 'running',
    elapsed: '35m',
    tokens: '38,900',
    steps: [
      { name: 'Retrieve context', state: 'done' },
      { name: 'Draft requirements', state: 'done' },
      { name: 'Structure to template', state: 'running' },
      { name: 'Independent reviews', state: 'pending' },
      { name: 'Judge the reviews', state: 'pending' },
      { name: 'Human gate', state: 'pending' },
      { name: 'Publish with evidence', state: 'pending' },
    ],
    events: ['Structure started: 22 requirements drafted'],
  },
  {
    id: 'run_0170',
    line: 'Vehicle design',
    workOrder: 'WO-061',
    source: 'VD-61',
    title: 'Move the ADAS camera 40 mm lower',
    stage: 'U3',
    playbook: 'architecture-to-design',
    status: 'waiting',
    elapsed: '4 days',
    tokens: '118,700',
    note: 'Waiting on the chief engineer: the wiper arc check fails',
    steps: [
      { name: 'Retrieve context', state: 'done' },
      { name: 'Draft detailed design', state: 'done' },
      { name: 'Independent reviews', state: 'done' },
      { name: 'Judge the reviews', state: 'done' },
      { name: 'Human gate', state: 'waiting' },
      { name: 'Publish with evidence', state: 'pending' },
    ],
    events: ['Gate opened: the camera position fails the wiper arc check'],
  },
  {
    id: 'run_0171',
    line: 'Vehicle design',
    workOrder: 'WO-057',
    source: 'VD-57',
    title: 'Adaptive cruise control: set-speed and following-distance limits',
    stage: 'U1',
    playbook: 'intent-to-requirements',
    status: 'running',
    elapsed: '40m',
    tokens: '45,200',
    steps: [
      { name: 'Retrieve context', state: 'done' },
      { name: 'Draft requirements', state: 'done' },
      { name: 'Structure to template', state: 'running' },
      { name: 'Independent reviews', state: 'pending' },
      { name: 'Judge the reviews', state: 'pending' },
      { name: 'Human gate', state: 'pending' },
      { name: 'Publish with evidence', state: 'pending' },
    ],
    events: ['Structure started: 31 requirements drafted'],
  },
];

// The approval request for run 0142. The run stops here until a named person decides.
export const approvalRequest = {
  run: 'run_0142 · U1 intent-to-requirements',
  workOrder: 'WO-412',
  line: 'IVI development',
  reason: 'Uncertainty is above the threshold, so the judge escalated to a person.',
  waiting: '6 minutes',
  deadline: 'Decision due within 24h, then escalates to the chief engineer',
  risk: 'Medium. The requirements change what the driver sees while driving.',
  uncertainty: { score: 0.38, threshold: 0.3 },
  reviews: [
    { reviewer: 'Review A · Compliance', verdict: 'All 38 requirements have the required elements', flagged: false },
    { reviewer: 'Review B · Clarity', verdict: '4 requirements are not testable as written', flagged: true },
    { reviewer: 'Review C · Traceability', verdict: '2 requirements have no source link', flagged: true },
  ],
  disagreements: [
    {
      id: 'REQ-031',
      text: 'Suggestions refresh within a reasonable time after a reroute',
      issue: 'Clarity says it cannot be tested. Compliance accepted it.',
      suggested: 'Replace with the numeric limit from the HMI timing spec: 2 seconds after the route changes.',
    },
    {
      id: 'REQ-044',
      text: 'Suggestions stay visible during a turn',
      issue: 'The judge finds it conflicts with the rule that hides non-essential content during manoeuvres.',
      suggested: 'Decide the rule: keep, hide, or show at reduced size during turns.',
    },
    {
      id: 'REQ-058',
      text: 'A charging stop chime sounds on the cluster',
      issue: 'No source link.',
      suggested: 'Link it to the HMI style guide, section 4.2, or remove it.',
    },
  ],
  judgeSummary: 'The reviewers agree on 35 of 38 requirements. The three disagreements all concern timing and attention while driving.',
  options: [
    { label: 'Approve', effect: 'Publish version 1 with the three items recorded as open.' },
    { label: 'Approve with changes', effect: 'Apply the suggested edits and publish. No new review.' },
    { label: 'Send back for rework', effect: 'The draft runs again. This is the last rework allowed (3 of 3).' },
    { label: 'Reject', effect: 'Stop the run and record the reason as evidence.' },
  ],
  rule: 'The factory never publishes on its own. A named person decides at every gate, and rework is capped at three iterations.',
};

// The evidence package for run 0142. It is assembling until the gate is decided.
export const evidenceRun = {
  run: 'run_0142',
  workOrder: 'WO-412',
  playbook: 'U1 intent-to-requirements, version 0.3',
  line: 'IVI development',
  status: 'Assembling. Waiting for the gate decision.',
  inputs: [
    'Tracker item IVI-412, version 3, fetched 09:14',
    'navigation-requirements.pdf, pages 5 and 9, version 2',
    'hmi-style-guide.md, version 7',
    'Intake handoff from run_0141: source reference, brief, classification, routing',
  ],
  outputs: ['Requirements draft, version 2: 38 requirements', 'Structured spec: template valid'],
  reviews: [
    { name: 'Review A · Compliance', verdict: 'All 38 requirements have the required elements.', flagged: false },
    { name: 'Review B · Clarity', verdict: '4 requirements are not testable as written.', flagged: true },
    { name: 'Review C · Traceability', verdict: '2 requirements have no source link.', flagged: true },
  ],
  judge: 'Uncertainty 0.38 against a threshold of 0.30. Three disagreements, all about timing and attention.',
  gate: 'Pending. Waiting for a named approver.',
  calls: [
    { step: 'Retrieve', profile: 'local-fast', tokensIn: 3120, tokensOut: 410 },
    { step: 'Draft, iteration 1', profile: 'local-strong', tokensIn: 4920, tokensOut: 1150 },
    { step: 'Draft, iteration 2', profile: 'local-strong', tokensIn: 4920, tokensOut: 1160 },
    { step: 'Structure', profile: 'local-fast', tokensIn: 2700, tokensOut: 1190 },
    { step: 'Review A', profile: 'local-fast', tokensIn: 3100, tokensOut: 510 },
    { step: 'Review B', profile: 'local-fast', tokensIn: 3000, tokensOut: 520 },
    { step: 'Review C', profile: 'local-fast', tokensIn: 3200, tokensOut: 510 },
  ],
  provenance: {
    prompts: 'spec-writer v3, reviewer v2, judge v1',
    sources: 'Versions and hashes recorded at fetch',
    reproducibility: 'The same inputs and profiles give the same sequence of steps. The wording of the output may vary.',
  },
  links: 'Source: IVI-412. Forward: the U3 design starts only after this baseline is published.',
};

// Traced chains across lines. Two are released, and two are still at requirements.
export type TraceRow = {
  id: string;
  text: string;
  source: string;
  design: string;
  code: string;
  unitTests: string;
  integration: string;
  validation: string;
  status: 'verified' | 'attention' | 'open';
  note?: string;
};

export const traceChains: Array<{
  item: string;
  line: string;
  state: string;
  release: string;
  rows: TraceRow[];
}> = [
  {
    item: 'IVI-377 · Show remaining range on the instrument cluster',
    line: 'IVI development',
    state: 'Released in IVI 4.2',
    release: 'IVI 4.2',
    rows: [
      {
        id: 'REQ-021',
        text: 'Remaining range is shown on the cluster',
        source: 'IVI-377, navigation-requirements.pdf p.4',
        design: 'DD-03 range display',
        code: 'range-display module',
        unitTests: 'UT-071 to UT-073 pass',
        integration: 'SIL-14 pass',
        validation: 'AC-6 accepted on test vehicle',
        status: 'verified',
      },
      {
        id: 'REQ-022',
        text: 'Range updates within 5 s of a charge change',
        source: 'IVI-377, navigation-requirements.pdf p.6',
        design: 'DD-03 range display',
        code: 'range-display module',
        unitTests: 'UT-074 pass',
        integration: 'SIL-14 pass',
        validation: 'AC-6 accepted on test vehicle',
        status: 'verified',
      },
      {
        id: 'REQ-023',
        text: 'Range hides in low-power mode',
        source: 'IVI-377, hmi-style-guide.md §6',
        design: 'DD-04 power states',
        code: 'power-state handler',
        unitTests: 'UT-080 failed once, fixed in run_0121',
        integration: 'HIL-15 pass',
        validation: 'AC-7 re-run pending',
        status: 'attention',
        note: 'Validation needs a re-run after the fix.',
      },
    ],
  },
  {
    item: 'OTA-208 · Staged rollout to a 5% canary fleet',
    line: 'OTA cloud systems',
    state: 'Released in OTA 3.0',
    release: 'OTA 3.0',
    rows: [
      {
        id: 'REQ-061',
        text: 'A new update reaches 5% of vehicles before the full rollout',
        source: 'OTA-208, ota-requirements.pdf p.2',
        design: 'DD-11 rollout controller',
        code: 'rollout-controller service',
        unitTests: 'UT-140 to UT-143 pass',
        integration: 'SIL-31 pass',
        validation: 'AC-12 accepted on canary fleet',
        status: 'verified',
      },
      {
        id: 'REQ-062',
        text: 'The rollout pauses automatically when the failure rate passes 1%',
        source: 'OTA-208, ota-requirements.pdf p.3',
        design: 'DD-11 rollout controller',
        code: 'rollout-controller service',
        unitTests: 'UT-144 pass',
        integration: 'SIL-31 pass',
        validation: 'AC-12 accepted on canary fleet',
        status: 'verified',
      },
    ],
  },
  {
    item: 'IVI-412 · Show charging stops on the navigation map',
    line: 'IVI development',
    state: 'At requirements. Waiting for the gate decision.',
    release: 'Not yet',
    rows: [
      {
        id: 'REQ-031',
        text: 'Suggestions refresh within a reasonable time after a reroute',
        source: 'IVI-412, navigation-requirements.pdf p.5',
        design: 'Not started',
        code: 'Not started',
        unitTests: 'Not started',
        integration: 'Not started',
        validation: 'Not started',
        status: 'open',
        note: 'Open at the gate. Clarity review says it is not testable.',
      },
      {
        id: 'REQ-044',
        text: 'Suggestions stay visible during a turn',
        source: 'hmi-style-guide.md §4.2',
        design: 'Not started',
        code: 'Not started',
        unitTests: 'Not started',
        integration: 'Not started',
        validation: 'Not started',
        status: 'open',
        note: 'Conflicts with the rule that hides content during manoeuvres.',
      },
      {
        id: 'REQ-058',
        text: 'A charging stop chime sounds on the cluster',
        source: 'No source link',
        design: 'Not started',
        code: 'Not started',
        unitTests: 'Not started',
        integration: 'Not started',
        validation: 'Not started',
        status: 'attention',
        note: 'Traceability review found no source.',
      },
    ],
  },
  {
    item: 'VD-57 · Adaptive cruise control: set-speed and following-distance limits',
    line: 'Vehicle design',
    state: 'At requirements. Structuring the spec.',
    release: 'Not yet',
    rows: [
      {
        id: 'REQ-101',
        text: 'The set speed can be changed in 5 km/h steps between 30 and 150 km/h',
        source: 'VD-57, adas-requirements.pdf p.2',
        design: 'Not started',
        code: 'Not started',
        unitTests: 'Not started',
        integration: 'Not started',
        validation: 'Not started',
        status: 'open',
        note: 'Structuring. Reviews have not started.',
      },
    ],
  },
];

// Change impact (U9): what a change to one requirement would touch.
export const changeImpact = {
  changed: 'REQ-022 · Range updates within 5 s of a charge change',
  affected: ['DD-03 range display', 'range-display module', 'UT-074', 'SIL-14', 'AC-6'],
  action: 'Affected playbooks restart from U1. A person approves the impact before any artifact changes.',
};


// Cost of AI (docs/CONCEPT.md §9). Local models cost $0, so tokens are the real measure. The
// equivalent figure is what the same tokens would cost on a cloud API at these illustrative list
// prices. It is shown to compare, not as a bill. Monthly figures; other periods scale from them.
export const costBasis = { inputPerMillion: 3, outputPerMillion: 15 };

export const monthTokens = { input: 11_800_000, output: 2_400_000 };

export const periodScale: Record<'day' | 'week' | 'month' | 'year', number> = {
  day: 1 / 30,
  week: 7 / 30,
  month: 1,
  year: 12,
};

export const periodLabel: Record<'day' | 'week' | 'month' | 'year', string> = {
  day: 'Average day',
  week: 'This week',
  month: 'This month',
  year: 'This year, at this rate',
};

// Monthly tokens in millions, split by stage, line, and activity. Each split adds up to the month.
export const costByStage: Array<{ name: string; millions: number }> = [
  { name: 'U0 intake-and-triage', millions: 0.1 },
  { name: 'U1 intent-to-requirements', millions: 3.8 },
  { name: 'U2 requirements-to-architecture', millions: 1.6 },
  { name: 'U3 architecture-to-design', millions: 1.3 },
  { name: 'U4 design-to-implementation', millions: 4.8 },
  { name: 'U5–6 unit verification', millions: 1.0 },
  { name: 'U7 integration verification', millions: 0.4 },
  { name: 'U8 system-validation', millions: 1.2 },
];

export const costByLine: Array<{ name: string; millions: number }> = [
  { name: 'IVI development', millions: 5.4 },
  { name: 'OTA cloud systems', millions: 3.9 },
  { name: 'Data products', millions: 3.1 },
  { name: 'Vehicle design', millions: 1.8 },
];

export const costByActivity: Array<{ name: string; millions: number }> = [
  { name: 'Building code (Builder)', millions: 4.3 },
  { name: 'Drafting requirements and design (SpecWriter)', millions: 4.4 },
  { name: 'Review and judging (Reviewers, Judge)', millions: 3.5 },
  { name: 'Test generation', millions: 1.2 },
  { name: 'Retrieval and classification', millions: 0.8 },
];

// Share of tokens by model profile (used on the cost detail page).
export const profileSplit: Array<{ profile: string; share: number }> = [
  { profile: 'local-strong', share: 0.61 },
  { profile: 'local-fast', share: 0.31 },
  { profile: 'Second model family (judge)', share: 0.08 },
  { profile: 'Cloud API profiles', share: 0 },
];
