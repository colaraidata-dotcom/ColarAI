# ARCHITECTURE — Decision Record
Generated: 2026-06-12

## Stack Decisions

### Auth — Clerk
**Decision:** Use Clerk for authentication.
**Rationale:** Fastest path to production-ready auth with Next.js App Router. Provides pre-built UI components, session management, webhooks for user events. Zero auth code to write.
**Alternative considered:** NextAuth.js (more config required), Supabase Auth (couples to Supabase).

### Database — Supabase (PostgreSQL)
**Decision:** Supabase as DB + backend.
**Rationale:** PostgreSQL with real-time capabilities, Row-Level Security for profile isolation, free tier for launch, excellent Next.js SDK. The schema maps 1:1 to existing TypeScript types in packages/shared.
**Alternative considered:** PlanetScale (MySQL, no RLS), Neon (plain Postgres, less batteries).

### API Layer — Next.js Route Handlers
**Decision:** API routes at `apps/web/src/app/api/`.
**Rationale:** Already in Next.js monorepo. Avoids separate server to maintain/deploy. Supabase handles heavy DB lifting. Route handlers are sufficient for CRUD + webhooks.
**When to reconsider:** If DNS enforcement or ML classification needs a long-running process → move those to a separate service.

### Content Classification — CleanBrowsing DNS API (launch)
**Decision:** Use CleanBrowsing or Cloudflare Gateway API at launch.
**Rationale:** Spec explicitly says "Use a third-party API at launch to move fast; build proprietary layer over time." CleanBrowsing has a categorized DNS API. Cloudflare Gateway offers URL classification.
**Future:** Build proprietary classification on top of this.

### Enforcement Layer — DNS-over-HTTPS (DoH)
**Decision:** Configure profiles to use a per-profile DoH resolver.
**Rationale:** Works on iOS (Network Extension / MDM DoH profile), Android (Private DNS), macOS/Windows (system DNS). Server-side profile rules evaluated at DNS resolution time.
**Implementation:** Custom DoH server (Go or Node) reading profile rules from Supabase. Each device points to `https://dns.guardian.app/dns-query?profile_token=<token>`.

### Mobile — Expo + React Native (existing)
**Decision:** Keep Expo. Implement screens matching web dashboard flows.
**Mobile enforcement:** iOS Network Extension (requires Apple Developer program + separate native module).

### State Management (Web) — React Server Components + Supabase Realtime
**Decision:** No client state library. RSC for data fetching, Supabase Realtime for live updates (notifications, access requests).
**Rationale:** Next.js 15 + React 19 RSC patterns are the right fit. No Redux/Zustand needed for dashboard.

## Database Schema (Supabase Tables)
Maps directly from `packages/shared/src/types/index.ts`:

```
accounts (id, email, display_name, subscription_tier, created_at)
profiles (id, account_id, name, type, avatar_color, avatar_emoji, is_active, created_at, updated_at)
category_rules (id, profile_id, category, action, daily_limit_minutes)
site_overrides (id, profile_id, url, action, added_at)
schedules (id, profile_id, label, days, start_time, end_time, action, categories[])
devices (id, account_id, profile_id, device_name, platform, last_seen, is_online, os_version)
access_requests (id, profile_id, url, site_name, category, status, requested_at, expires_at, note)
usage_reports (id, profile_id, period, start_date, end_date, total_minutes, blocked_count, ...)
block_events (id, profile_id, device_id, url, category, action, timestamp)
notifications (id, account_id, type, title, body, read, created_at, access_request_id)
```

## Phase Scope

### Phase 1 (Web Dashboard — Current)
Build all missing dashboard pages using **mock data first**, then wire Supabase.
This unblocks design validation and user testing without needing the DNS backend.

### Phase 2 (Backend + Auth)
Integrate Clerk + Supabase. Replace mock data with real API calls.

### Phase 3 (Enforcement)
Build DoH server + iOS Network Extension. DNS enforcement is the core product but complex — defer until web/mobile UX is validated.

### Phase 4 (Mobile Screens)
Map web dashboard flows to mobile-native screens.
