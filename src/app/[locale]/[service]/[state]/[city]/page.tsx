import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { currentSeoYear } from "@/lib/content";
import {
  countiesFromZips,
  getCityHubData,
  getCityStaticParams,
} from "@/lib/directory";
import { getDictionary, isAppLocale } from "@/lib/i18n";
import { countyPath, directoryPath, localeHomePath } from "@/lib/paths";
import { isPhaseCoverage } from "@/lib/ssot";
import { serializeJsonLd } from "@/lib/schema";

export const revalidate = 86400;

type CityHubProps = {
  params: Promise<{
    locale: string;
    service: string;
    state: string;
    city: string;
  }>;
};

export async function generateStaticParams() {
  return getCityStaticParams();
}

export async function generateMetadata({
  params,
}: CityHubProps): Promise<Metadata> {
  const { locale: raw, service, state, city } = await params;
  if (!isAppLocale(raw)) {
    return { title: "Not found", robots: { index: false, follow: true } };
  }

  const hub = await getCityHubData(service, state, city);
  if (!hub) {
    return { title: "Not found", robots: { index: false, follow: true } };
  }

  const copy = getDictionary(raw);
  const year = currentSeoYear();
  const title = copy.cityHubH1(year, hub.cityName, hub.stateId);
  const canonical = directoryPath({
    locale: raw,
    service: hub.service.slug,
    state: hub.stateId,
    city: hub.cityName,
  });

  return {
    title: { absolute: title },
    description: copy.cityHubLead(hub.cityName, hub.zips.length),
    alternates: {
      canonical,
      languages: {
        en: directoryPath({
          locale: "en",
          service: hub.service.slug,
          state: hub.stateId,
          city: hub.cityName,
        }),
        es: directoryPath({
          locale: "es",
          service: hub.service.slug,
          state: hub.stateId,
          city: hub.cityName,
        }),
        "x-default": directoryPath({
          locale: "en",
          service: hub.service.slug,
          state: hub.stateId,
          city: hub.cityName,
        }),
      },
    },
    openGraph: {
      title,
      description: copy.cityHubLead(hub.cityName, hub.zips.length),
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

export default async function CityHubPage({ params }: CityHubProps) {
  const { locale: raw, service, state, city } = await params;
  if (!isAppLocale(raw) || !isPhaseCoverage(service, state.toUpperCase())) {
    notFound();
  }

  const hub = await getCityHubData(service, state, city);
  if (!hub) {
    notFound();
  }

  const copy = getDictionary(raw);
  const year = currentSeoYear();
  const pageUrl = `${SITE_URL}${directoryPath({
    locale: raw,
    service: hub.service.slug,
    state: hub.stateId,
    city: hub.cityName,
  })}`;

  const counties = countiesFromZips(hub.zips);
  const sharedCounty = counties.length === 1 ? counties[0] : null;

  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: copy.breadcrumbHome,
      item: `${SITE_URL}${localeHomePath(raw)}`,
    },
  ];

  if (sharedCounty) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: sharedCounty.label,
      item: `${SITE_URL}${countyPath({
        locale: raw,
        service: hub.service.slug,
        state: hub.stateId,
        county: sharedCounty.name,
      })}`,
    });
  }

  breadcrumbItems.push({
    "@type": "ListItem",
    position: breadcrumbItems.length + 1,
    name: hub.cityName,
    item: pageUrl,
  });

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }}
      />
      <section className="bg-navy text-white">
        <div className="mx-auto w-full min-w-0 max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <nav className="text-xs font-medium text-white/60">
            <Link href={localeHomePath(raw)} className="hover:text-white">
              {copy.breadcrumbHome}
            </Link>
            {sharedCounty ? (
              <>
                <span className="px-2">/</span>
                <Link
                  href={countyPath({
                    locale: raw,
                    service: hub.service.slug,
                    state: hub.stateId,
                    county: sharedCounty.name,
                  })}
                  className="hover:text-white"
                >
                  {sharedCounty.label}
                </Link>
              </>
            ) : null}
            <span className="px-2">/</span>
            <span className="text-white">
              {hub.cityName}, {hub.stateId}
            </span>
          </nav>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
            {copy.cityHubH1(year, hub.cityName, hub.stateId)}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
            {copy.cityHubLead(hub.cityName, hub.zips.length)}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full min-w-0 max-w-6xl px-4 py-12 sm:px-6">
        {counties.length > 1 ? (
          <div className="mb-10 min-w-0">
            <h2 className="text-2xl font-semibold tracking-tight text-navy">
              {copy.cityCountiesHeading}
            </h2>
            <div className="mt-4 flex max-w-full min-w-0 flex-wrap gap-2">
              {counties.map((county) => (
                <Link
                  key={county.slug}
                  href={countyPath({
                    locale: raw,
                    service: hub.service.slug,
                    state: hub.stateId,
                    county: county.name,
                  })}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-navy transition hover:border-emergency/40"
                >
                  {county.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
        <h2 className="text-2xl font-semibold tracking-tight text-navy">
          {copy.zipListHeading}
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {hub.zips.map((zip) => (
            <Link
              key={zip.zip_code}
              href={directoryPath({
                locale: raw,
                service: hub.service.slug,
                state: zip.state_id,
                city: zip.city,
                zip: zip.zip_code,
              })}
              className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:border-emergency/40 hover:shadow-md"
            >
              <p className="text-lg font-semibold text-navy">{zip.zip_code}</p>
              <p className="text-sm text-slate-500">
                {zip.city}, {zip.state_id}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
