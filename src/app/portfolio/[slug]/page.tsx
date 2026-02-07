'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Share2, Calendar } from 'lucide-react';

const DEMO_WORK = {
  title: 'Brand Reel 2024',
  description: 'A high-energy brand reel for a global tech launch. Shot and edited in-house with motion graphics.',
  client: 'Confidential',
  tools: ['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
  projectType: 'Reels',
  slug: 'brand-reel-2024',
};

const RELATED = [
  { title: 'Product Short', slug: 'product-short', type: 'Shorts' },
  { title: 'Motion Promo', slug: 'motion-promo', type: 'Promo' },
  { title: 'Social Series', slug: 'social-series', type: 'Reels' },
];

export default function SingleWorkPage() {
  const params = useParams();
  const slug = (params?.slug as string) || DEMO_WORK.slug;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/portfolio" className="text-sm text-slate-500 hover:text-white">← Portfolio</Link>
        </motion.div>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative aspect-video w-full max-w-5xl mx-auto rounded-2xl overflow-hidden bg-slate-800 border border-white/10 mb-10"
        >
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <button type="button" className="rounded-full bg-white/20 p-6 backdrop-blur-sm hover:bg-brand-500/90 transition-colors">
              <Play className="h-14 w-14 text-white fill-white" />
            </button>
          </div>
          <div className="aspect-video bg-slate-700" />
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row md:items-start md:justify-between gap-6"
        >
          <div>
            <span className="text-brand-400 font-medium">{DEMO_WORK.projectType}</span>
            <h1 className="text-3xl font-bold text-white mt-1">{DEMO_WORK.title}</h1>
            <p className="mt-4 text-slate-400 max-w-2xl">{DEMO_WORK.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {DEMO_WORK.tools.map((t) => (
                <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-300">{t}</span>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-500">Client: {DEMO_WORK.client}</p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <Link
              href="/book-meeting"
              className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 font-semibold text-white hover:bg-brand-400 transition-colors"
            >
              <Calendar className="h-5 w-5" />
              Hire us for similar work
            </Link>
            <button type="button" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-white hover:bg-white/10 transition-colors">
              <Share2 className="h-5 w-5" />
              Share
            </button>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-20"
        >
          <h2 className="text-xl font-bold text-white mb-6">Related projects</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {RELATED.map((r) => (
              <Link key={r.slug} href={`/portfolio/${r.slug}`}>
                <div className="rounded-xl border border-white/10 bg-slate-800/50 overflow-hidden hover:border-white/20 transition-colors">
                  <div className="aspect-video bg-slate-700" />
                  <div className="p-4">
                    <span className="text-xs text-brand-400">{r.type}</span>
                    <p className="font-medium text-white">{r.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
