'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Calendar, Send } from 'lucide-react';

type FormData = {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budgetRange: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
};

const PROJECT_TYPES = ['Reels / Shorts', 'Promo Video', 'Motion Graphics', 'Ad Campaign', 'Other'];
const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];
const BUDGET_RANGES = ['Under $1k', '$1k – $5k', '$5k – $10k', '$10k+', 'Not sure yet'];

export default function BookMeetingPage() {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          projectType: data.projectType,
          budgetRange: data.budgetRange || null,
          preferredDate: data.preferredDate || null,
          preferredTime: data.preferredTime || null,
          message: data.message || null,
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      toast.success('Meeting request sent! We\'ll confirm via email shortly.');
      reset();
    } catch {
      toast.error('Something went wrong. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-slate-900/30">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Book a Meeting</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Tell us about your project and we&apos;ll get back within 24 hours.</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl border border-white/10 bg-white dark:bg-slate-800/50 backdrop-blur-xl p-6 sm:p-8 shadow-glass"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name *</label>
              <input
                {...register('name', { required: 'Required' })}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                placeholder="Your name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
              <input
                type="email"
                {...register('email', { required: 'Required' })}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                placeholder="you@company.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone (optional)</label>
            <input
              type="tel"
              {...register('phone')}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              placeholder="+1 234 567 8900"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project type *</label>
            <select
              {...register('projectType', { required: 'Required' })}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
              <option value="">Select...</option>
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.projectType && <p className="mt-1 text-sm text-red-500">{errors.projectType.message}</p>}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Budget range</label>
            <div className="flex flex-wrap gap-2">
              {BUDGET_RANGES.map((b) => (
                <label key={b} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" {...register('budgetRange')} value={b} className="rounded-full border-brand-500 text-brand-500 focus:ring-brand-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{b}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preferred date</label>
              <input
                type="date"
                {...register('preferredDate')}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time slot</label>
              <select
                {...register('preferredTime')}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              >
                <option value="">Select...</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message / brief (optional)</label>
            <textarea
              {...register('message')}
              rows={4}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 text-slate-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              placeholder="Tell us about your project, goals, or references..."
            />
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3.5 font-semibold text-white shadow-glow hover:bg-brand-400 disabled:opacity-50 transition-all"
            >
              {submitting ? 'Sending...' : (
                <>
                  <Send className="h-5 w-5" />
                  Send meeting request
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
