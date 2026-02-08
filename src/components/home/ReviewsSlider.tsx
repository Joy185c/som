'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Review = {
  id: string;
  client_name: string;
  content: string;
  rating: number;
  project_type: string | null;
};

const DEMO_REVIEWS: Review[] = [
  { id: '1', client_name: 'Sarah K.', content: 'ShowOffs delivered beyond expectations. Our Reels engagement tripled.', rating: 5, project_type: 'Reels' },
  { id: '2', client_name: 'James L.', content: 'Professional, creative, and on time. Will definitely work with them again.', rating: 5, project_type: 'Promo' },
  { id: '3', client_name: 'Emma R.', content: 'The motion graphics they created elevated our product launch. Stunning work.', rating: 5, project_type: 'Motion Graphics' },
  { id: '4', client_name: 'Mike T.', content: 'Best video agency we have worked with. Clear communication and premium output.', rating: 5, project_type: 'Shorts' },
];

export function ReviewsSlider() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, client_name, content, rating, project_type')
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(20);
      if (!error && data?.length) setReviews(data);
      else setReviews(DEMO_REVIEWS);
    };
    fetchReviews();
  }, []);

  const list = reviews.length > 0 ? reviews : DEMO_REVIEWS;

  // Auto-scroll: shift by one card every 4s
  useEffect(() => {
    if (list.length <= 1) return;
    const el = scrollRef.current;
    if (!el) return;
    const step = 320; // card width + gap
    const maxScroll = el.scrollWidth - el.clientWidth;
    const interval = setInterval(() => {
      el.scrollBy({ left: step, behavior: 'smooth' });
      if (el.scrollLeft >= maxScroll - 10) el.scrollTo({ left: 0, behavior: 'smooth' });
    }, 4000);
    return () => clearInterval(interval);
  }, [list.length]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const step = 320;
    el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-slate-900 dark:bg-slate-950 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">What Clients Say</h2>
          <p className="mt-2 text-slate-400">Trusted by brands worldwide.</p>
        </motion.div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 hover:bg-white/20 p-2 text-white transition-colors hidden md:flex items-center justify-center"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 hover:bg-white/20 p-2 text-white transition-colors hidden md:flex items-center justify-center"
            aria-label="Next reviews"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 scroll-smooth"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {list.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-[300px] sm:w-[320px] snap-start rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-glass"
              >
                <Quote className="h-8 w-8 text-brand-500/50 mb-3" />
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm line-clamp-4">&ldquo;{review.content}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-500/30 flex items-center justify-center text-sm font-bold text-white">
                    {review.client_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{review.client_name}</p>
                    <p className="text-xs text-slate-500">{review.project_type ?? 'Client'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center">
          <Link href="/reviews" className="text-brand-400 font-semibold hover:underline">View all reviews & submit yours →</Link>
        </p>
      </div>
    </section>
  );
}
