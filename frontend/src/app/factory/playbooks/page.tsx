import Link from 'next/link';
import { Download, Play, Pencil, Eye } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { playbookLibrary, type LibraryPlaybook } from '../data';

function PlaybookCard({ playbook }: { playbook: LibraryPlaybook }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-mono font-semibold text-cyan-700 dark:text-cyan-400">{playbook.code}</span>
        <h3 className="font-semibold text-slate-900 dark:text-white">{playbook.title}</h3>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-500 mb-2">{playbook.vStage}</p>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{playbook.description}</p>

      <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">
        <span className="font-medium text-slate-600 dark:text-slate-400">Agents:</span> {playbook.agents.join(', ')}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">
        <span className="font-medium text-slate-600 dark:text-slate-400">Gate:</span> {playbook.gate}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-500 mb-4">
        <span className="font-medium text-slate-600 dark:text-slate-400">Verified by:</span> {playbook.verifiedBy}
      </p>

      <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">Designed · not runnable yet (M6)</p>
        <div className="flex items-center gap-1">
          {playbook.href ? (
            <Link href={playbook.href} className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" title="View sample">
              <Eye size={15} />
            </Link>
          ) : (
            <span className="p-1.5 text-slate-400 dark:text-slate-600" title="No sample run available">
              <Eye size={15} />
            </span>
          )}
          <span className="p-1.5 text-slate-400 dark:text-slate-600" title="Run (not built yet)">
            <Play size={15} />
          </span>
          <span className="p-1.5 text-slate-400 dark:text-slate-600" title="Edit (not built yet)">
            <Pencil size={15} />
          </span>
          <span className="p-1.5 text-slate-400 dark:text-slate-600" title="Export YAML (not built yet)">
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
        description="A playbook is a versioned workflow (YAML plus prompt files) that orchestrates agents and gates. Each one sits on one stage of the V-cycle, and the right arm verifies the left. The library is designed; the playbook engine (M6) is not built yet."
      />

      <section className="mb-10">
        <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-4">
          First vertical slice
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PlaybookCard playbook={playbookLibrary.firstSlice} />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-4">
          V-cycle library (U2–U9)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {playbookLibrary.vCycle.map((p) => (
            <PlaybookCard key={p.id} playbook={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
