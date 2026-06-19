import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  const key = `${ip}:${email.toLowerCase()}`;
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

  const service = createServiceClient();

  const { count } = await service
    .from('sign_in_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('key', key)
    .gte('attempted_at', windowStart);

  if ((count ?? 0) >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait 15 minutes.' },
      { status: 429 }
    );
  }

  await service.from('sign_in_attempts').insert({ key, attempted_at: new Date().toISOString() });

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  await service.from('sign_in_attempts').delete().eq('key', key);

  return NextResponse.json({ ok: true });
}
