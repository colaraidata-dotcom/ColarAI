import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/cron/apply-overrides — called by Vercel Cron every minute
// Applies pending_overrides whose apply_at has passed
export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();

  const { data: pending, error } = await supabase
    .from('pending_overrides')
    .select('*')
    .eq('applied', false)
    .lte('apply_at', new Date().toISOString());

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!pending?.length) return NextResponse.json({ ok: true, applied: 0 });

  let applied = 0;
  for (const po of pending) {
    const ruleId = `rule_${po.profile_id}_${po.category}`;

    // Upsert the content rule
    const { error: ruleErr } = await supabase
      .from('content_rules')
      .upsert({
        id: ruleId,
        profile_id: po.profile_id,
        category: po.category,
        action: po.new_action as 'allow' | 'block' | 'limit',
        daily_limit_minutes: po.new_daily_limit_minutes ?? null,
      }, { onConflict: 'profile_id,category' });

    if (!ruleErr) {
      await supabase
        .from('pending_overrides')
        .update({ applied: true })
        .eq('id', po.id);
      applied++;
    }
  }

  return NextResponse.json({ ok: true, applied });
}
