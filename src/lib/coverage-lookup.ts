import { currentPhaseService, isPhaseCoverage } from "@/lib/ssot";
import { getSupabase } from "@/lib/supabase";
import type { ServiceCategory, ZipCode } from "@/lib/types";

export type CoverageZip = Pick<
  ZipCode,
  "zip_code" | "city" | "state_id" | "state_name"
>;

const SERVICE_SELECT_WITH_DID =
  "id, slug, name, avg_price_min, avg_price_max, avg_response_time, is_active, created_at, phone_en, phone_es";
const SERVICE_SELECT_BASE =
  "id, slug, name, avg_price_min, avg_price_max, avg_response_time, is_active, created_at";

let phaseCoveragePromise: Promise<CoverageZip[]> | null = null;

export async function getServiceBySlug(
  slug: string,
): Promise<ServiceCategory | null> {
  const supabase = getSupabase();
  const withDid = await supabase
    .from("service_categories")
    .select(SERVICE_SELECT_WITH_DID)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!withDid.error) {
    return withDid.data;
  }

  const { data, error } = await supabase
    .from("service_categories")
    .select(SERVICE_SELECT_BASE)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("service_categories lookup failed", error.message);
    return null;
  }

  return data;
}

export async function getZipCode(zipCode: string): Promise<ZipCode | null> {
  const { data, error } = await getSupabase()
    .from("zip_codes")
    .select(
      "zip_code, city, county_name, state_id, state_name, latitude, longitude, population, density, created_at",
    )
    .eq("zip_code", zipCode)
    .maybeSingle();

  if (error) {
    console.error("zip_codes lookup failed", error.message);
    return null;
  }

  return data;
}

async function fetchPhaseCoverageZips(): Promise<CoverageZip[]> {
  const service = currentPhaseService();
  const { data: zips, error } = await getSupabase()
    .from("zip_codes")
    .select("zip_code, city, state_id, state_name")
    .order("zip_code", { ascending: true });

  if (error) {
    console.error("phase coverage zip lookup failed", error.message);
    return [];
  }

  return (zips ?? []).filter((zip) =>
    isPhaseCoverage(service.slug, zip.state_id),
  );
}

export async function getPhaseCoverageZips(): Promise<CoverageZip[]> {
  if (!phaseCoveragePromise) {
    phaseCoveragePromise = fetchPhaseCoverageZips().catch((error: unknown) => {
      phaseCoveragePromise = null;
      throw error;
    });
  }

  return phaseCoveragePromise;
}

export async function resolveCoverageLocation(
  serviceSlug: string,
  zipCode: string,
) {
  const [service, zip] = await Promise.all([
    getServiceBySlug(serviceSlug),
    getZipCode(zipCode),
  ]);

  if (!service || !zip || !isPhaseCoverage(service.slug, zip.state_id)) {
    return null;
  }

  return { service, zip };
}
