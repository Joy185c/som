import { NextResponse } from 'next/server';
import { requireAdmin } from '../auth-helper';

const DEFAULT_KEYS = [
  'agencyName',
  'websiteUrl',
  'logoUrl',
  'email',
  'whatsapp',
  'contactPhone',
  'seoTitle',
  'seoDescription',
  'darkModeDefault',
  'heroVideoUrl',
  'heroHeadline',
  'heroSubtext',
  'ogImage',
  'favicon',
  'socialLinks',
];

export async function GET(request: Request) {
  const result = await requireAdmin(request);
  if (result instanceof NextResponse) return result;
  const { db } = result;
  const { data: rows, error } = await db.from('site_settings').select('key, value');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const settings: Record<string, unknown> = {};
  for (const k of DEFAULT_KEYS) {
    settings[k] = null;
  }
  const settingsRows = (rows ?? []) as { key: string; value: unknown }[];
  for (const row of settingsRows) {
    settings[row.key] = row.value;
  }
  return NextResponse.json(settings);
}

/** Normalize value so we never send null (site_settings.value is NOT NULL). */
function normalizeValue(key: string, value: unknown): string | number | boolean | Record<string, unknown> {
  if (value === null || value === undefined) {
    if (key === 'socialLinks') return {};
    if (key === 'darkModeDefault') return false;
    return '';
  }
  if (key === 'socialLinks') {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) return value as Record<string, unknown>;
    return {};
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
  return String(value);
}

export async function PUT(request: Request) {
  const result = await requireAdmin(request);
  if (result instanceof NextResponse) return result;
  const { db } = result;
  const body = await request.json();
  for (const key of Object.keys(body)) {
    const value = normalizeValue(key, body[key]);
    const { error } = await db
      .from('site_settings')
      // @ts-expect-error Supabase client generic inference for upsert
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
