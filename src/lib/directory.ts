import { cache } from "react";
import { LOCALES, type AppLocale } from "@/lib/i18n";
import {
  hasValidCoordinates,
  pickNeighboringZips,
  type GeoZip,
} from "@/lib/neighbors";
import {
  citySlug,
  countyDisplayName,
  countySlug,
  hasCountyName,
  parseStateId,
} from "@/lib/paths";
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
  "zip_code" | "city" | "county_name" | "state_id" | "state_name"
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

export type CountyStaticParam = {
  locale: AppLocale;
  service: string;
  state: string;
  county: string;
};

export type CountyHubSummary = {
  service: string;
  stateId: string;
  countyName: string;
  countySlug: string;
  countyLabel: string;
  zipCount: number;
  cityCount: number;
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

function toGeoZip(zip: {
  zip_code: string;
  city: string;
  county_name: string | null;
  state_id: string;
  state_name: string;
  latitude: number | null;
  longitude: number | null;
}): GeoZip | null {
  if (!hasValidCoordinates(zip)) {
    return null;
  }

  return {
    zip_code: zip.zip_code,
    city: zip.city,
    county_name: zip.county_name,
    state_id: zip.state_id,
    state_name: zip.state_name,
    latitude: zip.latitude,
    longitude: zip.longitude,
  };
}

export async function getNeighboringZips(
  zip: ZipCode,
  limit = 8,
): Promise<NeighborZip[]> {
  const origin = toGeoZip(zip);
  if (!origin) {
    return [];
  }

  const { data, error } = await supabase
    .from("zip_codes")
    .select(
      "zip_code, city, county_name, state_id, state_name, latitude, longitude",
    )
    .eq("state_id", zip.state_id);

  if (error) {
    console.error("neighboring zip lookup failed", error.message);
    return [];
  }

  const candidates = (data ?? [])
    .map(toGeoZip)
    .filter((candidate): candidate is GeoZip => candidate !== null);

  return pickNeighboringZips(origin, candidates, limit).map(({ zip: neighbor }) => ({
    zip_code: neighbor.zip_code,
    city: neighbor.city,
    state_id: neighbor.state_id,
    state_name: neighbor.state_name,
  }));
}

export async function getPhaseCoverageZips(): Promise<CoverageZip[]> {
  const service = currentPhaseService();
  const { data: zips, error } = await supabase
    .from("zip_codes")
    .select("zip_code, city, county_name, state_id, state_name")
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

export function countiesFromZips(zips: CoverageZip[]) {
  const map = new Map<
    string,
    { slug: string; name: string; label: string }
  >();

  for (const zip of zips) {
    if (!hasCountyName(zip.county_name)) {
      continue;
    }

    const slug = countySlug(zip.county_name);
    if (!map.has(slug)) {
      map.set(slug, {
        slug,
        name: zip.county_name,
        label: countyDisplayName(zip.county_name),
      });
    }
  }

  return [...map.values()].sort((a, b) => a.label.localeCompare(b.label));
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

function uniqueCityCount(zips: CoverageZip[]) {
  return new Set(zips.map((zip) => citySlug(zip.city))).size;
}

function groupCoverageByCounty(zips: CoverageZip[]) {
  const groups = new Map<string, CoverageZip[]>();

  for (const zip of zips) {
    if (!hasCountyName(zip.county_name)) {
      continue;
    }

    const key = `${zip.state_id.toUpperCase()}:${countySlug(zip.county_name)}`;
    const list = groups.get(key) ?? [];
    list.push(zip);
    groups.set(key, list);
  }

  return groups;
}

export async function getCountyHubSummaries(): Promise<CountyHubSummary[]> {
  const service = currentPhaseService();
  const zips = await getPhaseCoverageZips();
  const summaries: CountyHubSummary[] = [];

  for (const countyZips of groupCoverageByCounty(zips).values()) {
    const sample = countyZips[0];
    if (!sample?.county_name || countyZips.length === 0) {
      continue;
    }

    summaries.push({
      service: service.slug,
      stateId: sample.state_id,
      countyName: sample.county_name,
      countySlug: countySlug(sample.county_name),
      countyLabel: countyDisplayName(sample.county_name),
      zipCount: countyZips.length,
      cityCount: uniqueCityCount(countyZips),
    });
  }

  return summaries.sort((a, b) => a.countyLabel.localeCompare(b.countyLabel));
}

export async function getCountyStaticParams(): Promise<CountyStaticParam[]> {
  const summaries = await getCountyHubSummaries();

  return LOCALES.flatMap((locale) =>
    summaries.map((hub) => ({
      locale,
      service: hub.service,
      state: hub.stateId.toLowerCase(),
      county: hub.countySlug,
    })),
  );
}

export async function getCountyHubData(
  serviceSlug: string,
  stateSlugValue: string,
  countySlugValue: string,
) {
  const service = await getServiceBySlug(serviceSlug);
  const stateId = parseStateId(stateSlugValue);

  if (!service || !isPhaseCoverage(service.slug, stateId)) {
    return null;
  }

  const zips = await getPhaseCoverageZips();
  const countyZips = zips.filter(
    (zip) =>
      zip.state_id.toUpperCase() === stateId &&
      hasCountyName(zip.county_name) &&
      countySlug(zip.county_name) === countySlugValue,
  );

  if (!countyZips.length) {
    return null;
  }

  const sample = countyZips[0];
  if (!sample?.county_name) {
    return null;
  }

  const cityGroups = new Map<
    string,
    { cityName: string; citySlug: string; zips: CoverageZip[] }
  >();

  for (const zip of countyZips) {
    const slug = citySlug(zip.city);
    const group = cityGroups.get(slug) ?? {
      cityName: zip.city,
      citySlug: slug,
      zips: [],
    };
    group.zips.push(zip);
    cityGroups.set(slug, group);
  }

  for (const group of cityGroups.values()) {
    group.zips.sort((a, b) => a.zip_code.localeCompare(b.zip_code));
  }

  const cities = [...cityGroups.values()].sort((a, b) =>
    a.cityName.localeCompare(b.cityName),
  );

  return {
    service,
    stateId,
    stateName: sample.state_name,
    countyName: sample.county_name,
    countySlug: countySlug(sample.county_name),
    countyLabel: countyDisplayName(sample.county_name),
    zips: countyZips,
    cities,
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
