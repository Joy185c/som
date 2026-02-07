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
    const { error } = await db.from('sections').update({ order_index: s.order_index, visible: s.visible }).eq('id', s.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
