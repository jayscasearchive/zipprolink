import type { MetadataRoute } from "next";
import { getSitemapUrlList } from "@/lib/sitemap-urls";

/** Build snapshot only — same ZIP/hub set as generateStaticParams. Do not ISR from later DB rows. */
export const dynamic = "force-static";
export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getSitemapUrlList();

  return entries.map((entry, index) => ({
    url: entry.url,
    changeFrequency: index < 2 ? "daily" : "weekly",
    priority: index < 2 ? 1 : entry.url.split("/").length > 6 ? 0.8 : 0.7,
  }));
}
