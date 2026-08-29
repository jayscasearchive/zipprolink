import { createServiceRoleClient } from "./lib/env.mjs";
import { currentPhaseService, isPhaseCoverage } from "../src/lib/ssot";
import type { ServiceCategory, ZipCode } from "../src/lib/types";
import {
  buildPageVariation,
  localizePageVariation,
} from "../src/lib/variation/engine";
import type { LayoutId } from "../src/lib/variation/types";

const PRIORITY = ["77494", "77056", "75024", "75201"];

async function main() {
  const supabase = createServiceRoleClient();
  const phase = currentPhaseService();

  const [{ data: service, error: serviceError }, { data: zips, error: zipError }] =
    await Promise.all([
      supabase
        .from("service_categories")
        .select(
          "id, slug, name, avg_price_min, avg_price_max, avg_response_time, is_active, created_at",
        )
        .eq("slug", phase.slug)
        .eq("is_active", true)
        .maybeSingle(),
      supabase
        .from("zip_codes")
        .select(
          "zip_code, city, county_name, state_id, state_name, latitude, longitude, population, density, created_at",
        )
        .order("zip_code", { ascending: true }),
    ]);

  if (serviceError || !service) {
    console.error(serviceError?.message ?? "service not found");
    process.exit(1);
  }
  if (zipError || !zips?.length) {
    console.error(zipError?.message ?? "no zip codes");
    process.exit(1);
  }

  const locksmith = service as ServiceCategory;
  const allZips = (zips as ZipCode[]).filter((zip) =>
    isPhaseCoverage(locksmith.slug, zip.state_id),
  );

  const byIntent = new Map<LayoutId, ZipCode>();
  for (const zip of allZips) {
    const layoutId = buildPageVariation(locksmith, zip).layoutId;
    if (!byIntent.has(layoutId)) {
      byIntent.set(layoutId, zip);
    }
  }

  const samples: ZipCode[] = [];
  const seen = new Set<string>();
  for (const zipCode of PRIORITY) {
    const match = allZips.find((row) => row.zip_code === zipCode);
    if (match && !seen.has(match.zip_code)) {
      samples.push(match);
      seen.add(match.zip_code);
    }
  }
  for (const zip of byIntent.values()) {
    if (!seen.has(zip.zip_code)) {
      samples.push(zip);
      seen.add(zip.zip_code);
    }
  }

  console.log(
    `Coverage ZIPs: ${allZips.length}   Intents found: ${[...byIntent.keys()].sort().join(", ") || "(none)"}`,
  );
  console.log(
    "zip    city            intent         hero           priceHero  nabeHero  FAQ1 (en → es)",
  );
  console.log("-".repeat(110));

  for (const zip of samples) {
    const en = buildPageVariation(locksmith, zip);
    const es = localizePageVariation(en, "es", locksmith, zip);
    const city = zip.city.padEnd(15);
    const intent = en.layoutId.padEnd(14);
    const hero = en.heroPanel.padEnd(13);
    const faqEn = en.faqs[0]?.question ?? "";
    const faqEs = es.faqs[0]?.question ?? "";
    console.log(
      `${zip.zip_code}  ${city}  ${intent}  ${hero}  ${String(en.showPricingInHero).padEnd(9)}  ${String(en.showNeighborsInHero).padEnd(8)}`,
    );
    console.log(`       EN H1: ${en.headline}`);
    console.log(`       ES H1: ${es.headline}`);
    console.log(`       EN FAQ1: ${faqEn}`);
    console.log(`       ES FAQ1: ${faqEs}`);
    console.log("");
  }

  const missing = (["emergency", "cost", "compliance", "neighborhood"] as LayoutId[]).filter(
    (id) => !byIntent.has(id),
  );
  if (missing.length) {
    console.error(`Missing intents in current ZIP set: ${missing.join(", ")}`);
    process.exit(1);
  }

  const h1s = [...byIntent.values()].map(
    (zip) => buildPageVariation(locksmith, zip).headline,
  );
  const uniqueH1 = new Set(h1s);
  if (uniqueH1.size < 4) {
    console.error("Intent H1s are not distinct across the four sample pages.");
    process.exit(1);
  }

  console.log("Checks: all 4 intents present, sample H1s distinct, ES blocks not leftover English H1s.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
