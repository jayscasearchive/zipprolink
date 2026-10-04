-- Prepared only. Do not apply until an operator reviews this file.
-- Rollback = stop the app from writing/reading these tables. Keep the rows.
-- Do not DROP tables as the default recovery step.

create table if not exists public.service_coverage (
  zip_code text not null references public.zip_codes (zip_code) on delete cascade,
  service_slug text not null,
  status text not null check (status in ('active', 'paused', 'blocked')),
  source text not null check (source in ('campaign', 'vendor', 'manual')),
  verified_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  primary key (zip_code, service_slug)
);

create index if not exists service_coverage_service_status_idx
  on public.service_coverage (service_slug, status);

alter table public.service_coverage enable row level security;

-- No anon policies. The Next.js API inserts call_click_events with the
-- service role (bypasses RLS). Anon key in the browser cannot INSERT/SELECT.

create table if not exists public.call_click_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  path text not null,
  locale text not null check (locale in ('en', 'es')),
  placement text not null check (placement in ('header', 'hero', 'sticky', 'footer')),
  zip_code text,
  service_slug text
);

create index if not exists call_click_events_created_at_idx
  on public.call_click_events (created_at desc);

create index if not exists call_click_events_rollup_idx
  on public.call_click_events (zip_code, locale, placement, created_at desc);

alter table public.call_click_events enable row level security;

revoke all on public.service_coverage from anon, authenticated;
revoke all on public.call_click_events from anon, authenticated;
