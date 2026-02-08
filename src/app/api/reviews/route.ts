import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

/** Public: submit a review (stored with approved: false until admin approves). */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { client_name, rating, content, project_type } = body;

    if (!client_name || typeof client_name !== 'string' || !client_name.trim()) {
      return NextResponse.json({ error: 'Client name is required' }, { status: 400 });
    }
    if (content == null || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'Review content is required' }, { status: 400 });
    }

    const ratingNum = Number(rating);
    if (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from('reviews')
      // @ts-expect-error Supabase client generic inference for insert
      .insert({
        client_name: client_name.trim().slice(0, 500),
        rating: Math.round(ratingNum),
        content: content.trim().slice(0, 5000),
        project_type: typeof project_type === 'string' && project_type.trim() ? project_type.trim().slice(0, 200) : null,
        approved: false,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Review insert error:', error);
      return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: (data as { id?: string } | null)?.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
