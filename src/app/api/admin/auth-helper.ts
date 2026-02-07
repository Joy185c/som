import { NextResponse } from 'next/server';
import { getAdminUserFromRequest, getSupabaseAdminOptional } from '@/lib/supabase-admin';

export async function requireAdmin(request: Request) {
  const user = await getAdminUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const db = getSupabaseAdminOptional();
  if (!db) {
    return NextResponse.json(
      { error: 'Supabase not configured. Add env vars to persist data.' },
      { status: 503 }
    );
  }
  return { user, db };
}
