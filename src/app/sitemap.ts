import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getCityStaticParams, getZipStaticParams } from "@/lib/directory";
import { LOCALES } from "@/lib/i18n";
import { directoryPath, localeHomePath } from "@/lib/paths";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [zips, hubs] = await Promise.all([
    getZipStaticParams(),
    getCityStaticParams(),
  ]);

  const entries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${SITE_URL}${localeHomePath(locale)}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
  }));

  for (const hub of hubs) {
    entries.push({
      url: `${SITE_URL}${directoryPath(hub)}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const zip of zips) {
    entries.push({
      url: `${SITE_URL}${directoryPath(zip)}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return entries;
}
