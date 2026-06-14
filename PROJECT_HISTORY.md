# Guardian — Proje Geçmişi

> **YENİ SESSION BAŞLANGICI — BURADAN OKU**
>
> Bu dosya, her terminal oturumu kapandığında bağlamı geri kazanmak için hazırlandı.
> Claude bu dosyayı okuyarak tam bağlamı 1 dakikada yakalar.

---

## Şu Anki Durum (Son Güncelleme: 2026-06-14)

| Katman | URL / Ref | Durum |
|--------|-----------|-------|
| Web App (Vercel) | `https://guardian-fd0cs99tb-colarai.vercel.app` | ✅ Canlı |
| Supabase | ref: `szyuvymdilnxbjzcpmkt` | ✅ Canlı |
| GitHub | `github.com/Talip88/Guardian`, `main` branch | ✅ Aktif |
| DNS Worker | `guardian-dns-worker.talipclk1988.workers.dev` | ✅ Canlı |
| Mobile (Expo) | Ekranlar hazır, Supabase env eksik | ⏳ Bekliyor |

### Bekleyen İşler (öncelik sırasıyla)
1. **Mobile env** → `apps/mobile/.env` dosyasına Supabase URL + anon key ekle
2. **Langfuse** → `cloud.langfuse.com`'dan key al → `.env` dosyasına ekle
3. **GitHub Secret** → repo Settings → Secrets → `CLAUDE_API_KEY` ekle (security-review Action için)
4. **Custom domain** → Vercel dashboard'dan bağla
5. **Email sender** → Supabase Auth → SMTP → Sender name: "Guardian"

### Kritik Bilgiler
- Supabase schema: `supabase/schema.sql` — **zaten çalıştırıldı**, tekrar çalıştırma
- Vercel build config: `apps/web/vercel.json`
- DNS Worker deploy adımları: bu dosyanın Bölüm 4 (DNS Worker) kısmı + `BACKEND_SETUP.md`
- E2E testler: `npx playwright test` — 27/27 geçiyor (web app)

---

Bu belge, Guardian projesinde başından itibaren yapılan tüm çalışmaları özetler.

---

## Proje Nedir?

**Guardian**, profil bazlı internet kontrol platformudur. Ebeveynler veya bireyler; çocukların, gençlerin ya da kendi cihazlarının internete erişimini DNS seviyesinde kontrol edebilir. Uygulama içerik kategorilerini (sosyal medya, oyun, yetişkin içerik vb.) tespit eder ve profil kurallarına göre anında engeller veya izin verir.

---

## Teknik Altyapı

| Katman | Teknoloji |
|---|---|
| Monorepo | Turbo (npm workspaces) |
| Web app | Next.js 15.3.9, React 19, Tailwind CSS 4 |
| Mobile app | Expo 56 (SDK), React Native |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| DNS Worker | Cloudflare Worker (DoH — DNS over HTTPS) |
| Deploy | Vercel (web), Cloudflare (DNS worker) |
| Versiyon kontrolü | GitHub → github.com/Talip88/Guardian |

---

## Yapılanlar (Kronolojik Sıra)

### 1. Proje İskeleti

- `guardian/` monorepo oluşturuldu
- `apps/web` — Next.js web uygulaması
- `apps/mobile` — Expo React Native uygulaması
- `apps/dns-worker` — Cloudflare DNS filtreleme worker'ı
- `packages/shared` — ortak tipler ve yardımcı fonksiyonlar
- Turbo pipeline yapılandırıldı

---

### 2. Web Uygulaması — Landing Sayfaları

**Tasarım sistemi:** "Signal Dark" teması
- Arka plan: `#08080F` (derin koyu lacivert)
- Primary: `#0EA5E9` (gökyüzü mavisi)
- Font: Plus Jakarta Sans

**Oluşturulan sayfalar ve bölümler:**

| Sayfa / Bileşen | Açıklama |
|---|---|
| `/` | Ana sayfa — tüm bölümleri içeren landing |
| `HeroSection` | Büyük başlık + dashboard mockup (3D perspektif) + CTA |
| `StatsSection` | İstatistik kartları |
| `CustomerJourneySection` | "5 dakikada kurulum" — 4 adımlı müşteri yolculuğu |
| `HowItWorksSection` | DNS akış diyagramı + sade dil açıklamaları |
| `ProfilesSection` | Profil bazlı kontrol gösterimi |
| `FeaturesSection` | Özellikler listesi |
| `PlatformSection` | Desteklenen platformlar (iOS, Android, Mac, Windows) |
| `TrustSection` | Güven unsurları |
| `PricingSection` | Fiyatlandırma planları |
| `CTASection` | Son çağrı bölümü |
| `/how-it-works` | Detaylı teknik açıklama sayfası (6 adım + 10 kategori) |
| `/pricing` | Fiyatlandırma sayfası |
| `/privacy` | Gizlilik politikası |
| `/demo` | **Kayıt gerektirmez** — interaktif panel önizlemesi |

---

### 3. Web Uygulaması — Auth Sistemi

Supabase Auth entegrasyonu:

