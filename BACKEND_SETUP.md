# Guardian Backend Setup

## 1. Supabase Projesi Oluştur

1. https://app.supabase.com → "New project"
2. Organization seç, proje adı "guardian", şifre belirle, **EU (Frankfurt)** region seç (GDPR)
3. Proje oluşturulana kadar bekle (~2 dakika)

## 2. Database Schema'sını Kur

1. Supabase Dashboard → **SQL Editor** → "New query"
2. `supabase/schema.sql` dosyasının içeriğini yapıştır → **Run**
3. Hata yoksa devam et

## 3. Environment Variables

`apps/web/.env.local` dosyası oluştur:

```bash
cp apps/web/.env.local.example apps/web/.env.local
```

Supabase Dashboard → **Settings → API** sayfasından al:
- `NEXT_PUBLIC_SUPABASE_URL` → "Project URL"
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → "anon public" key
- `SUPABASE_SERVICE_ROLE_KEY` → "service_role" key (gizli tut!)

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJ...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJ...
DNS_WORKER_SECRET=rastgele_bir_string_buraya
```

## 4. DNS Worker (Cloudflare)

### Gereksinimler
- Cloudflare hesabı (ücretsiz)
- `npm install -g wrangler && wrangler login`

### Deploy

```bash
cd apps/dns-worker
npm install
wrangler kv:namespace create DNS_CACHE
# Çıkan ID'yi wrangler.toml'daki "YOUR_KV_NAMESPACE_ID" ile değiştir

wrangler secret put SUPABASE_URL
# → Supabase URL'ini gir

wrangler secret put SUPABASE_SERVICE_KEY
# → service_role key'ini gir

wrangler deploy
# → DNS Worker URL'ini not al
```

### DNS_RESOLVER_URL Environment Variable

`.env.local`'a ekle:
```env
DNS_RESOLVER_URL=https://guardian-dns-worker.YOUR_SUBDOMAIN.workers.dev
```

## 5. Supabase Auth Ayarları

Supabase Dashboard → **Authentication → URL Configuration**:
- Site URL: `http://localhost:3000` (dev) / production URL
- Redirect URLs: `http://localhost:3000/api/auth/callback`

## 6. Uygulama Akışı

```
Kullanıcı kayıt olur (sign-up)
    ↓ Supabase Auth otomatik account_settings row oluşturur (trigger)
    ↓
Profil oluşturur (örn. "Emma", type: "child")
    ↓ seed_default_rules() çağrılarak default kurallar eklenir
    ↓
Cihaz ekler (telefon/tablet)
    ↓ POST /api/device/register → device_token döner
    ↓
Telefona Guardian app kurulur
    ↓ device_token ile DNS sunucusu ayarlanır
    ↓ Her DNS sorgusu Guardian DNS Worker'dan geçer
    ↓ Profile kurallarına göre izin/blok
    ↓ access_logs tablosuna kayıt
    ↓ Dashboard'da anlık görünür
```

## 7. Cihaz Bağlantı Testi

```bash
# Cihaz kaydı (mobile app bunu yapacak)
curl -X POST http://localhost:3000/api/device/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SUPABASE_JWT_TOKEN" \
  -d '{"display_name":"Emma iPad","platform":"ios","profile_id":"prof_xxx"}'

# Heartbeat (mobile app 5 dakikada bir çağırır)
curl -X POST http://localhost:3000/api/device/heartbeat \
  -H "Authorization: Bearer DEVICE_TOKEN"
```

## 8. Güvenlik Checklist

- [ ] `SUPABASE_SERVICE_ROLE_KEY` asla client-side'a expose edilmemeli
- [ ] Supabase RLS'nin açık olduğunu kontrol et (schema.sql bunu yapıyor)
- [ ] DNS Worker'a sadece bilinen device_token'ları erişmeli
- [ ] Production'da HTTPS zorunlu
- [ ] Supabase → Authentication → Enable email confirmations (açık olsun)
