import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { currentSeoYear } from "@/lib/content";
import { getCountyHubData, getCountyStaticParams } from "@/lib/directory";
import { getDictionary, isAppLocale } from "@/lib/i18n";
import { countyPath, directoryPath, localeHomePath } from "@/lib/paths";
import { isPhaseCoverage } from "@/lib/ssot";
import { serializeJsonLd } from "@/lib/schema";

export const revalidate = 86400;

type CountyHubProps = {
  params: Promise<{
    locale: string;
    service: string;
    state: string;
    county: string;
  }>;
};

export async function generateStaticParams() {
  return getCountyStaticParams();
}

export async function generateMetadata({
  params,
}: CountyHubProps): Promise<Metadata> {
  const { locale: raw, service, state, county } = await params;
  if (!isAppLocale(raw)) {
    return { title: "Not found", robots: { index: false, follow: true } };
  }

  const hub = await getCountyHubData(service, state, county);
  if (!hub) {
    return { title: "Not found", robots: { index: false, follow: true } };
  }

  const copy = getDictionary(raw);
  const year = currentSeoYear();
  const title = copy.countyHubH1(year, hub.countyLabel, hub.stateId);
  const canonical = countyPath({
    locale: raw,
    service: hub.service.slug,
    state: hub.stateId,
    county: hub.countyName,
  });

  return {
    title: { absolute: title },
    description: copy.countyHubLead(
      hub.countyLabel,
      hub.zips.length,
      hub.cities.length,
    ),
    alternates: {
      canonical,
      languages: {
        en: countyPath({
          locale: "en",
          service: hub.service.slug,
          state: hub.stateId,
          county: hub.countyName,
        }),
        es: countyPath({
          locale: "es",
          service: hub.service.slug,
          state: hub.stateId,
          county: hub.countyName,
        }),
        "x-default": countyPath({
          locale: "en",
          service: hub.service.slug,
          state: hub.stateId,
          county: hub.countyName,
        }),
      },
    },
    openGraph: {
      title,
      description: copy.countyHubLead(
        hub.countyLabel,
        hub.zips.length,
        hub.cities.length,
      ),
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

export default async function CountyHubPage({ params }: CountyHubProps) {
  const { locale: raw, service, state, county } = await params;
  if (!isAppLocale(raw) || !isPhaseCoverage(service, state.toUpperCase())) {
    notFound();
  }

  const hub = await getCountyHubData(service, state, county);
  if (!hub) {
    notFound();
  }

  const copy = getDictionary(raw);
  const year = currentSeoYear();
  const pageUrl = `${SITE_URL}${countyPath({
    locale: raw,
    service: hub.service.slug,
    state: hub.stateId,
    county: hub.countyName,
  })}`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: copy.breadcrumbHome,
        item: `${SITE_URL}${localeHomePath(raw)}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: hub.countyLabel,
        item: pageUrl,
      },
    ],
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
            <span className="px-2">/</span>
            <span className="text-white">
              {hub.countyLabel}, {hub.stateId}
            </span>
          </nav>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
            {copy.countyHubH1(year, hub.countyLabel, hub.stateId)}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
            {copy.countyHubLead(
              hub.countyLabel,
              hub.zips.length,
              hub.cities.length,
            )}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full min-w-0 max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight text-navy">
          {copy.countyListHeading}
        </h2>
        <div className="mt-8 space-y-10">
          {hub.cities.map((group) => (
            <div key={group.citySlug} className="min-w-0">
              <h3 className="text-lg font-semibold text-navy">
                <Link
                  href={directoryPath({
                    locale: raw,
                    service: hub.service.slug,
                    state: hub.stateId,
                    city: group.cityName,
                  })}
                  className="hover:text-emergency"
                >
                  {group.cityName}
                </Link>
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.zips.map((zip) => (
                  <Link
                    key={zip.zip_code}
                    href={directoryPath({
                      locale: raw,
                      service: hub.service.slug,
                      state: zip.state_id,
                      city: zip.city,
                      zip: zip.zip_code,
                    })}
                    className="min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:border-emergency/40 hover:shadow-md"
                  >
                    <p className="text-lg font-semibold text-navy">
                      {zip.zip_code}
                    </p>
                    <p className="text-sm text-slate-500">
                      {zip.city}, {zip.state_id}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
