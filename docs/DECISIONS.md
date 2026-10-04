# ZipProLink — Decisions

Durable technical and business decisions. Newest first within each status. Do not log secrets.

---

### 2026-10-04 — Sitemap is a build snapshot; keep existing pages; evidence-gate new ZIPs

**Decision**  
`sitemap.xml` is `force-static` with `revalidate = false`. It lists the same ZIP/hub set as `generateStaticParams`. Directory ZIP/city/county routes use `dynamicParams = false`, so a DB row that appears after the last build is neither in the sitemap nor a 200 page until the next rebuild. `service_coverage` is a label on already-live geography; it does not 404, noindex, or hide CTAs. Existing TX pages stay published. New ZIPs use `npm run zips:publish` with a filled evidence JSON (grain, scope, source, evidence_summary, verified_on, operator). Default is dry-run. There is no `--allow-unverified-geo` path. Do not wait until every current URL is indexed before issuing a confirmed ZIP. SQL recovery is: stop the app from using the new tables. Do not DROP them as the default rollback.

**Reason**  
An ISR sitemap plus `dynamicParams = false` would advertise URLs that 404 until rebuild. Treating `service_coverage` as a publish valve would unpublish the live TX set when the table is empty. Bypass flags taught operators to skip evidence.

**Alternatives Considered**  
ISR sitemap; filter `generateStaticParams` on coverage rows; keep `--allow-unverified-geo`; DROP tables on rollback.

**Trade-offs**  
New confirmed ZIPs need a rebuild to go live. Deleted DB rows can remain in the last sitemap until the next build.

**Status**  
Active

---

### 2026-10-04 — Goal is billed calls, not page count; ZIP issuance is evidence-gated

**Decision**  
Do not block new Houston-adjacent ZIPs indefinitely because GSC indexed/discovered is stalled. Do not add ZIPs that are only geographic clones. Issue a ZIP only when campaign/vendor serviceability is confirmed, HTTP/canonical/index policy is valid, the page has a real local difference, call connection and measurement exist, and the listing does not claim unsupported service. Existing pages stay published; `geo_only` is a label, not a reason to unpublish. Do not inject a batch in this change.

**Reason**  
The product wins on MarketCall-settled calls. A crawl-valve that waits for every current URL to index treats page count as the KPI. Template dumps without supply proof create thin pages and false coverage claims.

**Alternatives Considered**  
Wait until discovered ≈ 0; dump 20 Houston ZIPs now; treat every `zip_codes` row as proof of supply.

**Trade-offs**  
New URLs can be added before the backlog is empty, but only a small confirmed cluster. Unconfirmed adjacent ZIPs stay on hold.

**Status**  
Active (supersedes “Crawl valve before ZIP dumps”)

---

### 2026-10-04 — Shortcut 308; missing ZIP 404; wrong city 308

**Decision**  
Public canonical remains `/locksmith/tx/{city}/{zip}` (ES prefixed). `/tx/{city}/{zip}` **308s** to that canonical (no more 200 rewrite duplicate). Missing ZIP and missing hubs are HTTP **404** (`notFound()`). A known ZIP under the wrong city slug **308s** to the correct city path. Lookup API stays JSON 404 for unknown ZIP and JSON **503** when the directory DB is down.

**Reason**  
Live production showed `/tx/houston/77002` 200 with the same body/etag as the canonical, and `/locksmith/tx/houston/99999` plus `/locksmith/tx/austin/77002` as 200 + noindex (soft-404 shape). GSC “Google chose different canonical” / discovered lists cannot be blamed on crawl budget until those duplicates and soft 404s are gone.

**Alternatives Considered**  
Keep 200 + noindex for missing ZIPs; keep shortcut 200 until www is fully digested.

**Trade-offs**  
Short URLs still work via 308. GSC will reprocess former 200 duplicates.

**Status**  
Active (supersedes “`/tx/city/zip` is a 200 rewrite”)

---

### 2026-10-04 — Phone clicks are leads, not revenue; one DID per locale/service

**Decision**  
CTA, copy, FAQ, meta, and schema all use `getLocalePhone(locale, service)`. `tel:` clicks POST `/api/telemetry/call-click` with path, ZIP, locale, and CTA placement only — never the phone number. The API returns `conversion: false`. Billed/valid calls stay in MarketCall until a settlement feed is approved.

**Reason**  
Copy previously interpolated `HOTLINE_DISPLAY` (always the EN env DID) while buttons used locale/service DID. There was no click log, so search-to-call could not be audited.

**Alternatives Considered**  
GA/GTM; unique DID per ZIP; treating clicks as conversions.

**Trade-offs**  
Clicks over-count vs answered/billed calls. The `call_click_events` table is prepared in SQL and not applied until review.

