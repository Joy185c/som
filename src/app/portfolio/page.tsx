'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Search } from 'lucide-react';

const DEMO_WORKS = [
  { id: '1', title: 'Brand Reel 2024', type: 'Reels', tools: ['Premiere', 'AE'], slug: 'brand-reel-2024', isVertical: false },
  { id: '2', title: 'Product Short', type: 'Shorts', tools: ['Premiere'], slug: 'product-short', isVertical: true },
  { id: '3', title: 'Motion Promo', type: 'Promo', tools: ['After Effects'], slug: 'motion-promo', isVertical: false },
  { id: '4', title: 'Social Series', type: 'Reels', tools: ['Premiere', 'DaVinci'], slug: 'social-series', isVertical: true },
  { id: '5', title: 'Event Highlight', type: 'Promo', tools: ['AE', 'Premiere'], slug: 'event-highlight', isVertical: false },
  { id: '6', title: 'Ad Campaign', type: 'Ads', tools: ['Premiere', 'AE'], slug: 'ad-campaign', isVertical: false },
];

const TAGS = ['All', 'Reels', 'Shorts', 'Promo', 'Motion Graphics', 'Ads'];
const SORT_OPTIONS = ['New', 'Most Viewed', 'Popular'];

export default function PortfolioPage() {
  const [tag, setTag] = useState('All');
  const [sort, setSort] = useState('New');
  const [search, setSearch] = useState('');

  const filtered = DEMO_WORKS.filter((w) => {
    const matchTag = tag === 'All' || w.type === tag;
    const matchSearch = !search || w.title.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-slate-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Portfolio</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Filter and explore our work.</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              type="search"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  tag === t ? 'bg-brand-500 text-white' : 'bg-white/10 text-slate-400 hover:bg-white/20'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {SORT_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSort(s)}
              className={`rounded-lg px-3 py-1.5 text-sm ${sort === s ? 'text-brand-400 font-medium' : 'text-slate-500 hover:text-white'}`}
            >
              {s}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((work, i) => (
              <motion.div
                key={work.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/portfolio/${work.slug}`}>
                  <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-800/50 backdrop-blur-xl transition-all hover:border-white/20 hover:shadow-glow">
                    <div className={`relative ${work.isVertical ? 'aspect-[9/16]' : 'aspect-video'} bg-slate-700`}>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/30 transition-colors">
                        <span className="rounded-full bg-white/20 p-3 backdrop-blur-sm group-hover:bg-brand-500/90 transition-colors">
                          <Play className="h-8 w-8 text-white fill-white" />
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <span className="text-xs font-medium text-brand-400">{work.type}</span>
                        <h3 className="font-semibold text-white">{work.title}</h3>
                        <p className="text-xs text-slate-400">{work.tools.join(' · ')}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-slate-500 py-12">No projects match your filters.</p>
        )}
      </div>
    </div>
  );
}
