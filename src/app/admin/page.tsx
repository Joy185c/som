'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FolderOpen, MessageSquare, Calendar, Users, TrendingUp, Loader2 } from 'lucide-react';
import { apiGet } from '@/lib/admin-api';
import toast from 'react-hot-toast';

type Stats = { works: number; reviews: number; meetings: number; team: number };

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [works, reviews, meetings, team] = await Promise.all([
          apiGet<unknown[]>('/api/admin/works').then((a) => (Array.isArray(a) ? a.length : 0)),
          apiGet<unknown[]>('/api/admin/reviews').then((a) => (Array.isArray(a) ? a.length : 0)),
          apiGet<unknown[]>('/api/admin/meetings').then((a) => (Array.isArray(a) ? a.length : 0)),
          apiGet<unknown[]>('/api/admin/team').then((a) => (Array.isArray(a) ? a.length : 0)),
        ]);
        setStats({ works, reviews, meetings, team });
      } catch (e) {
        const msg = e instanceof Error ? e.message : '';
        if (msg.includes('Supabase not configured')) {
          setStats({ works: 0, reviews: 0, meetings: 0, team: 0 });
        } else {
          toast.error(msg || 'Failed to load stats');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = [
    { title: 'Works', value: stats?.works ?? '—', href: '/admin/works', icon: FolderOpen },
    { title: 'Reviews', value: stats?.reviews ?? '—', href: '/admin/reviews', icon: MessageSquare },
    { title: 'Meetings', value: stats?.meetings ?? '—', href: '/admin/meetings', icon: Calendar },
    { title: 'Team', value: stats?.team ?? '—', href: '/admin/team', icon: Users },
    { title: 'Analytics', value: '—', href: '/admin/analytics', icon: TrendingUp },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      <p className="mt-1 text-slate-400">Overview of your site.</p>
      {loading && (
        <div className="mt-4 flex items-center gap-2 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading…
        </div>
      )}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={card.href}>
                <div className="rounded-xl border border-white/10 bg-slate-800/50 p-6 transition-all hover:border-brand-500/30 hover:shadow-glow">
                  <Icon className="h-8 w-8 text-brand-400 mb-3" />
                  <p className="text-2xl font-bold text-white">{card.value}</p>
                  <p className="text-slate-400">{card.title}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
      {!loading && stats && (stats.works === 0 && stats.reviews === 0 && stats.meetings === 0 && stats.team === 0) && (
        <p className="mt-6 text-sm text-amber-500/90">
          Connect Supabase (env vars) and run <code className="bg-slate-800 px-1 rounded">supabase/schema.sql</code> to persist data.
        </p>
      )}
    </div>
  );
}
