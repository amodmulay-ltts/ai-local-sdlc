import Link from 'next/link';
import {
  LayoutDashboard,
  BookOpen,
  Cpu,
  Activity,
  ShieldCheck,
  FileCheck2,
  GitBranch,
  ArrowRight,
  Database,
  Layers,
  Brain,
} from 'lucide-react';
import LifecycleStrip from './components/LifecycleStrip';
import PageHeader from './components/PageHeader';

const tourStops = [
  {
    href: '/demo/factory',
    icon: LayoutDashboard,
    title: '1. Factory Dashboard',
    description: 'The homepage of the factory: the lifecycle, live playbook runs, pending decisions, and cost — all in one view.',
  },
  {
    href: '/demo/playbooks',
    icon: BookOpen,
    title: '2. Playbooks',
    description: 'Discoverable, versioned workflows that orchestrate agents and gates. Not hidden — browsable and exportable.',
  },
  {
    href: '/demo/agents',
    icon: Cpu,
    title: '3. Agent Catalog',
    description: 'Every execution unit, grouped by lifecycle stage, with success rates, timing, and disagreement history.',
  },
  {
    href: '/demo/runs/live',
    icon: Activity,
    title: '4. A Playbook Mid-Run',
    description: 'Watch a playbook execute: completed steps, parallel independent reviews, and accumulating evidence.',
  },
  {
    href: '/demo/gates/pending',
    icon: ShieldCheck,
    title: '5. A Human Gate',
    description: 'Where reviewers disagree, the system escalates. Humans decide with full context — not by reading every line.',
  },
  {
    href: '/demo/evidence/requirements-run',
    icon: FileCheck2,
    title: '6. Evidence Package',
    description: 'The replacement for "please review my PR": inputs, outputs, independent reviews, disagreements, and the decision — exportable.',
  },
  {
    href: '/demo/traceability',
    icon: GitBranch,
    title: '7. Traceability Matrix',
    description: 'Every requirement traced to its code, tests, cost, and production telemetry. Intent connected to outcome.',
  },
];

export default function DemoOverviewPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Concept Tour · Static Demo"
        title="The Factory, Not the Copilot"
        description="This is a click-through of the Engineering Intelligence Factory concept, built with static illustrative data so the whole idea can be seen end-to-end before the orchestration engine is built. Nothing here talks to a real backend."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Why this exists</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
            Most organizations have tried AI copilots. Engineers code faster — releases don&apos;t move. That&apos;s
            not a technology failure; it&apos;s a unit-of-automation failure. The value leaks in the handoffs
            <em> between</em> functions, not inside them.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            The Factory orchestrates <strong className="text-slate-800 dark:text-slate-200">playbooks</strong> (repeatable workflows)
            that run <strong className="text-slate-800 dark:text-slate-200">agents</strong> (execution units) with{' '}
            <strong className="text-slate-800 dark:text-slate-200">human gates</strong> at points of genuine uncertainty, producing{' '}
            <strong className="text-slate-800 dark:text-slate-200">evidence</strong> instead of asking someone to trust the model.
          </p>
        </div>
        <div className="bg-gradient-to-br from-cyan-100 dark:from-cyan-500/10 to-blue-100 dark:to-blue-500/10 border border-cyan-200 dark:border-cyan-500/20 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-cyan-700 dark:text-cyan-400 uppercase tracking-wide mb-3">The governance equation</h3>
          <p className="text-sm text-slate-700 dark:text-slate-200 font-mono leading-relaxed">
            AI + Enterprise Data<br />+ Human Approval<br />+ Regulatory Governance<br />
            <span className="text-cyan-700 dark:text-cyan-400">= Measurable Productivity</span>
          </p>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">The underlying technology fabric</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={20} className="text-cyan-600 dark:text-cyan-400" />
            <h3 className="font-semibold text-slate-900 dark:text-white">LLM Orchestration</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Claude (Anthropic) + Ollama (local models) connected via LLM Adapter pattern. Swap models per step without changing playbooks.</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Database size={20} className="text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Vector Store</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">PostgreSQL + pgvector for semantic search across ingested knowledge. Scoped by project, shared across organization.</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Layers size={20} className="text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Playbook Engine</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">State machine orchestrating agents in parallel, with human gates at verification points. Evidence collected as workflow byproduct.</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">The lifecycle — the central organizing principle</h2>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-12">
        <LifecycleStrip />
      </div>

      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Guided tour — 7 stops</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tourStops.map((stop) => {
          const Icon = stop.icon;
          return (
            <Link
              key={stop.href}
              href={stop.href}
              className="group flex items-start gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/60 dark:hover:border-cyan-500/40 rounded-xl p-5 transition-colors"
            >
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-500/10 transition-colors shrink-0">
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{stop.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{stop.description}</p>
              </div>
              <ArrowRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
