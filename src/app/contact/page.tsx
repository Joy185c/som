'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, MessageCircle, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-slate-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Contact Us</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Reach out — we&apos;d love to hear from you.</p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <a
              href="mailto:hello@showoffsmedia.com"
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white dark:bg-slate-800/50 p-6 transition-all hover:border-brand-500/50 hover:shadow-glow"
            >
              <span className="rounded-full bg-brand-500/20 p-3">
                <Mail className="h-6 w-6 text-brand-500" />
              </span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Email</p>
                <p className="text-slate-600 dark:text-slate-400">hello@showoffsmedia.com</p>
              </div>
            </a>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white dark:bg-slate-800/50 p-6 transition-all hover:border-green-500/50 hover:shadow-glow"
            >
              <span className="rounded-full bg-green-500/20 p-3">
                <MessageCircle className="h-6 w-6 text-green-500" />
              </span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">WhatsApp</p>
                <p className="text-slate-600 dark:text-slate-400">Chat with us</p>
              </div>
            </a>
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white dark:bg-slate-800/50 p-6">
              <span className="rounded-full bg-slate-500/20 p-3">
                <MapPin className="h-6 w-6 text-slate-500" />
              </span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Location</p>
                <p className="text-slate-600 dark:text-slate-400">Remote-first · Worldwide</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-white dark:bg-slate-800/50 p-8"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Prefer to book a call?</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Pick a time that works for you and we&apos;ll send a calendar invite.</p>
            <Link
              href="/book-meeting"
              className="inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-3 font-semibold text-white hover:bg-brand-400 transition-colors w-full"
            >
              Book a Meeting
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
