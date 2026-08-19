import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { DirectorySearch } from "@/components/DirectorySearch";
import { SITE_NAME, SITE_URL, TEST_CITIES } from "@/lib/constants";
import { currentSeoYear } from "@/lib/content";
import { getPhaseServices } from "@/lib/directory";
import { getDictionary, isAppLocale } from "@/lib/i18n";
import { directoryPath, localeHomePath } from "@/lib/paths";

export const revalidate = 86400;

type HomeProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) {
    return { title: "Not found" };
  }

  const copy = getDictionary(raw);
  const year = currentSeoYear();
  const title = copy.homeH1(year);

  return {
    title: { absolute: `${title.replace(/\.$/, "")} | ${SITE_NAME}` },
    description: copy.homeLead,
    alternates: {
      canonical: localeHomePath(raw),
      languages: {
        en: localeHomePath("en"),
        es: localeHomePath("es"),
      },
    },
    openGraph: {
      title,
      description: copy.homeLead,
      url: `${SITE_URL}${localeHomePath(raw)}`,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

export default async function LocaleHomePage({ params }: HomeProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) {
    notFound();
  }

  const locale = raw;
  const copy = getDictionary(locale);
  const serviceOptions = await getPhaseServices();
  const seoYear = currentSeoYear();

  return (
    <main>
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(225,29,72,0.25),transparent_40%),radial-gradient(circle_at_90%_10%,rgba(245,158,11,0.16),transparent_32%)]" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">
            <Zap className="h-3.5 w-3.5" aria-hidden />
            {copy.homeTagline}
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl sm:leading-[1.05]">
            {copy.homeH1(seoYear)}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            {copy.homeLead}
          </p>
          <div className="mt-8 max-w-3xl">
            <DirectorySearch locale={locale} services={serviceOptions} />
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-white/65">
            <ShieldCheck className="h-4 w-4 text-emerald-300" aria-hidden />
            {copy.licensedLine}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-navy">
            {copy.coverageHeading}
          </h2>
          <p className="mt-2 text-sm text-slate-600">{copy.coverageLead}</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEST_CITIES.map((city) => (
            <Link
              key={`${city.zip}-${city.service}`}
              href={directoryPath({
                locale,
                service: city.service,
                state: city.state,
                city: city.city,
                zip: city.zip,
              })}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emergency/40 hover:shadow-lg"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emergency">
                {city.service}
              </p>
              <p className="mt-2 text-lg font-semibold text-navy">
                {city.city}, {city.state}
              </p>
              <p className="text-sm text-slate-500">ZIP {city.zip}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy">
                {copy.openPage}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-navy">
            {copy.whyHeading}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {copy.whyItems.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
