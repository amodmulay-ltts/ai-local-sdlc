import type { Status } from '../data';

const STYLES: Record<Status, string> = {
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  running: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  waiting: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  escalated: 'bg-red-500/15 text-red-400 border-red-500/30',
  idle: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

const DOT: Record<Status, string> = {
  success: 'bg-emerald-400',
  running: 'bg-blue-400 animate-pulse',
  waiting: 'bg-amber-400 animate-pulse',
  escalated: 'bg-red-400',
  idle: 'bg-slate-500',
};

export default function StatusBadge({ status, label }: { status: Status; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${STYLES[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${DOT[status]}`} />
      {label}
    </span>
  );
}
