import { lifecycleStages } from '../data';

export default function LifecycleStrip({ compact = false }: { compact?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <div className="flex items-start gap-0 min-w-[900px]">
        {lifecycleStages.map((stage, idx) => (
          <div key={stage.name} className="flex-1 relative">
            <div className="flex items-center">
              <div
                className={`shrink-0 rounded-full border-2 border-cyan-500 dark:border-cyan-400 bg-slate-50 dark:bg-slate-950 ${
                  compact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'
                }`}
              />
              {idx < lifecycleStages.length - 1 && (
                <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/60 dark:from-cyan-400/60 to-slate-300 dark:to-slate-700" />
              )}
            </div>
            <p className={`mt-3 font-semibold text-slate-900 dark:text-slate-100 ${compact ? 'text-xs' : 'text-sm'}`}>
              {stage.name}
            </p>
            {!compact && (
              <ul className="mt-2 space-y-1 pr-4">
                {stage.agents.map((agent) => (
                  <li key={agent} className="text-xs text-slate-500 dark:text-slate-400">
                    • {agent}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
