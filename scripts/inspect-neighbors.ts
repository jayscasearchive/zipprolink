import { createServiceRoleClient } from "./lib/env.mjs";
import {
  hasValidCoordinates,
  pickNeighboringZips,
  type GeoZip,
} from "../src/lib/neighbors";

function toGeoZip(row: {
  zip_code: string;
  city: string;
  county_name: string | null;
  state_id: string;
  state_name: string;
  latitude: number | null;
  longitude: number | null;
}): GeoZip | null {
  if (!hasValidCoordinates(row)) {
    return null;
  }
  return {
    zip_code: row.zip_code,
    city: row.city,
    county_name: row.county_name,
    state_id: row.state_id,
    state_name: row.state_name,
    latitude: row.latitude,
    longitude: row.longitude,
  };
}

async function main() {
  const samples = process.argv.slice(2);
  const zipCodes = samples.length > 0 ? samples : ["77494", "77056"];
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("zip_codes")
    .select("zip_code, city, county_name, state_id, state_name, latitude, longitude");

  if (error) {
    console.error(error.message);
    process.exit(1);
  }

  const all = (data ?? [])
    .map(toGeoZip)
    .filter((row): row is GeoZip => row !== null);

  for (const zipCode of zipCodes) {
    const origin = all.find((row) => row.zip_code === zipCode);
    if (!origin) {
      console.log(`\n${zipCode}: not found or missing coordinates`);
      continue;
    }

    const candidates = all.filter((row) => row.state_id === origin.state_id);
    const neighbors = pickNeighboringZips(origin, candidates);
    const hasDallas = neighbors.some((row) => row.zip.zip_code.startsWith("75"));

    console.log(
      `\nOrigin ${origin.zip_code}  ${origin.city}, ${origin.state_id}  ${origin.county_name}  (${origin.latitude}, ${origin.longitude})`,
    );
    console.log(
      `Neighbors: ${neighbors.length}   Dallas 75xxx leak: ${hasDallas ? "YES" : "no"}`,
    );
    if (neighbors.length === 0) {
      console.log("  (none — true mesh, not padded)");
      continue;
    }
    console.log("zip    city                 county        miles");
    for (const row of neighbors) {
      const miles = row.miles.toFixed(1);
      const city = row.zip.city.padEnd(18);
      const county = (row.zip.county_name ?? "").padEnd(12);
      console.log(`${row.zip.zip_code}  ${city}  ${county}  ${miles}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