| Sayfa | Açıklama |
|---|---|
| `/sign-up` | E-posta + şifre ile kayıt |
| `/sign-in` | Giriş |
| `/sign-in/forgot-password` | Şifremi unuttum |
| `/sign-in/reset-password` | Yeni şifre belirleme |

- `middleware.ts` → tüm dashboard rotalarını korur; auth yoksa `/sign-in`'e yönlendirir
- Auth callback: `/api/auth/callback`
- Open redirect güvenlik açığı kapatıldı (`safeNext()` validasyonu)

---

### 4. Web Uygulaması — Dashboard

Giriş yapılan kullanıcının kontrol paneli:

| Sayfa | Açıklama |
|---|---|
| `/dashboard` | Genel bakış — aktif profiller, engellenenler, ekran süresi |
| `/profiles` | Profil listesi |
| `/profiles/new` | Yeni profil oluşturma |
| `/profiles/[id]` | Profil detayı — kurallar, cihazlar, istatistikler |
| `/reports` | Haftalık rapor — kategori bazlı bar grafik |
| `/notifications` | Bildirimler — erişim talepleri, engelleme bildirimleri |
| `/settings` | Hesap ayarları |

---

### 5. Backend API Rotaları

| Endpoint | İşlev |
|---|---|
| `GET /api/notifications` | Kullanıcının bildirimlerini çeker |
| `POST /api/notifications/mark-read` | Tüm bildirimleri okundu işaretler |
| `GET /api/reports/weekly` | Son 7 günlük erişim özeti |
| `POST /api/device/register` | Cihaz kaydı |
| `POST /api/device/heartbeat` | Cihaz aktiflik bildirimi |
| `GET/PATCH /api/access-requests` | Erişim taleplerini listele / onayla / reddet |
| `GET/PATCH /api/profiles/[id]` | Profil okuma ve güncelleme |
| `GET /api/auth/callback` | Supabase auth callback |

---

### 6. Supabase Veritabanı

`supabase/schema.sql` ile oluşturulan tablolar:

| Tablo | İçerik |
|---|---|
| `account_settings` | Kullanıcı ayarları |
| `profiles` | İnternet profilleri (çocuk, genç, kişisel vb.) |
| `devices` | Bağlı cihazlar |
| `rules` | Profil başına kategori kuralları |
| `access_logs` | DNS sorgu geçmişi |
| `access_requests` | Çocuğun ebeveynden izin talepleri |
| `notifications` | Bildirimler |
| `time_schedules` | İnternet açık/kapalı saatleri |
| `daily_limits` | Günlük ekran süresi limitleri |

- Tüm tablolarda **Row Level Security (RLS)** aktif
- `avatar_emoji` kolonu `profiles` tablosuna eklendi
- 9 RLS policy tanımlandı (tek satır sözdizimi — çoklu satır syntax hatası veriyordu)

---

### 7. Güvenlik İyileştirmeleri

| Seviye | Düzeltme |
|---|---|
| KRİTİK | `PATCH /api/access-requests` artık JWT auth gerektiriyor |
| KRİTİK | Middleware, Supabase yapılandırılmamışsa production'da erişimi kapatır |
| YÜKSEK | Auth callback ve sign-in formunda open redirect engellendi (`safeNext()`) |
| YÜKSEK | Cihaz kaydı öncesi `profile_id` sahipliği doğrulanıyor |
| YÜKSEK | `next.config.ts`'e güvenlik başlıkları eklendi (CSP, X-Frame-Options vb.) |
| ORTA | Tüm ID'ler `randomBytes` ile üretiliyor (`Date.now()` yerine) |
| ORTA | Domain uzunluğu `access-requests POST`'ta doğrulanıyor |
| ORTA | Sign-in sayfasındaki `error` query parametresi whitelist ile doğrulanıyor |

---

### 8. Mobile Uygulama (Expo)

Oluşturulan ekranlar:

| Ekran | İşlev |
|---|---|
| `(auth)/welcome.tsx` | Karşılama / onboarding |
| `(tabs)/index.tsx` | Ana dashboard |
| `(tabs)/profiles.tsx` | Profil listesi |
| `(tabs)/profile/[id]/index.tsx` | Profil detayı |
| `(tabs)/profile/[id]/edit.tsx` | Kural düzenleyici |
| `(tabs)/profile/new.tsx` | Yeni profil |
| `(tabs)/reports.tsx` | Raporlar |
| `(tabs)/notifications.tsx` | Bildirimler |
| `(tabs)/settings.tsx` | Ayarlar |
| `(tabs)/override/[requestId].tsx` | Erişim izni modal |

Altyapı:
- `lib/supabase.ts` — SecureStore ile Supabase client
- `store/auth.ts` — Zustand auth store
- `store/profiles.ts` — Zustand profil store

**Mevcut durum:** Expo SDK 56 kurulu. Expo Go'da test için SDK uyumu gerekiyor — bu adım ertelendi.

---

### 9. GitHub'a Push

- `github.com/Talip88/Guardian` reposu oluşturuldu
- Classic PAT token ile ilk push yapıldı
- `main` branch aktif

---

### 10. Vercel Deploy