**Status**  
Active

---

### 2026-10-04 — Geo ZIP ≠ serviceable coverage; DB errors ≠ missing ZIP

**Decision**  
`zip_codes` remains geography. `service_coverage` (SQL prepared, not applied) is an optional label (`serviceable` vs `geo_only`). It is not a publish valve: missing/empty/unreadable rows do not 404, noindex, or hide CTAs. Existing TX pages stay live. New ZIP URLs are created only by the evidence publish script plus a rebuild. Directory queries throw `DirectoryUnavailableError` on DB failure so sitemap/pages do not collapse into empty coverage or mass noindex.

**Reason**  
Coverage was “TX row exists.” A failed Supabase read returned `[]`/`null` and looked like “no ZIP.”

**Alternatives Considered**  
Filter generation to `service_coverage` immediately (would hide all pages until the table is filled).

**Trade-offs**  
Existing island metros remain published as geo listings. New ZIPs should not be upserted without a coverage row once the table is live.

**Status**  
Active

---

### 2026-10-04 — Referral schema, honest prices, omit sitemap lastmod

**Decision**  
ZIP JSON-LD is Organization + Service with `areaServed` PostalCode. Do not put the ZIP centroid on `address`/`geo` as a shop. Do not declare `InStock`. Job rows are a shared catalog without a 1.08 density multiplier. Sitemap omits `lastmod` until a trustworthy content-change timestamp exists. `zip_codes.created_at` is insert time, not a page revision. Never stamp `new Date()`.

**Reason**  
Schema claimed a storefront and stock at the ZIP point. Prices were fixed bands with an invented urban lift. Treating insert dates as lastmod would tell Google stale pages were edited on first ingest.

**Alternatives Considered**  
Keep `EmergencyService` + InStock; use `created_at` as lastmod.

**Trade-offs**  
Rich-result eligibility for EmergencyService may change. Google infers recrawl without lastmod.

**Status**  
Active

---


### 2026-09-13 — Spanish SERP titles lead with “Cerrajero”, not Houston-only branches

**Decision**  
Change ES ZIP/hub copy in `es-blocks.ts` and `i18n.ts` so headlines/meta start with `Cerrajero…` while keeping `${city}` and `${zip}`. Translate leftover English legal chrome on ES pages. Do not special-case Houston ZIP lists in code. Leave English titles unchanged in that pass.

**Reason**  
GSC impressions concentrated on `cerrajero en houston` and ES Houston URLs. Year-first / “Despacho” / “Costo” titles did not match the query. Hardcoding Houston would make Magnolia/Conroe titles wrong and increase doorway risk.

**Alternatives Considered**  
Per-URL title overrides for 8–10 winner pages; rewriting all English titles at the same time; claiming “direct locksmith” for `locksmith direct`.

**Trade-offs**  
All ES pages change from two files (good uniqueness via city+ZIP). English SERPs unchanged. Ranking impact not measured at decision time.

**Status**  
Active

---

### 2026-09-15 — 308 `/&` to homepage

**Decision**  
In `src/proxy.ts`, treat pathname `/&` (decoded) as 308 to `/`.

**Reason**  
GSC 404 example was `https://www.zipprolink.com/&` (broken inbound), not a missing ZIP.

**Alternatives Considered**  
Leave 404; custom 404 content.

**Trade-offs**  
Junk URL stops 404ing. Does not affect directory URLs.

**Status**  
Active

---

### 2026-08-31 — County hubs only for counties with live ZIPs, path `/county/[county]`

**Decision**  
Generate county pages from coverage ZIPs only. URL: `/[service]/[state]/county/[county]` so city slugs cannot collide with county names.

**Reason**  
Empty county hubs are thin. `harris` as a city vs Harris County must not share one segment.

**Alternatives Considered**  
`/[state]/[county]` without `county` infix; generating all Texas counties.

**Trade-offs**  
New counties appear automatically when a ZIP with that `county_name` is upserted. Extra path segment.

**Status**  
Active

---

### 2026-08-31 — Canonical host is `www.zipprolink.com`

**Decision**  
`SITE_URL` normalizes `zipprolink.com` → `www.zipprolink.com`. Canonicals and sitemap use that origin. BreadcrumbList added on directory pages.

**Reason**  
Split signals between apex and www in GSC.

**Alternatives Considered**  
Apex-only canonical.

**Trade-offs**  
Apex must 308 at the host. GSC may list old apex/`/en` URLs as redirects/alternates while digesting.

**Status**  
Active

---

### 2026-08-30 — Four hashed intents; no extra URLs per intent

**Decision**  
Each ZIP×service hashes into `emergency` | `compliance` | `neighborhood` | `cost`. Same URL, different section order and copy packs (`pools.ts` / `es-blocks.ts`).

