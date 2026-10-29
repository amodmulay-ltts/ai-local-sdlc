import { ReactNode } from 'react';
import OverviewNav from './components/OverviewNav';

export const metadata = {
  title: 'Engineering Intelligence Factory — Overview',
  description: 'The Engineering Intelligence Factory concept: the V-cycle, playbooks, agents, gates, and evidence.',
};

export default function FactoryLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <OverviewNav />
      <main className="max-w-[1400px] mx-auto px-6 py-10">{children}</main>
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 mt-10">
        <div className="max-w-[1400px] mx-auto px-6 text-xs text-slate-500 dark:text-slate-500 flex items-center justify-between flex-wrap gap-2">
          <p>Figures shown are illustrative. What is built today is listed on the overview.</p>
          <p>Engineering Intelligence Factory · A concept for AI-native engineering delivery</p>
        </div>
      </footer>
    </div>
  );
}
