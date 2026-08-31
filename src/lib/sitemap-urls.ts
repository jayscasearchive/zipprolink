import { SITE_URL } from "@/lib/constants";
import {
  getCityStaticParams,
  getCountyStaticParams,
  getZipStaticParams,
} from "@/lib/directory";
import { LOCALES } from "@/lib/i18n";
import { countyPath, directoryPath, localeHomePath } from "@/lib/paths";

export async function getSitemapUrlList() {
  const [zips, hubs, counties] = await Promise.all([
    getZipStaticParams(),
    getCityStaticParams(),
    getCountyStaticParams(),
  ]);

  const urls = LOCALES.map((locale) => `${SITE_URL}${localeHomePath(locale)}`);

  for (const hub of hubs) {
    urls.push(`${SITE_URL}${directoryPath(hub)}`);
  }

  for (const county of counties) {
    urls.push(`${SITE_URL}${countyPath(county)}`);
  }

  for (const zip of zips) {
    urls.push(`${SITE_URL}${directoryPath(zip)}`);
  }

  return urls;
}
