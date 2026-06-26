-- Migration 004: privacy-respecting harm-signal alerts
-- Adds a new notification type 'harm_signal' (derived from DNS access patterns,
-- not message content) and enables it by default in notification preferences.

-- 1. Allow the new notification type.
alter table public.notifications drop constraint if exists notifications_type_check;
alter table public.notifications add constraint notifications_type_check
  check (type in ('access_request','weekly_report','device_added','limit_reached','tamper_attempt','harm_signal'));

-- 2. Default new accounts to harm_signal = true.
alter table public.account_settings
  alter column notification_prefs
  set default '{"access_request":true,"weekly_report":true,"device_added":true,"limit_reached":true,"tamper_attempt":true,"harm_signal":true}'::jsonb;

-- 3. Backfill existing rows that lack the key (default to enabled).
update public.account_settings
set notification_prefs = notification_prefs || '{"harm_signal":true}'::jsonb
where not (notification_prefs ? 'harm_signal');
