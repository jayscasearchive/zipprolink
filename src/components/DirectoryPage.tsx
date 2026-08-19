import type { ReactNode } from "react";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { CallToAction } from "@/components/CallToAction";
import { DispatchProcess } from "@/components/DispatchProcess";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PriceTimeTable } from "@/components/PriceTimeTable";
import { TexasDpsNotice } from "@/components/TexasDpsNotice";
import { TrustBadges } from "@/components/TrustBadges";
import { priceRange } from "@/lib/content";
import { getDictionary, type AppLocale } from "@/lib/i18n";
import { directoryPath } from "@/lib/paths";
import type { DirectoryPageData } from "@/lib/types";
import type { PageVariation, SectionKey } from "@/lib/variation/types";

type DirectoryPageProps = {
  locale: AppLocale;
  data: DirectoryPageData;
  variation: PageVariation;
};

export function DirectoryPage({ locale, data, variation }: DirectoryPageProps) {
  const { service, zip, neighbors } = data;
  const copy = getDictionary(locale);

  const sections: Record<SectionKey, ReactNode> = {
    process: (
      <DispatchProcess
        key="process"
        heading={variation.processHeading}
        intro={variation.processIntro}
        steps={variation.processSteps}
      />
    ),
    pricing: null,
    checklist: (
      <section key="checklist">
        <h2 className="text-2xl font-semibold tracking-tight text-navy">
          {variation.checklistHeading}
        </h2>
        <ul className="mt-6 space-y-3">
          {variation.checklist.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>
    ),
    local: (
      <section key="local">
        <h2 className="text-2xl font-semibold tracking-tight text-navy">
          {variation.localHeading}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{variation.localBody}</p>
        {neighbors.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {neighbors.map((neighbor) => (
              <Link
                key={neighbor.zip_code}
                href={directoryPath({
                  locale,
                  service: service.slug,
                  state: neighbor.state_id,
                  city: neighbor.city,
                  zip: neighbor.zip_code,
                })}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-emergency/40 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-navy">{neighbor.zip_code}</p>
                <p className="text-xs text-slate-500">
                  {neighbor.city}, {neighbor.state_id}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500">
            Nearby ZIP listings for {zip.state_name} will appear here as coverage
            expands.
          </p>
        )}
      </section>
    ),
    dps: (
      <TexasDpsNotice
        key="dps"
        heading={variation.dpsHeading}
        body={variation.dpsBody}
      />
    ),
    faq: (
      <section key="faq">
        <h2 className="text-2xl font-semibold tracking-tight text-navy">
          {copy.faqHeading}
        </h2>
        <p className="mt-2 mb-6 text-sm text-slate-600">
          {copy.faqLead(zip.zip_code)}
        </p>
        <FaqAccordion items={variation.faqs} />
      </section>
    ),
  };

  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.28),transparent_42%)]" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:py-16">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {zip.city}, {zip.state_name} · {zip.zip_code}
              </p>
              <p className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
                {variation.densityLabel}
              </p>
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-[1.1]">
              {variation.headline}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              {variation.heroSupport}
            </p>

            <div className="mt-8 flex max-w-xl flex-col gap-3">
              <CallToAction locale={locale} variant="hero" service={service} />
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-sm font-medium text-amber-200 ring-1 ring-white/10">
                  <Clock className="h-4 w-4" aria-hidden />
                  Dispatch {service.avg_response_time}
                </span>
                <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-2 text-sm font-medium text-white ring-1 ring-white/10">
                  Cost {priceRange(service)}
                </span>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">
              {variation.asideTitle}
            </p>
            <p className="mt-3 text-3xl font-semibold">{priceRange(service)}</p>
            <p className="mt-2 text-sm leading-6 text-white/70">{variation.asideBody}</p>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                <dt className="text-white/60">Avg. dispatch</dt>
                <dd className="font-semibold">{service.avg_response_time}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                <dt className="text-white/60">Coverage ZIP</dt>
                <dd className="font-semibold">{zip.zip_code}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-white/60">Area type</dt>
                <dd className="font-semibold text-emerald-300">{variation.densityLabel}</dd>
              </div>
            </dl>
          </aside>

          <div className="lg:col-span-2">
            <PriceTimeTable
              heading={variation.pricingHeading}
              intro={variation.pricingIntro}
              rows={variation.jobEstimates}
              tone="hero"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <TrustBadges />
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-navy">
            {variation.introHeading}
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
            {variation.introParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {variation.sectionOrder
        .filter((key) => key !== "pricing")
        .map((key) => (
          <div
            key={key}
            className={
              key === "faq"
                ? "mx-auto w-full max-w-6xl px-4 py-12 sm:px-6"
                : "mx-auto w-full max-w-6xl px-4 py-8 sm:px-6"
            }
          >
            {sections[key]}
          </div>
        ))}
    </>
  );
}
