'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const DEMO_REVIEWS = [
  { id: '1', name: 'Sarah K.', role: 'Marketing Director', content: 'ShowOffs delivered beyond expectations. Our Reels engagement tripled.', rating: 5, projectType: 'Reels' },
  { id: '2', name: 'James L.', role: 'Founder', content: 'Professional, creative, and on time. Will definitely work with them again.', rating: 5, projectType: 'Promo' },
  { id: '3', name: 'Emma R.', role: 'Brand Manager', content: 'The motion graphics they created elevated our product launch. Stunning work.', rating: 5, projectType: 'Motion Graphics' },
  { id: '4', name: 'Mike T.', role: 'CEO', content: 'Best video agency we have worked with. Clear communication and premium output.', rating: 5, projectType: 'Shorts' },
  { id: '5', name: 'Lisa M.', role: 'Content Lead', content: 'From concept to delivery, everything was smooth. Highly recommend.', rating: 5, projectType: 'Reels' },
];

const FILTERS = ['All', 'Reels', 'Shorts', 'Promo', 'Motion Graphics'];
const RATING_FILTERS = ['All', '5', '4', '3'];

export default function ReviewsPage() {
  const [typeFilter, setTypeFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');

  const filtered = DEMO_REVIEWS.filter((r) => {
    const matchType = typeFilter === 'All' || r.projectType === typeFilter;
    const matchRating = ratingFilter === 'All' || String(r.rating) === ratingFilter;
    return matchType && matchRating;
  });

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
        </motion.div>

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
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{review.name}</p>
                    <p className="text-sm text-slate-500">{review.role} · {review.projectType}</p>
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
