import Link from 'next/link';
import PageHeader from '../components/PageHeader';
import {
  costBasis,
  monthTokens,
  periodScale,
  periodLabel,
  costByStage,
  costByLine,
  costByActivity,
  profileSplit,
} from '../data';

type Period = keyof typeof periodScale;
const periods: Period[] = ['day', 'week', 'month', 'year'];

const card = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl';

// Tokens are the measure. The equivalent cost prices the same tokens at the illustrative list prices.
function equivalentCost(inputTokens: number, outputTokens: number) {
  return (inputTokens / 1_000_000) * costBasis.inputPerMillion + (outputTokens / 1_000_000) * costBasis.outputPerMillion;
}

const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const millions = (n: number) => `${(n / 1_000_000).toFixed(2)}M`;

function Breakdown({
  title,
  note,
  rows,
  monthTotal,
  equivalentTotal,
  scale,
}: {
  title: string;
  note: string;
  rows: Array<{ name: string; millions: number }>;
  monthTotal: number;
  equivalentTotal: number;
  scale: number;
}) {
  const max = Math.max(...rows.map((r) => r.millions));
  return (
    <section className={`${card} p-5`}>
      <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{note}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[40rem]">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <th className="py-2 font-medium w-1/3">Name</th>
              <th className="py-2 font-medium text-right">Tokens</th>
              <th className="py-2 font-medium w-1/4 pl-4">Share</th>
              <th className="py-2 font-medium text-right">Local cost</th>
              <th className="py-2 font-medium text-right">Equivalent cloud cost</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const tokens = r.millions * 1_000_000 * scale;
              const share = r.millions / monthTotal;
              return (
                <tr key={r.name} className="border-b border-slate-100 dark:border-slate-800/60 text-slate-700 dark:text-slate-300">
                  <td className="py-2">{r.name}</td>
                  <td className="py-2 text-right font-mono">{millions(tokens)}</td>
                  <td className="py-2 pl-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-cyan-500 dark:bg-cyan-400"
                          style={{ width: `${(r.millions / max) * 100}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-slate-500">{Math.round(share * 100)}%</span>
                    </div>
                  </td>
                  <td className="py-2 text-right">$0.00</td>
                  <td className="py-2 text-right">{money(share * equivalentTotal)}</td>
                </tr>
              );
            })}
            <tr className="font-semibold text-slate-900 dark:text-white">
              <td className="py-2">Total</td>
              <td className="py-2 text-right font-mono">{millions(monthTotal * 1_000_000 * scale)}</td>
              <td className="py-2" />
              <td className="py-2 text-right">$0.00</td>
              <td className="py-2 text-right">{money(equivalentTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default async function CostPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const { period } = await searchParams;
  const p: Period = periods.includes(period as Period) ? (period as Period) : 'month';
  const scale = periodScale[p];

  const inputTokens = monthTokens.input * scale;
  const outputTokens = monthTokens.output * scale;
  const totalTokens = inputTokens + outputTokens;
  const equivalent = equivalentCost(inputTokens, outputTokens);
  const monthMillions = [...costByStage].reduce((sum, r) => sum + r.millions, 0);
  const estimatedCalls = Math.round(totalTokens / 4100);

  return (
    <div>
      <PageHeader
        eyebrow="Cost of AI · resources"
        title="Cost of AI"
        description="Local models cost $0, so tokens are the real measure. The equivalent cloud cost shows what the same tokens would cost on a cloud API at illustrative list prices. It is for comparison, not a bill."
      />

      {/* Period */}
      <div className="flex flex-wrap gap-2 mb-6">
        {periods.map((k) => (
          <Link
            key={k}
            href={`/factory/cost?period=${k}`}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              k === p
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {k === 'day' ? 'Day' : k === 'week' ? 'Week' : k === 'month' ? 'Month' : 'Year'}
          </Link>
        ))}
        <span className="self-center text-xs text-slate-500 dark:text-slate-400 ml-2">{periodLabel[p]}</span>
      </div>

      {/* Headline */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
        {[
          { label: 'Input tokens', value: millions(inputTokens) },
          { label: 'Output tokens', value: millions(outputTokens) },
          { label: 'Total tokens', value: millions(totalTokens) },
          { label: 'Cost, local models', value: '$0.00' },
          { label: 'Equivalent cloud cost', value: money(equivalent) },
          { label: 'Model calls (est.)', value: estimatedCalls.toLocaleString('en-US') },
        ].map((t) => (
          <div key={t.label} className={`${card} p-4`}>
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{t.label}</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{t.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-6 mb-8">
        <Breakdown
          title="By stage"
          note="Where the tokens go in the V-cycle. U4 implementation and U1 requirements are the largest."
          rows={costByStage}
          monthTotal={monthMillions}
          equivalentTotal={equivalent}
          scale={scale}
        />
        <Breakdown
          title="By line"
          note="Each line's share of the tokens. Lines are independent, so this shows where spend is concentrated."
          rows={costByLine}
          monthTotal={monthMillions}
          equivalentTotal={equivalent}
          scale={scale}
        />
        <Breakdown
          title="By activity"
          note="What the agents were doing: building, drafting, reviewing, and testing."
          rows={costByActivity}
          monthTotal={monthMillions}
          equivalentTotal={equivalent}
          scale={scale}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className={`${card} p-5`}>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Tokens by model profile</h2>
          <dl className="space-y-2 text-xs">
            {profileSplit.map((ps) => (
              <div key={ps.profile} className="flex justify-between">
                <dt className="text-slate-500">{ps.profile}</dt>
                <dd className="text-slate-800 dark:text-slate-200">{ps.share === 0 ? 'Deferred' : `${Math.round(ps.share * 100)}%`}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={`${card} p-5`}>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">How the equivalent cost is worked out</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Input tokens are priced at ${costBasis.inputPerMillion} per million and output tokens at ${costBasis.outputPerMillion} per million. These are illustrative list prices, set in one place. They exist only to compare local work with cloud work. Local models cost $0 to run.
          </p>
        </section>
      </div>
    </div>
  );
}
