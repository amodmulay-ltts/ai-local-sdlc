import PageHeader from '../../components/PageHeader';
import { evidenceRun as e } from '../../data';

const card = 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl';
const sectionTitle = 'text-sm font-semibold text-slate-900 dark:text-white mb-3';

export default function EvidencePage() {
  const totalIn = e.calls.reduce((sum, c) => sum + c.tokensIn, 0);
  const totalOut = e.calls.reduce((sum, c) => sum + c.tokensOut, 0);

  return (
    <div>
      <PageHeader
        eyebrow={`Evidence package · ${e.workOrder} · ${e.line}`}
        title={`Evidence for ${e.run}`}
        description="The record a reviewer reads instead of re-reading the work. It shows what went in, what came out, what each check found, and who decided. It is assembled as the run goes, and it is complete once the gate is decided."
      />

      <div className={`${card} p-4 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs`}>
        <p className="text-slate-800 dark:text-slate-200">
          <span className="font-semibold">{e.playbook}</span> · {e.line}
        </p>
        <p className="text-amber-700 dark:text-amber-400 font-medium">{e.status}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className={`${card} p-5`}>
          <h2 className={sectionTitle}>Inputs</h2>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {e.inputs.map((i) => (
              <li key={i} className="flex gap-2">
                <span className="text-slate-400">•</span>
                {i}
              </li>
            ))}
          </ul>
        </div>

        <div className={`${card} p-5`}>
          <h2 className={sectionTitle}>Outputs</h2>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {e.outputs.map((o) => (
              <li key={o} className="flex gap-2">
                <span className="text-slate-400">•</span>
                {o}
              </li>
            ))}
          </ul>
        </div>

        <div className={`${card} p-5`}>
          <h2 className={sectionTitle}>Independent checks</h2>
          <div className="space-y-2 text-xs">
            {e.reviews.map((rv) => (
              <p key={rv.name} className={rv.flagged ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}>
                <span className="font-medium">{rv.name}:</span> {rv.verdict}
              </p>
            ))}
            <p className="text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="font-medium">Judge:</span> {e.judge}
            </p>
          </div>
        </div>

        <div className={`${card} p-5`}>
          <h2 className={sectionTitle}>Decision</h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 mb-3">{e.gate}</p>
          <p className="text-xs text-slate-500">
            The approver&apos;s name, role, decision, and reason are written here when the gate is decided.
          </p>
        </div>

        <div className={`${card} p-5 xl:col-span-2`}>
          <h2 className={sectionTitle}>Model calls</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2 font-medium">Step</th>
                  <th className="py-2 font-medium">Profile</th>
                  <th className="py-2 font-medium text-right">Input tokens</th>
                  <th className="py-2 font-medium text-right">Output tokens</th>
                </tr>
              </thead>
              <tbody>
                {e.calls.map((c, idx) => (
                  <tr key={`${c.step}-${idx}`} className="border-b border-slate-100 dark:border-slate-800/60 text-slate-700 dark:text-slate-300">
                    <td className="py-2">{c.step}</td>
                    <td className="py-2 font-mono">{c.profile}</td>
                    <td className="py-2 text-right">{c.tokensIn.toLocaleString('en-US')}</td>
                    <td className="py-2 text-right">{c.tokensOut.toLocaleString('en-US')}</td>
                  </tr>
                ))}
                <tr className="font-semibold text-slate-900 dark:text-white">
                  <td className="py-2" colSpan={2}>
                    Total, {e.calls.length} calls · cost $0 (local models)
                  </td>
                  <td className="py-2 text-right">{totalIn.toLocaleString('en-US')}</td>
                  <td className="py-2 text-right">{totalOut.toLocaleString('en-US')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={`${card} p-5`}>
          <h2 className={sectionTitle}>Provenance</h2>
          <dl className="space-y-2 text-xs">
            <div>
              <dt className="text-slate-500">Prompts</dt>
              <dd className="text-slate-700 dark:text-slate-300">{e.provenance.prompts}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Sources</dt>
              <dd className="text-slate-700 dark:text-slate-300">{e.provenance.sources}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Reproducibility</dt>
              <dd className="text-slate-700 dark:text-slate-300">{e.provenance.reproducibility}</dd>
            </div>
          </dl>
        </div>

        <div className={`${card} p-5`}>
          <h2 className={sectionTitle}>Links</h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{e.links}</p>
        </div>
      </div>
    </div>
  );
}
