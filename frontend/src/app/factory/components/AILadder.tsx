// Where AI use stands, from simple to systemic. Each rung adds reach: from one question, to one
// task, to a repeatable process, to the whole path from request to release.

const rungs = [
  {
    name: 'Chat',
    summary: 'Ask a question and copy the answer.',
    gain: 'Helps one person think faster.',
    limit: 'Nothing changes in the work itself. The answer still has to be carried over by hand.',
  },
  {
    name: 'Copilot',
    summary: 'Suggests code while you type.',
    gain: 'Makes an individual engineer faster.',
    limit: 'Releases do not move, because the handoffs between people stay the same.',
    marker: 'Most organizations are here',
  },
  {
    name: 'Agents',
    summary: 'Give a model a task and some tools, and it finishes the task.',
    gain: 'Can carry out a whole task on its own.',
    limit: 'Each run is one-off. There is no shared standard, and no independent check on the result.',
    marker: 'The most technically forward companies are here now',
    pulse: true,
  },
  {
    name: 'Playbooks',
    summary: 'A repeatable workflow: agents, checks, and a human decision at set points.',
    gain: 'The same process runs the same way every time, and each step leaves a record.',
    limit: 'Covers one part of the delivery at a time.',
    marker: 'This concept starts here',
  },
  {
    name: 'Factory',
    summary: 'The whole path from a request to a release, with evidence at every step.',
    gain: 'Speed comes from the whole chain, and review is designed for volume.',
    limit: 'Needs governance, risk policy, and people who decide at the gates.',
    marker: 'The destination',
  },
];

const card = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl';

export default function AILadder() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      {rungs.map((r, idx) => (
        <div key={r.name} className={`${card} p-4 flex flex-col`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300">
              {idx + 1}
            </span>
            <p className="font-semibold text-slate-900 dark:text-white">{r.name}</p>
            {r.pulse && (
              <span className="relative ml-auto flex h-3 w-3" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500" />
              </span>
            )}
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 mb-3">{r.summary}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            <span className="font-medium text-emerald-700 dark:text-emerald-400">Gains: </span>
            {r.gain}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            <span className="font-medium text-amber-700 dark:text-amber-400">Limit: </span>
            {r.limit}
          </p>
          {r.marker && (
            <p className="mt-auto pt-3 text-[11px] font-semibold text-cyan-700 dark:text-cyan-400">{r.marker}</p>
          )}
        </div>
      ))}
    </div>
  );
}
