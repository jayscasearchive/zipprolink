# ZipProLink — PROJECT_CONTEXT

Handoff document for another AI reading this repo for the first time.

**Rule:** This file describes **current code state only**. It is not a work log. Update it when architecture, URLs, data, SEO, tracking, or deploy mechanics change.

**Last verified against the repo:** 2026-10-04  
**Repo:** `https://github.com/jayscasearchive/zipprolink.git`  
**Latest app commit at write time:** `760783c` (`fix(seo): 308 stray /& URL to homepage for GSC 404`)

---

## 1. Project Overview

### Purpose

ZipProLink is a **Texas emergency-locksmith referral directory**, not a locksmith company. Pages match a caller to independent licensed technicians via a tracking phone number. Copy and schema must not claim ZipProLink employs techs or is itself a locksmith.

Business source of truth (also in `.cursor/rules/zipprolink-ssot.mdc` and `src/lib/ssot.ts`):

- **Phase 1 (active):** Texas (`TX`) + Emergency Locksmith (`locksmith`)
- **Later:** Florida, then Georgia; plumbing, then water-damage
- Do not generate pSEO for other states or niches until the current phase is done

### Implemented features

- Locale-aware directory: home, city hubs, county hubs, ZIP landing pages (`en` / `es`)
- ZIP search that resolves coverage via `/api/directory/lookup` and routes to the canonical ZIP URL
- Deterministic per-ZIP copy variation (4 intents × EN/ES packs)
- Neighbor ZIP mesh (Haversine, 10 miles, optional same-city/county ≤25 miles)
- JSON-LD (`EmergencyService`, FAQ, breadcrumb), canonical, hreflang, sitemap, robots
- Call CTAs (`tel:`) + mobile sticky call bar
- TX DPS / referral / TCPA / availability disclaimers
- IndexNow submit endpoint
- ZIP upsert CLI from JSON batches into Supabase

### Tech stack

| Layer | Choice |
|---|---|
| App | Next.js **16.3.1** (App Router), React **19.2.8**, TypeScript |
| Styling | Tailwind CSS **4** (`@tailwindcss/postcss`) |
| Data | Supabase JS client (`@supabase/supabase-js`) |
| Icons | `lucide-react` |
| Fonts | `next/font` Geist / Geist Mono |
| Lint | ESLint 9 + `eslint-config-next` 16.3.1 |

There is **no** Google Analytics, GTM, or other analytics package in source.

### Deploy

- Host: **Vercel** (GitHub `main` → Production). No `vercel.json` in repo.
- Public site: `https://www.zipprolink.com` (`SITE_URL` forces apex `zipprolink.com` → `www`)
- GSC verification HTML lives under `public/`. Bing verification is a meta tag in `src/app/layout.tsx` (`verification.other["msvalidate.01"]`), not a `public/` HTML file.

### Where data comes from

1. **Supabase tables (runtime / SSG):**
   - `zip_codes` — one row per ZIP (upsert on `zip_code`)
   - `service_categories` — service slug, price band, response time, optional `phone_en` / `phone_es`
2. **Batch JSON (offline inject):** `scripts/data/*.json` → `npm run zips:upsert -- scripts/data/<file>.json` (service-role key from `.env.local`, TX-only in current phase)
3. **Code SSOT:** `src/lib/ssot.ts` filters page generation to phase 1 (`locksmith` + `TX`) even if extra rows exist in the DB
4. **Copy packs:** `src/lib/variation/pools.ts` (EN), `src/lib/variation/es-blocks.ts` (ES), dictionaries in `src/lib/i18n.ts`

Env used by the app (names only; values are not documented here):

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Optional: `NEXT_PUBLIC_PHONE_EN`, `NEXT_PUBLIC_PHONE_EN_DISPLAY`, `NEXT_PUBLIC_PHONE_ES`, `NEXT_PUBLIC_PHONE_ES_DISPLAY`

