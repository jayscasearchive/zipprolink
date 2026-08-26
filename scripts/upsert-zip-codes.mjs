import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  createServiceRoleClient,
  normalizeCountyName,
} from "./lib/env.mjs";

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
    "Usage: npm run zips:upsert -- scripts/data/<batch>.json",
  );
  process.exit(1);
}

const inputPath = process.argv[2];
if (!inputPath) {
  usage();
}

const filePath = resolve(process.cwd(), inputPath);
const payload = JSON.parse(readFileSync(filePath, "utf8"));
const rows = Array.isArray(payload) ? payload : payload.zips;

if (!Array.isArray(rows) || rows.length === 0) {
  throw new Error(`No ZIP rows found in ${inputPath}`);
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

const supabase = createServiceRoleClient();
const { data, error } = await supabase
  .from("zip_codes")
  .upsert(normalized, { onConflict: "zip_code" })
  .select(ZIP_FIELDS.join(", "));

if (error) {
  console.error(error.message);
  process.exit(1);
}

const zips = (data ?? []).map((row) => row.zip_code).sort();
console.log(`Upserted ${data?.length ?? 0} ZIP codes from ${inputPath}`);
for (const row of (data ?? []).sort((a, b) => a.zip_code.localeCompare(b.zip_code))) {
  console.log(
    `${row.zip_code}  ${row.city}, ${row.state_id}  ${row.county_name}  pop ${row.population}`,
  );
}

const { count, error: countError } = await supabase
  .from("zip_codes")
  .select("zip_code", { count: "exact", head: true })
  .in("zip_code", zips);

if (countError) {
  console.error(countError.message);
  process.exit(1);
}

console.log(`Verified ${count} matching rows in public.zip_codes`);
