-- Migration 002: shared, persistent domain category cache
-- Lets the DNS worker resolve a domain's category once (AI/feed) and reuse it
-- across all users (cache-first), instead of re-classifying per edge in KV only.
-- A row with category = null is a negative cache (known-uncategorized).

create table if not exists public.domain_categories (
  domain      text primary key,
  category    text,
  source      text not null default 'ai' check (source in ('ai','feed','manual')),
  updated_at  timestamptz not null default now()
);

-- No user data; only the worker's service role touches it (bypasses RLS).
-- RLS on + no policy keeps anon/auth roles locked out.
alter table public.domain_categories enable row level security;
