import { NextResponse } from 'next/server';
import { requireAdmin } from '../auth-helper';

const DEFAULT_KEYS = [
  'agencyName',
  'email',
  'whatsapp',
  'seoTitle',
  'seoDescription',
  'darkModeDefault',
  'logoUrl',
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
  for (const row of rows ?? []) {
    settings[row.key] = row.value;
  }
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const result = await requireAdmin(request);
  if (result instanceof NextResponse) return result;
  const { db } = result;
  const body = await request.json();
  for (const key of Object.keys(body)) {
    const value = body[key];
    const { error } = await db
      .from('site_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