Upsert scripts also require `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.

### How the site works (end to end)

1. Build/runtime loads phase TX locksmith ZIPs from Supabase.
2. `generateStaticParams` emits EN+ES params for each ZIP, each city that has ≥1 ZIP, and each county that has ≥1 ZIP.
3. `src/proxy.ts` maps public URLs onto the internal `/[locale]/...` tree, 308s `/en/...` to unprefixed English, 308s `/&` to `/`, 308s legacy `/locksmith/12345` style paths when resolvable, and **rewrites** (200) shortcuts like `/tx/houston/77005` to the internal ZIP page.
4. ZIP pages hash `(zip, service)` to pick an intent layout and interpolate city/ZIP/county/price/response into templates.
5. CTAs dial a MarketCall-style tracking DID via `tel:`.
6. Sitemap lists locale homes + city hubs + county hubs + ZIP URLs. Robots allow `/` and point at sitemap.

---

## 2. Project Structure

```
zipprolink/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root HTML, metadataBase, default title
│   │   ├── globals.css
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   ├── not-found.tsx
│   │   ├── [locale]/
│   │   │   ├── layout.tsx             # Header, footer, sticky call bar
│   │   │   ├── page.tsx               # Home
│   │   │   ├── not-found.tsx
│   │   │   └── [service]/[state]/
│   │   │       ├── [city]/page.tsx    # City hub
│   │   │       ├── [city]/[zip]/page.tsx
│   │   │       ├── [city]/[zip]/loading.tsx
│   │   │       └── county/[county]/page.tsx
│   │   └── api/
│   │       ├── directory/lookup/route.ts
│   │       └── indexnow/route.ts
│   ├── components/                    # UI (CTA, directory, legal, chrome)
│   ├── lib/                           # Data, paths, SEO, variation, SSOT
│   └── proxy.ts                       # Public URL rewrite/redirect
├── scripts/
│   ├── data/                          # ZIP batch JSON (west/north/east Houston)
│   ├── lib/env.mjs                    # Service-role client for upsert
│   ├── upsert-zip-codes.mjs
│   ├── inspect-neighbors.ts
│   └── inspect-intents.ts
├── public/                            # IndexNow key file, GSC verification HTML (Bing is layout meta, not here)
├── docs/                              # DECISIONS.md + worklog/
├── PROJECT_CONTEXT.md                 # This file
├── next.config.ts                     # Almost empty; routing lives in proxy
├── package.json
├── AGENTS.md / CLAUDE.md              # Next.js 16 agent notice
└── .cursor/rules/                     # SSOT + pSEO engineering rules
```

Omitted from analysis: `node_modules`, `.next`, caches, `.env*`.

### Role map

| Concern | Location |
|---|---|
| Pages | `src/app/[locale]/**` |
| Components | `src/components/` |
| Data access | `src/lib/directory.ts`, `src/lib/supabase.ts` |
| Batch ZIP files | `scripts/data/` |
| API | `src/app/api/directory/lookup`, `src/app/api/indexnow` |
| SEO | `generateMetadata` on pages, `src/lib/schema.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/lib/paths.ts`, `src/proxy.ts` |
| ZIP / city / county | `directory.ts`, `paths.ts`, `neighbors.ts`, hub/ZIP `page.tsx` files |
| Phone / CTA | `src/lib/i18n.ts` (`TRACKING_PHONE`, `getLocalePhone`), `CallToAction.tsx`, `StickyCallBar.tsx` |
| Sitemap | `src/app/sitemap.ts`, `src/lib/sitemap-urls.ts` |
| Robots | `src/app/robots.ts` |
| Schema | `src/lib/schema.ts` |
| Analytics | **Not implemented** |

---

## 3. Routing Structure

Public English URLs **omit** `/en` (`localePrefix: as-needed`). Spanish uses `/es/...`. App Router files still live under `src/app/[locale]/...`. Mapping is `toInternalPath()` in `src/lib/paths.ts`, applied by `src/proxy.ts`.

| Public URL | Internal file | Notes |
|---|---|---|
| `/` | `[locale]/page.tsx` with locale `en` | Rewrite |
| `/es` | `[locale]/page.tsx` | |
| `/locksmith/tx/{city}/{zip}` | `[locale]/[service]/[state]/[city]/[zip]/page.tsx` | Canonical ZIP (EN) |
| `/es/locksmith/tx/{city}/{zip}` | same | Canonical ZIP (ES) |
| `/locksmith/tx/{city}` | `[city]/page.tsx` | City hub (EN) |
| `/es/locksmith/tx/{city}` | same | City hub (ES) |
| `/locksmith/tx/county/{county}` | `county/[county]/page.tsx` | County hub; `county` segment avoids city slug collisions |
| `/es/locksmith/tx/county/{county}` | same | |
| `/tx/{city}/{zip}` | rewritten to internal EN ZIP page | **200 rewrite**, not 308 |
| `/en/...` | 308 to the same path without `/en` | `proxy.ts` |
| `/&` or `/%26` | 308 to `/` | GSC junk URL |
| Legacy `/locksmith/{zip}` (5-digit) | 308 to canonical directory path if coverage exists | `LEGACY_ZIP` in `proxy.ts` |

There is **no** dedicated state hub route such as `/locksmith/tx`.

`generateStaticParams`:

- ZIP: `getZipStaticParams()` — locales × phase ZIPs
- City: `getCityStaticParams()` — unique city slugs among phase ZIPs
- County: `getCountyStaticParams()` — counties with ≥1 coverage ZIP
- Locale layout: `en`, `es`

---

## 4. ZIP Page Generation

### Data source

Supabase `zip_codes`, filtered by `isPhaseCoverage("locksmith", state_id)` so only TX rows become pages (even if other states exist in DB).

Inject path: JSON in `scripts/data/` → `scripts/upsert-zip-codes.mjs` (rejects non-TX in current phase). Known batch files:

- `scripts/data/houston-west-zips.json`
- `scripts/data/houston-north-zips.json`
- `scripts/data/houston-east-zips.json`

Island metros (Austin/Dallas/San Antonio/etc.) also exist in the live DB (seen in GSC) but are not defined solely by those three Houston JSON files. **Exact live ZIP count is DB state, not committed as a number in code.** Needs verification against Supabase.

### ZIP row shape

`src/lib/types.ts` → `ZipCode`:

- `zip_code`, `city`, `county_name`, `state_id`, `state_name`
- `latitude`, `longitude`, `population`, `density`, `created_at`

JSON batches use the same fields. Upsert conflict target: `zip_code`.

### Generation logic

1. `getZipStaticParams()` builds `{ locale, service, state, city, zip }` for every phase ZIP × `en`/`es`.
2. Page: `src/app/[locale]/[service]/[state]/[city]/[zip]/page.tsx`
3. `getDirectoryPageData(service, zip)` (React `cache`) loads service + ZIP + neighbors.
4. If the ZIP is missing from coverage, or the city/state slug does not match the ZIP row → coverage-missing UI + `robots: noindex` in metadata. That HTML is **HTTP 200**, not JSON 404 and not `notFound()`. `notFound()` only when locale/phase is invalid.
5. `buildPageVariation` then `localizePageVariation` for ES.
6. Render `DirectoryPage` + JSON-LD.

### Static vs dynamic

- **SSG** via `generateStaticParams` (build log historically ~283 routes including homes/hubs/ZIPs; recount at next build).
- **ISR:** `export const revalidate = 86400` (24h) on ZIP, city, county, home, locale layout, sitemap.
- Lookup API is dynamic (`ƒ`).
- Unknown / out-of-coverage ZIP **page**: HTTP **200** + in-page coverage-missing UI + noindex meta (not JSON 404).
- Lookup API only: `GET /api/directory/lookup` returns **JSON 404** `{ error: "ZIP not in coverage" }` when the ZIP is not in phase coverage; JSON 400 for invalid ZIP format.

### What differs per ZIP

Unique (data-driven):

- City, state, ZIP, county, lat/lng, population, density band
- Neighbor list (distance mesh)
- Hashed **intent** (`emergency` | `compliance` | `neighborhood` | `cost`) → section order, hero panel, which headline variant
- Interpolated strings (H1, FAQ, meta, DPS, jobs table notes)
- Urban vs suburban copy (`density >= 5000` → urban)
- Urban job prices get a 1.08 multiplier

Shared:

- `DirectoryPage` layout shell, CTA, sticky bar, legal chrome, job **types** list structure, DPS notice component

### Content generation for ZIP body

Not AI-generated at request time. Not hand-written per ZIP.

- Templates in `EN_INTENTS` / `ES_INTENTS`
- `hashZipCode(zip, service.slug)` picks layout + hook + extra FAQs
- `CopyContext` fills `${city}` `${zip}` `${county}` price range, response time
- Job estimates from `locksmithJobs()` using service `avg_price_min` / `avg_price_max`

### City / county / state links

- Breadcrumb + JSON-LD: Home → County (if named) → City → ZIP (`src/lib/schema.ts`)
- Neighbor grid: other ZIP URLs
- City hub lists ZIPs in that city; county hub groups cities → ZIPs
- Home lists `TEST_CITIES` (hardcoded Houston/Austin/Dallas/San Antonio sample ZIPs) plus live county hub cards

### Key files

- `src/app/[locale]/[service]/[state]/[city]/[zip]/page.tsx`
- `src/components/DirectoryPage.tsx`
- `src/lib/directory.ts`
- `src/lib/neighbors.ts`
- `src/lib/variation/engine.ts`
- `src/lib/variation/pools.ts`
- `src/lib/variation/es-blocks.ts`
- `src/lib/variation/hash.ts`
- `src/lib/paths.ts`
- `scripts/upsert-zip-codes.mjs`

---

## 5. SEO Implementation

| Feature | Implementation | File |
|---|---|---|
| Title | ZIP: `variation.headline` as `absolute`; hubs: dictionary `cityHubH1` / `countyHubH1`; home: `homeH1` | ZIP/city/county/home `page.tsx`, `i18n.ts`, `es-blocks.ts` / `pools.ts` |
| Meta description | ZIP: `variation.metaDescription`; hubs: `cityHubLead` / `countyHubLead`; home: `homeLead` | same |
| Canonical | `alternates.canonical` = public `directoryPath` / `countyPath` / `localeHomePath` (no `/en` on English). `metadataBase` = www `SITE_URL` | pages + `constants.ts` |
| hreflang | `alternates.languages` en / es / x-default | pages |
| Robots.txt | `allow: /`, sitemap URL, `host: SITE_URL` | `src/app/robots.ts` |
| Per-page robots | `noindex, follow` on invalid locale metadata and ZIP city/state mismatch metadata | ZIP (and hub not-found metadata) |
| Sitemap | Daily rebuild list of homes + hubs + ZIPs | `sitemap.ts`, `sitemap-urls.ts` |
| Open Graph | title, description, url, siteName, type website | page `generateMetadata` |
| JSON-LD | `@graph`: BreadcrumbList, EmergencyService (address, geo, 24/7 hours, telephone, OfferCatalog), FAQPage | `schema.ts` |
| Internal links | Neighbors, city/county lists, home TEST_CITIES + county cards, locale switch | `DirectoryPage`, hub pages, home, `LocaleSwitch` |
| Visible breadcrumbs | City and county hub pages (nav). ZIP JSON-LD breadcrumb; ZIP visible crumb is location chips not a full crumb trail | hub `page.tsx`, `schema.ts` |
| H1 | ZIP: `variation.headline`; city/county: hub H1 functions; home: `homeH1` | `DirectoryPage.tsx`, hub/home pages |
| H2 | Variation section headings + hub list headings | `DirectoryPage`, i18n |
| Dynamic metadata | Yes, `generateMetadata` per route | pages |

English ZIP titles still often lead with year/cost/dispatch depending on hashed intent. Spanish emergency/cost/compliance/neighborhood headlines were updated to lead with `Cerrajero…` (see `es-blocks.ts`).

---

## 6. Content Generation

| Kind | Used? |
|---|---|
| Hand-written per ZIP | No |
| Templates + interpolation | Yes |
| Data-driven (ZIP/city/county/prices/neighbors) | Yes |
| Runtime AI generation | No |
| Hash-selected variants | Yes (4 layouts, 2 hooks, extra FAQs) |

**Common across ZIP pages:** layout components, legal, CTA, job categories, process step structure, DPS component.

**Unique per ZIP:** numbers and names in strings, neighbor set, density band, which intent template, which extra FAQs, slightly scaled job prices if urban.

City/county hubs are **not** the intent engine; they use dictionary H1/lead + lists of child URLs.

Home copy is dictionary-only plus hardcoded `TEST_CITIES`.

---

## 7. Geographic Data Architecture

There is no separate `states` / `cities` / `counties` table. Geography is **denormalized on each ZIP row**.

```
state_id / state_name
  └── county_name (optional string)
        └── city
              └── zip_code (PK)
```

- City slug: `citySlug()` in `paths.ts` (NFKD, lowercase, hyphen)
- County slug: strip trailing ` County`, then same slug rules
- County URL always `/[service]/[state]/county/[county]` so a city named like a county cannot collide
- Hubs are derived: `getCityHubData` filters phase ZIPs by state + city slug; `getCountyHubData` groups remaining ZIPs by city
- Neighbors: all same-`state_id` ZIPs with coordinates, ranked by Haversine; keep ≤10 miles (max 8); if &lt;4, fill same city or county ≤25 miles; **never pad statewide**

Related files: `types.ts`, `directory.ts`, `neighbors.ts`, `paths.ts`, `ssot.ts`, `scripts/data/*.json`.

---

## 8. Pay-Per-Call Implementation

| Piece | Current code |
|---|---|
| Default tracking DID | `TRACKING_PHONE` in `i18n.ts`: display `(833) 567-5849`, e164 `+18335675849` (MarketCall; committed in source) |
| Env override | `NEXT_PUBLIC_PHONE_EN*` / `NEXT_PUBLIC_PHONE_ES*` if not placeholder |
| Per-service DB override | `service_categories.phone_en` / `phone_es` via `getLocalePhone` |
| Placeholder detection | Empty, too-short, or all-zero numbers fall back to `TRACKING_PHONE` |
| Call Now UI | `CallToAction` → `<a href={phone.tel}>` |
| Mobile sticky | `StickyCallBar` (`md:hidden`, bottom, `z-50`) wraps sticky variant CTA: `Call Now · {number}` |
| Header / footer | Header compact CTA; footer number link |
| Schema telephone | `buildPageJsonLd` → `EmergencyService.telephone` |
| Call tracking vendor JS | **Not in repo** (number swap is the tracking mechanism) |
| Conversion / GA / GTM events | **Not implemented** |
| IVR hint | Dictionary `ivr` string above hero CTA |

`constants.ts` still exports `HOTLINE_*` aliases of EN DID and unused `STICKY_TRUST_BADGES` (UI badges come from `i18n.stickyBadges` / `TrustBadges`).

---

## 9. User Conversion Flow

```
Search / sitemap / typed URL
  → proxy (308 /en or /&; rewrite /tx/... or unprefixed EN)
  → Locale layout (header CTA + sticky bar)
  → Home (ZIP search) OR city/county hub OR ZIP DirectoryPage
  → CallToAction tel: link
  → Device dialer → tracking DID (MarketCall)
```

Home search: client `DirectorySearch` → `GET /api/directory/lookup?zip=&service=` → `router.push` canonical ZIP path.

Conversion-affecting UI (code):

- Hero `CallToAction` (large button + IVR + compact referral disclaimer)
- Sticky call bar (mobile only)
- Header CTA
- Footer CTA + full disclaimers (`ReferralDisclaimer`, availability copy)
- Trust badges on ZIP pages
- Price table + FAQ (intent to call, not a second conversion pixel)

No on-page form beyond ZIP search. No click event analytics.

---

## 10. Sitemap / Indexing

`getSitemapUrlList()` concatenates, in order:

1. Locale homes (`/` and `/es`)
2. Every city hub (en+es)
3. Every county hub (en+es)
4. Every ZIP page (en+es)

All use `SITE_URL` (www). English entries have **no** `/en`.

`sitemap.ts`: `lastModified = now`, `changeFrequency` daily for first two URLs else weekly, priority 1 / 0.8 / 0.7 by path depth. `revalidate = 86400`.

Robots: allow all user agents `/`; sitemap + host www.

Canonical: self-canonical public path. English `/en` URLs are 308, so they should not appear in sitemap.

Pagination: **none**.

noindex: invalid locale metadata; ZIP page when the ZIP is missing or city/state slug does not match. Coverage-missing ZIP HTML is still **HTTP 200** with meta `robots: noindex` (not an HTTP 404, and not the lookup API’s JSON 404).

IndexNow: `GET|POST /api/indexnow` posts **entire** sitemap URL list to `api.indexnow.org`. Key file: `public/indexnow-key.txt` (must be publicly fetchable). Key constant is in `src/lib/indexnow.ts`.

GSC HTML file: `public/googlef69e6616b7cf7e92.html`. Bing: root layout `verification.other["msvalidate.01"]`.

---

## 11. Performance

| Topic | Current |
|---|---|
| SSG | Yes, `generateStaticParams` |
| ISR | `revalidate = 86400` on directory routes + sitemap |
| SSR | Locale layout still fetches service for chrome; APIs are dynamic |
| CSR | `DirectorySearch`, `FaqAccordion`, `HtmlLang`, `LocaleSwitch` |
| Images | No `next/image` usage in app components; lucide SVGs; Geist fonts |
| Lazy loading | No route-level image lazy strategy; ZIP `loading.tsx` exists |
| Caching | `getDirectoryPageData` wrapped in React `cache()`; neighbor query is per origin ZIP against all state ZIPs in memory |
| External scripts | IndexNow fetch from API route only (server). No GTM/GA in HTML |
| Fonts | `next/font` Google Geist |
| Proxy | Edge/middleware-style `src/proxy.ts`; can call `resolveCoverageLocation` (Supabase) on legacy ZIP URLs |

Risk: `getNeighboringZips` selects **all ZIPs in the state** then ranks in process. Fine at ~100 TX ZIPs; will get heavier if the table grows a lot.

---

## 12. Important Files

1. `src/lib/ssot.ts` — Phase lock (TX locksmith). Changing this generates the wrong state/niche pages.
2. `src/lib/paths.ts` — Canonical URL builders, shortcut → internal path, city/county slugs.
3. `src/proxy.ts` — Public 308/rewrite behavior (`/en`, `/tx/...`, `/&`, legacy ZIP).
4. `src/lib/directory.ts` — All SSG params and hub/ZIP data loading.
5. `src/lib/neighbors.ts` — Mesh rules (10 / 25 mile, no statewide padding).
6. `src/app/[locale]/[service]/[state]/[city]/[zip]/page.tsx` — Money pages: metadata + JSON-LD + DirectoryPage.
7. `src/components/DirectoryPage.tsx` — ZIP template (H1, CTA, sections, neighbors).
8. `src/lib/variation/engine.ts` — Assembles hashed intent copy.
9. `src/lib/variation/pools.ts` — English intent packs + jobs.
10. `src/lib/variation/es-blocks.ts` — Spanish intent packs (SERP titles for `cerrajero`).
11. `src/lib/schema.ts` — JSON-LD graph.
12. `src/lib/i18n.ts` — Locales, DIDs, dictionaries, hub H1s, legal ES/EN.
13. `src/lib/constants.ts` — SITE_URL www, TEST_CITIES, leftover hotline aliases.
14. `src/components/CallToAction.tsx` — tel: conversion control.
15. `src/components/StickyCallBar.tsx` — Mobile CRO bar.
16. `src/lib/sitemap-urls.ts` + `src/app/sitemap.ts` — What Google is invited to crawl.
17. `src/app/robots.ts` — Crawl policy.
18. `src/app/api/directory/lookup/route.ts` — Home search resolver.
19. `scripts/upsert-zip-codes.mjs` — How new ZIPs enter the DB.
20. `src/lib/supabase.ts` — Anon client; build fails without public env.
21. `src/app/[locale]/[service]/[state]/[city]/page.tsx` — City hubs.
22. `src/app/[locale]/[service]/[state]/county/[county]/page.tsx` — County hubs.
23. `src/app/[locale]/page.tsx` — Home.
24. `src/lib/types.ts` — ZIP/service/page data contracts.
25. `next.config.ts` — Confirms routing is not in Next redirects config.
26. `.cursor/rules/zipprolink-ssot.mdc` — Human/AI phase rules matching `ssot.ts`.

---

## 13. Current Issues / TODO

From **source**, not a wish list:

- **No TODO/FIXME comments** found in TS/TSX.
- `plumbing` / `water-damage` / FL / GA are **SSOT stubs only** (`status: "upcoming"`). No pages generated.
- `getServiceBySlug` falls back if `phone_en`/`phone_es` columns missing.
- `getPhaseServices` falls back to hard-coded phase name if DB has no matching active row.
- `isPlaceholderPhone` treats several all-zero numbers as missing.
- `STICKY_TRUST_BADGES` in `constants.ts` appears **unused** (dead constant).
- `constants.ts` `REFERRAL_DISCLAIMER` / `TCPA` / `AFFILIATE_AVAILABILITY` coexist with **dictionary** strings actually rendered in footer (`i18n` + `SiteFooter`). Dual sources can drift.
- `TEST_CITIES` hard-codes four metro sample ZIPs on the home grid (not derived from DB).
- IndexNow route submits the **full** URL list with no auth in code (Needs verification: whether Vercel protects this).
- ZIP **page** (missing ZIP, out of coverage, or city/state mismatch) returns **200** + coverage-missing UI + noindex meta, not HTTP/JSON 404. JSON 404 is **only** `/api/directory/lookup`.
- Shortcut `/tx/city/zip` is **200 duplicate content** of `/locksmith/tx/city/zip` (canonical tag points at locksmith path).
- `County === "the local"` fallback string when `county_name` empty.
- `locksmithJobs` / short names still locksmith-centric; plumbing slug mapping exists in `content.ts` but unused in generation.

Operational (not in code): GSC discovered-not-indexed backlog and impression/click performance. See latest `docs/worklog/`.

---

## 14. SEO Risk Areas

**Observed in code (certain):**

- **Duplicate URL classes:** `/en/...` (308), `/tx/city/zip` (200 rewrite + canonical), www vs apex (SITE_URL normalized to www; apex 308 is hosting-level, Needs verification on Vercel).
- **Templated pSEO at scale:** one `DirectoryPage` + hashed packs. Unique tokens are location/intent, not independently edited articles. Doorway-like if titles were identical — currently city+ZIP stay in headlines.
- **Thin hubs:** city/county pages are lists + shared H1 pattern, not the full ZIP module stack.
- **Sitemap includes every EN+ES ZIP/hub** including island metros that may still sit in GSC “Discovered”.
- **noindex only on mismatch/invalid locale**, not on “thin” islands.

**Possible (not proven by code):**

- Google treating similar ZIP templates as duplicates (GSC “Google chose different canonical”).
- `/en` 308 chains with trailing slash (observed historically as GSC redirect errors).
- ES/EN pairs: hreflang + distinct canonicals; shared `@id` for the business entity is **not** implemented (each page URL is the EmergencyService `url`).
- Schema `@type` is `EmergencyService`, not `Locksmith` (intentional vs referral). Rich result eligibility Needs verification via Rich Results Test.
- Home `TEST_CITIES` can internal-link island ZIPs (Austin/Dallas/SA) that are not the Houston mesh priority.

**Not a code bug:** GSC “Discovered” means uncrawled sitemap/link URLs (`해당사항 없음` = no last crawl).

---

## 15. Questions for Further Review

Mark as **Unknown** or **Needs verification**:

- Live Supabase ZIP count and whether non-TX rows exist
- Exact SSG page count on the latest production build
- Whether Vercel project maps apex → www (code assumes www canonical)
- Whether `/api/indexnow` is publicly callable in production and if that is intended
- Whether `service_categories.phone_en/es` are populated or all traffic uses the committed 833 DID
- MarketCall account, payout ($/call), and IVR — not in repo
- GSC property coverage vs `www` only
- Bing Webmaster vs Google crawl differences
- Whether trailingSlash is enabled on the Vercel/Next host (affects `/en/.../` chains)
- Image/OG images: none configured beyond default metadata
- Legal: TX DPS referral wording vs future niches

---

## Related docs

- `docs/DECISIONS.md` — durable decisions
- `docs/worklog/` — dated sessions
- `.cursor/rules/zipprolink-ssot.mdc` — phase policy
- `.cursorrules` — routing, mobile CRO, pre-commit build checklist
