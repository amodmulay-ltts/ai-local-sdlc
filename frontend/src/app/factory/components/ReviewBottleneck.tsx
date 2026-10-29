// How the same SDLC flows in three eras. Each dot is one change. Each lane is one era, and its
// colour matches the card for that era below. Illustrative, not measured.

const stages = ['Requirements', 'Design', 'Build', 'Test', 'Review', 'Release'];
const REVIEW = 4;

// One SVG for all three lanes. Each dot is placed on its lane's line by its own coordinates, so it
// cannot drift out of its lane. Illustrative, not measured.
const VIEW_W = 1000;
const TRACK_X0 = 230;
const TRACK_X1 = 910;
const LANE_GAP = 64;
const laneY = (i: number) => 70 + i * LANE_GAP;
const stageX = (pct: number) => TRACK_X0 + (pct / 100) * (TRACK_X1 - TRACK_X0);

type Dot = { endPct: number; delay: number };

// Without AI: a few changes, each read by a person, and they flow steadily through review.
const withoutAi: Dot[] = Array.from({ length: 3 }, (_, k) => ({ endPct: 100, delay: k * 2.2 }));

// AI, and people still read everything: many changes, and most wait in a pile at review.
const aiWithHumans: Dot[] = [
  ...Array.from({ length: 7 }, (_, k) => ({ endPct: 70 + k * 2, delay: k * 0.7 })),
  ...Array.from({ length: 3 }, (_, k) => ({ endPct: 100, delay: 5 + k * 0.7 })),
];

// AI, with a factory: many changes, checked by machines and independent reviewers, so they clear
// review without queueing. Only a few reach a person at the gate.
const factory: Dot[] = [
  ...Array.from({ length: 8 }, (_, k) => ({ endPct: 100, delay: k * 0.6 })),
  ...Array.from({ length: 2 }, (_, k) => ({ endPct: REVIEW * 20, delay: 5 + k * 0.6 })),
];

const eras = [
  {
    key: 'without',
    lines: ['Without AI'],
    dotFill: 'fill-slate-400 dark:fill-slate-500',
    textFill: 'fill-slate-600 dark:fill-slate-400',
    dots: withoutAi,
  },
  {
    key: 'ai',
    lines: ['AI, and people', 'still read everything'],
    dotFill: 'fill-amber-500 dark:fill-amber-400',
    textFill: 'fill-amber-700 dark:fill-amber-400',
    dots: aiWithHumans,
  },
  {
    key: 'factory',
    lines: ['AI, with a factory'],
    dotFill: 'fill-emerald-500 dark:fill-emerald-400',
    textFill: 'fill-emerald-700 dark:fill-emerald-400',
    dots: factory,
  },
];

function SdlcFlow() {
  const height = laneY(eras.length - 1) + 40;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 mb-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-2">
        The SDLC as one line, in three eras: each dot is a change
      </p>
      <svg viewBox={`0 0 ${VIEW_W} ${height}`} className="w-full h-auto" role="img" aria-label="Three lanes showing changes flowing through the SDLC without AI, with AI and people reading everything, and with a factory">
        {/* Stage names */}
        {stages.map((name, i) => (
          <text
            key={name}
            x={stageX(i * 20)}
            y={28}
            textAnchor="middle"
            className={i === REVIEW ? 'fill-slate-900 dark:fill-white text-[14px] font-semibold' : 'fill-slate-500 dark:fill-slate-400 text-[13px]'}
          >
            {name}
          </text>
        ))}

        {eras.map((era, li) => {
          const y = laneY(li);
          return (
            <g key={era.key}>
              {/* Lane name */}
              {era.lines.map((ln, k) => (
                <text key={ln} x={0} y={y + 4 + (k - (era.lines.length - 1) / 2) * 16} className={`${era.textFill} text-[13px] font-semibold`}>
                  {ln}
                </text>
              ))}

              {/* Track and stage ticks */}
              <line x1={TRACK_X0} y1={y} x2={TRACK_X1} y2={y} strokeWidth={1} className="stroke-slate-300 dark:stroke-slate-700" />
              {stages.map((name, i) => (
                <line
                  key={name}
                  x1={stageX(i * 20)}
                  x2={stageX(i * 20)}
                  y1={y - 6}
                  y2={y + 6}
                  strokeWidth={i === REVIEW ? 2 : 1.5}
                  className={i === REVIEW ? 'stroke-slate-700 dark:stroke-slate-200' : 'stroke-slate-400 dark:stroke-slate-600'}
                />
              ))}

              {/* Changes: each moves from Requirements to its end point on this lane */}
              {era.dots.map((d, k) => {
                const endX = stageX(d.endPct);
                return (
                  <circle key={k} r={5} cx={TRACK_X0} cy={y} className={era.dotFill}>
                    <animate attributeName="cx" values={`${TRACK_X0};${endX};${endX}`} keyTimes="0;0.45;1" calcMode="linear" dur="9s" begin={`${-d.delay}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.9;1" dur="9s" begin={`${-d.delay}s`} repeatCount="indefinite" />
                  </circle>
                );
              })}
            </g>
          );
        })}
      </svg>
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
        Without AI, a few changes flow and a person reads each one. With AI and people still reading everything, far more
        changes arrive, and most wait in a pile at Review. In the factory, checks run before review, so changes clear
        without queueing, and only a few reach a person at the gate.
      </p>
    </div>
  );
}

const scenarios = [
  {
    title: 'Without AI',
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

const MAX = 40;

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
