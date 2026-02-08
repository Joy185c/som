'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Film, Wrench } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Work = {
  title: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  project_type: string;
  tools: string[];
  tags: string[];
};

export default function SingleWorkPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWork = async () => {
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error || !data) {
        notFound();
      } else {
        setWork(data);
      }
      setLoading(false);
    };

    fetchWork();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!work) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-slate-900/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-brand-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to portfolio
          </Link>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white dark:bg-slate-800/50 overflow-hidden shadow-xl"
        >
          <div className="relative aspect-video bg-slate-900">
            {work.video_url ? (
              <video
                src={work.video_url}
                controls
                className="w-full h-full object-contain"
                poster={work.thumbnail_url ?? undefined}
              />
            ) : work.thumbnail_url ? (
              <img
                src={work.thumbnail_url}
                alt={work.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                <Film className="h-20 w-20" />
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8">
            <span className="inline-block rounded-full bg-brand-500/20 px-3 py-1 text-sm font-medium text-brand-400">
              {work.project_type}
            </span>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              {work.title}
            </h1>

            {work.description && (
              <div className="mt-6 prose prose-slate dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {work.description}
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-6 border-t border-white/10 pt-6">
              {work.tools?.length > 0 && (
                <div className="flex items-start gap-2">
                  <Wrench className="h-5 w-5 text-brand-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tools</p>
                    <p className="text-slate-700 dark:text-slate-300">{work.tools.join(', ')}</p>
                  </div>
                </div>
              )}
              {work.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {work.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-200 dark:bg-white/10 px-3 py-1 text-sm text-slate-600 dark:text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
