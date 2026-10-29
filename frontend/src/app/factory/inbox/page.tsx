import Link from 'next/link';
import { CheckCircle2, Circle, CircleDot, Hand, Ban, Zap } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { workOrders, selectedWorkOrder, lines, type WorkOrder } from '../data';

const card = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl';

const stageOrder = ['U0', 'U1', 'U2', 'U3', 'U4', 'U5–6', 'U7', 'U8'];

const stateStyle: Record<string, string> = {
  'Needs a decision': 'border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400',
  'In progress': 'border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400',
  Triaging: 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  Blocked: 'border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400',
};

const views = [
  { label: 'Needs me', count: 3 },
  { label: 'All', count: 63 },
  { label: 'Stuck', count: 1 },
  { label: 'Mine', count: 0 },
];

const lineChips = ['All lines', ...lines.map((l) => l.name)];

function StatePill({ state }: { state: string }) {
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${stateStyle[state] ?? stateStyle.Triaging}`}>
      {state}
    </span>
  );
}

export default function InboxPage() {
  const selected = workOrders.find((w) => w.id === selectedWorkOrder.id) as WorkOrder;
  const currentIdx = stageOrder.indexOf(selectedWorkOrder.currentStage);

  return (
    <div>
      <PageHeader
        eyebrow="Inbox"
        title="Work orders"
        description="Every open request across the factory, with the stage each one is at. What needs a decision comes first. Each row is one work order, belonging to one line."
      />

      {/* Views and line filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {views.map((v, idx) => (
            <span
              key={v.label}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                idx === 0
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {v.label} <span className="opacity-70">{v.count}</span>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {lineChips.map((c, idx) => (
            <span
              key={c}
              className={`rounded-md border px-2.5 py-1 text-xs ${
                idx === 0
                  ? 'border-cyan-500/60 text-cyan-700 dark:text-cyan-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* The list */}
      <div className={`${card} overflow-x-auto mb-8`}>
        <table className="w-full text-xs min-w-[56rem]">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-3 py-3 font-medium">Work order</th>
              <th className="px-3 py-3 font-medium">Line</th>
              <th className="px-3 py-3 font-medium">Type</th>
              <th className="px-3 py-3 font-medium">Stage</th>
              <th className="px-3 py-3 font-medium">State</th>
              <th className="px-3 py-3 font-medium">Age</th>
              <th className="px-3 py-3 font-medium">Waiting on</th>
            </tr>
          </thead>
          <tbody>
            {workOrders.map((w) => {
              const isSelected = w.id === selectedWorkOrder.id;
              return (
                <tr
                  key={w.id}
                  className={`border-b border-slate-100 dark:border-slate-800/60 align-top ${
                    isSelected ? 'bg-cyan-50/60 dark:bg-cyan-500/5' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {isSelected && selectedWorkOrder.changedSinceLastLook && (
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" aria-label="Changed since you last looked" />
                      )}
                      <span className="font-mono text-slate-700 dark:text-slate-300">{w.source}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">{w.id}</p>
                    <p className="text-slate-800 dark:text-slate-200">{w.title}</p>
                    {w.note && <p className="text-[11px] text-slate-500 mt-0.5">{w.note}</p>}
                  </td>
                  <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{w.line}</td>
                  <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{w.type}</td>
                  <td className="px-3 py-3 font-mono font-semibold text-slate-800 dark:text-slate-200">{w.stage}</td>
                  <td className="px-3 py-3">
                    <StatePill state={w.state} />
                  </td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">{w.age}</td>
                  <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{w.waitingOn}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail pane for the selected work order */}
      <section className={`${card} p-6`}>
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-xs font-mono text-cyan-700 dark:text-cyan-400 mb-1">
              {selected.id} · {selected.source}
            </p>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{selected.title}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {selected.line} line · {selected.type} · {selected.risk} risk · Opened {selectedWorkOrder.opened}
            </p>
          </div>
          <StatePill state={selected.state} />
        </div>

        {/* Stages */}
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Stage</p>
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {stageOrder.map((st, idx) => {
            const done = idx < currentIdx;
            const current = idx === currentIdx;
            return (
              <div
                key={st}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs ${
                  current
                    ? 'border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 font-semibold'
                    : done
                    ? 'border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600'
                }`}
              >
                {done ? <CheckCircle2 size={12} /> : current ? <Hand size={12} /> : <Circle size={12} />}
                <span className="font-mono">{st}</span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Waiting on</p>
            <p className="text-sm text-slate-800 dark:text-slate-200">{selectedWorkOrder.waitingFor}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mt-5 mb-2">Runs</p>
            <ul className="space-y-1.5 text-xs font-mono text-slate-600 dark:text-slate-400">
              {selectedWorkOrder.runs.map((r) => (
                <li key={r} className="flex items-start gap-2">
                  <CircleDot size={11} className="mt-0.5 shrink-0 text-slate-400" />
                  {r}
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-slate-500 mt-3">Parent: {selectedWorkOrder.parentRun}</p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Decide</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {['Approve', 'Approve with changes', 'Send back', 'Reject'].map((a) => (
                <span key={a} className="rounded-md border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                  {a}
                </span>
              ))}
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Other actions</p>
            <div className="flex flex-wrap gap-2 mb-4 text-xs text-slate-600 dark:text-slate-400">
              {['Assign', 'Hold', 'Reroute', 'Merge', 'Split', 'Cancel'].map((a) => (
                <span key={a} className="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1">
                  {a}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 text-xs font-medium">
              <Link href="/factory/gates/pending" className="text-cyan-700 dark:text-cyan-400 hover:underline">Open the gate</Link>
              <Link href="/factory/runs/live" className="text-cyan-700 dark:text-cyan-400 hover:underline">Live run</Link>
              <Link href="/factory/evidence/requirements-run" className="text-cyan-700 dark:text-cyan-400 hover:underline">Evidence</Link>
              <Link href="/factory/traceability" className="text-cyan-700 dark:text-cyan-400 hover:underline">Traceability</Link>
            </div>
          </div>
        </div>

        <p className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-start gap-2">
          <Zap size={12} className="mt-0.5 shrink-0" />
          Actions are shown for the design. Every action is recorded as evidence with who, when, and why. Nothing here changes a source system without a gate.
        </p>
      </section>

      <p className="text-[11px] text-slate-500 mt-4 flex items-center gap-1">
        <Ban size={11} /> Stuck: WO-071 is blocked, with no source for its rounding rule.
      </p>
    </div>
  );
}
