'use client';

import Link from 'next/link';
import { Mail, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-900/50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-bold text-white">
              ShowOffs <span className="text-brand-400">Media</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-slate-400">
              We make brands stand out with premium video, Reels, Shorts, and motion graphics.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {['/portfolio', '/team', '/reviews', '/contact', '/book-meeting'].map((path) => (
                <li key={path}>
                  <Link href={path} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {path === '/' ? 'Home' : path.slice(1).replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Contact</h3>
            <div className="mt-4 flex flex-col gap-3">
              <a href="mailto:hello@showoffsmedia.com" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                <Mail className="h-4 w-4" /> hello@showoffsmedia.com
              </a>
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} ShowOffs Media. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
