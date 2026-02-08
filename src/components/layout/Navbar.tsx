'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useTheme, type ThemeId } from '@/components/ThemeProvider';
import { useSiteSettings } from '@/components/SiteSettingsProvider';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/team', label: 'Team' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/contact', label: 'Contact' },
  { href: '/book-meeting', label: 'Book a Meeting' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const settings = useSiteSettings();

  const displayName = settings.agencyName || 'ShowOffs Media';

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-sm"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
          {settings.logoUrl ? (
            <span className="relative h-9 w-9 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={settings.logoUrl} alt="" fill className="object-contain" unoptimized sizes="36px" />
            </span>
          ) : null}
          <span>{displayName.includes(' ') ? displayName.split(' ')[0] : displayName}</span>
          {displayName.includes(' ') && (
            <span className="text-brand-400">{displayName.split(' ').slice(1).join(' ')}</span>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors focus:outline-none focus:text-white rounded px-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeSwitcher theme={theme} setTheme={setTheme} />
          <Link
            href="/book-meeting"
            className="hidden md:inline-flex items-center justify-center rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:bg-brand-400 transition-all"
          >
            Book a Meeting
          </Link>
          <button
            type="button"
            className="md:hidden rounded-lg p-2 text-white hover:bg-white/10"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="ml-auto flex h-full w-72 flex-col border-l border-white/10 bg-slate-900/98 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-white">{displayName}</span>
                <button type="button" onClick={() => setOpen(false)} className="p-2 text-slate-400 hover:text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-slate-300 hover:text-white py-2"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/book-meeting"
                  onClick={() => setOpen(false)}
                  className="mt-4 rounded-full bg-brand-500 px-5 py-3 text-center font-semibold text-white"
                >
                  Book a Meeting
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function ThemeSwitcher({ theme, setTheme }: { theme: ThemeId; setTheme: (id: ThemeId) => void }) {
  const [open, setOpen] = useState(false);
  const themes: { id: ThemeId; label: string }[] = [
    { id: 'light', label: 'Light' },
    { id: 'dark', label: 'Dark' },
    { id: 'brand', label: 'Brand' },
    { id: 'purple', label: 'Purple' },
  ];
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
        aria-label="Theme"
      >
        <span className="w-5 h-5 rounded-full bg-current border border-white/20" style={{ backgroundColor: theme === 'dark' ? '#1e293b' : theme === 'light' ? '#f8fafc' : theme === 'brand' ? '#0ea5e9' : '#7c3aed' }} />
        <span className="text-xs capitalize hidden sm:inline">{themes.find((t) => t.id === theme)?.label ?? theme}</span>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute right-0 top-full mt-1 z-50 rounded-xl border border-white/10 bg-slate-900 py-2 min-w-[120px] shadow-xl"
            >
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { setTheme(t.id); setOpen(false); }}
                  className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-white/10 ${theme === t.id ? 'text-brand-400' : 'text-slate-300'}`}
                >
                  <span className="w-3 h-3 rounded-full border border-white/30" style={{ backgroundColor: t.id === 'dark' ? '#1e293b' : t.id === 'light' ? '#f8fafc' : t.id === 'brand' ? '#0ea5e9' : '#7c3aed' }} />
                  {t.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
