'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiGet, apiMutate } from '@/lib/admin-api';

type Meeting = {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  project_type: string;
  preferred_date: string | null;
  preferred_time_slot: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/20 text-amber-400',
  confirmed: 'bg-green-500/20 text-green-400',
  completed: 'bg-slate-500/20 text-slate-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

export default function AdminMeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const load = async () => {
    try {
      const url = statusFilter ? `/api/admin/meetings?status=${statusFilter}` : '/api/admin/meetings';
      const data = await apiGet<Meeting[]>(url);
      setMeetings(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load meetings');
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const setStatus = async (id: string, status: string) => {
    try {
      await apiMutate('/api/admin/meetings', 'PATCH', { id, status });
      setMeetings((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
      toast.success('Updated');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading meetings...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Meeting Manager</h1>
      <p className="mt-1 text-slate-400">Confirm, reschedule, or cancel. Filter by status.</p>
      <div className="mt-6 flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setStatusFilter(null)}
          className={`rounded-full px-4 py-2 text-sm font-medium ${!statusFilter ? 'bg-brand-500 text-white' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}
        >
          All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${statusFilter === s ? 'bg-brand-500 text-white' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {meetings.map((m) => (
          <motion.div
            key={m.id}
            layout
            className="rounded-xl border border-white/10 bg-slate-800/50 p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-white">{m.client_name}</p>
                <p className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                  <Mail className="h-4 w-4" /> {m.client_email}
                </p>
                {m.client_phone && <p className="text-sm text-slate-500">{m.client_phone}</p>}
                <p className="text-sm text-slate-500 mt-1">
                  {m.project_type} · {m.preferred_date ?? '—'} {m.preferred_time_slot ?? ''}
                </p>
                {m.message && <p className="mt-2 text-sm text-slate-400 line-clamp-2">{m.message}</p>}
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_COLORS[m.status] || 'bg-slate-500/20'}`}>
                {m.status}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {STATUSES.filter((s) => s !== m.status).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(m.id, s)}
                  className="rounded-lg bg-white/10 px-3 py-1.5 text-sm text-slate-400 hover:bg-white/20 capitalize"
                >
                  Mark {s}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
        {meetings.length === 0 && <p className="text-slate-500">No meetings match.</p>}
      </div>
    </div>
  );
}
