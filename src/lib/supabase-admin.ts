import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/** Server-only: use for admin API routes. Bypasses RLS. Throws if not configured. */
export function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient<Database>(supabaseUrl, supabaseServiceKey);
}

/** Same but returns null when not configured (for optional DB in demo mode). */
export function getSupabaseAdminOptional(): ReturnType<typeof createClient<Database>> | null {
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient<Database>(supabaseUrl, supabaseServiceKey);
}

/** Verify JWT or demo token from request. Returns user or null. */
export async function getAdminUserFromRequest(request: Request): Promise<{ id: string; email: string } | null> {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;

  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && anonKey) {
    const supabaseAuth = createClient(supabaseUrl, anonKey);
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
    if (!error && user) return { id: user.id, email: user.email ?? '' };
  }

  if (token === 'demo-token' || token === 'demo-admin-token') return { id: 'demo', email: 'demo@local' };
  return null;
}
