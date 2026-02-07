'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  Calendar,
  Users,
  Settings,
  BarChart3,
  Layers,
  LogOut,
  KeyRound,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/sections', label: 'Sections', icon: Layers },
  { href: '/admin/works', label: 'Media / Works', icon: FolderOpen },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/admin/meetings', label: 'Meetings', icon: Calendar },
  { href: '/admin/team', label: 'Team', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || pathname === '/admin/login') return;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const demo = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
      if (!session?.access_token && !demo) {
        router.replace('/admin/login');
      }
    })();
  }, [mounted, pathname, router]);

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('admin_token');
    router.replace('/admin/login');
    router.refresh();
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <aside className="w-64 border-r border-white/10 bg-slate-900/50 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="text-lg font-bold text-white">ShowOffs <span className="text-brand-400">Admin</span></Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  active ? 'bg-brand-500/20 text-brand-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/admin/change-password"
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <KeyRound className="h-5 w-5" />
            Change password
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
