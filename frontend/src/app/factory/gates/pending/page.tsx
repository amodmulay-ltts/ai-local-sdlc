import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { approvalRequest as a } from '../../data';

const card = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl';

const optionStyle = [
  'border-emerald-200 dark:border-emerald-500/30',
  'border-slate-200 dark:border-slate-700',
  'border-amber-200 dark:border-amber-500/30',
  'border-red-200 dark:border-red-500/30',
];

export default function GatePage() {
  return (
    <div>
      <PageHeader
        eyebrow={`Human gate · ${a.workOrder} · ${a.line}`}
        title="Decision needed"
        description="The run stopped here because the judge's uncertainty is above the threshold. A named person decides, with the evidence in front of them. The factory does not publish on its own."
      />

      {/* Why this gate opened */}
      <div className={`${card} p-5 mb-6 flex flex-wrap items-start gap-6`}>
        <div className="flex items-start gap-3 min-w-[16rem] flex-1">
          <AlertTriangle size={18} className="mt-0.5 text-amber-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{a.run}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">{a.reason}</p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
          <div>
            <dt className="text-slate-500">Uncertainty</dt>
            <dd className="font-semibold text-amber-700 dark:text-amber-400">
              {a.uncertainty.score.toFixed(2)} (threshold {a.uncertainty.threshold.toFixed(2)})
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Waiting</dt>
            <dd className="text-slate-800 dark:text-slate-200">{a.waiting}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Risk</dt>
            <dd className="text-slate-800 dark:text-slate-200">{a.risk}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Deadline</dt>
            <dd className="text-slate-800 dark:text-slate-200">{a.deadline}</dd>
          </div>
        </dl>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Reviewer verdicts */}
          <div className={`${card} p-5`}>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Independent reviews</h2>
            <div className="space-y-2">
              {a.reviews.map((rv) => (
                <div key={rv.reviewer} className="flex items-start justify-between gap-4 text-xs border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0">
                  <p className="font-medium text-slate-800 dark:text-slate-200">{rv.reviewer}</p>
                  <p className={rv.flagged ? 'text-amber-700 dark:text-amber-400 text-right' : 'text-slate-600 dark:text-slate-400 text-right'}>
                    {rv.verdict}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Disagreements, each with a suggested resolution */}
          <div className={`${card} p-5`}>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Where the reviews disagree</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">{a.judgeSummary}</p>
            <div className="space-y-4">
              {a.disagreements.map((d) => (
                <div key={d.id} className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono font-semibold text-cyan-700 dark:text-cyan-400">{d.id}</span>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{d.text}</p>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{d.issue}</p>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-medium">Suggested: </span>
                    {d.suggested}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decision options */}
        <div className="space-y-4">
          <div className={`${card} p-5`}>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Decide</h2>
            <div className="space-y-2">
              {a.options.map((o, idx) => (
                <div key={o.label} className={`rounded-lg border ${optionStyle[idx]} p-3`}>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white mb-0.5">{o.label}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{o.effect}</p>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">{a.rule}</p>
          </div>

          <div className={`${card} p-5`}>
            <p className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />
              Every decision is recorded as evidence with the approver&apos;s role and reason.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
