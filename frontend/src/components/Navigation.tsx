'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/projects', label: 'Projects', icon: '📁' },
    { href: '/models', label: 'Model Profiles', icon: '🤖' },
    { href: '/sources', label: 'Knowledge Sources', icon: '📚' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            AI-SDLC Factory
          </Link>

          <div className="flex space-x-1">
            {links.map(({ href, label, icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-1">{icon}</span>
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
