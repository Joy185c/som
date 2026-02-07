import { NextResponse } from 'next/server';
import { requireAdmin } from '../auth-helper';

export async function GET(request: Request) {
  const result = await requireAdmin(request);
  if (result instanceof NextResponse) return result;
  const { db } = result;
  const { searchParams } = new URL(request.url);
  const publishedOnly = searchParams.get('published');
  let q = db.from('works').select('*').order('order_index', { ascending: true });
  if (publishedOnly === 'true') q = q.eq('published', true);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const result = await requireAdmin(request);
  if (result instanceof NextResponse) return result;
  const { db } = result;
  const body = await request.json();
  const {
    title,
    slug,
    description,
    video_url,
    thumbnail_url,
    project_type,
    tools,
    tags,
    is_vertical,
    published,
    order_index,
  } = body;
  if (!title || !slug || !project_type) {
    return NextResponse.json({ error: 'title, slug, project_type required' }, { status: 400 });
  }
  const { data, error } = await db
    .from('works')
    .insert({
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: description ?? null,
      video_url: video_url ?? null,
      thumbnail_url: thumbnail_url ?? null,
      project_type,
      tools: Array.isArray(tools) ? tools : [],
      tags: Array.isArray(tags) ? tags : [],
      is_vertical: !!is_vertical,
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
  const allowed = ['title', 'slug', 'description', 'video_url', 'thumbnail_url', 'project_type', 'tools', 'tags', 'is_vertical', 'published', 'order_index'];
  const payload: Record<string, unknown> = {};
  for (const k of allowed) {
    if (updates[k] !== undefined) payload[k] = updates[k];
  }
  if (Object.keys(payload).length === 0) return NextResponse.json({ error: 'No updates' }, { status: 400 });
  const { error } = await db.from('works').update(payload).eq('id', id);
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
  const { error } = await db.from('works').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
