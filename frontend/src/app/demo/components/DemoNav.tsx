'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Factory, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

const LINKS = [
  { href: '/demo', label: 'Overview' },
  { href: '/demo/factory', label: 'Factory Dashboard' },
  { href: '/demo/playbooks', label: 'Playbooks' },
  { href: '/demo/agents', label: 'Agents' },
  { href: '/demo/runs/live', label: 'Live Run' },
  { href: '/demo/gates/pending', label: 'Gate Decision' },
  { href: '/demo/evidence/requirements-run', label: 'Evidence' },
  { href: '/demo/traceability', label: 'Traceability' },
];

export default function DemoNav() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/demo" className="flex items-center gap-2 shrink-0">
            <div className="p-1.5 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg">
              <Factory size={18} className="text-slate-950" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-slate-900 dark:text-white">AI-SDLC Factory</p>
              <p className="text-[10px] text-cyan-600 dark:text-cyan-400 tracking-wide uppercase">
                Concept Tour · Demo Mode
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm rounded-md whitespace-nowrap transition-colors ${
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
              Exit demo
            </Link>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="lg:hidden flex items-center gap-1 pb-3 overflow-x-auto">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-xs rounded-md whitespace-nowrap transition-colors ${
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
