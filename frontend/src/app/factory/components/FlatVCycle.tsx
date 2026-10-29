// The V-cycle, flattened into one line. Information moves left to right through the stages. Each
// specifying stage on the left also feeds the verifying stage on the right that checks it, shown
// as a loop above the line. Illustrative: each dot is one piece of information.

const stages = [
  { code: 'U1', name: 'Requirements', kind: 'spec' },
  { code: 'U2', name: 'Architecture', kind: 'spec' },
  { code: 'U3', name: 'Detailed design', kind: 'spec' },
  { code: 'U4', name: 'Implementation', kind: 'build' },
  { code: 'U5–6', name: 'Unit tests', kind: 'verify' },
  { code: 'U7', name: 'Integration', kind: 'verify' },
  { code: 'U8', name: 'Validation', kind: 'verify' },
] as const;

const W = 1120;
const H = 300;
const NODE_W = 128;
const NODE_H = 56;
const LINE_Y = 200; // centre of the stage line
const TOP = LINE_Y - NODE_H / 2;
const xs = stages.map((_, i) => 80 + i * 160);

// Loops from each specifying stage to the verifying stage that checks it. Nested: the outer loop is the tallest.
const loops = [
  { from: 0, to: 6, height: 140, label: 'Requirements checked by validation' },
  { from: 1, to: 5, height: 98, label: 'Architecture checked by integration' },
  { from: 2, to: 4, height: 56, label: 'Design checked by unit tests' },
];

const loopPath = (fromX: number, toX: number, h: number) =>
  `M ${fromX} ${TOP} C ${fromX} ${TOP - h} ${toX} ${TOP - h} ${toX} ${TOP}`;

// Points along the loop's cubic Bezier, from the left stage's top to the right stage's top. The
// dot's position is animated through these, so it sits exactly on the drawn loop.
const SAMPLES = 24;
function loopPoints(fromX: number, toX: number, h: number) {
  const p0 = [fromX, TOP];
  const p1 = [fromX, TOP - h];
  const p2 = [toX, TOP - h];
  const p3 = [toX, TOP];
  return Array.from({ length: SAMPLES + 1 }, (_, k) => {
    const t = k / SAMPLES;
    const u = 1 - t;
    const pt = (i: number) =>
      u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i];
    return { x: pt(0), y: pt(1) };
  });
}

const keyTimes = Array.from({ length: SAMPLES + 1 }, (_, k) => (k / SAMPLES).toFixed(4)).join(';');

const nodeStyle = {
  spec: 'fill-cyan-50 stroke-cyan-500 dark:fill-cyan-500/10 dark:stroke-cyan-400',
  build: 'fill-slate-100 stroke-slate-400 dark:fill-slate-800 dark:stroke-slate-500',
  verify: 'fill-emerald-50 stroke-emerald-500 dark:fill-emerald-500/10 dark:stroke-emerald-400',
} as const;

const dotStyle = {
  line: 'fill-cyan-500 dark:fill-cyan-400',
  loop: 'fill-emerald-500 dark:fill-emerald-400',
} as const;

export default function FlatVCycle() {
  const lineDots = [0, 1, 2, 3].map((k) => ({ begin: -k * 1.9, dur: 7.6 }));
  const loopDots = loops.flatMap((l, li) =>
    [0, 1].map((k) => ({ loop: li, begin: -(li * 0.9 + k * 2.4), dur: 4.8, from: l.from, to: l.to })),
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-3">
        The V-cycle, flattened: information moves left to right
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Flattened V-cycle with information flowing left to right and loops from each specifying stage to the stage that verifies it">
        {/* Line through every stage */}
        <line x1={xs[0]} y1={LINE_Y} x2={xs[xs.length - 1]} y2={LINE_Y} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth={2} />

        {/* Loops */}
        {loops.map((l) => (
          <g key={`${l.from}-${l.to}`}>
            <path d={loopPath(xs[l.from], xs[l.to], l.height)} fill="none" strokeDasharray="4 5" className="stroke-emerald-400 dark:stroke-emerald-500" strokeWidth={1.5} />
            <text x={(xs[l.from] + xs[l.to]) / 2} y={TOP - l.height * 0.75 - 8} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[12px]">
              {l.label}
            </text>
          </g>
        ))}

        {/* Dots moving left to right along the line */}
        {lineDots.map((d, i) => (
          <circle key={`line-${i}`} r={5} cx={xs[0]} cy={LINE_Y} className={dotStyle.line}>
            <animate attributeName="cx" values={`${xs[0]};${xs[xs.length - 1]}`} keyTimes="0;1" dur={`${d.dur}s`} begin={`${d.begin}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Dots looping from a specifying stage to the stage that checks it */}
        {loopDots.map((d, i) => {
          const pts = loopPoints(xs[d.from], xs[d.to], loops[d.loop].height);
          return (
            <circle key={`loop-${i}`} r={4.5} cx={pts[0].x} cy={pts[0].y} className={dotStyle.loop}>
              <animate attributeName="cx" values={pts.map((q) => q.x.toFixed(2)).join(';')} keyTimes={keyTimes} calcMode="linear" dur={`${d.dur}s`} begin={`${d.begin}s`} repeatCount="indefinite" />
              <animate attributeName="cy" values={pts.map((q) => q.y.toFixed(2)).join(';')} keyTimes={keyTimes} calcMode="linear" dur={`${d.dur}s`} begin={`${d.begin}s`} repeatCount="indefinite" />
            </circle>
          );
        })}

        {/* Stages, drawn over the line and the loops */}
        {stages.map((s, i) => (
          <g key={s.code}>
            <rect x={xs[i] - NODE_W / 2} y={TOP} width={NODE_W} height={NODE_H} rx={10} strokeWidth={1.5} className={nodeStyle[s.kind]} />
            <text x={xs[i]} y={TOP + 22} textAnchor="middle" className="fill-cyan-700 dark:fill-cyan-400 text-[11px] font-mono font-semibold">
              {s.code}
            </text>
            <text x={xs[i]} y={TOP + 40} textAnchor="middle" className="fill-slate-900 dark:fill-white text-[13px] font-semibold">
              {s.name}
            </text>
          </g>
        ))}

        {/* Labels for the three columns of the flattened V */}
        <text x={xs[0]} y={H - 12} textAnchor="start" className="fill-slate-500 dark:fill-slate-400 text-[11px]">Specify</text>
        <text x={xs[3]} y={H - 12} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[11px]">Build</text>
        <text x={xs[xs.length - 1]} y={H - 12} textAnchor="end" className="fill-slate-500 dark:fill-slate-400 text-[11px]">Verify</text>
      </svg>
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
        Requirements do not wait for the end. They flow straight on to implementation, and the tests and validation that check
        them are built from the same information. Each loop carries a stage&apos;s information to the stage that checks it, so at every step
        the check is already in place.
      </p>
    </div>
  );
}
