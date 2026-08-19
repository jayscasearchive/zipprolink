import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { isPhaseCoverage } from "@/lib/ssot";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data: services }, { data: zips }] = await Promise.all([
    supabase
      .from("service_categories")
      .select("slug, is_active")
      .eq("is_active", true),
    supabase.from("zip_codes").select("zip_code, state_id"),
  ]);

  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  for (const service of services ?? []) {
    for (const zip of zips ?? []) {
      if (!isPhaseCoverage(service.slug, zip.state_id)) {
        continue;
      }

      entries.push({
        url: `${SITE_URL}/${service.slug}/${zip.zip_code}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
