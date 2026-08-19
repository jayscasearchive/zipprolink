import { cache } from "react";
import { LOCALES, type AppLocale } from "@/lib/i18n";
import { citySlug, parseStateId } from "@/lib/paths";
import { currentPhaseService, isPhaseCoverage } from "@/lib/ssot";
import { supabase } from "@/lib/supabase";
import type {
  DirectoryPageData,
  NeighborZip,
  ServiceCategory,
  ZipCode,
} from "@/lib/types";

export type CoverageZip = Pick<
  ZipCode,
  "zip_code" | "city" | "state_id" | "state_name"
>;

export type ZipStaticParam = {
  locale: AppLocale;
  service: string;
  state: string;
  city: string;
  zip: string;
};

export type CityStaticParam = {
  locale: AppLocale;
  service: string;
  state: string;
  city: string;
};

const SERVICE_SELECT_WITH_DID =
  "id, slug, name, avg_price_min, avg_price_max, avg_response_time, is_active, created_at, phone_en, phone_es";
const SERVICE_SELECT_BASE =
  "id, slug, name, avg_price_min, avg_price_max, avg_response_time, is_active, created_at";

export async function getServiceBySlug(
  slug: string,
): Promise<ServiceCategory | null> {
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
  const { data, error } = await supabase
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

export async function getNeighboringZips(
  zip: ZipCode,
  limit = 8,
): Promise<NeighborZip[]> {
  const select = "zip_code, city, state_id, state_name";

  const { data: sameCity, error: cityError } = await supabase
    .from("zip_codes")
    .select(select)
    .eq("state_id", zip.state_id)
    .eq("city", zip.city)
    .neq("zip_code", zip.zip_code)
    .order("zip_code", { ascending: true })
    .limit(limit);

  if (cityError) {
    console.error("neighboring zip lookup failed", cityError.message);
  }

  const neighbors: NeighborZip[] = sameCity ?? [];
  if (neighbors.length >= limit) {
    return neighbors.slice(0, limit);
  }

  const { data: sameState, error: stateError } = await supabase
    .from("zip_codes")
    .select(select)
    .eq("state_id", zip.state_id)
    .neq("zip_code", zip.zip_code)
    .neq("city", zip.city)
    .order("zip_code", { ascending: true })
    .limit(limit - neighbors.length);

  if (stateError) {
    console.error("statewide neighbor lookup failed", stateError.message);
    return neighbors;
  }

  return [...neighbors, ...(sameState ?? [])];
}

export async function getPhaseCoverageZips(): Promise<CoverageZip[]> {
  const service = currentPhaseService();
  const { data: zips, error } = await supabase
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

export async function getZipStaticParams(): Promise<ZipStaticParam[]> {
  const service = currentPhaseService();
  const zips = await getPhaseCoverageZips();

  return LOCALES.flatMap((locale) =>
    zips.map((zip) => ({
      locale,
      service: service.slug,
      state: zip.state_id.toLowerCase(),
      city: citySlug(zip.city),
      zip: zip.zip_code,
    })),
  );
}

export async function getCityStaticParams(): Promise<CityStaticParam[]> {
  const service = currentPhaseService();
  const zips = await getPhaseCoverageZips();
  const seen = new Set<string>();
  const hubs: CityStaticParam[] = [];

  for (const locale of LOCALES) {
    for (const zip of zips) {
      const state = zip.state_id.toLowerCase();
      const city = citySlug(zip.city);
      const key = `${locale}:${service.slug}:${state}:${city}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      hubs.push({
        locale,
        service: service.slug,
        state,
        city,
      });
    }
  }

  return hubs;
}

export async function getCityHubData(
  serviceSlug: string,
  stateSlugValue: string,
  citySlugValue: string,
) {
  const service = await getServiceBySlug(serviceSlug);
  const stateId = parseStateId(stateSlugValue);

  if (!service || !isPhaseCoverage(service.slug, stateId)) {
    return null;
  }

  const zips = await getPhaseCoverageZips();
  const cityZips = zips.filter(
    (zip) =>
      zip.state_id.toUpperCase() === stateId &&
      citySlug(zip.city) === citySlugValue,
  );

  if (!cityZips.length) {
    return null;
  }

  const sample = cityZips[0];
  if (!sample) {
    return null;
  }
  return {
    service,
    stateId,
    stateName: sample.state_name,
    cityName: sample.city,
    citySlug: citySlug(sample.city),
    zips: cityZips,
  };
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

export const getDirectoryPageData = cache(async function getDirectoryPageData(
  serviceSlug: string,
  zipCode: string,
): Promise<DirectoryPageData | null> {
  const [service, zip] = await Promise.all([
    getServiceBySlug(serviceSlug),
    getZipCode(zipCode),
  ]);

  if (!service || !zip || !isPhaseCoverage(service.slug, zip.state_id)) {
    return null;
  }

  const neighbors = await getNeighboringZips(zip);

  return { service, zip, neighbors };
});

export async function getActiveServices(): Promise<
  Pick<ServiceCategory, "slug" | "name">[]
> {
  const { data, error } = await supabase
    .from("service_categories")
    .select("slug, name")
    .eq("is_active", true)
    .order("slug", { ascending: true });

  if (error) {
    console.error("service_categories list failed", error.message);
    return [];
  }

  return data ?? [];
}

export async function getPhaseServices(): Promise<
  Pick<ServiceCategory, "slug" | "name">[]
> {
  const services = await getActiveServices();
  const phase = currentPhaseService();
  const matched = services.filter((service) => service.slug === phase.slug);

  return matched.length
    ? matched
    : [{ slug: phase.slug, name: phase.name }];
}
