import { ReactNode } from 'react';
import DemoNav from './components/DemoNav';

export const metadata = {
  title: 'Engineering Intelligence Factory — Concept Tour',
  description: 'A static walkthrough of the Engineering Intelligence Factory concept: lifecycle, playbooks, agents, gates, and evidence.',
};

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <DemoNav />
      <main className="max-w-[1400px] mx-auto px-6 py-10">{children}</main>
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 mt-10">
        <div className="max-w-[1400px] mx-auto px-6 text-xs text-slate-500 dark:text-slate-500 flex items-center justify-between flex-wrap gap-2">
          <p>All data on this tour is static and illustrative — no backend calls are made.</p>
          <p>Engineering Intelligence Factory · Concept Demo</p>
        </div>
      </footer>
    </div>
  );
}
