import { NextResponse } from 'next/server';

// Placeholder: integrate with Supabase Auth (signInWithPassword) and return JWT.
// For now we accept demo credentials and return a token so client can store it.
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }
    // TODO: const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    // if (error) return NextResponse.json({ error: error.message }, { status: 401 });
    // return NextResponse.json({ token: data.session?.access_token });
    if (email === 'admin@showoffsmedia.com' && password === 'admin123') {
      return NextResponse.json({ token: 'demo-admin-token' });
    }
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
