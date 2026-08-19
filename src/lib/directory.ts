import { cache } from "react";
import { currentPhaseService } from "@/lib/ssot";
import { supabase } from "@/lib/supabase";
import type {
  DirectoryPageData,
  NeighborZip,
  ServiceCategory,
  ZipCode,
} from "@/lib/types";

export async function getServiceBySlug(
  slug: string,
): Promise<ServiceCategory | null> {
  const { data, error } = await supabase
    .from("service_categories")
    .select(
      "id, slug, name, avg_price_min, avg_price_max, avg_response_time, is_active, created_at",
    )
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

export const getDirectoryPageData = cache(async function getDirectoryPageData(
  serviceSlug: string,
  zipCode: string,
): Promise<DirectoryPageData | null> {
  const [service, zip] = await Promise.all([
    getServiceBySlug(serviceSlug),
    getZipCode(zipCode),
  ]);

  if (!service || !zip) {
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