**Karşılaşılan sorunlar ve çözümler:**

| Sorun | Çözüm |
|---|---|
| React dual-instance (styled-jsx vs react-dom) | `react`/`react-dom` sadece root `package.json`'da bırakıldı, `apps/web`'den kaldırıldı |
| `react: 19.0.0` vs `react-dom: 19.2.7` uyumsuzluğu | Her ikisi `19.1.0`'a sabitlendi (root overrides) |
| Next.js CVE-2025-66478 — Vercel deploy'u reddetti | Next.js `15.3.0` → `15.3.9` yükseltildi |
| CSP Vercel live script'i engelliyordu | `https://vercel.live` ve `wss://ws-us3.pusher.com` CSP'ye eklendi |
| Supabase env var'ları build'e yansımıyordu | Vercel dashboard'dan `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY` eklendi |

**Vercel yapılandırması (`vercel.json`):**
```json
{
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "installCommand": "cd ../.. && npm install --legacy-peer-deps",
  "framework": "nextjs",
  "regions": ["fra1"]
}
```

**Canlı URL:** `https://guardian-fd0cs99tb-colarai.vercel.app`

---

### 11. UX İyileştirmeleri (Son Aşama)

Sitenin müşteriye ne sunduğunun anlaşılmaması üzerine:

1. **`CustomerJourneySection`** eklendi → "5 dakikada kurulum" — 4 görsel adım + DNS'i sade dille açıklayan callout kutu
2. **`HowItWorksSection`** yeniden yazıldı → teknik DNS jargonu yerine sade İngilizce + görsel akış diyagramı (cihaz → Guardian → engel/izin)
3. **`/demo` sayfası** oluşturuldu → kayıt olmadan interaktif panel — Emma (çocuk), Liam (genç), John (iş) profilleri arasında geçiş, kurallar ve aktivite görüntüleme
4. **Hero'da** "How does it work?" → "Live Demo →" butonu olarak güncellendi

---

## Bekleyen İşler

| Görev | Öncelik | Durum | Not |
|---|---|---|---|
| Cloudflare DNS Worker deploy | Yüksek | ✅ | `guardian-dns-worker.talipclk1988.workers.dev` — canlı, 405/401 doğrulandı |
| Mobile app Supabase bağlantısı | Orta | ⏳ | `apps/mobile/.env` → `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY` |
| Şifre sıfırlama e-postası adı | Düşük | ⏳ | Supabase dashboard → Auth → SMTP → Sender name: "Guardian" |
| Custom domain | Düşük | ⏳ | Vercel dashboard → Domains |
| Mobile app Expo Go uyumu | Düşük | ⏳ | SDK 53 + Expo Go versiyonu eşleşince test |

---

---

### 12. Agent Takımı + Langfuse Kurulumu (2026-06-14)

Rehber: `Guardian_Agent_Team_Rehberi.docx`

**Oluşturulan dosyalar:**

| Dosya | Açıklama |
|---|---|
| `CLAUDE.md` | Orchestrator ana beyin — Claude Code her açılışta okur |
| `agents/00_LEAD_DEVELOPER.md` | Lead Developer — sprint koordinasyonu |
| `agents/01_SENIOR_DEVELOPER.md` | Senior Developer — DNS Worker, backend API |
| `agents/02_CYBERSECURITY_EXPERT.md` | Cybersecurity Expert — TRACE döngüsü, tarama |
| `agents/03_TESTER.md` | Tester — enforcement, PIN, profil testleri |
| `agents/04_RESEARCHER.md` | Researcher — CVE takibi, rakip analiz |
| `agents/05_REVIEWER.md` | Reviewer — PR review, kırmızı çizgi kontrolü |
| `security/scan-instructions.txt` | Guardian'a özel güvenlik tarama talimatları |
| `security/false-positive-filter.txt` | False positive filtresi |
| `security/threat-model.md` | Tehdit modeli — kritik yüzeyler |
| `.github/workflows/security-review.yml` | Her PR'da otomatik Anthropic security review |
| `scripts/langfuse-sync.ts` | Agent log'larını Langfuse'a gönderir |
| `.claude/mcp_settings.json` | MCP filesystem bağlantısı |

**Referans repolar (02_CYBERSECURITY_EXPERT.md'de belgelenmiş):**
- `anthropics/claude-code-security-review` → GitHub Action + tarama kategorileri
- `aliasrobotics/cai` → TRACE döngüsü, security orchestration
- `ElNiak/awesome-ai-cybersecurity` → araç kataloğu

**Langfuse:** `package.json`'a eklendi (`langfuse ^3.38.20`)

**Kalan adımlar:**
- `cloud.langfuse.com` → proje oluştur → key'leri `.env`'e ekle
- GitHub repo → Settings → Secrets → `CLAUDE_API_KEY` ekle

---

## Supabase Proje Bilgileri

- **Project ref:** `szyuvymdilnxbjzcpmkt`
- **Dashboard:** `https://supabase.com/dashboard/project/szyuvymdilnxbjzcpmkt`
- **URL:** `https://szyuvymdilnxbjzcpmkt.supabase.co`
