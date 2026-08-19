import type { Metadata } from "next";
import { DirectoryPage } from "@/components/DirectoryPage";
import { DirectorySearch } from "@/components/DirectorySearch";
import { SiteHeader } from "@/components/SiteHeader";
import { HOTLINE_DISPLAY, SITE_NAME, SITE_URL } from "@/lib/constants";
import { getDirectoryPageData, getPhaseServices } from "@/lib/directory";
import {
  buildEmergencyServiceSchema,
  buildFaqSchema,
  serializeJsonLd,
} from "@/lib/schema";
import {
  currentPhaseService,
  currentPhaseStateIds,
  isPhaseCoverage,
} from "@/lib/ssot";
import { supabase } from "@/lib/supabase";
import { buildPageVariation } from "@/lib/variation";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ service: string; zip: string }>;
};

export async function generateStaticParams() {
  const service = currentPhaseService();
  const stateIds = currentPhaseStateIds();

  const { data: zips } = await supabase
    .from("zip_codes")
    .select("zip_code, state_id")
    .in("state_id", [...stateIds]);

  if (!zips?.length) {
    return [];
  }

  return zips
    .filter((zip) => isPhaseCoverage(service.slug, zip.state_id))
    .map((zip) => ({
      service: service.slug,
      zip: zip.zip_code,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service: serviceSlug, zip: zipCode } = await params;
  const data = await getDirectoryPageData(serviceSlug, zipCode);

  if (!data) {
    return {
      title: "Local emergency service not found",
      description: `We could not find emergency coverage for this ZIP. Call ${HOTLINE_DISPLAY} for live dispatch help.`,
      robots: { index: false, follow: true },
    };
  }

  const variation = buildPageVariation(data.service, data.zip);
  const canonical = `/${data.service.slug}/${data.zip.zip_code}`;

  return {
    title: { absolute: variation.headline },
    description: variation.metaDescription,
    alternates: { canonical },
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

export default async function ServiceZipPage({ params }: PageProps) {
  const { service: serviceSlug, zip: zipCode } = await params;
  const [data, services] = await Promise.all([
    getDirectoryPageData(serviceSlug, zipCode),
    getPhaseServices(),
  ]);

  if (!data) {
    return (
      <div className="flex min-h-full flex-1 flex-col bg-slate-50">
        <SiteHeader />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emergency">
            Coverage not found
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-navy">
            We do not have a live listing for this ZIP yet
          </h1>
          <p className="mt-3 text-slate-600">
            Check the service and 5-digit ZIP, or call {HOTLINE_DISPLAY} for
            immediate dispatch.
          </p>
          <div className="mt-8">
            <DirectorySearch
              services={services}
              defaultService={currentPhaseService().slug}
              variant="compact"
            />
          </div>
        </main>
      </div>
    );
  }

  const variation = buildPageVariation(data.service, data.zip);
  const pageUrl = `${SITE_URL}/${data.service.slug}/${data.zip.zip_code}`;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <JsonLd json={buildEmergencyServiceSchema(data, variation, pageUrl)} />
      <JsonLd json={buildFaqSchema(variation)} />
      <SiteHeader />
      <main>
        <DirectoryPage data={data} variation={variation} />
      </main>
    </div>
  );
}
