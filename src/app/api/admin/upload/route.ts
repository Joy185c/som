import { NextResponse } from 'next/server';
import { requireAdmin } from '../auth-helper';
import { getSupabaseAdminOptional } from '@/lib/supabase-admin';

const BUCKET = 'uploads';

export async function POST(request: Request) {
  const result = await requireAdmin(request);
  if (result instanceof NextResponse) return result;
  const db = getSupabaseAdminOptional();
  if (!db) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string) || 'misc';
  if (!file) return NextResponse.json({ error: 'file required' }, { status: 400 });

  await db.storage.createBucket(BUCKET, { public: true }).catch(() => {});

  const ext = file.name.split('.').pop() || 'bin';
  const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data: uploadData, error: uploadError } = await db.storage
    .from(BUCKET)
    .upload(name, file, { upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = db.storage.from(BUCKET).getPublicUrl(uploadData.path);
  return NextResponse.json({ url: urlData.publicUrl, path: uploadData.path });
}
