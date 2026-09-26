import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import { traceabilityRows, traceabilitySummary as sum } from '../data';

export default function TraceabilityPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Stop 7 of 7"
        title="Traceability Matrix"
        description="Enterprise Cloud Platform — every requirement traced to its source, implementation, tests, cost, and production behavior."
      />

      <div className="space-y-4 mb-10">
        {traceabilityRows.map((row) => (
          <div key={row.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="font-mono font-bold text-cyan-400 text-sm">{row.id}</span>
              <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">{row.text}</p>
              <StatusBadge status={row.status} label={row.statusLabel} />
            </div>
            <dl className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-1">
              <p>├─ Source: {row.source}</p>
              <p>├─ Code: {row.codeId}</p>
              <p>├─ Tests: {row.tests}</p>
              <p>├─ Validation: {row.validation}</p>
              {row.changedBy && <p>├─ Changed by: {row.changedBy}</p>}
              {row.incident && <p className="text-amber-700 dark:text-amber-400">├─ Incident: {row.incident}</p>}
              {row.remediation && <p>├─ Remediation: {row.remediation}</p>}
              <p>├─ Cost impact: {row.cost}</p>
              <p>└─ Production telemetry: {row.telemetry}</p>
            </dl>
          </div>
        ))}
        <p className="text-xs text-slate-600 dark:text-slate-400 pl-1">…234 more requirements omitted from this static tour.</p>
      </div>

      <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-300 uppercase tracking-wide mb-4">Metrics summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-500 dark:text-slate-500">Total requirements</p>
          <p className="text-xl font-bold text-white mt-1">{sum.totalRequirements}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-500 dark:text-slate-500">Implemented</p>
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">{sum.implemented} (100%)</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-500 dark:text-slate-500">Tests written</p>
          <p className="text-xl font-bold text-white mt-1">{sum.testsWritten}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-500 dark:text-slate-500">Test pass rate</p>
          <p className="text-xl font-bold text-white mt-1">{sum.testPassRate}%</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-500 dark:text-slate-500">Requirements tested</p>
          <p className="text-xl font-bold text-white mt-1">{sum.requirementsTested}</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4">
          <p className="text-xs text-amber-700 dark:text-amber-400">Attention needed</p>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-300 mt-1">{sum.attentionNeeded}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-500 dark:text-slate-500">Total cost</p>
          <p className="text-xl font-bold text-white mt-1">${sum.totalCost}</p>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
          <p className="text-xs text-cyan-400">ROI</p>
          <p className="text-xl font-bold text-cyan-300 mt-1">{sum.roi}</p>
        </div>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-500">
        Estimated engineer time: {sum.estimatedEngineerHours}h · Time saved vs. manual spec: ~{sum.timeSaved}h
      </p>
    </div>
  );
}
