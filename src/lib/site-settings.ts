'use client';

/** Keys stored in site_settings. socialLinks is JSON: { youtube, facebook, instagram, twitter, linkedin, whatsapp }. */
export interface SiteSettings {
  agencyName: string;
  websiteUrl: string;
  logoUrl: string | null;
  email: string;
  whatsapp: string;
  contactPhone: string;
  seoTitle: string;
  seoDescription: string;
  darkModeDefault: boolean;
  heroVideoUrl: string | null;
  heroHeadline: string;
  heroSubtext: string;
  socialLinks: {
    youtube?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    whatsapp?: string;
  };
}

const DEFAULTS: SiteSettings = {
  agencyName: 'ShowOffs Media',
  websiteUrl: '',
  logoUrl: null,
  email: 'hello@showoffsmedia.com',
  whatsapp: '',
  contactPhone: '',
  seoTitle: 'ShowOffs Media — We Make Brands Stand Out',
  seoDescription: 'Premium video production, Reels, Shorts & motion graphics.',
  darkModeDefault: true,
  heroVideoUrl: null,
  heroHeadline: 'We Make Brands Stand Out',
  heroSubtext: 'Premium video production, Reels, Shorts & motion graphics that get seen.',
  socialLinks: {},
};

function parseValue(key: string, value: unknown): string | boolean | Record<string, string> | null {
  if (value === null || value === undefined) return null;
  if (key === 'darkModeDefault') return Boolean(value);
  if (key === 'socialLinks' && typeof value === 'object' && value !== null) {
    const o = value as Record<string, unknown>;
    const out: Record<string, string> = {};
    for (const k of ['youtube', 'facebook', 'instagram', 'twitter', 'linkedin', 'whatsapp']) {
      if (typeof o[k] === 'string') out[k] = o[k] as string;
    }
    return out;
  }
  return typeof value === 'string' ? value : String(value);
}

export function buildSettingsFromRows(rows: { key: string; value: unknown }[]): SiteSettings {
  const map: Record<string, unknown> = {};
  for (const row of rows) map[row.key] = row.value;
  return {
    agencyName: (parseValue('agencyName', map.agencyName) as string) ?? DEFAULTS.agencyName,
    websiteUrl: (parseValue('websiteUrl', map.websiteUrl) as string) ?? DEFAULTS.websiteUrl,
    logoUrl: map.logoUrl != null && typeof map.logoUrl === 'string' ? map.logoUrl : null,
    email: (parseValue('email', map.email) as string) ?? DEFAULTS.email,
    whatsapp: (parseValue('whatsapp', map.whatsapp) as string) ?? DEFAULTS.whatsapp,
    contactPhone: (parseValue('contactPhone', map.contactPhone) as string) ?? DEFAULTS.contactPhone,
    seoTitle: (parseValue('seoTitle', map.seoTitle) as string) ?? DEFAULTS.seoTitle,
    seoDescription: (parseValue('seoDescription', map.seoDescription) as string) ?? DEFAULTS.seoDescription,
    darkModeDefault: (parseValue('darkModeDefault', map.darkModeDefault) as boolean) ?? DEFAULTS.darkModeDefault,
    heroVideoUrl: map.heroVideoUrl != null && typeof map.heroVideoUrl === 'string' ? map.heroVideoUrl : null,
    heroHeadline: (parseValue('heroHeadline', map.heroHeadline) as string) ?? DEFAULTS.heroHeadline,
    heroSubtext: (parseValue('heroSubtext', map.heroSubtext) as string) ?? DEFAULTS.heroSubtext,
    socialLinks: (parseValue('socialLinks', map.socialLinks) as Record<string, string>) ?? DEFAULTS.socialLinks,
  };
}

export { DEFAULTS };
