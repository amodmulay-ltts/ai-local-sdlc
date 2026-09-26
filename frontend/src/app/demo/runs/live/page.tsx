import { CheckCircle2, Loader2, Square, Download, Pause } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import { liveRun } from '../../data';

export default function LiveRunPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Stop 4 of 7"
        title={`Playbook Run: ${liveRun.playbook}`}
        description={`Project: ${liveRun.project} · ${liveRun.elapsed} elapsed`}
        right={<StatusBadge status="running" label="Running" />}
      />

      <div className="space-y-3 mb-8">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Completed steps</h2>
        {liveRun.completedSteps.map((step) => (
          <div key={step.title} className="flex items-start gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
            <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-white text-sm">
                {step.title} <span className="text-slate-500 font-normal">— {step.time}</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Agent: {step.agent}</p>
              <p className="text-sm text-slate-300 mt-1">Output: {step.output}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">
          Current step (running)
        </h2>
        <div className="bg-blue-500/5 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Loader2 size={18} className="text-blue-400 animate-spin" />
            <p className="font-medium text-white text-sm">
              {liveRun.runningStep.title}{' '}
              <span className="text-slate-500 font-normal">— {liveRun.runningStep.elapsed} elapsed</span>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {liveRun.runningStep.lanes.map((lane) => (
              <div key={lane.name} className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-100">{lane.name}</p>
                  <StatusBadge status={lane.status} label={lane.status === 'success' ? 'Done' : 'Running'} />
                </div>
                <p className="text-xs text-slate-500">{lane.time}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {lane.findings !== null ? `Findings: ${lane.findings}` : 'Checking…'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">Pending steps</h2>
        <ul className="space-y-2">
          {liveRun.pendingSteps.map((s) => (
            <li key={s} className="text-sm text-slate-500 bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2.5">
              ⬜ {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">
            Evidence collected so far
          </h2>
          <ul className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1.5">
            {liveRun.evidenceSoFar.map((e) => (
              <li key={e} className="text-xs text-slate-400">
                • {e}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">Logs</h2>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 font-mono text-xs max-h-80 overflow-y-auto">
            {liveRun.logs.map((group) => (
              <div key={group.step}>
                <p className="text-slate-300 font-semibold mb-1">▼ {group.step}</p>
                {group.lines.map((line) => (
                  <p key={line} className="text-slate-500 pl-3">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          { icon: Pause, label: 'Pause' },
          { icon: Square, label: 'Stop' },
          { icon: Download, label: 'Download evidence' },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            title="Disabled in static tour"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 text-slate-500 text-sm font-medium rounded-lg cursor-not-allowed"
          >
            <Icon size={15} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
