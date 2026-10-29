import Link from 'next/link';
import { Inbox, Layers, Gauge, Clock, RotateCcw, GitBranch, ShieldAlert } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { floorStats, flowByStage, lines, lineSlug, approvalBacklog, playbookHealth, costBasis, monthTokens, periodScale } from '../data';

const card = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl';
const sectionTitle = 'text-sm font-semibold text-slate-900 dark:text-white mb-3';

function Tile({ icon: Icon, label, value, note }: { icon: typeof Layers; label: string; value: string; note: string }) {
  return (
    <div className={`${card} p-4`}>
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
        <Icon size={14} />
        <p className="text-[11px] font-medium uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-0.5">{note}</p>
    </div>
  );
}

export default function FloorPage() {
  const s = floorStats;
  const maxFlow = Math.max(...flowByStage.map((f) => f.count));

  return (
    <div>
      <PageHeader
        eyebrow="Organisation view · last 30 days"
        title="The floor"
        description="Every line in the factory, in one view: where work is, where it waits, and what it costs. Each number links to the work orders behind it. Figures are illustrative."
      />

      {/* Headline numbers */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
        <Tile icon={Inbox} label="Open work orders" value={String(s.openWorkOrders)} note="Across all lines" />
        <Tile icon={ShieldAlert} label="Waiting on a person" value={String(s.waitingOnPerson)} note="Open gates" />
        <Tile icon={Layers} label="Released" value={String(s.released)} note="Last 30 days" />
        <Tile icon={Clock} label="Cycle time" value={s.cycleTime} note="Intake to release, median" />
        <Tile icon={Gauge} label="Autonomy" value={`${Math.round(s.autonomyRate * 100)}%`} note="Gates passed without escalation" />
        <Tile icon={RotateCcw} label="Rework" value={`${Math.round(s.reworkRate * 100)}%`} note="Runs that needed rework" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Flow by stage */}
        <div className={`${card} p-5 xl:col-span-2`}>
          <h2 className={sectionTitle}>Flow by stage</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Open work orders at each stage, across every line. The longest bars are where queues form.
          </p>
          <div className="space-y-2">
            {flowByStage.map((f) => {
              const isQueue = f.count === maxFlow;
              return (
                <div key={f.stage} className="flex items-center gap-3">
                  <span className="w-12 text-[11px] font-mono font-semibold text-cyan-700 dark:text-cyan-400">{f.stage}</span>
                  <div className="flex-1 h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isQueue ? 'bg-amber-500 dark:bg-amber-400' : 'bg-slate-400 dark:bg-slate-500'}`}
                      style={{ width: `${(f.count / maxFlow) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs font-semibold text-slate-900 dark:text-white">{f.count}</span>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 mt-3">U8 validation and U4 implementation hold the most work orders, so they are where a queue is most likely to form.</p>
        </div>

        {/* Approval backlog */}
        <div className={`${card} p-5`}>
          <h2 className={sectionTitle}>Approval backlog</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Gates waiting on a named person, oldest first.</p>
          <div className="space-y-3">
            {approvalBacklog.map((g) => (
              <Link key={g.id} href="/factory/inbox" className="block rounded-lg border border-slate-200 dark:border-slate-800 p-3 hover:border-cyan-500/60 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-semibold text-cyan-700 dark:text-cyan-400">{g.id}</span>
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">{g.waiting}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {g.line} · stage {g.stage} · {g.approver}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Lines */}
      <section className="mb-6">
        <h2 className={sectionTitle}>Lines</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {lines.map((l) => (
            <Link key={l.name} href={`/factory/lines/${lineSlug(l.name)}`} className={`${card} p-5 hover:border-cyan-500/60 transition-colors`}>
              <p className="font-semibold text-slate-900 dark:text-white mb-1">{l.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Owner: {l.owner}</p>
              <div className="flex gap-6 text-xs">
                <div>
                  <p className="text-slate-500">Open</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{l.open}</p>
                </div>
                <div>
                  <p className="text-slate-500">Gates waiting</p>
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">{l.gatesWaiting}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Playbook health */}
        <div className={`${card} p-5`}>
          <h2 className={sectionTitle}>Playbook health</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Versions in use across the lines.</p>
          <div className="space-y-3">
            {playbookHealth.map((p) => (
              <div key={p.playbook} className="text-xs">
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {p.playbook} <span className="font-mono text-slate-500">v{p.version}</span>
                </p>
                <p className="text-slate-500">
                  {p.lines} · {p.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cost of AI, per period */}
      <section className="mb-6">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className={sectionTitle}>Cost of AI</h2>
          <Link href="/factory/cost" className="text-xs font-medium text-cyan-700 dark:text-cyan-400 hover:underline">
            Cost detail
          </Link>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {(['day', 'week', 'month', 'year'] as const).map((k) => {
            const scale = periodScale[k];
            const input = monthTokens.input * scale;
            const output = monthTokens.output * scale;
            const equivalent = (input / 1_000_000) * costBasis.inputPerMillion + (output / 1_000_000) * costBasis.outputPerMillion;
            const name = k === 'day' ? 'Average day' : k === 'week' ? 'This week' : k === 'month' ? 'This month' : 'This year';
            return (
              <Link key={k} href={`/factory/cost?period=${k}`} className={`${card} p-5 hover:border-cyan-500/60 transition-colors`}>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">{name}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{((input + output) / 1_000_000).toFixed(1)}M tokens</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  $0 on local models · equivalent cloud cost ${equivalent.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Change impact */}
      <section className={`${card} p-5 mt-6 flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex items-start gap-3">
          <GitBranch size={16} className="mt-0.5 text-cyan-600 dark:text-cyan-400" />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Change impact</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Three requirement changes this month touched 17 artifacts across two lines. Each change restarts the affected playbooks from U1.
            </p>
          </div>
        </div>
        <Link href="/factory/traceability" className="text-xs font-medium text-cyan-700 dark:text-cyan-400 hover:underline">
          Open traceability
        </Link>
      </section>
    </div>
  );
}
