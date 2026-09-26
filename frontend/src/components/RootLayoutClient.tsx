'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/providers/ThemeProvider';
import Sidebar from '@/components/Sidebar';

export default function RootLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDemo = pathname?.startsWith('/demo');

  if (isDemo) {
    // The demo tour is a self-contained, full-bleed experience with its own
    // navigation (DemoNav) — it does not use the app shell/sidebar.
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