**Reason**  
Need template variation without multiplying URLs (doorway risk).

**Alternatives Considered**  
One identical template; separate `/cost` and `/emergency` paths per ZIP.

**Trade-offs**  
Winner query (`cerrajero`) may land on a cost-intent page. Variation is deterministic and stable.

**Status**  
Active

---

### 2026-08-30 — Neighbor mesh is Haversine, never statewide padding

**Decision**  
Neighbors: same state, ≤10 miles (max 8). If fewer than 4, same city or county ≤25 miles. Stop even if still under 4. Implemented in `src/lib/neighbors.ts`.

**Reason**  
Houston pages must not link Dallas as “nearby”.

**Alternatives Considered**  
Pad to 8 with farthest-in-state ZIPs; fixed editorial neighbor lists.

**Trade-offs**  
Edge ZIPs may show 1–3 neighbors. Mesh quality depends on coordinates and cluster density.

**Status**  
Active

---

### 2026-08-27 — Pay-per-call via MarketCall tracking DID, not on-site checkout

**Decision**  
Primary conversion is `tel:` to `(833) 567-5849` (overridable by env or `service_categories` phone columns). No cart. No GA/GTM in repo.

**Reason**  
Emergency locksmith demand is call-led. Tracking number attributes calls to the site.

**Alternatives Considered**  
Forms; unique DID per ZIP (not implemented).

**Trade-offs**  
Conversion measurement starts with click telemetry (not billed). MarketCall remains the settlement source until a feed is approved. Schema `telephone` is the same DID.

**Status**  
Active (click telemetry added 2026-10-04; clicks are not conversions)

---

### 2026-08-22 — English URLs omit `/en`; `/tx/city/zip` is a 200 rewrite

**Decision**  
Public EN canonical is `/locksmith/tx/{city}/{zip}`. `/en/...` 308s away. Shortcut `/tx/{city}/{zip}` **rewrites** (HTTP 200) to the internal locale tree; it is not a 308.

**Reason**  
Avoid forced `/en` 404s and keep short URLs. Shortcut 308 was deferred while GSC digested www unification.

**Alternatives Considered**  
Always prefix `/en`; 308 shortcuts to `/locksmith/...`.

**Trade-offs**  
Shortcut and canonical can both 200 with the same document (canonical tag points at `/locksmith/...`). GSC may treat them as alternates until Google consolidates.

**Status**  
Superseded (2026-10-04 — shortcut 308 to canonical)

---

### 2026-08-19+ — ZIP-centric programmatic SEO, one ZIP = one canonical URL pair (EN+ES)

**Decision**  
Directory is ZIP-first: `/[service]/[state]/[city]/[zip]`. One DB row per ZIP. EN and ES are locales of that ZIP, not separate businesses. Schema type on ZIP pages is `EmergencyService`, not `Locksmith`.

**Reason**  
Local emergency queries include ZIP and city. ZipProLink is a referral matching service (TX DPS); schema must not claim it is the locksmith shop.

**Alternatives Considered**  
City-only pages; `@type: Locksmith`; AI-generated unique essays per ZIP.

**Trade-offs**  
Scales via data + templates. Thin/doorway risk if variation is weak or dumps are too large for crawl.

**Status**  
Active

---

### 2026-08+ — Phase 1 SSOT: TX + locksmith only

**Decision**  
`src/lib/ssot.ts`: `CURRENT_PHASE = 1` → service `locksmith`, states with `role: "pilot"` → `TX`. `generateStaticParams` and upsert (current script) stay on that phase. FL/GA and plumbing/water-damage are declared but not generated.

**Reason**  
Finish Houston-area locksmith coverage before opening more states or niches.

**Alternatives Considered**  
Generate all services × all ZIPs immediately.

**Trade-offs**  
Less index bloat. Island TX metros in the same table still get pages if rows exist.

**Status**  
Active

---

### Operational (product, not a single commit) — Crawl valve before ZIP dumps

**Decision**  
Do not add large ZIP batches while GSC “Discovered – currently not indexed” is high and not falling. Prefer Houston infill over DFW/Austin thickening. Target new batches when indexed is rising and discovered is falling (not necessarily to zero).

**Reason**  
Uncrawled URLs are not a net. Adding URLs lengthens the queue; Google does not treat more sitemap URLs as an “activity” quality signal.

**Alternatives Considered**  
Weekly 20-ZIP cadence regardless of GSC; bulk URL Inspection requests.

**Trade-offs**  
Slower page-count growth. Better chance new URLs get crawled when added.

**Status**  
Superseded (2026-10-04 — evidence-gated issuance, not an indefinite crawl valve)
