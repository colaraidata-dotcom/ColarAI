# Guardian — Product Specification v0.1 (Extracted)

**Vision:** Profile-based internet control platform. Single account → unlimited profiles → per-profile rules enforced in real time across all devices.

## Core Concept
Internet control should be identity-based (profile), not device-based.

## Profile Types
| Type | Example | Rules |
|------|---------|-------|
| `child` | 5–12 yr | Strict allowlist. No social media. Safe search. Screen time limits. |
| `teen` | 13–17 yr | Moderate. Social media with time limits. Adult blocked. |
| `adult_self` | Professional | Self-imposed blocks during work hours. |
| `adult_unrestricted` | Parent account | Full access. Approves override requests. |

## Profile Configuration Options
- Category rules: allow / block / limit per category
- Site-level overrides: explicit allow/block by URL
- Time-based schedules: hour/day rules
- Screen time limits: daily caps per category or aggregate
- Safe search enforcement: Google, Bing, YouTube
- Request access flow: child → parent one-tap request

## Content Categories
`social_media`, `adult_content`, `gaming`, `streaming`, `news`, `shopping`, `gambling`, `productivity`, `education`, `communication`

## Classification Methods
1. DNS-level categorization (primary)
2. URL pattern matching (secondary)
3. AI-assisted (fallback for unknown URLs)

## Platform Coverage
| Platform | Method | Priority |
|----------|--------|----------|
| iOS | Network Extension / DoH | P0 |
| Android | VpnService / DoH | P0 |
| macOS | Network Extension | P1 (v1.1) |
| Windows | Network driver | P1 (v1.1) |
| Browser Extension | Chrome/Safari/Firefox | P1 optional |
| Router | Custom DNS | P2 |

## Key Features
### Dashboard
- All profiles overview + status
- Per-profile weekly usage reports
- Notification center (blocks, override requests)
- Quick-edit rules

### Enforcement
- Real-time blocking (before load)
- Age-appropriate block screen
- PIN-protected overrides (time-windowed)
- Tamper resistance (child can't disable)

### Usage Reporting
- Weekly push/email reports
- Category breakdown, top sites, blocked log
- Self-report for adults

## Business Model
Family subscription ($9.99–$14.99/mo). Freemium with 1 profile free.
Tiers: `free` (1 profile), `basic`, `family`.

## Success Metrics
- Activation rate (2+ profiles)
- D30 retention
- Rules per profile
- Override request rate
- Platform coverage %
- Support contact rate
