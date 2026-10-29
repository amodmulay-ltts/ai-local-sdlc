import Link from 'next/link';
import { ArrowRight, Layers, Cpu, ShieldAlert, Clock, Gauge, Coins } from 'lucide-react';
import LifecycleStrip from '../components/LifecycleStrip';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import { factoryStats, recentActivity } from '../data';

function Metric({
  icon: Icon,
  label,
  value,
  note,
  href,
  tone = 'default',
}: {
  icon: typeof Layers;
  label: string;
  value: string;
  note: string;
  href?: string;
  tone?: 'default' | 'attention';
}) {
  const body = (
    <>
      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
        <Icon size={16} />
        <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{note}</p>
    </>
  );
  const className =
    tone === 'attention'
      ? 'bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-5'
      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5';
  return href ? (
    <Link href={href} className={`${className} hover:border-cyan-500/60 transition-colors`}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

export default function FactoryDashboardPage() {
  const s = factoryStats;
  const tokens = s.tokensThisWeek.toLocaleString('en-US');

  return (
    <div>
      <PageHeader
        eyebrow="Stop 1 of 7"
        title="Factory Dashboard"
        description="One view of the factory: the V-cycle, runs in progress, the approval queue, and the agents and tokens behind them. Figures are illustrative. The orchestrator (M5) is not built yet."
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-6">
          The V-cycle: one playbook per stage
        </h2>
        <LifecycleStrip />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <Metric
          icon={Layers}
          label="Runs"
          value={`${s.runs.active} active`}
          note={`${s.runs.waitingOnGate} waiting on a gate · ${s.runs.completed} completed · ${s.runs.total} total`}
        />
        <Metric
          icon={Cpu}
          label="Agents"
          value={`${s.agents.active} of ${s.agents.total} active`}
          note={`${s.agents.idle} idle · ${s.agents.failed} failed`}
          href="/factory/agents"
        />
        <Metric
          icon={ShieldAlert}
          label="Approval queue"
          value={`${s.pendingApprovals} waiting`}
          note="Human gate, waiting on the Tech Lead"
          href="/factory/gates/pending"
          tone="attention"
        />
        <Metric
          icon={Coins}
          label="Model cost (local)"
          value={`$${s.costThisWeek.toFixed(2)}`}
          note={s.costRangeLabel}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <Metric
          icon={Gauge}
          label="Autonomy rate"
          value={`${Math.round(s.autonomyRate * 100)}%`}
          note="Gate decisions passed without escalation this week"
        />
        <Metric
          icon={Clock}
          label="Median cycle time"
          value={s.medianCycleTime}
          note="Run start to approval"
        />
        <Metric
          icon={Cpu}
          label="Tokens this week"
          value={tokens}
          note="Input and output tokens, summed from the call log"
        />
      </div>

      <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-4">Recent runs</h2>
      <div className="space-y-3 mb-10">
        {recentActivity.map((item) => (
          <Link
            key={item.playbook + item.project}
            href={item.href}
            className="flex items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 rounded-xl p-4 transition-colors"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-500">[{item.project}]</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white font-mono">{item.playbook}</span>
                <StatusBadge status={item.status} label={item.statusLabel} />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{item.detail}</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">{item.meta}</p>
            </div>
            <ArrowRight size={16} className="text-slate-600 dark:text-slate-400 shrink-0" />
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/factory/playbooks" className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-medium rounded-lg transition-colors">
          View the playbook library
        </Link>
        <Link href="/factory/agents" className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-medium rounded-lg transition-colors">
          Browse agents
        </Link>
        <Link href="/factory/evidence/requirements-run" className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-medium rounded-lg transition-colors">
          See evidence
        </Link>
      </div>
    </div>
  );
}
