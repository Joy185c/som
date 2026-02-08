'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Upload, Film } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiGet, apiMutate, apiUpload } from '@/lib/admin-api';

type Settings = {
  agencyName: string | null;
  websiteUrl: string | null;
  email: string | null;
  whatsapp: string | null;
  contactPhone: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  darkModeDefault: boolean | null;
  logoUrl: string | null;
  heroVideoUrl: string | null;
  heroHeadline: string | null;
  heroSubtext: string | null;
  socialLinks: Record<string, string> | null;
};

const SOCIAL_KEYS = ['youtube', 'facebook', 'instagram', 'twitter', 'linkedin'] as const;

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    agencyName: 'ShowOffs Media',
    websiteUrl: '',
    email: 'hello@showoffsmedia.com',
    whatsapp: '',
    contactPhone: '',
    seoTitle: 'ShowOffs Media — We Make Brands Stand Out',
    seoDescription: 'Premium video production, Reels, Shorts & motion graphics.',
    darkModeDefault: true,
    logoUrl: null,
    heroVideoUrl: null,
    heroHeadline: 'We Make Brands Stand Out',
    heroSubtext: 'Premium video production, Reels, Shorts & motion graphics that get seen.',
    socialLinks: {},
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  const load = async () => {
    try {
      const data = await apiGet<Settings>('/api/admin/settings');
      setSettings({
        agencyName: data.agencyName ?? 'ShowOffs Media',
        websiteUrl: data.websiteUrl ?? '',
        email: data.email ?? 'hello@showoffsmedia.com',
        whatsapp: data.whatsapp ?? '',
        contactPhone: data.contactPhone ?? '',
        seoTitle: data.seoTitle ?? 'ShowOffs Media — We Make Brands Stand Out',
        seoDescription: data.seoDescription ?? 'Premium video production, Reels, Shorts & motion graphics.',
        darkModeDefault: data.darkModeDefault ?? true,
        logoUrl: data.logoUrl ?? null,
        heroVideoUrl: data.heroVideoUrl ?? null,
        heroHeadline: data.heroHeadline ?? 'We Make Brands Stand Out',
        heroSubtext: data.heroSubtext ?? 'Premium video production, Reels, Shorts & motion graphics that get seen.',
        socialLinks: data.socialLinks ?? {},
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiMutate('/api/admin/settings', 'PUT', {
        agencyName: settings.agencyName ?? '',
        websiteUrl: settings.websiteUrl ?? '',
        email: settings.email ?? '',
        whatsapp: settings.whatsapp ?? '',
        contactPhone: settings.contactPhone ?? '',
        seoTitle: settings.seoTitle ?? '',
        seoDescription: settings.seoDescription ?? '',
        darkModeDefault: settings.darkModeDefault ?? true,
        logoUrl: settings.logoUrl ?? '',
        heroVideoUrl: settings.heroVideoUrl ?? '',
        heroHeadline: settings.heroHeadline ?? '',
        heroSubtext: settings.heroSubtext ?? '',
        socialLinks: settings.socialLinks ?? {},
      });
      toast.success('Settings saved — changes reflect across the site.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const setSocial = (key: string, value: string) => {
    setSettings((s) => {
      const next: Record<string, string> = { ...(s.socialLinks ?? {}) };
      if (value) next[key] = value;
      else delete next[key];
      return { ...s, socialLinks: next };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading settings...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Site Settings</h1>
      <p className="mt-1 text-slate-400">Agency info, links, hero video, and social — all update across the site.</p>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="mt-8 max-w-2xl space-y-8"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Brand & Contact</h2>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Agency name</label>
            <input
              type="text"
              value={settings.agencyName ?? ''}
              onChange={(e) => setSettings({ ...settings, agencyName: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Website URL</label>
            <input
              type="url"
              value={settings.websiteUrl ?? ''}
              onChange={(e) => setSettings({ ...settings, websiteUrl: e.target.value })}
              placeholder="https://yoursite.com"
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Logo URL</label>
            <input
              type="url"
              value={settings.logoUrl ?? ''}
              onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value || '' })}
              placeholder="https://..."
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={settings.email ?? ''}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">WhatsApp number</label>
            <input
              type="tel"
              value={settings.whatsapp ?? ''}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              placeholder="+1234567890"
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Contact phone (optional)</label>
            <input
              type="tel"
              value={settings.contactPhone ?? ''}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              placeholder="+1234567890"
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Hero section (home page)</h2>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Hero video (plays automatically on home)</label>
            <p className="text-xs text-slate-500 mb-2">Upload a video file or paste a URL. No external link required — upload is stored on your storage.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={settings.heroVideoUrl ?? ''}
                onChange={(e) => setSettings({ ...settings, heroVideoUrl: e.target.value || '' })}
                placeholder="Or paste video URL..."
                className="flex-1 rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50"
              />
              <label className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 cursor-pointer hover:bg-slate-700 hover:text-white transition-colors">
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg"
                  className="hidden"
                  disabled={uploadingHero}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingHero(true);
                    try {
                      const { url } = await apiUpload(file, 'hero');
                      setSettings((s) => ({ ...s, heroVideoUrl: url }));
                      toast.success('Hero video uploaded. Click Save to apply.');
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : 'Upload failed');
                    } finally {
                      setUploadingHero(false);
                      e.target.value = '';
                    }
                  }}
                />
                {uploadingHero ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploadingHero ? 'Uploading...' : 'Upload video'}
              </label>
            </div>
            {(settings.heroVideoUrl ?? '') && (
              <p className="mt-1 text-xs text-green-400 flex items-center gap-1">
                <Film className="h-3 w-3" /> Hero video set — will play on homepage.
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Hero headline</label>
            <input
              type="text"
              value={settings.heroHeadline ?? ''}
              onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Hero subtext</label>
            <input
              type="text"
              value={settings.heroSubtext ?? ''}
              onChange={(e) => setSettings({ ...settings, heroSubtext: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Social media links</h2>
          {SOCIAL_KEYS.map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-300 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)} URL</label>
              <input
                type="url"
                value={settings.socialLinks?.[key] ?? ''}
                onChange={(e) => setSocial(key, e.target.value)}
                placeholder={`https://${key}.com/...`}
                className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50"
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2">SEO & appearance</h2>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">SEO title</label>
            <input
              type="text"
              value={settings.seoTitle ?? ''}
              onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Meta description</label>
            <textarea
              rows={2}
              value={settings.seoDescription ?? ''}
              onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="dark-default"
              checked={settings.darkModeDefault ?? true}
              onChange={(e) => setSettings({ ...settings, darkModeDefault: e.target.checked })}
              className="rounded border-white/20 text-brand-500 focus:ring-brand-500"
            />
            <label htmlFor="dark-default" className="text-sm text-slate-400">Default to dark mode for new visitors</label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 font-semibold text-white hover:bg-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          Save settings
        </button>
      </motion.form>
    </div>
  );
}
