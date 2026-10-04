# ZipProLink — Decisions

Durable technical and business decisions. Newest first within each status. Do not log secrets.

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
Conversion measurement is the call vendor, not in-app events. Schema `telephone` is the same DID.

**Status**  
Active

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
Active

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
Active
