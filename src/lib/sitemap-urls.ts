import { SITE_URL } from "@/lib/constants";
import {
  getCityStaticParams,
  getCountyStaticParams,
  getZipStaticParams,
} from "@/lib/directory";
import { LOCALES } from "@/lib/i18n";
import { countyPath, directoryPath, localeHomePath } from "@/lib/paths";

export type SitemapEntry = {
  url: string;
};

function sitemapAbsoluteUrl(path: string) {
  if (!path || path === "/") {
    return SITE_URL;
  }
  return `${SITE_URL}${path}`;
}

export async function getSitemapUrlList(): Promise<SitemapEntry[]> {
  const [zips, hubs, counties] = await Promise.all([
    getZipStaticParams(),
    getCityStaticParams(),
    getCountyStaticParams(),
  ]);

  const entries: SitemapEntry[] = LOCALES.map((locale) => ({
    url: sitemapAbsoluteUrl(localeHomePath(locale)),
  }));

  for (const hub of hubs) {
    entries.push({ url: sitemapAbsoluteUrl(directoryPath(hub)) });
  }

  for (const county of counties) {
    entries.push({ url: sitemapAbsoluteUrl(countyPath(county)) });
  }

  for (const zip of zips) {
    entries.push({ url: sitemapAbsoluteUrl(directoryPath(zip)) });
  }

  return entries;
}
