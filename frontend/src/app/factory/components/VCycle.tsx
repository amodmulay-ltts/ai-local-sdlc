import { ArrowDown, ArrowLeftRight, RotateCcw } from 'lucide-react';

// The V-cycle: what happens at each stage (docs/FACTORY_DEMO_DESIGN.md §2.3). The left arm
// specifies, the bottom builds, and the right arm verifies the left. Each stage is one playbook,
// and each one is checked by the stage opposite it.

type Stage = {
  code: string;
  name: string;
  does: string;
  agents: string;
  output: string;
  checkedBy?: string;
  verifies?: string;
};

const leftArm: Stage[] = [
  {
    code: 'U1',
    name: 'Requirements',
    does: 'Turns a stakeholder brief into numbered requirements, each linked to its source.',
    agents: 'Retrieval, SpecWriter, Judge, Human gate',
    output: 'Requirements specification',
    checkedBy: 'U8 system validation',
  },
  {
    code: 'U2',
    name: 'Architecture',
    does: 'Proposes components and interfaces, and allocates each requirement to one of them.',
    agents: 'SpecWriter, Reviewers',
    output: 'Architecture with requirement allocation',
    checkedBy: 'U7 integration verification',
  },
  {
    code: 'U3',
    name: 'Detailed design',
    does: 'Writes the design of each component: state machine, timing, and limits.',
    agents: 'SpecWriter, Reviewers',
    output: 'Detailed design per component',
    checkedBy: 'U5–6 unit verification',
  },
];

const rightArm: Stage[] = [
  {
    code: 'U8',
    name: 'System validation',
    does: 'Checks the built function against the original stakeholder intent and requirements.',
    agents: 'Judge, then a person',
    output: 'Acceptance decision with evidence',
    verifies: 'U1 requirements',
  },
  {
    code: 'U7',
    name: 'Integration verification',
    does: 'Runs interface tests between components, against the architecture.',
    agents: 'Builder, automated tests',
    output: 'Integration test results',
    verifies: 'U2 architecture',
  },
  {
    code: 'U5–6',
    name: 'Unit verification',
    does: 'Derives unit test cases from the detailed design, then runs them.',
    agents: 'SpecWriter, Builder, automated tests',
    output: 'Unit test plan and results',
    verifies: 'U3 detailed design',
  },
];

const card = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5';

function StageCard({ stage, side }: { stage: Stage; side: 'left' | 'right' }) {
  return (
    <div className={card}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className="text-xs font-mono font-semibold text-cyan-700 dark:text-cyan-400">{stage.code}</p>
        <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
          {side === 'left' ? 'Specify' : 'Verify'}
        </p>
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{stage.name}</h3>
      <dl className="space-y-2 text-xs">
        <div>
          <dt className="text-slate-500 dark:text-slate-500">What happens</dt>
          <dd className="text-slate-700 dark:text-slate-300 leading-relaxed">{stage.does}</dd>
        </div>
        <div>
          <dt className="text-slate-500 dark:text-slate-500">Agents</dt>
          <dd className="text-slate-700 dark:text-slate-300">{stage.agents}</dd>
        </div>
        <div>
          <dt className="text-slate-500 dark:text-slate-500">Produces</dt>
          <dd className="text-slate-700 dark:text-slate-300">{stage.output}</dd>
        </div>
      </dl>
      <p className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
        {stage.checkedBy ? (
          <>
            <span className="font-medium">Checked by:</span> {stage.checkedBy}
          </>
        ) : (
          <>
            <span className="font-medium">Verifies:</span> {stage.verifies}
          </>
        )}
      </p>
    </div>
  );
}

export default function VCycle() {
  return (
    <div>
      {/* Column headers */}
      <div className="hidden md:grid grid-cols-2 gap-4 mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
          Left arm · specify the work
        </p>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
          Right arm · verify the work
        </p>
      </div>

      {/* Paired rows: each left stage is verified by the right stage on the same row */}
      <div className="space-y-3">
        {leftArm.map((left, idx) => (
          <div key={left.code} className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
            <StageCard stage={left} side="left" />
            <div className="hidden md:flex flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-600">
              <ArrowLeftRight size={18} />
            </div>
            <StageCard stage={rightArm[idx]} side="right" />
          </div>
        ))}
      </div>

      {/* Bottom of the V */}
      <div className="flex flex-col items-center my-4 text-slate-400 dark:text-slate-600">
        <ArrowDown size={18} />
      </div>
      <div className="max-w-xl mx-auto">
        <div className="bg-white dark:bg-slate-900 border-2 border-cyan-500/50 dark:border-cyan-400/40 rounded-xl p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="text-xs font-mono font-semibold text-cyan-700 dark:text-cyan-400">U4</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500">Build</p>
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Implementation</h3>
          <dl className="space-y-2 text-xs">
            <div>
              <dt className="text-slate-500 dark:text-slate-500">What happens</dt>
              <dd className="text-slate-700 dark:text-slate-300 leading-relaxed">
                The Builder writes one component slice from its detailed design. Reviewers check security, UX, UI, and code.
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-500">Agents</dt>
              <dd className="text-slate-700 dark:text-slate-300">Builder, four Reviewers</dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-500">Produces</dt>
              <dd className="text-slate-700 dark:text-slate-300">Code and reviewed changes</dd>
            </div>
          </dl>
          <p className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-medium">Checked by:</span> U5–6 unit tests and U7 integration tests, in the verify arm
          </p>
        </div>
      </div>

      {/* Change impact: the feedback loop */}
      <div className="mt-5 flex flex-wrap items-start gap-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4">
        <RotateCcw size={16} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <p className="font-semibold text-slate-900 dark:text-white mb-1">U9 · Change impact, across the whole V</p>
          <p>
            When a requirement changes, the change is traced through every stage it touches, and each affected playbook is
            restarted from U1. A person approves the impact before any artifact is changed.
          </p>
        </div>
      </div>
    </div>
  );
}
