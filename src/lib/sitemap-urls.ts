import { SITE_URL } from "@/lib/constants";
import { getCityStaticParams, getZipStaticParams } from "@/lib/directory";
import { LOCALES } from "@/lib/i18n";
import { directoryPath, localeHomePath } from "@/lib/paths";

export async function getSitemapUrlList() {
  const [zips, hubs] = await Promise.all([
    getZipStaticParams(),
    getCityStaticParams(),
  ]);

  const urls = LOCALES.map((locale) => `${SITE_URL}${localeHomePath(locale)}`);

  for (const hub of hubs) {
    urls.push(`${SITE_URL}${directoryPath(hub)}`);
  }

  for (const zip of zips) {
    urls.push(`${SITE_URL}${directoryPath(zip)}`);
  }

  return urls;
}
