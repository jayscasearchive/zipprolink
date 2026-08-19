import type { MetadataRoute } from "next";
import { getSitemapUrlList } from "@/lib/sitemap-urls";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls = await getSitemapUrlList();
  const now = new Date();

  return urls.map((url, index) => ({
    url,
    lastModified: now,
    changeFrequency: index < 2 ? "daily" : "weekly",
    priority: index < 2 ? 1 : url.split("/").length > 6 ? 0.8 : 0.7,
  }));
}
