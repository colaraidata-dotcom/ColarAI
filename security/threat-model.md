# Guardian — Tehdit Modeli

Son güncelleme: 2026-06-14

## Genel Bağlam

Guardian çocukların verilerini işler, ağ trafiğini intercepting eder ve ebeveyn kontrolü mekanizmaları içerir. Bu üç özellik en yüksek risk kategorilerini belirler.

## Tehdit Yüzeyi

| Yüzey | Tehdit | Kontrol | Öncelik |
|-------|--------|---------|---------|
| DNS/VPN interceptor | Man-in-the-middle, sertifika bypass | Certificate pinning, TLS doğrulama | KRİTİK |
| PIN koruması | Brute-force, bypass yolları | Lockout mekanizması, PIN hashing | KRİTİK |
| Child profil tamper resistance | Uygulama kapatma, DNS değiştirme | OS seviyesi koruma, izin kontrolü | KRİTİK |
| Browsing verisi | PII sızıntısı, cloud'a fazla veri | On-device işleme, minimal log | YÜKSEK |
| Override request akışı | Parent PIN'i çalma, sahte istek | İstek doğrulama, imzalama | YÜKSEK |
| Classification API | Prompt injection, API key sızıntısı | Input sanitize, secret rotation | ORTA |

## Kırmızı Çizgiler (Kod Değişikliği ile İhlal Edilemez)

1. Child profil aktifken Guardian kapatılamaz
2. Child profilden adult profile geçiş yapılamaz
3. PIN bypass yolu açılamaz
4. Browsing geçmişi kullanıcı onayı olmadan cloud'a gönderilemez

## Bilinen Sınırlar (Kabul Edilmiş Risk)

- **Cellular ağ**: DNS-over-HTTPS cellular ağda bypass edilebilir. Bu işletim sistemi düzeyinde bir sınırdır. Her ilgili kod satırına `// KNOWN LIMIT: cellular bypass possible, documented in threat-model.md` yorumu ekle. Kullanıcı arayüzünde belirt.
- **iOS App Store süreci**: Network Extension entitlement review'ı uzundur (~2-4 hafta). Erken başlanmalı.

## Güvenlik Tarama Geçmişi

Raporlar: `security/reports/` klasöründe tarihli olarak saklanır.
