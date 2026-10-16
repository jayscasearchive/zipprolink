import { FaqAccordion } from "@/components/FaqAccordion";
import type { HoustonHubCopy } from "@/lib/city-hubs/houston";
import { serializeJsonLd } from "@/lib/schema";

export function HoustonCityHub({ copy }: { copy: HoustonHubCopy }) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto w-full min-w-0 max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          {copy.sections.map((section) => (
            <article key={section.heading} className="min-w-0">
              <h2 className="text-xl font-semibold tracking-tight text-navy sm:text-2xl">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph, index) => (
                <p
                  key={`${section.heading}-${index}`}
                  className="mt-3 text-sm leading-6 text-slate-600 sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HoustonHubFaq({ copy }: { copy: HoustonHubCopy }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="mx-auto w-full min-w-0 max-w-6xl px-4 pb-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
      />
      <h2 className="text-2xl font-semibold tracking-tight text-navy">
        {copy.faqHeading}
      </h2>
      <div className="mt-6">
        <FaqAccordion items={copy.faqs} />
      </div>
    </section>
  );
}
