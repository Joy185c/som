'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24 bg-slate-900 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to stand out?</h2>
          <p className="mt-4 text-lg text-slate-400">Book a free discovery call. No commitment.</p>
          <Link
            href="/book-meeting"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-500 px-8 py-4 text-lg font-semibold text-white shadow-glow hover:bg-brand-400 hover:shadow-glow-lg transition-all"
          >
            <Calendar className="h-6 w-6" />
            Book a Meeting
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
