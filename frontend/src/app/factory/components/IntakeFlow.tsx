import { ArrowRight, ArrowDown, ArrowLeft, Radio, ShieldCheck } from 'lucide-react';

// Work enters through intake (docs/CONCEPT.md §4.1). Intake is playbook U0, with services nested
// inside it. Playbooks chain by emitting events, each run records its parent, and every step uses
// the cheapest resource that can decide correctly (docs/CONCEPT.md §4.2).

type Resource = 'local' | 'automation' | 'cloud' | 'human';

const resourceStyle: Record<Resource, { label: string; chip: string }> = {
  local: {
    label: 'Local model',
    chip: 'border-cyan-200 dark:border-cyan-500/30 bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-400',
  },
  automation: {
    label: 'Automation',
    chip: 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  },
  cloud: {
    label: 'Cloud API · deferred',
    chip: 'border-dashed border-violet-300 dark:border-violet-500/40 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400',
  },
  human: {
    label: 'Human gate',
    chip: 'border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400',
  },
};

function ResourceChip({ type }: { type: Resource }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${resourceStyle[type].chip}`}>
      {resourceStyle[type].label}
    </span>
  );
}

const sources = ['Chat message', 'Tracker issue', 'Webhook', 'Schedule'];

const services: Array<{ name: string; job: string; resource: Resource }> = [
  { name: 'Connector', job: 'Fetches the full item', resource: 'automation' },
  { name: 'Deduplicator', job: 'One item, one run', resource: 'automation' },
  { name: 'Normalizer', job: 'Source text is data', resource: 'automation' },
  { name: 'Classifier', job: 'Rules first, model if unclear', resource: 'local' },
  { name: 'Router', job: 'Picks the playbook', resource: 'automation' },
  { name: 'Handoff', job: 'Starts the child run', resource: 'automation' },
];

// Each playbook in the V-cycle, with the resources its steps use.
const chain: Array<{ code: string; name: string; resources: Resource[]; note?: string; cloudOptional?: boolean }> = [
  { code: 'U1', name: 'Requirements', resources: ['local', 'human'], note: 'Judge uses a second model family' },
  { code: 'U2', name: 'Architecture', resources: ['local'] },
  { code: 'U3', name: 'Design', resources: ['local'] },
  { code: 'U4', name: 'Implementation', resources: ['local', 'automation'], cloudOptional: true, note: 'Builder may use a cloud profile' },
  { code: 'U5–6', name: 'Unit tests', resources: ['automation', 'local'] },
  { code: 'U7', name: 'Integration', resources: ['automation'] },
  { code: 'U8', name: 'Validation', resources: ['local', 'human'], note: 'Judge, then a person decides' },
];

const trace = ['Source item', 'Requirement', 'Design', 'Code', 'Tests', 'Release'];

const box = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl';
const label = 'text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-2';

export default function IntakeFlow() {
  return (
    <div className={`${box} p-6`}>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <p className="text-xs text-slate-500 dark:text-slate-400 mr-2">Resources:</p>
        {(Object.keys(resourceStyle) as Resource[]).map((r) => (
          <ResourceChip key={r} type={r} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[auto_auto_1fr] gap-4 lg:gap-3 items-stretch">
        {/* Triggers */}
        <div className="flex flex-col">
          <p className={label}>Triggers</p>
          <div className="flex flex-col gap-2">
            {sources.map((s) => (
              <div key={s} className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-300">
                <Radio size={13} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                {s}
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center text-slate-400 dark:text-slate-600">
          <ArrowRight size={20} />
        </div>
        <div className="flex lg:hidden justify-center text-slate-400 dark:text-slate-600">
          <ArrowDown size={20} />
        </div>

        {/* Intake playbook with nested services */}
        <div className="rounded-xl border-2 border-cyan-500/50 dark:border-cyan-400/40 bg-cyan-50/40 dark:bg-cyan-500/5 p-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <p className="text-xs font-mono font-semibold text-cyan-700 dark:text-cyan-400">U0 · intake-and-triage</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Intake playbook</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
              <ShieldCheck size={11} />
              Gate
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {services.map((svc, idx) => (
              <div key={svc.name} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5">
                <p className="text-[10px] font-mono text-slate-400 dark:text-slate-600">{idx + 1}</p>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">{svc.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mb-1.5">{svc.job}</p>
                <ResourceChip type={svc.resource} />
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-3">
            Services are deterministic code. The classifier calls a model only when the rules cannot decide.
          </p>
        </div>
      </div>

      {/* Handoff to the V-cycle */}
      <div className="flex items-center justify-center gap-2 py-4 text-slate-400 dark:text-slate-600">
        <ArrowDown size={18} />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Handoff contract: source reference, brief, classification, routing decision
        </p>
        <ArrowDown size={18} />
      </div>

      {/* The chain of playbooks: each step emits an event to the next */}
      <p className={label}>Chained playbooks: each one emits an event that starts the next as a child run</p>
      <div className="flex flex-wrap items-stretch gap-y-3">
        {chain.map((step, idx) => (
          <div key={step.code} className="flex items-center">
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 w-40 h-44 flex flex-col">
              <p className="text-[10px] font-mono font-semibold text-cyan-700 dark:text-cyan-400">{step.code}</p>
              <p className="text-xs font-semibold text-slate-900 dark:text-white mb-1.5">{step.name}</p>
              <div className="flex flex-wrap gap-1">
                {step.resources.map((r) => (
                  <ResourceChip key={r} type={r} />
                ))}
                {step.cloudOptional && <ResourceChip type="cloud" />}
              </div>
              {step.note && <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-1.5 leading-snug">{step.note}</p>}
            </div>
            {idx < chain.length - 1 && (
              <div className="flex flex-col items-center px-1.5 text-slate-400 dark:text-slate-600">
                <ArrowRight size={14} />
                <span className="text-[9px] font-mono text-slate-400 dark:text-slate-600">event</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Feedback loop: a changed requirement goes back to the start of the V */}
      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-3">
        <div className="w-40 h-44 flex flex-col rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2">
          <p className="text-[10px] font-mono font-semibold text-cyan-700 dark:text-cyan-400">U9</p>
          <p className="text-xs font-semibold text-slate-900 dark:text-white mb-1.5">Change impact</p>
          <div className="flex flex-wrap gap-1">
            <ResourceChip type="local" />
            <ResourceChip type="human" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ArrowLeft size={14} className="text-slate-400 dark:text-slate-600" />
          A changed requirement traces through the V and restarts the affected playbooks, starting at U1.
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
        A human gate sits at U8 and before any write-back to a source system. Cloud profiles are optional and need project policy approval. The cloud adapter is deferred.
      </p>

      {/* Traceability */}
      <div className="mt-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4">
        <p className={label}>Traceability: every artifact links back to its source</p>
        <div className="flex flex-wrap items-center gap-2">
          {trace.map((t, idx) => (
            <div key={t} className="flex items-center gap-2">
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-800 dark:text-slate-200">
                {t}
              </span>
              {idx < trace.length - 1 && <ArrowRight size={14} className="text-slate-400 dark:text-slate-600" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
