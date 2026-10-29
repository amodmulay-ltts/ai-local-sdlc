'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

const LINKS = [
  { href: '/factory', label: 'Overview' },
  { href: '/factory/floor', label: 'Floor' },
  { href: '/factory/lines', label: 'Lines' },
  { href: '/factory/inbox', label: 'Inbox' },
  { href: '/factory/cost', label: 'Cost' },
  { href: '/factory/setup', label: 'Setup' },
  { href: '/factory/playbooks', label: 'Playbooks' },
  { href: '/factory/agents', label: 'Agents' },
  { href: '/factory/runs/live', label: 'Live Run' },
  { href: '/factory/gates/pending', label: 'Gate Decision' },
  { href: '/factory/evidence/requirements-run', label: 'Evidence' },
  { href: '/factory/traceability', label: 'Traceability' },
];

export default function OverviewNav() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/factory" className="flex items-center gap-2 shrink-0">
            <div
              aria-hidden="true"
              className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[4px] border-2 border-slate-900 bg-slate-900 text-[11px] font-black leading-none tracking-tight text-white dark:border-white dark:bg-white dark:text-slate-900"
            >
              EI
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-slate-900 dark:text-white">Engineering Intelligence Factory</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 rounded-md px-3 py-1.5 transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>

            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 rounded-md px-3 py-1.5 transition-colors"
            >
              <X size={14} />
              Exit
            </Link>
          </div>
        </div>

        {/* Navigation: one row that wraps, so no horizontal scrollbar */}
        <nav className="flex flex-wrap items-center gap-x-1 gap-y-1 pb-3">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2.5 py-1.5 text-xs rounded-md whitespace-nowrap transition-colors ${
                  active
                    ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-400/10'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
