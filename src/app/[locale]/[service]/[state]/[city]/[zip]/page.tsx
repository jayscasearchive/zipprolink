import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { DirectoryPage } from "@/components/DirectoryPage";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import {
  getDirectoryPageData,
  getZipStaticParams,
} from "@/lib/directory";
import { isAppLocale } from "@/lib/i18n";
import { citySlug, directoryPath, parseStateId } from "@/lib/paths";
import { DirectoryUnavailableError } from "@/lib/query-errors";
import {
  buildPageJsonLd,
  serializeJsonLd,
} from "@/lib/schema";
import { isPhaseCoverage } from "@/lib/ssot";
import { buildPageVariation, localizePageVariation } from "@/lib/variation";

export const revalidate = 86400;
export const dynamicParams = false;

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

  let data;
  try {
    data = await getDirectoryPageData(service, zip);
  } catch (error) {
    if (error instanceof DirectoryUnavailableError) {
      throw error;
    }
    throw error;
  }

  if (!data) {
    notFound();
  }

  const canonical = directoryPath({
    locale: raw,
    service: data.service.slug,
    state: data.zip.state_id,
    city: data.zip.city,
    zip: data.zip.zip_code,
  });

  if (
    citySlug(data.zip.city) !== city ||
    data.zip.state_id.toLowerCase() !== state.toLowerCase()
  ) {
    permanentRedirect(canonical);
  }

  const variation = localizePageVariation(
    buildPageVariation(data.service, data.zip),
    raw,
    data.service,
    data.zip,
  );

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

  const data = await getDirectoryPageData(service, zip);
  if (!data) {
    notFound();
  }

  const canonical = directoryPath({
    locale: raw,
    service: data.service.slug,
    state: data.zip.state_id,
    city: data.zip.city,
    zip: data.zip.zip_code,
  });

  if (
    citySlug(data.zip.city) !== city ||
    data.zip.state_id.toLowerCase() !== state.toLowerCase()
  ) {
    permanentRedirect(canonical);
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
