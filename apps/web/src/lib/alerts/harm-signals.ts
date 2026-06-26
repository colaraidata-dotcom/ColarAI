// Privacy-respecting harm-signal detection.
//
// Unlike monitoring-first rivals (Bark) that read message/email *content*, this
// derives alerts purely from DNS access patterns already in `access_logs`
// (domains are hashed, not read). No private communication is inspected — this
// keeps ColarAI's privacy-first positioning intact while still giving parents
// the proactive "something needs attention" signal.

export interface AccessLogRow {
  profile_id: string | null
  category: string | null
  action: 'allowed' | 'blocked' | 'limited'
  created_at: string // ISO timestamp (UTC)
}

export interface HarmSignal {
  ruleKey: string // stable id per rule, used for dedup (related_id = `${profileId}:${ruleKey}`)
  title: string
  body: string
}

// Categories whose repeated blocked attempts are worth surfacing to a parent.
export const HIGH_RISK_CATEGORIES = ['adult_content', 'gambling'] as const

const REPEATED_HIGH_RISK_THRESHOLD = 5 // blocked attempts to a high-risk category
const HIGH_BLOCK_VOLUME_THRESHOLD = 30 // total blocked attempts (determined access)
const LATE_NIGHT_THRESHOLD = 10 // requests between 00:00–05:00 UTC

function lateNightCount(logs: AccessLogRow[]): number {
  return logs.filter((l) => {
    const hour = new Date(l.created_at).getUTCHours()
    return hour >= 0 && hour < 5
  }).length
}

/**
 * Detects harm signals for ONE profile from its recent access logs (caller
 * pre-filters to the time window). Pure function — no I/O — so it is trivially
 * testable and reusable. Returns at most one signal per rule.
 */
export function detectHarmSignals(logs: AccessLogRow[], profileName: string): HarmSignal[] {
  const signals: HarmSignal[] = []
  const blocked = logs.filter((l) => l.action === 'blocked')

  // Rule 1 — repeated attempts to a specific high-risk category
  for (const category of HIGH_RISK_CATEGORIES) {
    const count = blocked.filter((l) => l.category === category).length
    if (count >= REPEATED_HIGH_RISK_THRESHOLD) {
      const label = category === 'adult_content' ? 'adult content' : 'gambling'
      signals.push({
        ruleKey: `repeated_${category}`,
        title: `${profileName}: repeated ${label} attempts`,
        body: `${count} blocked attempts to reach ${label} in the last 24 hours. You may want to check in.`,
      })
    }
  }

  // Rule 2 — high overall block volume (persistent attempts to bypass rules)
  if (blocked.length >= HIGH_BLOCK_VOLUME_THRESHOLD) {
    signals.push({
      ruleKey: 'high_block_volume',
      title: `${profileName}: many blocked attempts`,
      body: `${blocked.length} requests were blocked in the last 24 hours — an unusually high amount.`,
    })
  }

  // Rule 3 — unusual late-night activity (00:00–05:00)
  const nightCount = lateNightCount(logs)
  if (nightCount >= LATE_NIGHT_THRESHOLD) {
    signals.push({
      ruleKey: 'late_night_activity',
      title: `${profileName}: late-night activity`,
      body: `${nightCount} requests between midnight and 5 AM. Consider a bedtime schedule for this profile.`,
    })
  }

  return signals
}
