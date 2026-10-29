import Link from 'next/link';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import { simulatedRuns, lineSlug, type SimRun, type SimStep } from '../../data';

const LINES = ['IVI development', 'OTA cloud systems', 'Data products', 'Vehicle design'] as const;
type LineName = (typeof LINES)[number];

const card = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl';

const segment: Record<SimStep['state'], string> = {
  done: 'bg-emerald-500 dark:bg-emerald-400',
  running: 'bg-blue-500 dark:bg-blue-400 animate-pulse',
  waiting: 'bg-amber-500 dark:bg-amber-400',
  pending: 'bg-slate-200 dark:bg-slate-700',
};

function Stepper({ steps }: { steps: SimStep[] }) {
  return (
    <div className="flex gap-1" aria-label="Step progress">
      {steps.map((s) => (
        <span key={s.name} title={`${s.name}: ${s.state}`} className={`h-2 flex-1 rounded-full ${segment[s.state]}`} />
      ))}
    </div>
  );
}

function currentStep(run: SimRun) {
  const step = run.steps.find((s) => s.state === 'running' || s.state === 'waiting');
  return step ? step.name : 'Complete';
}

function RunCard({ run, detailed }: { run: SimRun; detailed: boolean }) {
  const doneCount = run.steps.filter((s) => s.state === 'done').length;
  return (
    <div className={`${card} p-4`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <p className="text-[11px] font-mono text-cyan-700 dark:text-cyan-400">
            {run.id} · {run.workOrder} · {run.source}
          </p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{run.title}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Stage {run.stage} · {run.playbook}
          </p>
        </div>
        <StatusBadge status={run.status} label={run.status === 'running' ? 'Running' : 'Waiting on a person'} />
      </div>

      <Stepper steps={run.steps} />
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
        <span>
          <span className="text-slate-800 dark:text-slate-200 font-medium">{currentStep(run)}</span> · {doneCount} of {run.steps.length} done
        </span>
        <span>
          {run.elapsed} · {run.tokens} tokens
        </span>
      </div>

      {run.note && <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1.5">{run.note}</p>}

      {detailed && (
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="space-y-1.5 text-xs">
            {run.steps.map((s) => (
              <li key={s.name} className="flex items-center justify-between gap-2">
                <span className="text-slate-700 dark:text-slate-300">{s.name}</span>
                <span
                  className={`text-[11px] font-medium ${
                    s.state === 'done'
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : s.state === 'running'
                      ? 'text-blue-700 dark:text-blue-400'
                      : s.state === 'waiting'
                      ? 'text-amber-700 dark:text-amber-400'
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {s.state === 'done' ? 'Done' : s.state === 'running' ? 'Running' : s.state === 'waiting' ? 'Waiting' : 'Not started'}
                </span>
              </li>
            ))}
          </ul>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Event log</p>
            <ul className="space-y-1 font-mono text-[11px] text-slate-600 dark:text-slate-400">
              {run.events.map((e) => (
                <li key={e} className="break-words">
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

const parseTokens = (t: string) => Number(t.replace(/,/g, ''));

export default async function LiveRunsPage({ searchParams }: { searchParams: Promise<{ line?: string }> }) {
  const { line } = await searchParams;
  const selected: LineName | null = LINES.includes(line as LineName) ? (line as LineName) : null;

  const runsShown = selected ? simulatedRuns.filter((r) => r.line === selected) : simulatedRuns;
  const linesRunning = new Set(simulatedRuns.map((r) => r.line)).size;
  const waiting = simulatedRuns.filter((r) => r.status === 'waiting').length;
  const tokensTotal = simulatedRuns.reduce((sum, r) => sum + parseTokens(r.tokens), 0);

  const tabs: Array<{ label: string; href: string; active: boolean }> = [
    { label: 'All lines', href: '/factory/runs/live', active: selected === null },
    ...LINES.map((l) => ({
      label: l,
      href: `/factory/runs/live?line=${encodeURIComponent(l)}`,
      active: selected === l,
    })),
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Live runs · simulated"
        title="Runs in progress"
        description="Runs from each line, moving at the same time. Each card is one run, with its stage and step. Nothing here executes: the feed is simulated for the concept."
      />

      {/* Line tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              t.active
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Lines running in parallel', value: String(linesRunning) },
          { label: 'Runs active', value: String(simulatedRuns.length) },
          { label: 'Waiting on a person', value: String(waiting) },
          { label: 'Tokens so far', value: `${(tokensTotal / 1_000_000).toFixed(2)}M` },
        ].map((t) => (
          <div key={t.label} className={`${card} p-4`}>
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{t.label}</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{t.value}</p>
          </div>
        ))}
      </div>

      {selected === null ? (
        /* All lines: one lane per line, all moving at the same time */
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6">
          {LINES.map((l) => {
            const lineRuns = simulatedRuns.filter((r) => r.line === l);
            const lineWaiting = lineRuns.filter((r) => r.status === 'waiting').length;
            return (
              <section key={l} className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <Link href={`/factory/lines/${lineSlug(l)}`} className="text-sm font-semibold text-slate-900 dark:text-white hover:underline">
                    {l}
                  </Link>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {lineRuns.length} active{lineWaiting > 0 ? ` · ${lineWaiting} waiting` : ''}
                  </span>
                </div>
                {lineRuns.map((r) => (
                  <RunCard key={r.id} run={r} detailed={false} />
                ))}
              </section>
            );
          })}
        </div>
      ) : (
        /* One line: its runs in detail */
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {selected}: {runsShown.length} runs active,{' '}
            {runsShown.filter((r) => r.status === 'waiting').length} waiting on a person.
          </p>
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
            {runsShown.map((r) => (
              <RunCard key={r.id} run={r} detailed />
            ))}
          </div>
        </div>
      )}

      <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-8">
        Simulated for the concept. Step names, timings, and token counts are illustrative. Each run belongs to one work order and one line.
      </p>
    </div>
  );
}
