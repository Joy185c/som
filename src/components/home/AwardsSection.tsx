'use client';

import { motion } from 'framer-motion';

const LOGOS = ['Client A', 'Client B', 'Featured Press', 'Award 2024', 'Partner X'];

export function AwardsSection() {
  return (
    <section className="py-16 border-t border-white/10 bg-slate-950/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm uppercase tracking-widest text-slate-500 mb-8"
        >
          Featured in & Awards
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-12 opacity-80"
        >
          {LOGOS.map((name, i) => (
            <div
              key={name}
              className="h-10 w-32 rounded bg-white/10 flex items-center justify-center text-slate-500 text-sm font-medium"
            >
              {name}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
