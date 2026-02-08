'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, MessageCircle, Youtube, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { useSiteSettings } from '@/components/SiteSettingsProvider';

export function Footer() {
  const settings = useSiteSettings();
  const displayName = settings.agencyName || 'ShowOffs Media';
  const email = settings.email || 'hello@showoffsmedia.com';
  const whatsapp = settings.whatsapp || '';
  const social = settings.socialLinks || {};
  const whatsappUrl = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, '')}` : social.whatsapp || '';

  const quickPaths = [
    { path: '/', label: 'Home' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/team', label: 'Team' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/contact', label: 'Contact' },
    { path: '/book-meeting', label: 'Book a Meeting' },
  ];

  const socialLinks = [
    { key: 'youtube', href: social.youtube, icon: Youtube, label: 'YouTube' },
    { key: 'facebook', href: social.facebook, icon: Facebook, label: 'Facebook' },
    { key: 'instagram', href: social.instagram, icon: Instagram, label: 'Instagram' },
    { key: 'twitter', href: social.twitter, icon: Twitter, label: 'Twitter' },
    { key: 'linkedin', href: social.linkedin, icon: Linkedin, label: 'LinkedIn' },
  ];

  return (
    <footer className="border-t border-white/10 bg-gradient-to-b from-slate-900/60 to-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
              {settings.logoUrl ? (
                <span className="relative h-8 w-8 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={settings.logoUrl} alt="" fill className="object-contain" unoptimized sizes="32px" />
                </span>
              ) : null}
              {displayName}
            </Link>
            <p className="mt-3 max-w-sm text-sm text-slate-400">
              We make brands stand out with premium video, Reels, Shorts, and motion graphics.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {socialLinks.filter((s) => s.href && s.href.startsWith('http')).map(({ key, href, icon: Icon, label }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-2.5 bg-white/10 text-slate-400 hover:text-white hover:bg-brand-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  aria-label={`${label} (opens in new tab)`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {quickPaths.map(({ path, label }) => (
                <li key={path}>
                  <Link href={path} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Contact</h3>
            <div className="mt-4 flex flex-col gap-3">
              <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <Mail className="h-4 w-4 flex-shrink-0" /> {email}
              </a>
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                  <MessageCircle className="h-4 w-4 flex-shrink-0" /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} {displayName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
