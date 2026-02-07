import { NextResponse } from 'next/server';
import { requireAdmin } from '../auth-helper';

export async function GET(request: Request) {
  const result = await requireAdmin(request);
  if (result instanceof NextResponse) return result;
  const { db } = result;
  const { data, error } = await db.from('team_members').select('*').order('order_index', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const result = await requireAdmin(request);
  if (result instanceof NextResponse) return result;
  const { db } = result;
  const body = await request.json();
  const { name, position, bio, photo_url, social_links, published, order_index } = body;
  if (!name || !position) return NextResponse.json({ error: 'name, position required' }, { status: 400 });
  const { data, error } = await db
    .from('team_members')
    .insert({
      name,
      position,
      bio: bio ?? null,
      photo_url: photo_url ?? null,
      social_links: social_links ?? {},
      published: published !== false,
      order_index: typeof order_index === 'number' ? order_index : 0,
    })
    .select('id')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const result = await requireAdmin(request);
  if (result instanceof NextResponse) return result;
  const { db } = result;
  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const allowed = ['name', 'position', 'bio', 'photo_url', 'social_links', 'published', 'order_index'];
  const payload: Record<string, unknown> = {};
  for (const k of allowed) {
    if (updates[k] !== undefined) payload[k] = updates[k];
  }
  if (Object.keys(payload).length === 0) return NextResponse.json({ error: 'No updates' }, { status: 400 });
  const { error } = await db.from('team_members').update(payload).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const result = await requireAdmin(request);
  if (result instanceof NextResponse) return result;
  const { db } = result;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const { error } = await db.from('team_members').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
