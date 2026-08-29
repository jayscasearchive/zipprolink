import { cache } from "react";
import {
  getPhaseCoverageZips,
  getServiceBySlug,
  getZipCode,
} from "@/lib/coverage-lookup";
import { LOCALES, type AppLocale } from "@/lib/i18n";
import { pickNeighboringZips, toGeoZip, type GeoZip } from "@/lib/neighbors";
import { citySlug, parseStateId } from "@/lib/paths";
import { currentPhaseService, isPhaseCoverage } from "@/lib/ssot";
import { getSupabase } from "@/lib/supabase";
import type {
  DirectoryPageData,
  NeighborZip,
  ServiceCategory,
  ZipCode,
} from "@/lib/types";

export type { CoverageZip } from "@/lib/coverage-lookup";
export {
  getPhaseCoverageZips,
  getServiceBySlug,
  getZipCode,
  resolveCoverageLocation,
} from "@/lib/coverage-lookup";

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

const stateGeoCache = new Map<string, Promise<GeoZip[]>>();

function getStateGeoZips(stateId: string): Promise<GeoZip[]> {
  const key = stateId.trim().toUpperCase();
  const existing = stateGeoCache.get(key);
  if (existing) {
    return existing;
  }

  const pending = fetchStateGeoZips(key).catch((error: unknown) => {
    stateGeoCache.delete(key);
    throw error;
  });
  stateGeoCache.set(key, pending);
  return pending;
}

async function fetchStateGeoZips(stateId: string): Promise<GeoZip[]> {
  const { data, error } = await getSupabase()
    .from("zip_codes")
    .select(
      "zip_code, city, county_name, state_id, state_name, latitude, longitude",
    )
    .eq("state_id", stateId);

  if (error) {
    console.error("neighboring zip lookup failed", error.message);
    return [];
  }

  return (data ?? [])
    .map(toGeoZip)
    .filter((candidate): candidate is GeoZip => candidate !== null);
}

export async function getNeighboringZips(
  zip: ZipCode,
  limit = 8,
): Promise<NeighborZip[]> {
  const origin = toGeoZip(zip);
  if (!origin) {
    return [];
  }

  const candidates = await getStateGeoZips(zip.state_id);
  return pickNeighboringZips(origin, candidates, limit).map(({ zip: neighbor }) => ({
    zip_code: neighbor.zip_code,
    city: neighbor.city,
    state_id: neighbor.state_id,
    state_name: neighbor.state_name,
  }));
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
  const { data, error } = await getSupabase()
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
