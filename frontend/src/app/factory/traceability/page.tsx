import { ArrowRight, Zap } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { traceChains, changeImpact, type TraceRow } from '../data';

const card = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl';

const statusStyle: Record<TraceRow['status'], { label: string; chip: string }> = {
  verified: {
    label: 'Verified',
    chip: 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  },
  attention: {
    label: 'Needs attention',
    chip: 'border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400',
  },
  open: {
    label: 'Open',
    chip: 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  },
};

// The links a requirement passes through, from source to release.
const links = ['Source', 'Design', 'Code', 'Unit tests', 'Integration', 'Validation'] as const;

export default function TraceabilityPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Traceability"
        title="From source to release"
        description="Every requirement links back to the request that caused it, and forward to the design, code, tests, and validation that deliver it. A gap shows up as a gap, not as a surprise at release."
      />

      <div className="space-y-8">
        {traceChains.map((chain) => (
          <section key={chain.item}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                {chain.item} <span className="font-normal text-slate-500 dark:text-slate-400">· {chain.line}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {chain.state}
                {chain.release !== 'Not yet' && <> · Release {chain.release}</>}
              </p>
            </div>

            <div className={`${card} overflow-x-auto`}>
              <table className="w-full text-xs min-w-[64rem]">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-4 py-3 font-medium">Requirement</th>
                    {links.map((l) => (
                      <th key={l} className="px-3 py-3 font-medium">
                        {l}
                      </th>
                    ))}
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {chain.rows.map((row) => {
                    const cells = [row.source, row.design, row.code, row.unitTests, row.integration, row.validation];
                    return (
                      <tr key={row.id} className="border-b border-slate-100 dark:border-slate-800/60 align-top">
                        <td className="px-4 py-3 w-64">
                          <p className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">{row.id}</p>
                          <p className="text-slate-800 dark:text-slate-200">{row.text}</p>
                          {row.note && <p className="mt-1 text-[11px] text-slate-500">{row.note}</p>}
                        </td>
                        {cells.map((cell, idx) => (
                          <td
                            key={links[idx]}
                            className={`px-3 py-3 ${cell === 'Not started' || cell.startsWith('No source') ? 'text-slate-400 dark:text-slate-600' : 'text-slate-700 dark:text-slate-300'}`}
                          >
                            {cell}
                          </td>
                        ))}
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusStyle[row.status].chip}`}>
                            {statusStyle[row.status].label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-500">
              {links.map((l, idx) => (
                <span key={l} className="flex items-center gap-1">
                  {l}
                  {idx < links.length - 1 && <ArrowRight size={10} />}
                </span>
              ))}
            </div>
          </section>
        ))}

        {/* Change impact */}
        <section className={`${card} p-5`}>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-amber-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Change impact (U9)</h2>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 mb-3">
            If {changeImpact.changed} changes, these artifacts are flagged:
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {changeImpact.affected.map((a) => (
              <span key={a} className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs text-slate-800 dark:text-slate-200">
                {a}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">{changeImpact.action}</p>
        </section>
      </div>
    </div>
  );
}
