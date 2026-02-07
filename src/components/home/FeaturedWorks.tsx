'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

// Demo data – replace with Supabase fetch
const DEMO_WORKS = [
  { id: '1', title: 'Brand Reel 2024', thumbnail: '/placeholder-work-1.jpg', type: 'Reels', tools: ['Premiere', 'AE'], slug: 'brand-reel-2024' },
  { id: '2', title: 'Product Short', thumbnail: '/placeholder-work-2.jpg', type: 'Shorts', tools: ['Premiere'], slug: 'product-short' },
  { id: '3', title: 'Motion Promo', thumbnail: '/placeholder-work-3.jpg', type: 'Promo', tools: ['After Effects'], slug: 'motion-promo' },
  { id: '4', title: 'Social Series', thumbnail: '/placeholder-work-4.jpg', type: 'Reels', tools: ['Premiere', 'DaVinci'], slug: 'social-series' },
  { id: '5', title: 'Event Highlight', thumbnail: '/placeholder-work-5.jpg', type: 'Promo', tools: ['AE', 'Premiere'], slug: 'event-highlight' },
];

const FILTERS = ['All', 'Reels', 'Shorts', 'Promo', 'Motion Graphics'];

export function FeaturedWorks() {
  const [filter, setFilter] = useState('All');
  const [index, setIndex] = useState(0);
  const filtered = filter === 'All' ? DEMO_WORKS : DEMO_WORKS.filter((w) => w.type === filter);
  const current = filtered[index % Math.max(1, filtered.length)];

  return (
    <section id="featured-works" className="relative py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Featured Works</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Our best projects, handpicked for you.</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => { setFilter(f); setIndex(0); }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + filtered.length) % filtered.length)}
              className="rounded-full p-2 bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <AnimatePresence mode="wait">
              {current && (
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1"
                >
                  <Link href={`/portfolio/${current.slug}`}>
                    <div className="group relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-slate-800 shadow-glow glass-card-hover">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <span className="rounded-full bg-white/20 p-4 backdrop-blur-sm group-hover:bg-brand-500/90 transition-colors">
                          <Play className="h-10 w-10 text-white fill-white" />
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                        <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                          {current.type}
                        </span>
                        <h3 className="mt-2 text-xl font-semibold text-white">{current.title}</h3>
                        <p className="text-sm text-slate-300">{current.tools.join(' · ')}</p>
                      </div>
                      <div className="aspect-video bg-slate-700" />
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % filtered.length)}
              className="rounded-full p-2 bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/portfolio"
              className="text-brand-500 font-semibold hover:underline"
            >
              View all works →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
