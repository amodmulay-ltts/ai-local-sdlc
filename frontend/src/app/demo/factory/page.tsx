import Link from 'next/link';
import { ArrowRight, Layers, Cpu, ShieldAlert, DollarSign } from 'lucide-react';
import LifecycleStrip from '../components/LifecycleStrip';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import { factoryStats, recentActivity } from '../data';

export default function FactoryDashboardPage() {
  const s = factoryStats;

  return (
    <div>
      <PageHeader
        eyebrow="Stop 1 of 7"
        title="Factory Dashboard"
        description="The homepage of the factory. Not scattered cards — the lifecycle, live work, pending decisions, and cost, connected."
      />

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-6">The lifecycle</h2>
        <LifecycleStrip />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Layers size={16} />
            <p className="text-xs font-medium uppercase tracking-wide">Active Playbooks</p>
          </div>
          <p className="text-2xl font-bold text-white">{s.activePlaybooks.total}</p>
          <p className="text-xs text-slate-500 mt-1">
            {s.activePlaybooks.running} running · {s.activePlaybooks.waitingOnGate} waiting on gate ·{' '}
            {s.activePlaybooks.completed} completed
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Cpu size={16} />
            <p className="text-xs font-medium uppercase tracking-wide">Total Agents</p>
          </div>
          <p className="text-2xl font-bold text-white">{s.agents.total}</p>
          <p className="text-xs text-slate-500 mt-1">
            {s.agents.active} active · {s.agents.idle} idle · {s.agents.failed} failed
          </p>
        </div>
        <Link
          href="/demo/gates/pending"
          className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 hover:border-amber-500/60 transition-colors"
        >
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <ShieldAlert size={16} />
            <p className="text-xs font-medium uppercase tracking-wide">Pending Decisions</p>
          </div>
          <p className="text-2xl font-bold text-white">{s.pendingDecisions}</p>
          <p className="text-xs text-amber-400/80 mt-1 flex items-center gap-1">
            Waiting on Tech Lead (47m) <ArrowRight size={12} />
          </p>
        </Link>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <DollarSign size={16} />
            <p className="text-xs font-medium uppercase tracking-wide">Cost This Week</p>
          </div>
          <p className="text-2xl font-bold text-white">${s.costThisWeek.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-1">{s.costRangeLabel}</p>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">Recent activity</h2>
      <div className="space-y-3 mb-10">
        {recentActivity.map((item) => (
          <Link
            key={item.playbook + item.project}
            href={item.href}
            className="flex items-center justify-between gap-4 bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-4 transition-colors"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-medium text-slate-500">[{item.project}]</span>
                <span className="text-sm font-semibold text-white font-mono">{item.playbook}</span>
                <StatusBadge status={item.status} label={item.statusLabel} />
              </div>
              <p className="text-sm text-slate-300 truncate">{item.detail}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.meta}</p>
            </div>
            <ArrowRight size={16} className="text-slate-600 shrink-0" />
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/demo/playbooks" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors">
          View all playbooks
        </Link>
        <Link href="/demo/agents" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors">
          Browse agents
        </Link>
        <Link href="/demo/evidence/requirements-run" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors">
          See evidence
        </Link>
      </div>
    </div>
  );
}
