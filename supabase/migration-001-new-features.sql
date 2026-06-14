-- Guardian Migration 001 — New Features
-- Run in Supabase SQL Editor AFTER schema.sql

-- ─── PAUSE INTERNET ────────────────────────────────────────────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_paused boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pause_until timestamptz;

-- ─── SELF-CONTROL DELAY OVERRIDE ──────────────────────────────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS override_delay_minutes integer NOT NULL DEFAULT 0;

-- ─── PENDING OVERRIDES ─────────────────────────────────────────────────────
-- Stores future rule changes for adult_self profiles with a delay set
CREATE TABLE IF NOT EXISTS public.pending_overrides (
  id            text primary key,
  profile_id    text not null references public.profiles(id) on delete cascade,
  category      text not null,
  new_action    text not null check (new_action in ('allow','block','limit')),
  new_daily_limit_minutes integer,
  apply_at      timestamptz not null,
  applied       boolean not null default false,
  created_at    timestamptz not null default now()
);

ALTER TABLE public.pending_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pending_overrides: own profile" ON public.pending_overrides
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE account_id = auth.uid())
  );

-- Index for cron job query
CREATE INDEX IF NOT EXISTS pending_overrides_apply_at_idx
  ON public.pending_overrides(apply_at)
  WHERE applied = false;
