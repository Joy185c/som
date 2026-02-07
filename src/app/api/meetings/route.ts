import { NextResponse } from 'next/server';

// Use dynamic import so app works without Supabase keys (dev mode)
async function createMeeting(body: Record<string, unknown>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.warn('Supabase not configured; meeting stored in memory only.');
    return { id: 'demo-' + Date.now() };
  }
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, serviceKey);
  const { data, error } = await supabase.from('meetings').insert({
    client_name: body.name,
    client_email: body.email,
    client_phone: body.phone ?? null,
    project_type: body.projectType,
    budget_range: body.budgetRange ?? null,
    preferred_date: body.preferredDate ?? null,
    preferred_time_slot: body.preferredTime ?? null,
    message: body.message ?? null,
    status: 'pending',
  }).select('id').single();
  if (error) throw error;
  return data;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, projectType } = body;
    if (!name || !email || !projectType) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, projectType' },
        { status: 400 }
      );
    }
    const data = await createMeeting(body);
    return NextResponse.json({ success: true, id: data?.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
