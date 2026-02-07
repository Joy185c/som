'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiGet, apiMutate } from '@/lib/admin-api';

type Settings = {
  agencyName: string | null;
  email: string | null;
  whatsapp: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  darkModeDefault: boolean | null;
  logoUrl: string | null;
  socialLinks: Record<string, string> | null;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    agencyName: 'ShowOffs Media',
    email: 'hello@showoffsmedia.com',
    whatsapp: '',
    seoTitle: 'ShowOffs Media — We Make Brands Stand Out',
    seoDescription: 'Premium video production, Reels, Shorts & motion graphics.',
    darkModeDefault: true,
    logoUrl: null,
    socialLinks: {},
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await apiGet<Settings>('/api/admin/settings');
      setSettings({
        agencyName: data.agencyName ?? 'ShowOffs Media',
        email: data.email ?? 'hello@showoffsmedia.com',
        whatsapp: data.whatsapp ?? '',
        seoTitle: data.seoTitle ?? 'ShowOffs Media — We Make Brands Stand Out',
        seoDescription: data.seoDescription ?? 'Premium video production, Reels, Shorts & motion graphics.',
        darkModeDefault: data.darkModeDefault ?? true,
        logoUrl: data.logoUrl ?? null,
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
        agencyName: settings.agencyName,
        email: settings.email,
        whatsapp: settings.whatsapp,
        seoTitle: settings.seoTitle,
        seoDescription: settings.seoDescription,
        darkModeDefault: settings.darkModeDefault,
        logoUrl: settings.logoUrl,
        socialLinks: settings.socialLinks,
      });
      toast.success('Settings saved');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
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
      <p className="mt-1 text-slate-400">Logo, agency name, WhatsApp, email, SEO, dark/light default.</p>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="mt-8 max-w-xl space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Agency name</label>
          <input
            type="text"
            value={settings.agencyName ?? ''}
            onChange={(e) => setSettings({ ...settings, agencyName: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
          <input
            type="email"
            value={settings.email ?? ''}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">WhatsApp number</label>
          <input
            type="tel"
            value={settings.whatsapp ?? ''}
            onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
            placeholder="+1234567890"
            className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">SEO title</label>
          <input
            type="text"
            value={settings.seoTitle ?? ''}
            onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Meta description</label>
          <textarea
            rows={2}
            value={settings.seoDescription ?? ''}
            onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
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
          <label htmlFor="dark-default" className="text-sm text-slate-400">Default to dark mode</label>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Logo URL</label>
          <input
            type="url"
            value={settings.logoUrl ?? ''}
            onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value || null })}
            placeholder="https://..."
            className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 font-semibold text-white hover:bg-brand-400 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          Save settings
        </button>
      </motion.form>
    </div>
  );
}
