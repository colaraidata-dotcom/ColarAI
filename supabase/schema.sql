-- Guardian Database Schema
-- Run this in Supabase SQL Editor: https://app.supabase.com → SQL Editor

-- ─── ACCOUNT SETTINGS ──────────────────────────────────────────────────────
-- One row per user, auto-created after signup via trigger

create table if not exists public.account_settings (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  notification_prefs jsonb not null default '{"access_request":true,"weekly_report":true,"device_added":true,"limit_reached":true,"tamper_attempt":true}'::jsonb,
  subscription_tier  text not null default 'free' check (subscription_tier in ('free','basic','family')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-create account_settings row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.account_settings (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── PROFILES ──────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id                    text primary key,
  account_id            uuid not null references auth.users(id) on delete cascade,
  display_name          text not null,
  type                  text not null check (type in ('child','teen','adult_self','adult_unrestricted')),
  avatar_emoji          text not null default '👤',
  avatar_color          text not null default '#0EA5E9',
  is_active             boolean not null default true,
  is_paused             boolean not null default false,
  pause_until           timestamptz,
  daily_limit_minutes   integer check (daily_limit_minutes > 0),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ─── DEVICES ───────────────────────────────────────────────────────────────

create table if not exists public.devices (
  id            text primary key,
  profile_id    text references public.profiles(id) on delete set null,
  account_id    uuid not null references auth.users(id) on delete cascade,
  display_name  text not null,
  platform      text not null check (platform in ('ios','android','macos','windows')),
  device_token  text unique,
  is_online     boolean not null default false,
  last_seen_at  timestamptz,
  created_at    timestamptz not null default now()
);

-- Index for fast device_token lookup (DNS worker queries this on every DNS request)
create index if not exists devices_device_token_idx on public.devices(device_token);

-- ─── CONTENT RULES ─────────────────────────────────────────────────────────

create table if not exists public.content_rules (
  id                    text primary key,
  profile_id            text not null references public.profiles(id) on delete cascade,
  category              text not null,
  action                text not null check (action in ('allow','block','limit')),
  daily_limit_minutes   integer check (daily_limit_minutes > 0),
  created_at            timestamptz not null default now(),
  unique (profile_id, category)
);

-- ─── SCHEDULES ─────────────────────────────────────────────────────────────

create table if not exists public.schedules (
  id          text primary key,
  profile_id  text not null references public.profiles(id) on delete cascade,
  label       text not null,
  start_time  text not null,  -- HH:MM (24h)
  end_time    text not null,  -- HH:MM (24h)
  days        text[] not null, -- ['Mon','Tue','Wed',...]
  action      text not null check (action in ('block_all','allow_all')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ─── SITE OVERRIDES ────────────────────────────────────────────────────────

create table if not exists public.site_overrides (
  id          text primary key,
  profile_id  text not null references public.profiles(id) on delete cascade,
  domain      text not null,
  action      text not null check (action in ('allow','block')),
  created_at  timestamptz not null default now(),
  unique (profile_id, domain)
);

-- ─── ACCESS LOGS ───────────────────────────────────────────────────────────
-- Written by DNS Worker via service key (bypasses RLS)
-- domain_hash: SHA-256 of domain — no raw URL stored for privacy

create table if not exists public.access_logs (
  id            bigserial primary key,
  device_id     text references public.devices(id) on delete set null,
  profile_id    text references public.profiles(id) on delete set null,
  domain_hash   text not null,
  domain        text,            -- nullable: only if user opted into full logging
  action        text not null check (action in ('allowed','blocked','limited')),
  category      text,
  created_at    timestamptz not null default now()
);

-- Partition by day for performance (important: logs can be millions of rows)
create index if not exists access_logs_created_at_idx on public.access_logs(created_at desc);
create index if not exists access_logs_profile_id_idx on public.access_logs(profile_id);

-- ─── ACCESS REQUESTS ───────────────────────────────────────────────────────

create table if not exists public.access_requests (
  id            text primary key,
  device_id     text references public.devices(id) on delete set null,
  profile_id    text references public.profiles(id) on delete set null,
  account_id    uuid not null references auth.users(id) on delete cascade,
  domain        text not null,
  reason        text,
  status        text not null default 'pending' check (status in ('pending','approved','denied')),
  responded_at  timestamptz,
  created_at    timestamptz not null default now()
);

-- ─── NOTIFICATIONS ─────────────────────────────────────────────────────────

create table if not exists public.notifications (
  id          text primary key,
  account_id  uuid not null references auth.users(id) on delete cascade,
  type        text not null check (type in ('access_request','weekly_report','device_added','limit_reached','tamper_attempt')),
  title       text not null,
  body        text not null,
  is_read     boolean not null default false,
  related_id  text,
  created_at  timestamptz not null default now()
);

-- ─── PENDING OVERRIDES ─────────────────────────────────────────────────────
-- Scheduled rule relaxations (e.g. pause filtering for 30 min)

create table if not exists public.pending_overrides (
  id            text primary key,
  profile_id    text not null references public.profiles(id) on delete cascade,
  account_id    uuid not null references auth.users(id) on delete cascade,
  override_type text not null check (override_type in ('pause','allow_domain','extend_limit')),
  domain        text,
  duration_minutes integer not null default 30,
  apply_at      timestamptz not null default now(),
  applied       boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ─── SIGN-IN RATE LIMITING ─────────────────────────────────────────────────
-- Tracks failed sign-in attempts per IP+email combo

create table if not exists public.sign_in_attempts (
  id            bigserial primary key,
  key           text not null,    -- ip:email
  attempted_at  timestamptz not null default now()
);

create index if not exists sign_in_attempts_key_idx on public.sign_in_attempts(key, attempted_at desc);

-- ─── ROW LEVEL SECURITY ────────────────────────────────────────────────────

alter table public.account_settings   enable row level security;
alter table public.profiles            enable row level security;
alter table public.devices             enable row level security;
alter table public.content_rules       enable row level security;
alter table public.schedules           enable row level security;
alter table public.site_overrides      enable row level security;
alter table public.access_logs         enable row level security;
alter table public.access_requests     enable row level security;
alter table public.notifications       enable row level security;
alter table public.pending_overrides   enable row level security;

-- account_settings: user owns their row
create policy "account_settings: own data" on public.account_settings
  for all using (id = auth.uid());

-- profiles: user owns profiles in their account
create policy "profiles: own account" on public.profiles
  for all using (account_id = auth.uid());

-- devices: user owns devices in their account
create policy "devices: own account" on public.devices
  for all using (account_id = auth.uid());

-- content_rules: accessible if user owns the profile
create policy "content_rules: own profile" on public.content_rules
  for all using (
    profile_id in (select id from public.profiles where account_id = auth.uid())
  );

-- schedules
create policy "schedules: own profile" on public.schedules
  for all using (
    profile_id in (select id from public.profiles where account_id = auth.uid())
  );

-- site_overrides
create policy "site_overrides: own profile" on public.site_overrides
  for all using (
    profile_id in (select id from public.profiles where account_id = auth.uid())
  );

-- access_logs: read-only for device owner (DNS worker writes via service key)
create policy "access_logs: read own" on public.access_logs
  for select using (
    profile_id in (select id from public.profiles where account_id = auth.uid())
  );

-- access_requests: user owns requests for their account
create policy "access_requests: own account" on public.access_requests
  for all using (account_id = auth.uid());

-- notifications
create policy "notifications: own account" on public.notifications
  for all using (account_id = auth.uid());

-- pending_overrides
create policy "pending_overrides: own account" on public.pending_overrides
  for all using (account_id = auth.uid());

-- ─── SEED: Default content rules for new profiles ──────────────────────────
-- Call this function after creating a profile to insert default rules

create or replace function public.seed_default_rules(p_profile_id text, p_profile_type text)
returns void language plpgsql security definer as $$
declare
  rules jsonb;
begin
  -- Default rules by profile type
  rules := case p_profile_type
    when 'child' then '[
      {"category":"adult_content","action":"block"},
      {"category":"social_media","action":"block"},
      {"category":"gaming","action":"limit","daily_limit_minutes":60},
      {"category":"gambling","action":"block"},
      {"category":"streaming","action":"limit","daily_limit_minutes":120},
      {"category":"education","action":"allow"},
      {"category":"news","action":"allow"},
      {"category":"shopping","action":"block"}
    ]'::jsonb
    when 'teen' then '[
      {"category":"adult_content","action":"block"},
      {"category":"social_media","action":"limit","daily_limit_minutes":90},
      {"category":"gaming","action":"limit","daily_limit_minutes":120},
      {"category":"gambling","action":"block"},
      {"category":"streaming","action":"allow"},
      {"category":"education","action":"allow"},
      {"category":"news","action":"allow"},
      {"category":"shopping","action":"allow"}
    ]'::jsonb
    when 'adult_self' then '[
      {"category":"adult_content","action":"allow"},
      {"category":"social_media","action":"block"},
      {"category":"gaming","action":"block"},
      {"category":"gambling","action":"block"},
      {"category":"streaming","action":"limit","daily_limit_minutes":60},
      {"category":"education","action":"allow"},
      {"category":"news","action":"allow"},
      {"category":"shopping","action":"allow"}
    ]'::jsonb
    else '[
      {"category":"adult_content","action":"allow"},
      {"category":"social_media","action":"allow"},
      {"category":"gaming","action":"allow"},
      {"category":"gambling","action":"allow"},
      {"category":"streaming","action":"allow"},
      {"category":"education","action":"allow"},
      {"category":"news","action":"allow"},
      {"category":"shopping","action":"allow"}
    ]'::jsonb
  end;

  insert into public.content_rules (id, profile_id, category, action, daily_limit_minutes)
  select
    'rule_' || p_profile_id || '_' || (rule->>'category'),
    p_profile_id,
    rule->>'category',
    rule->>'action',
    (rule->>'daily_limit_minutes')::integer
  from jsonb_array_elements(rules) as rule
  on conflict (profile_id, category) do nothing;
end;
$$;
