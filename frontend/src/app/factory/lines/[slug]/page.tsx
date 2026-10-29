import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import {
  lines,
  lineSlug,
  lineFlow,
  flowStages,
  workOrders,
  simulatedRuns,
  approvalBacklog,
  playbookHealth,
  traceChains,
  costByLine,
  costBasis,
  monthTokens,
} from '../../data';

const card = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl';
const sectionTitle = 'text-sm font-semibold text-slate-900 dark:text-white mb-3';

export function generateStaticParams() {
  return lines.map((l) => ({ slug: lineSlug(l.name) }));
}

export default async function LineDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const line = lines.find((l) => lineSlug(l.name) === slug);
  if (!line) notFound();

  const name = line.name;
  const flow = lineFlow[name] ?? [];
  const maxFlow = Math.max(...flow, 1);
  const orders = workOrders.filter((w) => w.line === name);
  const runs = simulatedRuns.filter((r) => r.line === name);
  const gates = approvalBacklog.filter((g) => g.line === name);
  const playbooks = playbookHealth.filter((p) => p.lines.includes(name));
  const chains = traceChains.filter((c) => c.line === name);

  const costMillions = costByLine.find((c) => c.name === name)?.millions ?? 0;
  const monthMillions = costByLine.reduce((sum, c) => sum + c.millions, 0);
  const monthEquivalent =
    (monthTokens.input / 1_000_000) * costBasis.inputPerMillion + (monthTokens.output / 1_000_000) * costBasis.outputPerMillion;
  const lineEquivalent = (costMillions / monthMillions) * monthEquivalent;

  return (
    <div>
      <PageHeader eyebrow={`Line · owner: ${line.owner}`} title={name} description={line.summary} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Open work orders', value: String(line.open) },
          { label: 'Gates waiting', value: String(line.gatesWaiting) },
          { label: 'Active runs', value: String(runs.length) },
          { label: 'Equivalent cloud cost, month', value: `$${lineEquivalent.toFixed(2)}` },
        ].map((t) => (
          <div key={t.label} className={`${card} p-4`}>
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{t.label}</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{t.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Flow by stage for this line */}
        <section className={`${card} p-5`}>
          <h2 className={sectionTitle}>Flow by stage</h2>
          <div className="space-y-2">
            {flowStages.map((st, i) => (
              <div key={st} className="flex items-center gap-3">
                <span className="w-12 text-[11px] font-mono font-semibold text-cyan-700 dark:text-cyan-400">{st}</span>
                <div className="flex-1 h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-slate-400 dark:bg-slate-500" style={{ width: `${(flow[i] / maxFlow) * 100}%` }} />
                </div>
                <span className="w-6 text-right text-xs font-semibold text-slate-900 dark:text-white">{flow[i]}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Gates */}
        <section className={`${card} p-5`}>
          <h2 className={sectionTitle}>Gates waiting on a person</h2>
          {gates.length === 0 ? (
            <p className="text-xs text-slate-500">None right now.</p>
          ) : (
            <div className="space-y-3">
              {gates.map((g) => (
                <div key={g.id} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-cyan-700 dark:text-cyan-400">{g.id}</span>
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">{g.waiting}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Stage {g.stage} · {g.approver}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Playbooks */}
        <section className={`${card} p-5`}>
          <h2 className={sectionTitle}>Playbooks in use</h2>
          <div className="space-y-3 text-xs">
            {playbooks.map((p) => (
              <div key={p.playbook}>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {p.playbook} <span className="font-mono text-slate-500">v{p.version}</span>
                </p>
                <p className="text-slate-500">{p.note}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Active runs */}
      <section className="mb-6">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className={sectionTitle}>Active runs</h2>
          <Link href={`/factory/runs/live?line=${encodeURIComponent(name)}`} className="text-xs font-medium text-cyan-700 dark:text-cyan-400 hover:underline">
            Open in live runs
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {runs.map((r) => {
            const current = r.steps.find((s) => s.state === 'running' || s.state === 'waiting');
            return (
              <div key={r.id} className={`${card} p-4`}>
                <div className="flex items-start justify-between gap-3 mb-1">
                  <p className="text-[11px] font-mono text-cyan-700 dark:text-cyan-400">
                    {r.id} · {r.workOrder} · {r.source}
                  </p>
                  <StatusBadge status={r.status} label={r.status === 'running' ? 'Running' : 'Waiting on a person'} />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{r.title}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Stage {r.stage} · {current ? current.name : 'Complete'} · {r.elapsed} · {r.tokens} tokens
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Work orders */}
      <section className={`${card} overflow-x-auto mb-6`}>
        <div className="p-5 pb-3">
          <h2 className={sectionTitle}>Work orders</h2>
        </div>
        <table className="w-full text-xs min-w-[48rem]">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <th className="px-5 py-2 font-medium">Source</th>
              <th className="px-3 py-2 font-medium">Work order</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Stage</th>
              <th className="px-3 py-2 font-medium">State</th>
              <th className="px-3 py-2 font-medium">Waiting on</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((w) => (
              <tr key={w.id} className="border-b border-slate-100 dark:border-slate-800/60 align-top">
                <td className="px-5 py-2 font-mono text-slate-700 dark:text-slate-300">{w.source}</td>
                <td className="px-3 py-2 text-slate-800 dark:text-slate-200">
                  <span className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">{w.id}</span> {w.title}
                </td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{w.type}</td>
                <td className="px-3 py-2 font-mono font-semibold text-slate-800 dark:text-slate-200">{w.stage}</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{w.state}</td>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{w.waitingOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Traced chains */}
      <section className="mb-6">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className={sectionTitle}>Traced chains</h2>
          <Link href="/factory/traceability" className="text-xs font-medium text-cyan-700 dark:text-cyan-400 hover:underline">
            Open traceability
          </Link>
        </div>
        {chains.length === 0 ? (
          <p className="text-xs text-slate-500">No traced chains for this line yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chains.map((c) => (
              <div key={c.item} className={`${card} p-4`}>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{c.item}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {c.state} · {c.rows.length} requirements
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="text-[11px] text-slate-500">
        Lines are independent. This page shows only this line&apos;s work, and the floor shows every line.
      </p>
    </div>
  );
}
