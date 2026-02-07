'use client';

import { motion } from 'framer-motion';
import { Eye, MessageSquare, Calendar, TrendingUp } from 'lucide-react';

const DEMO_STATS = [
  { label: 'Portfolio views (this month)', value: '—', icon: Eye },
  { label: 'Review submissions', value: '—', icon: MessageSquare },
  { label: 'Meetings requested', value: '—', icon: Calendar },
  { label: 'Top-performing media', value: '—', icon: TrendingUp },
];

export default function AdminAnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
      <p className="mt-1 text-slate-400">Portfolio views, reviews, meetings. Optional: Google Analytics / Hotjar.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {DEMO_STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-white/10 bg-slate-800/50 p-6"
            >
              <Icon className="h-8 w-8 text-brand-400 mb-3" />
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-slate-400 text-sm">{s.label}</p>
            </motion.div>
          );
        })}
      </div>
      <p className="mt-6 text-sm text-slate-500">Connect Supabase + optional analytics to show real data and charts.</p>
    </div>
  );
}
