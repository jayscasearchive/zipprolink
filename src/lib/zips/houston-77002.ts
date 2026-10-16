import type { AppLocale } from "@/lib/i18n";
import { citySlug } from "@/lib/paths";
import type { FaqItem } from "@/lib/types";
import type { PageVariation } from "@/lib/variation/types";

export const HOUSTON_77002_ZIP = "77002";

export function isHouston77002Page(
  city: string,
  stateId: string,
  zipCode: string,
) {
  return (
    zipCode === HOUSTON_77002_ZIP &&
    stateId.toLowerCase() === "tx" &&
    citySlug(city) === "houston"
  );
}

function rewriteDensityLanguage(text: string, locale: AppLocale) {
  if (locale === "es") {
    return text
      .replaceAll("Residencial suburbano", "Centro de Houston")
      .replaceAll("residencial suburbano", "centro de Houston")
      .replaceAll("de entrada suburbana", "de centro y torres")
      .replaceAll("cilindro de la puerta", "cilindro de departamento u oficina");
  }

  return text
    .replaceAll("Suburban residential", "Downtown Houston")
    .replaceAll("suburban residential", "Downtown Houston")
    .replaceAll("Suburban driveway calls", "Downtown and mid-rise calls")
    .replaceAll("a front-door cylinder", "an apartment or office cylinder");
}

function rewriteFaqs(faqs: FaqItem[], locale: AppLocale) {
  return faqs.map((item) => ({
    question: rewriteDensityLanguage(item.question, locale),
    answer: rewriteDensityLanguage(item.answer, locale),
  }));
}

export function applyHouston77002Overlay(
  variation: PageVariation,
  locale: AppLocale,
): PageVariation {
  const downtown = locale === "es" ? "Centro de Houston" : "Downtown Houston";

  const introParagraphs =
    locale === "es"
      ? [
          rewriteDensityLanguage(variation.introParagraphs[0] ?? "", locale),
          "El ZIP 77002 es el centro de Houston. Hay oficinas, departamentos y locales a pie de calle. No todas las direcciones son torres comerciales. Solo se refiere un técnico si un proveedor independiente puede tomar el trabajo.",
        ]
      : [
          rewriteDensityLanguage(variation.introParagraphs[0] ?? "", locale),
          "ZIP 77002 is Downtown Houston. The area mixes offices, apartments, and street-level storefronts. Not every address is a commercial tower. A technician is referred only if an independent provider can take the job.",
        ];

  const checklist =
    locale === "es"
      ? variation.checklist.map((item) =>
          item.includes("HOA")
            ? "Cierres de casa y departamento fuera de horario"
            : item,
        )
      : variation.checklist.map((item) =>
          item.includes("HOA-gate")
            ? "Home and apartment lockouts after hours"
            : item,
        );

  return {
    ...variation,
    densityBand: "urban",
    densityLabel: downtown,
    densityCopy:
      locale === "es"
        ? "El ZIP 77002 es el centro de Houston, en el condado de Harris. Mezcla oficinas, departamentos y locales a pie de calle. No todas las direcciones son torres comerciales. El referido sigue dependiendo de si un proveedor independiente puede tomar el trabajo."
        : "ZIP 77002 is Downtown Houston, in Harris County. It mixes offices, apartments, and street-level storefronts. Not every address is a commercial tower. A referral still depends on whether an independent provider can take the job.",
    introParagraphs,
    checklist,
    localBody:
      locale === "es"
        ? "El ZIP 77002 es el centro de Houston. Los códigos vecinos más abajo son listados cercanos, no talleres extra. Si está justo fuera de este ZIP, abra el listado más cercano."
        : "ZIP 77002 is Downtown Houston. Neighbor codes below are nearby listings, not extra shops. If you are just outside this ZIP, open the closest listing.",
    asideBody: rewriteDensityLanguage(
      variation.asideBody
        .replace("building or subdivision", "building or cross-street")
        .replace("edificio o la subdivisión", "edificio o el cruce"),
      locale,
    ),
    processSteps: variation.processSteps.map((step) => ({
      ...step,
      title: rewriteDensityLanguage(step.title, locale),
      detail: rewriteDensityLanguage(step.detail, locale),
    })),
    pricingIntro: rewriteDensityLanguage(variation.pricingIntro, locale),
    faqLead: rewriteDensityLanguage(variation.faqLead, locale),
    faqs: rewriteFaqs(variation.faqs, locale),
    metaDescription: rewriteDensityLanguage(variation.metaDescription, locale),
    heroSupport: rewriteDensityLanguage(variation.heroSupport, locale),
    dpsBody: rewriteDensityLanguage(variation.dpsBody, locale),
  };
}

export function overlayZipVariationIfHouston77002(
  variation: PageVariation,
  city: string,
  stateId: string,
  zipCode: string,
  locale: AppLocale,
): PageVariation {
  if (!isHouston77002Page(city, stateId, zipCode)) {
    return variation;
  }
  return applyHouston77002Overlay(variation, locale);
}
