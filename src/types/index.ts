export type { Database, Section, Work, Review, TeamMember, Meeting, SiteSetting } from './database';

export interface SiteConfig {
  agencyName: string;
  logoUrl: string | null;
  whatsapp: string;
  email: string;
  socialLinks: Record<string, string>;
  darkModeDefault: boolean;
  seoTitle: string;
  seoDescription: string;
  ogImage: string | null;
  favicon: string | null;
  primaryColor: string;
}
