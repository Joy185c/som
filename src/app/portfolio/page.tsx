'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Work = {
  id: string;
  title: string;
  slug: string;
  project_type: string;
  thumbnail_url: string | null;
  video_url: string | null;
  description: string | null;
  tools: string[];
};

export default function PortfolioPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorks = async () => {
      const { data, error } = await supabase
        .from('works')
        .select('id,title,slug,project_type,thumbnail_url,video_url,description,tools')
        .eq('published', true)
        .order('order_index', { ascending: true });

      if (error) console.error(error);
      else setWorks(data || []);
      setLoading(false);
    };
    fetchWorks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <p className="text-slate-500">Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-slate-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Portfolio</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Reels, Shorts, promos, thumbnails & motion graphics.
          </p>
        </motion.div>

        {works.length === 0 ? (
          <p className="text-center text-slate-500 py-12">No works published yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {works.map((work, i) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/portfolio/${work.slug}`} className="group block">
                  <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-800 border border-white/10 shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                    {work.video_url ? (
                      <>
                        <video
                          src={work.video_url}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          muted
                          loop
                          autoPlay
                          playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                          <span className="rounded-full bg-white/20 p-4 group-hover:bg-brand-500/90 transition-colors">
                            <Play className="h-10 w-10 text-white fill-white" />
                          </span>
                        </div>
                      </>
                    ) : work.thumbnail_url ? (
                      <img
                        src={work.thumbnail_url}
                        alt={work.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-16 w-16 text-slate-600" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                      <span className="text-xs font-medium text-white/90">{work.project_type}</span>
                      <h2 className="text-xl font-semibold text-white mt-1 line-clamp-1">{work.title}</h2>
                      {work.tools?.length > 0 && (
                        <p className="text-sm text-slate-300 mt-1 line-clamp-1">{work.tools.join(' · ')}</p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
