-- Operator verification after call_click_events exists.
-- These are leads, not billed conversions. Run in the SQL editor (service role).
-- Anon clients cannot SELECT this table.

-- 1. Rows landed after SQL apply
select count(*) as click_leads
from public.call_click_events
where created_at >= now() - interval '24 hours';

-- 2. ZIP × language × CTA placement
select
  coalesce(zip_code, '(none)') as zip_code,
  locale,
  placement,
  count(*) as clicks
from public.call_click_events
where created_at >= now() - interval '14 days'
group by 1, 2, 3
order by clicks desc, zip_code, locale, placement;

-- 3. Do not join to revenue here. Compare later to MarketCall valid/paid calls.
