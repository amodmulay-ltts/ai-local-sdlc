import PageHeader from '../components/PageHeader';
import { agentCatalog } from '../data';

export default function AgentsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Stop 3 of 7"
        title="Agent Catalog"
        description="Agents are not magical — they're execution units with a clear contract: plan, execute, report evidence. Grouped here by the lifecycle stage they serve."
      />

      <div className="space-y-10">
        {agentCatalog.map((group) => (
          <section key={group.stage}>
            <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-300 uppercase tracking-wide mb-4">
              Stage: {group.stage}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.agents.map((agent) => (
                <div key={agent.name} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{agent.icon}</span>
                      {agent.name}
                    </h3>
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
                      {agent.successRate}% success
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{agent.description}</p>

                  <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                    <div>
                      <dt className="text-slate-500 dark:text-slate-500">Runs in</dt>
                      <dd className="text-slate-800 dark:text-slate-200">{agent.runsIn} playbooks</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500 dark:text-slate-500">Success rate</dt>
                      <dd className="text-slate-800 dark:text-slate-200">{agent.successCount} runs</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500 dark:text-slate-500">Avg time</dt>
                      <dd className="text-slate-800 dark:text-slate-200">{agent.avgTime}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500 dark:text-slate-500">Models used</dt>
                      <dd className="text-slate-800 dark:text-slate-200">{agent.models}</dd>
                    </div>
                    {agent.failureModes && (
                      <div className="col-span-2">
                        <dt className="text-slate-500 dark:text-slate-500">Failure modes</dt>
                        <dd className="text-amber-700 dark:text-amber-400">{agent.failureModes}</dd>
                      </div>
                    )}
                    {agent.disputes && (
                      <div className="col-span-2">
                        <dt className="text-slate-500 dark:text-slate-500">Disputes with other reviewers</dt>
                        <dd className="text-amber-700 dark:text-amber-400">{agent.disputes}</dd>
                      </div>
                    )}
                    {agent.findings && (
                      <div className="col-span-2">
                        <dt className="text-slate-500 dark:text-slate-500">Findings</dt>
                        <dd className="text-slate-200">{agent.findings}</dd>
                      </div>
                    )}
                    {agent.escalations && (
                      <div className="col-span-2">
                        <dt className="text-slate-500 dark:text-slate-500">Escalations triggered</dt>
                        <dd className="text-amber-700 dark:text-amber-400">{agent.escalations}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
