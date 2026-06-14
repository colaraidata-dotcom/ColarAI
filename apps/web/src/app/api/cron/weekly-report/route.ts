import { NextResponse } from 'next/server';
import { createClient, getAuthenticatedUser, unauthorized } from '@/lib/supabase/server';
import { sendWeeklyReport } from '@/lib/email';

// GET /api/cron/weekly-report — called by Vercel Cron every Monday 08:00 UTC
// Protected by CRON_SECRET header
export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://guardian.io';
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Get all accounts with weekly_report notifications enabled
  const { data: accounts, error: accErr } = await supabase
    .from('account_settings')
    .select('id, display_name, notification_prefs');

  if (accErr || !accounts) {
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }

  let sent = 0;
  let skipped = 0;

  for (const account of accounts) {
    const prefs = account.notification_prefs as Record<string, boolean>;
    if (!prefs?.weekly_report) { skipped++; continue; }

    // Get user email from auth.users via service role
    const { data: userData } = await supabase.auth.admin.getUserById(account.id);
    const email = userData?.user?.email;
    if (!email) { skipped++; continue; }

    // Get profile IDs for this account
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('account_id', account.id);
    const profileIds = (profiles ?? []).map((p) => p.id);
    if (profileIds.length === 0) { skipped++; continue; }

    // Get access logs for the week
    const { data: logs } = await supabase
      .from('access_logs')
      .select('action, domain')
      .in('profile_id', profileIds)
      .gte('created_at', sevenDaysAgo.toISOString());

    const totalAllowed = logs?.filter((l) => l.action === 'allowed').length ?? 0;
    const totalBlocked = logs?.filter((l) => l.action === 'blocked').length ?? 0;

    const domainCount: Record<string, number> = {};
    logs?.filter((l) => l.action === 'blocked' && l.domain).forEach((l) => {
      domainCount[l.domain!] = (domainCount[l.domain!] ?? 0) + 1;
    });
    const topBlocked = Object.entries(domainCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([domain, count]) => ({ domain, count }));

    try {
      await sendWeeklyReport({
        to: email,
        displayName: account.display_name ?? email,
        topBlocked,
        totalAllowed,
        totalBlocked,
        dashboardUrl: `${appUrl}/dashboard`,
      });
      sent++;
    } catch {
      skipped++;
    }
  }

  return NextResponse.json({ ok: true, sent, skipped });
}
