import { NextResponse } from 'next/server'
import { timingSafeEqual, randomBytes } from 'crypto'
import { createServiceClient } from '@/lib/supabase/server'
import { detectHarmSignals, type AccessLogRow } from '@/lib/alerts/harm-signals'
import type { NotificationType } from '@/lib/supabase/types'

export const runtime = 'nodejs'
export const maxDuration = 60

const WINDOW_HOURS = 24

// GET /api/cron/harm-signals — Vercel Cron, daily.
// Scans the last 24h of access logs per profile, derives privacy-respecting
// harm signals, and creates one (deduplicated) notification per signal.
export async function GET(request: Request) {
  const auth = request.headers.get('authorization') ?? ''
  const expected = `Bearer ${process.env.CRON_SECRET ?? ''}`
  const a = Buffer.from(auth.padEnd(expected.length))
  const e = Buffer.from(expected.padEnd(auth.length))
  if (a.length !== e.length || !timingSafeEqual(a, e)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const since = new Date(Date.now() - WINDOW_HOURS * 3600_000).toISOString()
  const results = { profiles: 0, signals: 0, skipped_dedup: 0 }

  // Profiles with their owning account + name.
  const { data: profiles, error: profErr } = await supabase
    .from('profiles')
    .select('id, account_id, display_name, type')
  if (profErr) return NextResponse.json({ error: profErr.message }, { status: 500 })
  if (!profiles?.length) return NextResponse.json({ ok: true, ...results })

  // Unrestricted adult profiles don't need harm alerts.
  const watched = profiles.filter((p) => p.type !== 'adult_unrestricted')

  // Recent access logs in the window (only columns we need).
  const { data: logs, error: logErr } = await supabase
    .from('access_logs')
    .select('profile_id, category, action, created_at')
    .gte('created_at', since)
  if (logErr) return NextResponse.json({ error: logErr.message }, { status: 500 })

  const logsByProfile = new Map<string, AccessLogRow[]>()
  for (const row of (logs ?? []) as AccessLogRow[]) {
    if (!row.profile_id) continue
    const list = logsByProfile.get(row.profile_id) ?? []
    list.push(row)
    logsByProfile.set(row.profile_id, list)
  }

  // Existing harm_signal notifications in the window → dedup set of related_id.
  const { data: existing } = await supabase
    .from('notifications')
    .select('related_id')
    .eq('type', 'harm_signal')
    .gte('created_at', since)
  const alreadySent = new Set((existing ?? []).map((n) => n.related_id))

  // Accounts that disabled harm_signal notifications.
  const { data: settings } = await supabase
    .from('account_settings')
    .select('id, notification_prefs')
  const optedOut = new Set(
    (settings ?? [])
      .filter((s) => (s.notification_prefs as Record<string, boolean>)?.harm_signal === false)
      .map((s) => s.id)
  )

  const toInsert: Array<{ id: string; account_id: string; type: NotificationType; title: string; body: string; related_id: string }> = []

  for (const profile of watched) {
    const profileLogs = logsByProfile.get(profile.id)
    if (!profileLogs?.length) continue
    if (optedOut.has(profile.account_id)) continue
    results.profiles++

    const signals = detectHarmSignals(profileLogs, profile.display_name ?? 'Profile')
    for (const signal of signals) {
      const relatedId = `${profile.id}:${signal.ruleKey}`
      if (alreadySent.has(relatedId)) {
        results.skipped_dedup++
        continue
      }
      toInsert.push({
        id: `notif_${randomBytes(8).toString('hex')}`,
        account_id: profile.account_id,
        type: 'harm_signal' as NotificationType,
        title: signal.title,
        body: signal.body,
        related_id: relatedId,
      })
      alreadySent.add(relatedId)
    }
  }

  if (toInsert.length) {
    const { error: insErr } = await supabase.from('notifications').insert(toInsert)
    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 })
    results.signals = toInsert.length
  }

  return NextResponse.json({ ok: true, ...results })
}
