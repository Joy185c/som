'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

type Review = {
  id: string;
  client_name: string;
  content: string;
  rating: number;
  project_type: string | null;
  created_at: string;
};

const DEMO_REVIEWS: Review[] = [
  { id: '1', client_name: 'Sarah K.', content: 'ShowOffs delivered beyond expectations. Our Reels engagement tripled.', rating: 5, project_type: 'Reels', created_at: '' },
  { id: '2', client_name: 'James L.', content: 'Professional, creative, and on time. Will definitely work with them again.', rating: 5, project_type: 'Promo', created_at: '' },
  { id: '3', client_name: 'Emma R.', content: 'The motion graphics they created elevated our product launch. Stunning work.', rating: 5, project_type: 'Motion Graphics', created_at: '' },
  { id: '4', client_name: 'Mike T.', content: 'Best video agency we have worked with. Clear communication and premium output.', rating: 5, project_type: 'Shorts', created_at: '' },
  { id: '5', client_name: 'Lisa M.', content: 'From concept to delivery, everything was smooth. Highly recommend.', rating: 5, project_type: 'Reels', created_at: '' },
];

const FILTERS = ['All', 'Reels', 'Shorts', 'Promo', 'Motion Graphics'];
const RATING_FILTERS = ['All', '5', '4', '3'];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ client_name: '', content: '', rating: 5, project_type: '' });

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, client_name, content, rating, project_type, created_at')
        .eq('approved', true)
        .order('created_at', { ascending: false });
      if (!error && data?.length) setReviews(data);
      else setReviews(DEMO_REVIEWS);
      setLoading(false);
    };
    fetchReviews();
  }, []);

  const list = reviews.length > 0 ? reviews : DEMO_REVIEWS;
  const filtered = list.filter((r) => {
    const matchType = typeFilter === 'All' || r.project_type === typeFilter;
    const matchRating = ratingFilter === 'All' || String(r.rating) === ratingFilter;
    return matchType && matchRating;
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: form.client_name.trim(),
          content: form.content.trim(),
          rating: form.rating,
          project_type: form.project_type.trim() || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to submit');
      toast.success('Thank you! Your review has been submitted and will appear after approval.');
      setForm({ client_name: '', content: '', rating: 5, project_type: '' });
      setShowForm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-slate-900/30 flex items-center justify-center">
        <p className="text-slate-500">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-slate-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Reviews</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">What our clients say about us.</p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-4 rounded-full bg-brand-500 px-5 py-2.5 font-semibold text-white hover:bg-brand-400 transition-colors"
          >
            Submit a review
          </button>
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 rounded-2xl border border-white/10 bg-white dark:bg-slate-800/50 p-6 sm:p-8"
          >
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Submit your review</h2>
            <form onSubmit={handleSubmitReview} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your name *</label>
                <input
                  value={form.client_name}
                  onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))}
                  required
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 text-slate-900 dark:text-white"
                  placeholder="e.g. John D."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your review *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  required
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 text-slate-900 dark:text-white"
                  placeholder="Share your experience..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rating (1–5) *</label>
                <select
                  value={form.rating}
                  onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 text-slate-900 dark:text-white"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} ★</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project type (optional)</label>
                <input
                  value={form.project_type}
                  onChange={(e) => setForm((f) => ({ ...f, project_type: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 text-slate-900 dark:text-white"
                  placeholder="e.g. Reels, Promo"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-brand-500 px-5 py-2.5 font-semibold text-white hover:bg-brand-400 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit review'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-slate-300 dark:border-white/20 px-5 py-2.5 text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="flex flex-wrap gap-4 mb-10">
          <div>
            <span className="text-sm text-slate-500 block mb-1">Project type</span>
            <div className="flex gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setTypeFilter(f)}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    typeFilter === f ? 'bg-brand-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="text-sm text-slate-500 block mb-1">Rating</span>
            <div className="flex gap-2">
              {RATING_FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setRatingFilter(f)}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    ratingFilter === f ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {f === 'All' ? 'All' : `${f} ★`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((review, i) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="group rounded-2xl border border-white/10 bg-white dark:bg-slate-800/50 backdrop-blur-xl p-6 transition-all hover:shadow-glow hover:border-white/20"
              >
                <Quote className="h-8 w-8 text-brand-500/40 mb-3" />
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 italic">&ldquo;{review.content}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-500/30 flex items-center justify-center font-bold text-white">
                    {review.client_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{review.client_name}</p>
                    <p className="text-sm text-slate-500">{review.project_type ?? 'Client'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
