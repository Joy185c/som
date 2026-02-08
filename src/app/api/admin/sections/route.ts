import { NextResponse } from 'next/server';
import { requireAdmin } from '../auth-helper';

export async function GET(request: Request) {
  const result = await requireAdmin(request);
  if (result instanceof NextResponse) return result;
  const { db } = result;
  const { data, error } = await db.from('sections').select('*').order('order_index', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const result = await requireAdmin(request);
  if (result instanceof NextResponse) return result;
  const { db } = result;
  const body = await request.json();
  const { name, slug } = body as { name: string; slug?: string };
  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'name required' }, { status: 400 });
  }
  const slugVal = (slug && typeof slug === 'string' && slug.trim())
    ? slug.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    : name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const { data: max } = await db.from('sections').select('order_index').order('order_index', { ascending: false }).limit(1).single();
  const order_index = ((max as { order_index?: number } | null)?.order_index ?? -1) + 1;
  // @ts-expect-error Supabase client generic inference for insert
  const { data, error } = await db.from('sections').insert({ name: name.trim(), slug: slugVal, order_index, visible: true }).select('id').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const result = await requireAdmin(request);
  if (result instanceof NextResponse) return result;
  const { db } = result;
  const body = await request.json();
  const { sections } = body as { sections: { id: string; order_index: number; visible: boolean }[] };
  if (!Array.isArray(sections)) {
    return NextResponse.json({ error: 'sections array required' }, { status: 400 });
  }
  for (const s of sections) {
    // @ts-expect-error Supabase client generic inference for update
    const { error } = await db.from('sections').update({ order_index: s.order_index, visible: s.visible }).eq('id', s.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
