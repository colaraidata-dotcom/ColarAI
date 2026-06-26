-- Migration 003: content hub tables (catalog + scores + platform availability + criteria)
-- These were defined in schema.sql but never extracted/applied to the live DB.
-- Required by the content discovery feature (/api/content/catalog + /criteria),
-- the fail-safe defaults (#4) and the value-profile presets (#5).
-- All `create ... if not exists`; no existing data is touched.

create table if not exists public.content_catalog (
  id              text primary key,           -- tmdb:{type}:{tmdb_id}
  tmdb_id         integer not null,
  content_type    text not null check (content_type in ('movie','series')),
  title           text not null,
  original_title  text,
  description     text,
  release_year    integer,
  genres          text[] not null default '{}',
  poster_url      text,
  backdrop_url    text,
  tmdb_rating     numeric(3,1),
  tmdb_vote_count integer not null default 0,
  runtime_minutes integer,
  age_rating      text,                        -- G, PG, PG-13, R, TV-Y, TV-14...
  platforms       text[] not null default '{}', -- netflix|disney|prime|apple
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists content_catalog_tmdb_idx on public.content_catalog(tmdb_id, content_type);
create index if not exists content_catalog_platforms_idx on public.content_catalog using gin(platforms);
create index if not exists content_catalog_genres_idx on public.content_catalog using gin(genres);

create table if not exists public.content_scores (
  content_id          text primary key references public.content_catalog(id) on delete cascade,
  violence            numeric(3,1) not null default 0,
  language            numeric(3,1) not null default 0,
  sexual_content      numeric(3,1) not null default 0,
  fear_factor         numeric(3,1) not null default 0,
  substance_use       numeric(3,1) not null default 0,
  themes              jsonb not null default '{}'::jsonb,
  recommended_min_age integer not null default 0,
  guardian_safe_age   integer not null default 0,
  data_sources        text[] not null default '{}',
  scored_at           timestamptz not null default now(),
  score_version       integer not null default 1
);

create table if not exists public.platform_availability (
  id          bigserial primary key,
  content_id  text not null references public.content_catalog(id) on delete cascade,
  platform    text not null check (platform in ('netflix','disney','prime','apple','hbo')),
  deep_link   text,
  countries   text[] not null default '{"TR","US","GB"}',
  updated_at  timestamptz not null default now(),
  unique (content_id, platform)
);

create index if not exists platform_avail_content_idx on public.platform_availability(content_id);

create table if not exists public.content_criteria (
  profile_id          text primary key references public.profiles(id) on delete cascade,
  max_violence        numeric(3,1) not null default 2,
  max_language        numeric(3,1) not null default 2,
  max_sexual_content  numeric(3,1) not null default 1,
  max_fear_factor     numeric(3,1) not null default 3,
  max_substance_use   numeric(3,1) not null default 1,
  allowed_genres      text[] not null default '{}',
  blocked_themes      text[] not null default '{}',
  allowed_platforms   text[] not null default '{"netflix","disney","prime","apple"}',
  min_fit_score       integer not null default 70,
  updated_at          timestamptz not null default now()
);

-- RLS: catalog/scores/availability are public read (no user data);
-- criteria is scoped to the owning account's profiles.
alter table public.content_catalog       enable row level security;
alter table public.content_scores        enable row level security;
alter table public.platform_availability enable row level security;
alter table public.content_criteria      enable row level security;

create policy "content_catalog: public read" on public.content_catalog
  for select using (true);

create policy "content_scores: public read" on public.content_scores
  for select using (true);

create policy "platform_availability: public read" on public.platform_availability
  for select using (true);

create policy "content_criteria: own profile" on public.content_criteria
  for all using (
    profile_id in (select id from public.profiles where account_id = auth.uid())
  );
