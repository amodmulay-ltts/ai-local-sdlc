import { ArrowDown, FileCode, Eye, FileText, ClipboardList } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { playbookDetail } from '../../data';

export default function PlaybookDetailPage() {
  const p = playbookDetail;

  return (
    <div>
      <PageHeader
        eyebrow="Stop 2 of 7 · Playbook detail"
        title={p.title}
        description={`Version ${p.version} · Last modified ${p.lastModified} · Owner ${p.owner}`}
      />

      <div className="flex flex-col items-stretch gap-0 mb-8">
        {p.steps.map((step, idx) => (
          <div key={step.title}>
            {step.kind === 'step' && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-3">{step.title}</h3>
                <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-xs">
                  <div>
                    <dt className="text-slate-500">Agent</dt>
                    <dd className="text-slate-200 font-medium">{step.agent}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Model</dt>
                    <dd className="text-slate-200 font-medium">{step.model}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Timeout</dt>
                    <dd className="text-slate-200 font-medium">{step.timeout}</dd>
                  </div>
                  <div className="col-span-2 md:col-span-3">
                    <dt className="text-slate-500">Input</dt>
                    <dd className="text-slate-300">{step.input}</dd>
                  </div>
                  <div className="col-span-2 md:col-span-3">
                    <dt className="text-slate-500">Role</dt>
                    <dd className="text-slate-300">{step.role}</dd>
                  </div>
                  <div className="col-span-2 md:col-span-3">
                    <dt className="text-slate-500">Output shape</dt>
                    <dd className="text-cyan-400 font-mono">{step.output}</dd>
                  </div>
                </dl>
              </div>
            )}

            {step.kind === 'parallel' && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-3">{step.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {step.lanes.map((lane) => (
                    <div key={lane.name} className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                      <p className="text-sm font-semibold text-slate-100 mb-1">{lane.name}</p>
                      <p className="text-xs text-slate-500 mb-1">Agent: {lane.agent}</p>
                      <p className="text-xs text-slate-400">Check: {lane.check}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step.kind === 'gate' && (
              <div className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-5">
                <h3 className="font-semibold text-amber-400 mb-3">{step.title}</h3>
                <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-xs mb-3">
                  <div>
                    <dt className="text-slate-500">Trigger if</dt>
                    <dd className="text-slate-200 font-medium">{step.trigger}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Approvers</dt>
                    <dd className="text-slate-200 font-medium">{step.approvers}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Escalation</dt>
                    <dd className="text-slate-200 font-medium">{step.escalation}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Timeout</dt>
                    <dd className="text-slate-200 font-medium">{step.timeoutLabel}</dd>
                  </div>
                </dl>
                <p className="text-xs font-medium text-amber-400 bg-amber-500/10 rounded-md px-3 py-2 inline-block">
                  Status: {step.status}
                </p>
              </div>
            )}

            {idx < p.steps.length - 1 && (
              <div className="flex justify-center py-2">
                <ArrowDown size={18} className="text-slate-700" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">Final output</h3>
        <ul className="space-y-1">
          {p.outputs.map((o) => (
            <li key={o} className="text-sm font-mono text-cyan-400">
              ├─ {o}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          { icon: Eye, label: 'View prompts' },
          { icon: ClipboardList, label: 'View configs' },
          { icon: FileText, label: 'View rubrics' },
          { icon: FileCode, label: 'Export YAML' },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            title="Disabled in static tour — full transparency is available in the real app"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 text-slate-500 text-sm font-medium rounded-lg cursor-not-allowed"
          >
            <Icon size={15} />
            {label}
          </span>
        ))}
      </div>
      <p className="text-xs text-slate-600 mt-3">
        In the real app, every prompt, agent config, and rubric behind this playbook is visible and exportable —
        nothing runs in a black box.
      </p>
    </div>
  );
}
