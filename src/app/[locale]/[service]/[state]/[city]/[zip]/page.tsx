import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DirectoryPage } from "@/components/DirectoryPage";
import { DirectorySearch } from "@/components/DirectorySearch";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import {
  getDirectoryPageData,
  getPhaseServices,
  getZipStaticParams,
} from "@/lib/directory";
import { getDictionary, getLocalePhone, isAppLocale } from "@/lib/i18n";
import { citySlug, directoryPath, parseStateId } from "@/lib/paths";
import {
  buildPageJsonLd,
  serializeJsonLd,
} from "@/lib/schema";
import { currentPhaseService, isPhaseCoverage } from "@/lib/ssot";
import { buildPageVariation, localizePageVariation } from "@/lib/variation";

export const revalidate = 86400;

type ZipPageProps = {
  params: Promise<{
    locale: string;
    service: string;
    state: string;
    city: string;
    zip: string;
  }>;
};

export async function generateStaticParams() {
  return getZipStaticParams();
}

export async function generateMetadata({
  params,
}: ZipPageProps): Promise<Metadata> {
  const { locale: raw, service, state, city, zip } = await params;
  if (!isAppLocale(raw)) {
    return { title: "Not found", robots: { index: false, follow: true } };
  }

  const data = await getDirectoryPageData(service, zip);
  const phone = getLocalePhone(raw, data?.service);
  if (
    !data ||
    citySlug(data.zip.city) !== city ||
    data.zip.state_id.toLowerCase() !== state.toLowerCase()
  ) {
    return {
      title: "Local emergency service not found",
      description: `We could not find emergency coverage for this ZIP. Call ${phone.display} for live dispatch help.`,
      robots: { index: false, follow: true },
    };
  }

  const variation = localizePageVariation(
    buildPageVariation(data.service, data.zip),
    raw,
    data.service,
    data.zip,
  );
  const canonical = directoryPath({
    locale: raw,
    service: data.service.slug,
    state: data.zip.state_id,
    city: data.zip.city,
    zip: data.zip.zip_code,
  });

  return {
    title: { absolute: variation.headline },
    description: variation.metaDescription,
    alternates: {
      canonical,
      languages: {
        en: directoryPath({
          locale: "en",
          service: data.service.slug,
          state: data.zip.state_id,
          city: data.zip.city,
          zip: data.zip.zip_code,
        }),
        es: directoryPath({
          locale: "es",
          service: data.service.slug,
          state: data.zip.state_id,
          city: data.zip.city,
          zip: data.zip.zip_code,
        }),
        "x-default": directoryPath({
          locale: "en",
          service: data.service.slug,
          state: data.zip.state_id,
          city: data.zip.city,
          zip: data.zip.zip_code,
        }),
      },
    },
    openGraph: {
      title: variation.headline,
      description: variation.metaDescription,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

function JsonLd({ json }: { json: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(json) }}
    />
  );
}

export default async function ServiceZipPage({ params }: ZipPageProps) {
  const { locale: raw, service, state, city, zip } = await params;
  if (!isAppLocale(raw) || !isPhaseCoverage(service, parseStateId(state))) {
    notFound();
  }

  const [data, services] = await Promise.all([
    getDirectoryPageData(service, zip),
    getPhaseServices(),
  ]);
  const copy = getDictionary(raw);
  const phone = getLocalePhone(raw, data?.service);

  if (
    !data ||
    citySlug(data.zip.city) !== city ||
    data.zip.state_id.toLowerCase() !== state.toLowerCase()
  ) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emergency">
          Coverage not found
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-navy">
          {copy.coverageMissingTitle}
        </h1>
        <p className="mt-3 text-slate-600">
          {copy.coverageMissingBody(phone.display)}
        </p>
        <div className="mt-8">
          <DirectorySearch
            locale={raw}
            services={services}
            defaultService={currentPhaseService().slug}
            variant="compact"
          />
        </div>
      </main>
    );
  }

  const variation = localizePageVariation(
    buildPageVariation(data.service, data.zip),
    raw,
    data.service,
    data.zip,
  );
  const pageUrl = `${SITE_URL}${directoryPath({
    locale: raw,
    service: data.service.slug,
    state: data.zip.state_id,
    city: data.zip.city,
    zip: data.zip.zip_code,
  })}`;

  return (
    <div className="min-w-0 max-w-full bg-white">
      <JsonLd json={buildPageJsonLd(data, variation, pageUrl, raw)} />
      <main>
        <DirectoryPage locale={raw} data={data} variation={variation} />
      </main>
    </div>
  );
}
