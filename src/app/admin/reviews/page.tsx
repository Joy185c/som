'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Star, Loader2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiGet, apiMutate } from '@/lib/admin-api';

type Review = {
  id: string;
  client_name: string;
  content: string;
  rating: number;
  project_type: string | null;
  approved: boolean;
  created_at: string;
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ client_name: '', content: '', rating: 5, project_type: '' });

  const load = async () => {
    try {
      const data = await apiGet<Review[]>('/api/admin/reviews');
      setReviews(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id: string) => {
    try {
      await apiMutate('/api/admin/reviews', 'PATCH', { id, approved: true });
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, approved: true } : r)));
      toast.success('Approved');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      await apiMutate('/api/admin/reviews', 'DELETE', undefined, { id });
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success('Deleted');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  const submitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await apiMutate('/api/admin/reviews', 'POST', {
        client_name: form.client_name,
        content: form.content,
        rating: form.rating,
        project_type: form.project_type || null,
      });
      toast.success('Review added');
      setForm({ client_name: '', content: '', rating: 5, project_type: '' });
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading reviews...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Review Manager</h1>
          <p className="mt-1 text-slate-400">Approve or delete. Newest first.</p>
        </div>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 font-semibold text-white hover:bg-brand-400"
        >
          <Plus className="h-5 w-5" /> Add review
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {reviews.map((r) => (
          <motion.div
            key={r.id}
            layout
            className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-slate-800/50 p-4"
          >
            <div>
              <div className="flex gap-1 mb-1">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="font-medium text-white">{r.client_name}</p>
              <p className="text-sm text-slate-400 line-clamp-2">{r.content}</p>
              <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs ${r.approved ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {r.approved ? 'Approved' : 'Pending'}
              </span>
            </div>
            <div className="flex gap-2 shrink-0">
              {!r.approved && (
                <button type="button" onClick={() => approve(r.id)} className="rounded-lg p-2 bg-green-500/20 text-green-400 hover:bg-green-500/30" title="Approve">
                  <Check className="h-5 w-5" />
                </button>
              )}
              <button type="button" onClick={() => remove(r.id)} className="rounded-lg p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30" title="Delete">
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        ))}
        {reviews.length === 0 && !adding && <p className="text-slate-500">No reviews yet.</p>}
      </div>

      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setAdding(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">Add review</h2>
            <form onSubmit={submitAdd} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Client name *</label>
                <input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} required className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Content *</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={3} className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Rating (1-5)</label>
                <input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Project type (optional)</label>
                <input value={form.project_type} onChange={(e) => setForm({ ...form, project_type: e.target.value })} className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-white" placeholder="Reels, Promo..." />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="rounded-xl bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-400">Add</button>
                <button type="button" onClick={() => setAdding(false)} className="rounded-xl border border-white/20 px-4 py-2 text-slate-400">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
