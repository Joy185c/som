'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

export function StickyCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 }}
      className="fixed bottom-6 right-6 z-40 md:bottom-8 md:right-8"
    >
      <Link
        href="/book-meeting"
        className="group flex items-center gap-2 rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-glow hover:bg-brand-400 hover:shadow-glow-lg transition-all duration-300"
      >
        <Calendar className="h-5 w-5" />
        <span>Book a Meeting</span>
      </Link>
    </motion.div>
  );
}
