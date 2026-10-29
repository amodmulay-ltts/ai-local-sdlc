import type { CSSProperties } from 'react';

// Three ways the same team can work, with illustrative numbers. The point is what happens to
// review when output rises: without a change in how review works, the queue absorbs the gain.

// The SDLC as one line. Changes enter at the left and move right. Review is one stage among
// the others, but it clears changes at the rate of a person, so the pile forms there.

const stages = ['Requirements', 'Design', 'Build', 'Test', 'Review', 'Release'];
const REVIEW = 4;

// Seven changes wait at review in a pile; three pass straight through to release.
const dots = Array.from({ length: 10 }, (_, k) => {
  if (k < 7) {
    const row = Math.floor(k / 2);
    return {
      endLeft: `${74 + (k % 2) * 4}%`,
      endTop: `calc(50% - ${10 + row * 12}px)`,
      kind: 'queued' as const,
    };
  }
  return { endLeft: '100%', endTop: 'calc(50% - 5px)', kind: 'passed' as const };
});

const keyframes = `
@keyframes sdlc-flow {
  0% { left: 0%; top: calc(50% - 5px); opacity: 0; }
  8% { opacity: 1; }
  45% { left: var(--end-left); top: var(--end-top); opacity: 1; }
  90% { left: var(--end-left); top: var(--end-top); opacity: 1; }
  100% { left: var(--end-left); top: var(--end-top); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .sdlc-dot { animation: none !important; left: var(--end-left); top: var(--end-top); opacity: 1; }
}
`;

function SdlcFlow() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 mb-4">
      <style>{keyframes}</style>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-4">
        The SDLC as one line: each dot is a change
      </p>
      <div className="relative h-36 mx-10">
        {/* Track */}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-slate-300 dark:bg-slate-700" />

        {/* Stage nodes and labels */}
        {stages.map((name, i) => (
          <div key={name} className="absolute top-1/2" style={{ left: `${i * 20}%` }}>
            <div
              className={`-translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 ${
                i === REVIEW
                  ? 'border-amber-500 dark:border-amber-400 bg-amber-100 dark:bg-amber-500/30'
                  : 'border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-900'
              }`}
            />
            <p
              className={`absolute top-5 -translate-x-1/2 whitespace-nowrap text-xs ${
                i === REVIEW ? 'font-semibold text-amber-700 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {name}
            </p>
          </div>
        ))}

        {/* Queue label */}
        <p
          className="absolute -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold text-amber-700 dark:text-amber-400"
          style={{ left: `${REVIEW * 20 - 6}%`, top: 'calc(50% - 108px)' }}
        >
          The queue forms here
        </p>

        {/* Animated changes */}
        {dots.map((d, k) => (
          <span
            key={k}
            className={`sdlc-dot absolute h-2.5 w-2.5 rounded-full ${
              d.kind === 'queued' ? 'bg-amber-500 dark:bg-amber-400' : 'bg-emerald-500 dark:bg-emerald-400'
            }`}
            style={
              {
                '--end-left': d.endLeft,
                '--end-top': d.endTop,
                left: 0,
                top: 'calc(50% - 5px)',
                animation: `sdlc-flow 9s linear ${-k * 0.9}s infinite`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
        Changes arrive faster than people can review them, so most wait at Review. Only the few that clear review reach
        Release. Speed up every stage before Review and the pile grows faster.
      </p>
    </div>
  );
}

const MAX = 40;

const scenarios = [
  {
    title: 'Before AI',
    summary: 'The team writes the code and a person reads every change.',
    rows: [
      { label: 'Changes produced per day', value: 3 },
      { label: 'Changes a person reads', value: 3 },
      { label: 'Changes released', value: 3 },
    ],
    note: 'Writing the code is the slow part. Review keeps up easily.',
    tone: 'neutral' as const,
  },
  {
    title: 'AI, and people still read everything',
    summary: 'The team produces far more changes, and review stays the same.',
    rows: [
      { label: 'Changes produced per day', value: 40 },
      { label: 'Changes a person reads', value: 3 },
      { label: 'Changes released', value: 3 },
    ],
    note: 'Roughly 37 changes wait in the queue each day. Speed is gained in pockets, and the end result is no faster.',
    tone: 'warning' as const,
  },
  {
    title: 'AI, with a factory',
    summary: 'Machines and independent reviewers check every change. A person sees only what needs a decision.',
    rows: [
      { label: 'Changes produced per day', value: 40 },
      { label: 'Checked by machines and reviewers', value: 40 },
      { label: 'Reach a person', value: 4 },
    ],
    note: 'Low-risk changes pass on evidence. A person decides the rest, with the evidence in front of them.',
    tone: 'positive' as const,
  },
];

const toneBar = {
  neutral: 'bg-slate-400 dark:bg-slate-500',
  warning: 'bg-amber-500 dark:bg-amber-400',
  positive: 'bg-emerald-500 dark:bg-emerald-400',
};

const principles = [
  {
    title: 'Check evidence, not every line',
    detail: 'Reviewers see the evidence package and any failing checks first. Reading the code is the fallback.',
  },
  {
    title: 'Escalate by risk',
    detail: 'Low-risk changes pass on evidence. Higher-risk changes go to a named person, and the policy decides which is which.',
  },
  {
    title: 'Review patterns and samples',
    detail: 'People look at trends, disagreements between reviewers, and a sample of passes. They do not read forty changes a day line by line.',
  },
];

const card = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl';

export default function ReviewBottleneck() {
  return (
    <div className="space-y-4">
      <SdlcFlow />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {scenarios.map((s) => (
          <div key={s.title} className={`${card} p-5`}>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{s.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{s.summary}</p>
            <div className="space-y-3">
              {s.rows.map((r) => (
                <div key={r.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-400">{r.label}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{r.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${toneBar[s.tone]}`}
                      style={{ width: `${Math.max(3, (r.value / MAX) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 leading-relaxed">
              {s.note}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {principles.map((p) => (
          <div key={p.title} className={`${card} p-4`}>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{p.title}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{p.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
