# Guardian — Agent Takımı Ana Beyin

## Proje
Guardian: profil tabanlı internet filtreleme platformu.
Spec dosyası: Guardian_Product_Spec_v0.1.docx

> **Marka:** "Guardian → ColarAI" rebrand'i konuşuldu, karar beklendiğinden henüz uygulanmadı.

## Mevcut Durum (Son Güncelleme: 2026-06-25)

Tam kronoloji: `PROJECT_HISTORY.md`. Hızlı durum: `MEMORY.md` (kullanıcı belleği).

**Canlı servisler:** Web (Vercel) · Supabase `szyuvymdilnxbjzcpmkt` (**15 tablo**) · DNS Worker (Cloudflare) · GitHub `Talip88/Guardian`. Mobile: ekranlar hazır, Supabase env eksik.

**Yapılanlar (özet):**
- Web: landing + auth + dashboard + REST API; Vercel'de canlı
- DNS Worker: DoH enforcement (pause/schedule/limit/override/kategori) + cache-first domain kategori (KV→Supabase→AI)
- İçerik hub: `content_catalog/scores/criteria/platform_availability` + `scorer.ts` (objektif sinyal) + `calculateFitScore` (politika motoru)
- Kademeli sınıflandırma: değer profili preset'leri (`VALUE_PROFILE_PRESETS`), fail-safe (`FAIL_SAFE_BY_PROFILE`), preset→onboarding
- Canlı DB: migration-002/003 uygulandı + 12 sample içerik seed'lendi
- Mobile (Expo): tüm ekranlar + Zustand store'lar; Supabase env bekliyor
- Agent takımı + güvenlik review Action + tehdit modeli
- Rakip analizi → strateji (`competitive-strategy.md` belleği)

**Bekleyen (öncelik):** Mobile env → ColarAI rebrand kararı → GitHub token güvenliği (remote'ta açık PAT) → TMDB/Anthropic ingest → custom domain.

## Klasör Haritası
- apps/mobile/       → React Native iOS ve Android
- apps/dns-worker/   → DNS-over-HTTPS enforcement (Cloudflare Worker)
- apps/web/          → Next.js dashboard + REST API + backend
- packages/shared/   → Ortak tipler, ClassificationResult kontratı
- security/          → Tehdit modeli, tarama raporları, araçlar
- agents/            → Tüm agent tanımları
- agent-logs/        → JSONL logları (Langfuse'a beslenir)

## Takım
| Rol                  | Dosya                             |
|----------------------|-----------------------------------|
| Lead Developer       | agents/00_LEAD_DEVELOPER.md       |
| Senior Developer     | agents/01_SENIOR_DEVELOPER.md     |
| Cybersecurity Expert | agents/02_CYBERSECURITY_EXPERT.md |
| Tester               | agents/03_TESTER.md               |
| Researcher           | agents/04_RESEARCHER.md           |
| Reviewer             | agents/05_REVIEWER.md             |

## Orchestrator Kuralları
1. Görev gelince agents/ klasöründeki tüm AGENT.md dosyalarını oku
2. Bağımsız parçaları paralel başlat
3. Bağımlı parçaları sıralı yürüt (backend API kontratı → mobile geliştirme)
4. Her agent görev başı/sonu agent-logs/YYYY-MM-DD/ klasörüne JSONL yazar
5. Lead Developer sprint sonu sprint-summary.md yazar

## Görev Bağımlılık Sırası
| Önce Bitmeli | Sonra Başlar | Neden |
|---|---|---|
| backend/ API kontratı | mobile/ geliştirme | Mobile API'yi tüketir |
| ClassificationResult tipi | enforcement/ entegrasyonu | Tip kontratı paylaşılıyor |
| Her feature geliştirme | Security review | PR öncesi zorunlu |

## Loglama Formatı (Langfuse için)
```json
{
  "timestamp": "ISO8601",
  "agent": "cybersecurity_expert",
  "task": "görev özeti",
  "files_touched": ["security/reports/2026-06-14.md"],
  "status": "completed|in_progress|blocked",
  "token_estimate": 1200,
  "duration_seconds": 45,
  "notes": "varsa önemli not"
}
```

## Guardian Güvenlik Kırmızı Çizgileri
- Child profil hiçbir koşulda devre dışı bırakılamaz
- PIN hiçbir yoldan bypass edilemez
- Browsing verisi on-device işlenmeli, cloud'a minimal veri
- Cellular ağda DNS bypass: bilinen sınır, kod yorumuna ekle
