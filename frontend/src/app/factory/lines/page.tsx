import Link from 'next/link';
import PageHeader from '../components/PageHeader';
import { lines, lineSlug, simulatedRuns, costByLine, monthTokens, costBasis, workOrders } from '../data';

const card = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl';

export default function LinesPage() {
  const monthInput = monthTokens.input;
  const monthOutput = monthTokens.output;
  const monthEquivalent = (monthInput / 1_000_000) * costBasis.inputPerMillion + (monthOutput / 1_000_000) * costBasis.outputPerMillion;
  const monthMillions = costByLine.reduce((sum, c) => sum + c.millions, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Lines"
        title="The lines"
        description="Each line is one product's production line. Lines are independent: each has its own work orders, approvers, and runs. Open a line to see its work in detail."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lines.map((l) => {
          const slug = lineSlug(l.name);
          const activeRuns = simulatedRuns.filter((r) => r.line === l.name).length;
          const waiting = simulatedRuns.filter((r) => r.line === l.name && r.status === 'waiting').length;
          const cost = costByLine.find((c) => c.name === l.name)?.millions ?? 0;
          const equivalent = (cost / monthMillions) * monthEquivalent;
          const openOrders = workOrders.filter((w) => w.line === l.name).length;
          return (
            <Link key={l.name} href={`/factory/lines/${slug}`} className={`${card} p-5 hover:border-cyan-500/60 transition-colors`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">{l.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Owner: {l.owner}</p>
                </div>
                <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400">Open line</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{l.summary}</p>
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <dt className="text-slate-500">Open work orders</dt>
                  <dd className="text-sm font-semibold text-slate-900 dark:text-white">{l.open}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Gates waiting</dt>
                  <dd className="text-sm font-semibold text-amber-700 dark:text-amber-400">{l.gatesWaiting}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Active runs</dt>
                  <dd className="text-sm font-semibold text-slate-900 dark:text-white">
                    {activeRuns}
                    {waiting > 0 ? <span className="text-amber-700 dark:text-amber-400"> ({waiting} waiting)</span> : null}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Cost this month</dt>
                  <dd className="text-sm font-semibold text-slate-900 dark:text-white">
                    ${equivalent.toFixed(2)} <span className="text-[10px] font-normal text-slate-500">equiv.</span>
                  </dd>
                </div>
              </dl>
              <p className="text-[11px] text-slate-500 mt-3">{openOrders} work orders shown in the inbox</p>
            </Link>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-500 mt-6">
        The floor shows the approval backlog across all lines. Cost is the equivalent cloud cost; local models cost $0.
      </p>
    </div>
  );
}
