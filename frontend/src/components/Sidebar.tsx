'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import {
  LayoutDashboard,
  FolderOpen,
  Cpu,
  BookOpen,
  ChevronRight,
  Zap,
  Moon,
  Sun,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const links = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/projects', label: 'Projects', icon: FolderOpen },
    { href: '/models', label: 'Model Profiles', icon: Cpu },
    { href: '/sources', label: 'Knowledge Sources', icon: BookOpen },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col h-full shadow-xl border-r border-slate-700">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg">
            <Zap size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">AI-SDLC</h1>
            <p className="text-xs text-slate-400">Factory</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                active
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <Icon size={20} className={active ? '' : 'group-hover:scale-110 transition-transform'} />
              <span className="font-medium text-sm flex-1">{label}</span>
              {active && <ChevronRight size={18} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 space-y-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-slate-300 hover:text-white"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <>
              <Moon size={18} />
              <span className="text-sm font-medium">Dark</span>
            </>
          ) : (
            <>
              <Sun size={18} />
              <span className="text-sm font-medium">Light</span>
            </>
          )}
        </button>

        {/* API Status */}
        <div className="bg-slate-700/30 rounded-lg p-4 text-center">
          <p className="text-xs text-slate-400 mb-2">API Status</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-xs font-medium text-slate-300">Connected</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
