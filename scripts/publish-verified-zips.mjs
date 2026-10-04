import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  createServiceRoleClient,
  normalizeCountyName,
} from "./lib/env.mjs";

const GRAINS = new Set(["state", "metro", "county", "zip"]);
const SOURCES = new Set(["campaign", "vendor", "manual"]);
const ZIP_FIELDS = [
  "zip_code",
  "city",
  "state_id",
  "state_name",
  "county_name",
  "latitude",
  "longitude",
  "population",
  "density",
];

function usage() {
  console.error(
    "Usage: npm run zips:publish -- scripts/data/publish-requests/<request>.json [--execute]",
  );
  console.error("Default is dry-run. Does not write the database.");
  process.exit(1);
}

const args = process.argv.slice(2);
const execute = args.includes("--execute");
const inputPath = args.find((arg) => !arg.startsWith("--"));
if (!inputPath || inputPath.includes("_template.json")) {
  usage();
}

const filePath = resolve(process.cwd(), inputPath);
const request = JSON.parse(readFileSync(filePath, "utf8"));

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (request.service !== "locksmith") {
  fail("service must be locksmith in the current phase.");
}
if (!GRAINS.has(request.geography_grain)) {
  fail("geography_grain must be state, metro, county, or zip.");
}
if (!String(request.geography_scope ?? "").trim()) {
  fail("geography_scope is required (the official campaign area, not a guess).");
}
if (!SOURCES.has(request.source)) {
  fail("source must be campaign, vendor, or manual.");
}
if (String(request.evidence_summary ?? "").trim().length < 20) {
  fail("evidence_summary must record the official MarketCall/campaign condition.");
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(String(request.verified_on ?? ""))) {
  fail("verified_on must be YYYY-MM-DD.");
}
if (!String(request.operator ?? "").trim()) {
  fail("operator is required.");
}

const rows = Array.isArray(request.zips) ? request.zips : [];
if (rows.length === 0) {
  fail("zips must list the ZIP rows to publish.");
}

const normalized = rows.map((row) => {
  const zipCode = String(row.zip_code ?? "").trim();
  if (!/^\d{5}$/.test(zipCode)) {
    throw new Error(`Invalid zip_code: ${row.zip_code}`);
  }
  if (String(row.state_id ?? "").trim().toUpperCase() !== "TX") {
    throw new Error(`Only TX ZIPs are allowed in the current phase: ${zipCode}`);
  }
  return {
    zip_code: zipCode,
    city: String(row.city ?? "").trim(),
    state_id: "TX",
    state_name: String(row.state_name ?? "Texas").trim() || "Texas",
    county_name: normalizeCountyName(row.county_name),
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    population: Number(row.population),
    density: Number(row.density),
  };
});

console.log(
  JSON.stringify(
    {
      mode: execute ? "execute" : "dry-run",
      rebuild_required: true,
      geography_grain: request.geography_grain,
      geography_scope: request.geography_scope,
      source: request.source,
      verified_on: request.verified_on,
      operator: request.operator,
      zip_count: normalized.length,
      zip_codes: normalized.map((row) => row.zip_code),
    },
    null,
    2,
  ),
);

if (!execute) {
  console.log("Dry-run only. No database writes. Re-run with --execute after review.");
  process.exit(0);
}

const supabase = createServiceRoleClient();
const { data, error } = await supabase
  .from("zip_codes")
  .upsert(normalized, { onConflict: "zip_code" })
  .select(ZIP_FIELDS.join(", "));

if (error) {
  console.error(error.message);
  process.exit(1);
}

const coverageRows = (data ?? []).map((row) => ({
  zip_code: row.zip_code,
  service_slug: "locksmith",
  status: "active",
  source: request.source,
  verified_at: `${request.verified_on}T00:00:00Z`,
  notes: `${request.geography_grain}:${request.geography_scope} — ${request.evidence_summary}`,
}));

const coverage = await supabase
  .from("service_coverage")
  .upsert(coverageRows, { onConflict: "zip_code,service_slug" });

if (coverage.error) {
  console.error(
    "zip_codes wrote, but service_coverage was not stored:",
    coverage.error.message,
  );
  console.error("Pages still require a rebuild. Coverage labels are optional.");
} else {
  console.log(`Recorded ${coverageRows.length} service_coverage rows`);
}

console.log(`Upserted ${data?.length ?? 0} ZIP codes. Rebuild/deploy before they are live.`);
