import Link from 'next/link';
import { Download, Play, Pencil, Eye } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { playbookLibrary } from '../data';

function PlaybookCard({
  id,
  title,
  description,
  agents,
  gate,
  runs,
  lastRun,
  linkable = false,
}: {
  id: string;
  title: string;
  description: string;
  agents: string[];
  gate: string;
  runs: number;
  lastRun: string;
  linkable?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{description}</p>

      <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">
        <span className="font-medium text-slate-600 dark:text-slate-400">Agents:</span> {agents.join(', ')}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-500 mb-4">
        <span className="font-medium text-slate-600 dark:text-slate-400">Gate:</span> {gate}
      </p>

      <div className="flex items-center justify-between border-t border-slate-800 pt-3">
        <p className="text-xs text-emerald-700 dark:text-emerald-400">
          ✅ {runs.toLocaleString()} successful runs · Last: {lastRun}
        </p>
        <div className="flex items-center gap-1">
          {linkable ? (
            <Link href={`/demo/playbooks/${id}`} className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-cyan-400 rounded-md hover:bg-slate-100 dark:bg-slate-800" title="View">
              <Eye size={15} />
            </Link>
          ) : (
            <span className="p-1.5 text-slate-600 dark:text-slate-400" title="View (sample only in tour)">
              <Eye size={15} />
            </span>
          )}
          <span className="p-1.5 text-slate-600 dark:text-slate-400" title="Run (disabled in demo)">
            <Play size={15} />
          </span>
          <span className="p-1.5 text-slate-600 dark:text-slate-400" title="Edit (disabled in demo)">
            <Pencil size={15} />
          </span>
          <span className="p-1.5 text-slate-600 dark:text-slate-400" title="Export YAML (disabled in demo)">
            <Download size={15} />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function PlaybooksPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Stop 2 of 7"
        title="Playbooks"
        description="A playbook is a versioned, exportable workflow that orchestrates agents and gates. Not ad-hoc prompting — a repeatable process."
      />

      <section className="mb-10">
        <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-300 uppercase tracking-wide mb-4">
          Recommended for your project
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {playbookLibrary.recommended.map((p) => (
            <PlaybookCard key={p.id} {...p} linkable />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-300 uppercase tracking-wide mb-4">Standard library</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {playbookLibrary.standard.map((p) => (
            <PlaybookCard key={p.id} {...p} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-300 uppercase tracking-wide mb-4">Your custom playbooks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {playbookLibrary.custom.map((p) => (
            <PlaybookCard key={p.id} {...p} />
          ))}
        </div>
      </section>
    </div>
  );
}
