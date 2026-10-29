import PageHeader from '../components/PageHeader';
import { agentRoles } from '../data';

export default function AgentsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Stop 3 of 7"
        title="Agent Catalog"
        description="Agents are execution units with one bounded role, a model profile, and a clear contract. They are planned, not built. The model layer they call is implemented (M2); the orchestrator (M5) comes next."
      />

      <div className="space-y-10">
        {agentRoles.map((group) => (
          <section key={group.group}>
            <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-4">
              Role group: {group.group}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.agents.map((agent) => (
                <div key={agent.name} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{agent.name}</h3>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                      Planned · {agent.milestone}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{agent.responsibility}</p>

                  <dl className="text-xs">
                    <dt className="text-slate-500 dark:text-slate-500">Model profile</dt>
                    <dd className="text-slate-800 dark:text-slate-200">{agent.profile}</dd>
                  </dl>

                  {agent.rule && (
                    <div className="mt-4 p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Rule</p>
                      <p className="text-xs text-slate-700 dark:text-slate-300">{agent.rule}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
