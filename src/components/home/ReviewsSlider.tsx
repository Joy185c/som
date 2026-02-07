'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const DEMO_REVIEWS = [
  { id: '1', name: 'Sarah K.', role: 'Marketing Director', content: 'ShowOffs delivered beyond expectations. Our Reels engagement tripled.', rating: 5, projectType: 'Reels' },
  { id: '2', name: 'James L.', role: 'Founder', content: 'Professional, creative, and on time. Will definitely work with them again.', rating: 5, projectType: 'Promo' },
  { id: '3', name: 'Emma R.', role: 'Brand Manager', content: 'The motion graphics they created elevated our product launch. Stunning work.', rating: 5, projectType: 'Motion Graphics' },
  { id: '4', name: 'Mike T.', role: 'CEO', content: 'Best video agency we have worked with. Clear communication and premium output.', rating: 5, projectType: 'Shorts' },
];

export function ReviewsSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % DEMO_REVIEWS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const review = DEMO_REVIEWS[index];

  return (
    <section className="py-24 bg-slate-900 dark:bg-slate-950">
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

        <motion.div
          key={review.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 sm:p-10 shadow-glass">
            <Quote className="h-10 w-10 text-brand-500/50 mb-4" />
            <div className="flex gap-1 mb-4">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-lg text-slate-300 italic">&ldquo;{review.content}&rdquo;</p>
            <div className="mt-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-brand-500/30 flex items-center justify-center text-lg font-bold text-white">
                {review.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-white">{review.name}</p>
                <p className="text-sm text-slate-500">{review.role} · {review.projectType}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-center gap-2 mt-8">
          {DEMO_REVIEWS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-8 bg-brand-500' : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>

        <p className="mt-8 text-center">
          <a href="/reviews" className="text-brand-400 font-semibold hover:underline">View all reviews →</a>
        </p>
      </div>
    </section>
  );
}
