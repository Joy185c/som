'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, Calendar, FolderOpen } from 'lucide-react';
import { useSiteSettings } from '@/components/SiteSettingsProvider';

export function HeroSection() {
  const settings = useSiteSettings();
  const headline = settings.heroHeadline || 'We Make Brands Stand Out';
  const subtext = settings.heroSubtext || 'Premium video production, Reels, Shorts & motion graphics that get seen.';
  const videoUrl = settings.heroVideoUrl && String(settings.heroVideoUrl).trim() ? settings.heroVideoUrl : null;

  const [displayText, setDisplayText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= headline.length) {
        setDisplayText(headline.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
        setInterval(() => setCursorVisible((v) => !v), 500);
      }
    }, 80);
    return () => clearInterval(timer);
  }, [headline]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 pt-14">
      {/* 3D-style animated background (always visible for depth) */}
      <div className="hero-3d-bg">
        <div className="hero-grid" aria-hidden />
      </div>

      {/* Optional hero video background — plays automatically */}
      {videoUrl && (
        <div className="absolute inset-0 z-[1]">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            aria-label="Hero background video"
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
        </div>
      )}

      {/* Gradient overlay when no video */}
      {!videoUrl && (
        <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.2),transparent_50%)]" />
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto max-w-4xl px-4 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-lg">
          <span className="block">
            {displayText}
            <span className={cursorVisible ? 'opacity-100' : 'opacity-0'}>|</span>
          </span>
        </h1>
        <p className="mt-6 text-lg text-slate-200 sm:text-xl max-w-2xl mx-auto drop-shadow-md">
          {subtext}
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/book-meeting"
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3.5 text-base font-semibold text-white shadow-glow hover:bg-brand-400 hover:shadow-glow-lg transition-all focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <Calendar className="h-5 w-5" />
            Book a Meeting
          </Link>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <FolderOpen className="h-5 w-5" />
            See Portfolio
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <a href="#featured-works" className="flex flex-col items-center gap-1 text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent rounded">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
}
