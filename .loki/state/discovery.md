# DISCOVERY — Gap Analysis
Generated: 2026-06-12

## What Exists

### Landing Page (apps/web) — COMPLETE
- HeroSection, FeaturesSection, HowItWorksSection, ProfilesSection
- PricingSection, TrustSection, CompetitorSection, CTASection
- Footer, Navbar
- All purely presentational (no interactivity needed here)

### Dashboard (apps/web) — PARTIAL MOCK
- `/dashboard` — overview stats, pending access requests, profile cards, recent notifications
  - ✅ Layout/visual complete
  - ❌ All data is hardcoded mock — no real data fetching
  - ❌ Approve/Reject buttons are no-ops

### Shared Package — STRONG FOUNDATION
- `packages/shared/src/types/index.ts` — full type model (Profile, CategoryRule, SiteOverride, Schedule, Device, AccessRequest, UsageReport, AppNotification, BlockEvent, Account, ClassificationResult)
- `packages/shared/src/mock/index.ts` — comprehensive mock data covering all entities
- `packages/shared/src/constants/index.ts` — to be read

## Missing Pages (Nav Links Exist, No Pages)
| Route | Priority | Spec Reference |
|-------|----------|----------------|
| `/profiles` | P0 | Section 4 — Profile System |
| `/profiles/[id]` | P0 | Section 4.2 — Profile Configuration |
| `/profiles/[id]/rules` | P0 | Content category rules |
| `/profiles/[id]/schedules` | P0 | Time-based schedules |
| `/profiles/[id]/overrides` | P0 | Site-level overrides |
| `/profiles/[id]/devices` | P1 | Section 6 |
| `/reports` | P0 | Section 7.3 — Usage Reporting |
| `/reports/[profileId]` | P0 | Per-profile report |
| `/notifications` | P0 | Section 7.1 — Notification center |
| `/settings` | P1 | Account + subscription |

## Missing Infrastructure
| Component | Gap | Impact |
|-----------|-----|--------|
| Auth | No login/signup | Can't use app |
| API routes | None exist | All data is mock |
| Database | None | No persistence |
| Classification engine | None | Core enforcement missing |
| DNS enforcement | None | Core product missing |

## Mobile App (apps/mobile)
- Expo 53 + React Native + Expo Router scaffolded
- **Zero screens implemented** — effectively empty shell
- Needs: Onboarding, Profile Switcher, Status Widget, Block Screen, Access Request flow

## Complexity Assessment
- **Overall: COMPLEX tier** (10+ files, multi-platform, external integrations needed)
- **Immediate scope (web dashboard):** STANDARD (6–10 files per feature)
- **Platform enforcement:** requires native code — out of scope for web phase

## Priority Build Order
1. Auth (login/signup) — gating everything
2. `/profiles` list + create profile
3. `/profiles/[id]/rules` — category rule management
4. `/profiles/[id]/schedules` — time-based schedules
5. `/reports` — usage charts per profile
6. `/notifications` — full notification list + access request approval
7. `/settings` — account management
8. API backend (currently mocked — tie real data)
9. Mobile screens
10. DNS enforcement layer (native)
