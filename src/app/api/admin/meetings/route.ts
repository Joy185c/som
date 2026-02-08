import { NextResponse } from 'next/server';
import { requireAdmin } from '../auth-helper';

export async function GET(request: Request) {
  const result = await requireAdmin(request);
  if (result instanceof NextResponse) return result;
  const { db } = result;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  let q = db.from('meetings').select('*').order('created_at', { ascending: false });
  if (status) q = q.eq('status', status);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function PATCH(request: Request) {
  const result = await requireAdmin(request);
  if (result instanceof NextResponse) return result;
  const { db } = result;
  const body = await request.json();
  const { id, status } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const allowed: ('pending' | 'confirmed' | 'completed' | 'cancelled')[] = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!status || !allowed.includes(status)) {
    return NextResponse.json({ error: 'status must be one of: ' + allowed.join(', ') }, { status: 400 });
  }
  // Supabase client typings infer 'never' for this table's update; payload is valid at runtime.
  // @ts-expect-error - Database Update type is correct; client generic inference limitation
  const { error } = await db.from('meetings').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
