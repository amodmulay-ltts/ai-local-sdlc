import { ReactNode } from 'react';

export default function PageHeader({
  eyebrow,
  title,
  description,
  right,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 flex-wrap mb-8">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold tracking-wider uppercase text-cyan-400 mb-2">{eyebrow}</p>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
        {description && <p className="text-slate-400 mt-2 max-w-2xl">{description}</p>}
      </div>
      {right}
    </div>
  );
}
