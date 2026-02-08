'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, MessageCircle, MapPin, Youtube, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { useSiteSettings } from '@/components/SiteSettingsProvider';

export default function ContactPage() {
  const settings = useSiteSettings();
  const email = settings.email || 'hello@showoffsmedia.com';
  const whatsapp = settings.whatsapp || '';
  const whatsappUrl = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, '')}` : (settings.socialLinks?.whatsapp || '');
  const social = settings.socialLinks || {};

  const socialLinks = [
    { key: 'youtube', href: social.youtube, icon: Youtube, label: 'YouTube' },
    { key: 'facebook', href: social.facebook, icon: Facebook, label: 'Facebook' },
    { key: 'instagram', href: social.instagram, icon: Instagram, label: 'Instagram' },
    { key: 'twitter', href: social.twitter, icon: Twitter, label: 'Twitter' },
    { key: 'linkedin', href: social.linkedin, icon: Linkedin, label: 'LinkedIn' },
  ].filter((s) => s.href && String(s.href).startsWith('http'));

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
              href={`mailto:${email}`}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white dark:bg-slate-800/50 p-6 transition-all hover:border-brand-500/50 hover:shadow-glow"
            >
              <span className="rounded-full bg-brand-500/20 p-3">
                <Mail className="h-6 w-6 text-brand-500" />
              </span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Email</p>
                <p className="text-slate-600 dark:text-slate-400">{email}</p>
              </div>
            </a>
            {(whatsappUrl || social.whatsapp) && (
              <a
                href={whatsappUrl || social.whatsapp}
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
            )}
            {socialLinks.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white dark:bg-slate-800/50 p-6">
                <p className="font-semibold text-slate-900 dark:text-white mb-4">Follow us</p>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map(({ key, href, icon: Icon, label }) => (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-white/10 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-brand-500/20 hover:text-brand-500 transition-colors"
                    >
                      <Icon className="h-5 w-5" /> {label}
                    </a>
                  ))}
                </div>
              </div>
            )}
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
