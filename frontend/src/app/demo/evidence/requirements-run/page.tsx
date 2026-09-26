import { FileDown, FileText, FileJson, Link2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import { evidencePackage as e } from '../../data';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-300 uppercase tracking-wide mb-3">{title}</h2>
      {children}
    </div>
  );
}

export default function EvidencePackagePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Stop 6 of 7"
        title={`Evidence Package: ${e.playbook}`}
        description={`${e.date} · Project: ${e.project}`}
        right={<StatusBadge status={e.status} label="Approved" />}
      />

      <Section title="Executive summary">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-300 leading-relaxed">{e.summary}</p>
        </div>
      </Section>

      <Section title="Inputs to this playbook run">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">Business intent</p>
            <p className="text-sm text-slate-800 dark:text-slate-200">&ldquo;{e.inputs.intent}&rdquo;</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">Knowledge sources used</p>
            <ul className="space-y-1">
              {e.inputs.sources.map((s, i) => (
                <li key={s} className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-300">
                  {i + 1}. {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Outputs from this playbook run">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-500 dark:text-slate-500">Requirements generated</p>
            <p className="text-xl font-bold text-white mt-1">{e.outputs.total}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-500 dark:text-slate-500">Functional / Non-functional</p>
            <p className="text-xl font-bold text-white mt-1">
              {e.outputs.functional} / {e.outputs.nonFunctional}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-500 dark:text-slate-500">Traceability</p>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mt-1.5">{e.outputs.traceability}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-500 dark:text-slate-500">Completeness score</p>
            <p className="text-xl font-bold text-white mt-1">{e.outputs.completenessScore}/100</p>
          </div>
        </div>
      </Section>

      <Section title="Validation results">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-2 text-sm">
          <p className="text-slate-600 dark:text-slate-400 dark:text-slate-300">
            ✅ Tests generated: {e.validation.testsGenerated} — {e.validation.testsPass ? 'all pass (initial validation)' : 'failures present'}
          </p>
          <p className="text-slate-600 dark:text-slate-400 dark:text-slate-300">✅ No conflicts with architectural constraints</p>
          <p className="text-amber-600 dark:text-amber-300">⚠️ {e.validation.scopeFlags} requirements flagged for scope clarification</p>
          <p className="text-slate-600 dark:text-slate-400 dark:text-slate-300">✅ Security analysis: {e.validation.securityConcerns} concerns</p>
        </div>
      </Section>

      <Section title="Independent reviews">
        <div className="space-y-3">
          {e.reviews.map((r) => (
            <div key={r.name} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <StatusBadge status={r.status} label={r.status === 'success' ? 'Pass' : 'Concern'} />
                <p className="font-semibold text-white text-sm">{r.name}</p>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-300">{r.verdict}</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Issues found: {r.issues} · &ldquo;{r.note}&rdquo;</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Disagreements & resolution">
        <div className="bg-amber-500/5 border border-amber-200 dark:border-amber-500/30 rounded-xl p-5 text-sm space-y-1.5">
          <p className="text-amber-600 dark:text-amber-300 font-semibold">Disagreement: {e.disagreement.parties}</p>
          <p className="text-slate-600 dark:text-slate-400 dark:text-slate-300">— {e.disagreement.a}</p>
          <p className="text-slate-600 dark:text-slate-400 dark:text-slate-300">— {e.disagreement.b}</p>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Resolution: {e.disagreement.resolution}</p>
        </div>
      </Section>

      <Section title="Decision gate result">
        <div className="bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-5 text-sm space-y-1">
          <p className="text-emerald-700 dark:text-emerald-400 font-semibold">Decision: {e.decision.verdict}</p>
          <p className="text-slate-600 dark:text-slate-400 dark:text-slate-300">Approver: {e.decision.approver}</p>
          <p className="text-slate-500 dark:text-slate-500 text-xs">Timestamp: {e.decision.timestamp}</p>
          <p className="text-slate-600 dark:text-slate-400 dark:text-slate-300 mt-2">&ldquo;{e.decision.note}&rdquo;</p>
        </div>
      </Section>

      <Section title="Cost & metrics">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-500 dark:text-slate-500">Execution time</p>
            <p className="text-lg font-bold text-white mt-1">{e.cost.executionTime}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-500 dark:text-slate-500">LLM cost</p>
            <p className="text-lg font-bold text-white mt-1">${e.cost.llmCost}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-500 dark:text-slate-500">Human review time</p>
            <p className="text-lg font-bold text-white mt-1">{e.cost.reviewTime}</p>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
            <p className="text-xs text-cyan-400">Est. value created</p>
            <p className="text-lg font-bold text-cyan-300 mt-1">~${e.cost.estimatedValue}</p>
          </div>
        </div>
      </Section>

      <div className="flex flex-wrap gap-3 pt-2">
        {[
          { icon: FileDown, label: 'Download as PDF' },
          { icon: FileText, label: 'Download as Markdown' },
          { icon: FileJson, label: 'Download as JSON' },
          { icon: Link2, label: 'Copy share link' },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            title="Disabled in static tour"
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-500 text-sm font-medium rounded-lg cursor-not-allowed"
          >
            <Icon size={15} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
