'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { buildSettingsFromRows, type SiteSettings, DEFAULTS } from '@/lib/site-settings';

const SiteSettingsContext = createContext<SiteSettings | null>(null);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase.from('site_settings').select('key, value');
      if (error) {
        setSettings(DEFAULTS);
        return;
      }
      const rows = (data ?? []) as { key: string; value: unknown }[];
      setSettings(buildSettingsFromRows(rows));
    };
    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettings {
  const ctx = useContext(SiteSettingsContext);
  return ctx ?? DEFAULTS;
}
