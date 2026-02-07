'use client';

import { supabase } from './supabase';

/** Get auth headers for admin API calls. Use after ensuring user is logged in. */
export async function getAdminAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    return { Authorization: `Bearer ${session.access_token}` };
  }
  const demo = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  if (demo) {
    return { Authorization: `Bearer ${demo}` };
  }
  return {};
}

/** Check if we have Supabase auth (real login) vs demo token. */
export async function isSupabaseAuth(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session?.access_token;
}
