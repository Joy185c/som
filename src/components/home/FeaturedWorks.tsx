'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Work = {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  project_type: string;
  tools: string[];
};

const FILTERS = ['All', 'Reels', 'Shorts', 'Promo', 'Motion Graphics'];

export function FeaturedWorks() {
  const [works, setWorks] = useState<Work[]>([]);
  const [filter, setFilter] = useState('All');
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Supabase fetch
  useEffect(() => {
    const fetchFeaturedWorks = async () => {
      const { data, error } = await supabase
        .from('works')
        .select('id,title,slug,thumbnail_url,project_type,tools')
        .eq('published', true)
        .order('order_index', { ascending: true })
        .limit(8); // featured slider items

      if (error) {
        console.error('Featured works error:', error);
      } else {
        setWorks(data || []);
      }

      setLoading(false);
    };

    fetchFeaturedWorks();
  }, []);

  const filtered =
    filter === 'All'
      ? works
      : works.filter((w) => w.project_type === filter);

  const current =
    filtered.length > 0
      ? filtered[index % filtered.length]
      : null;

  if (loading || !current) return null;

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
            Our best projects, handpicked for you.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setIndex(0);
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center gap-4">

            <button
              onClick={() =>
                setIndex((i) => (i - 1 + filtered.length) % filtered.length)
              }
              className="rounded-full p-2 bg-white/10 text-white"
            >
              <ChevronLeft />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <Link href={`/portfolio/${current.slug}`}>
                  <div className="group relative aspect-video overflow-hidden rounded-2xl bg-slate-800">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />

                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <span className="rounded-full bg-white/20 p-4 group-hover:bg-brand-500/90">
                        <Play className="h-10 w-10 text-white fill-white" />
                      </span>
                    </div>

                    <div className="absolute bottom-0 p-6 z-20">
                      <span className="text-xs text-white">
                        {current.project_type}
                      </span>
                      <h3 className="text-xl font-semibold text-white">
                        {current.title}
                      </h3>
                      {current.tools?.length > 0 && (
                        <p className="text-sm text-slate-300">
                          {current.tools.join(' · ')}
                        </p>
                      )}
                    </div>

                    {current.thumbnail_url && (
                      <img
                        src={current.thumbnail_url}
                        alt={current.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={() =>
                setIndex((i) => (i + 1) % filtered.length)
              }
              className="rounded-full p-2 bg-white/10 text-white"
            >
              <ChevronRight />
            </button>

          </div>

          <div className="mt-6 text-center">
            <Link href="/portfolio" className="text-brand-500 font-semibold">
              View all works →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
