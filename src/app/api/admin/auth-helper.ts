import { NextResponse } from 'next/server';
import { getAdminUserFromRequest, getSupabaseAdminOptional } from '@/lib/supabase-admin';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export type AdminContext = {
  user: { id: string; email: string };
  db: SupabaseClient<Database>;
};

export async function requireAdmin(
  request: Request
): Promise<AdminContext | NextResponse> {
  const user = await getAdminUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getSupabaseAdminOptional();
  if (!db) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 503 }
    );
  }

  return { user, db };
}
