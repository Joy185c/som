'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Work = {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  video_url: string | null;
  project_type: string;
  tools: string[];
};

const FILTERS = ['All', 'Reels', 'Shorts', 'Promo', 'Motion Graphics'];

export function FeaturedWorks() {
  const [works, setWorks] = useState<Work[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchWorks = async () => {
      const { data, error } = await supabase
        .from('works')
        .select('id,title,slug,thumbnail_url,video_url,project_type,tools')
        .eq('published', true)
        .order('order_index', { ascending: true })
        .limit(20);
      if (error) console.error('Featured works error:', error);
      else setWorks(data || []);
      setLoading(false);
    };
    fetchWorks();
  }, []);

  const filtered = filter === 'All' ? works : works.filter((w) => w.project_type === filter);

  // Auto-scroll
  useEffect(() => {
    if (filtered.length <= 1) return;
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 320;
    const step = cardWidth + 24;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const interval = setInterval(() => {
      el.scrollBy({ left: step, behavior: 'smooth' });
      if (el.scrollLeft >= maxScroll - 10) el.scrollTo({ left: 0, behavior: 'smooth' });
    }, 3500);
    return () => clearInterval(interval);
  }, [filtered.length]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -344 : 344, behavior: 'smooth' });
  };

  if (loading) return null;

  return (
    <section id="featured-works" className="relative py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Featured Works
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Reels, Shorts, thumbnails & more — handpicked for you.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2 ${
                filter === f
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-white/10 p-2 text-slate-600 dark:text-slate-400 hover:text-brand-500 transition-colors hidden md:flex items-center justify-center"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-white/10 p-2 text-slate-600 dark:text-slate-400 hover:text-brand-500 transition-colors hidden md:flex items-center justify-center"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 scroll-smooth"
          >
            {filtered.map((work) => (
              <Link
                key={work.id}
                href={`/portfolio/${work.slug}`}
                className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start group"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative aspect-video overflow-hidden rounded-2xl bg-slate-800 border border-white/10 shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  {work.video_url && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                      <span className="rounded-full bg-white/20 p-3 group-hover:bg-brand-500/90 transition-colors">
                        <Play className="h-8 w-8 text-white fill-white" />
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <span className="text-xs text-white/80">{work.project_type}</span>
                    <h3 className="text-lg font-semibold text-white line-clamp-1">{work.title}</h3>
                    {work.tools?.length > 0 && (
                      <p className="text-xs text-slate-300 line-clamp-1">{work.tools.join(' · ')}</p>
                    )}
                  </div>
                  {work.video_url ? (
                    <video
                      src={work.video_url}
                      className="absolute inset-0 w-full h-full object-cover"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                  ) : work.thumbnail_url ? (
                    <img
                      src={work.thumbnail_url}
                      alt={work.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-700 flex items-center justify-center">
                      <Play className="h-12 w-12 text-slate-500" />
                    </div>
                  )}
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/portfolio" className="text-brand-500 font-semibold hover:underline">
            View all works →
          </Link>
        </div>
      </div>
    </section>
  );
}
