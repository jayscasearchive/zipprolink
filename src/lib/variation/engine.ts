import { locationLabel, priceRange, shortServiceName } from "@/lib/content";
import { getLocalePhone } from "@/lib/i18n";
import type { ServiceCategory, ZipCode } from "@/lib/types";
import { hashZipCode, pickIndex, pickUnique } from "@/lib/variation/hash";
import {
  EN_INTENTS,
  HERO_PANEL,
  LAYOUT_IDS,
  LAYOUT_ORDERS,
  PAGE_CHROME_EN,
  PRICING_TABLE_EN,
  classifyDensity,
  densityCopy,
  densityLabel,
  emptyPopulationFallback,
  emptyPopulationFallbackEs,
  interpolateList,
  locksmithJobs,
  populationLabel,
  populationLabelEs,
  type CopyContext,
  type IntentPack,
} from "@/lib/variation/pools";
import {
  ES_INTENTS,
  PAGE_CHROME_ES,
  PRICING_TABLE_ES,
  densityCopyEs,
  densityLabelEs,
} from "@/lib/variation/es-blocks";
import type { LayoutId, PageVariation } from "@/lib/variation/types";

export function buildCopyContext(
  service: ServiceCategory,
  zip: ZipCode,
  locale: "en" | "es" = "en",
): CopyContext {
  const band = classifyDensity(zip.density);
  const shortName = shortServiceName(service);
  const place = locationLabel(zip);
  const county = zip.county_name?.trim() || "the local";
  const phone = getLocalePhone(locale, service);
  const ctx: CopyContext = {
    city: zip.city,
    county,
    stateName: zip.state_name,
    stateId: zip.state_id,
    zip: zip.zip_code,
    place,
    shortName,
    serviceLabel: shortName.toLowerCase(),
    responseTime: service.avg_response_time,
    priceRange: priceRange(service),
    densityBand: band,
    densityLabel: locale === "es" ? densityLabelEs(band) : densityLabel(band),
    densityCopy: "",
    populationLabel:
      locale === "es"
        ? populationLabelEs(zip.population)
        : populationLabel(zip.population),
    phoneDisplay: phone.display,
  };
  ctx.densityCopy =
    locale === "es" ? densityCopyEs(ctx) : densityCopy(ctx);
  ctx.populationLabel =
    locale === "es"
      ? emptyPopulationFallbackEs(ctx)
      : emptyPopulationFallback(ctx);
  return ctx;
}

function assembleVariation(
  service: ServiceCategory,
  zip: ZipCode,
  locale: "en" | "es",
): PageVariation {
  const hash = hashZipCode(zip.zip_code, service.slug);
  const layoutId: LayoutId = LAYOUT_IDS[pickIndex(hash, LAYOUT_IDS.length, 1)];
  const pack: IntentPack = (locale === "es" ? ES_INTENTS : EN_INTENTS)[layoutId];
  const ctx = buildCopyContext(service, zip, locale);

  const hero = pack.hooks[pickIndex(hash, pack.hooks.length, 2)](ctx);
  const intro = pack.intro(ctx);
  const aside = pack.aside(ctx);
  const chips = pack.chips(ctx);
  const dps = pack.dps(ctx);
  const process = pack.process(ctx);
  const pricing = pack.pricing(ctx);
  const checklist = interpolateList(pack.checklist, ctx);

  const extraPool = pack.extraFaqs(ctx);
  const extraCount = 1 + pickIndex(hash, 2, 6);
  const extraIndexes = pickUnique(
    extraPool.map((_, index) => index),
    hash ^ 0x9e3779b9,
    extraCount,
  );
  const faqs = [
    ...pack.requiredFaqs(ctx),
    ...extraIndexes.flatMap((index) => {
      const item = extraPool[index];
      return item ? [item] : [];
    }),
  ];

  const heroPanel = HERO_PANEL[layoutId];

  return {
    hash,
    layoutId,
    heroPanel,
    showPricingInHero: layoutId === "cost",
    showNeighborsInHero: layoutId === "neighborhood",
    sectionOrder: LAYOUT_ORDERS[layoutId],
    densityBand: ctx.densityBand,
    densityLabel: ctx.densityLabel,
    densityCopy: ctx.densityCopy,
    headline: hero.headline,
    heroSupport: hero.support,
    asideTitle: aside.title,
    asideBody: aside.body,
    asideMetric: aside.metric,
    asideMetricLabel: aside.metricLabel,
    chipPrimaryLabel: chips.primaryLabel,
    chipPrimaryValue: chips.primaryValue,
    chipSecondaryLabel: chips.secondaryLabel,
    chipSecondaryValue: chips.secondaryValue,
    introHeading: intro.heading,
    introParagraphs: intro.paragraphs,
    checklistHeading: intro.checklistHeading,
    checklist,
    localHeading: intro.localHeading,
    localBody: intro.localBody,
    neighborsEmpty: pack.neighborsEmpty(zip.state_name),
    dpsHeading: dps.heading,
    dpsBody: dps.body,
    processHeading: process.heading,
    processIntro: process.intro,
    processSteps: process.steps,
    pricingHeading: pricing.heading,
    pricingIntro: pricing.intro,
    pricingTableLabels: locale === "es" ? PRICING_TABLE_ES : PRICING_TABLE_EN,
    jobEstimates: locksmithJobs(ctx, locale),
    faqHeading: pack.faqHeading(ctx),
    faqLead: pack.faqLead(ctx),
    faqs,
    metaDescription: pack.meta(ctx),
    chrome: locale === "es" ? PAGE_CHROME_ES : PAGE_CHROME_EN,
  };
}

export function buildPageVariation(
  service: ServiceCategory,
  zip: ZipCode,
): PageVariation {
  return assembleVariation(service, zip, "en");
}

export function localizePageVariation(
  variation: PageVariation,
  locale: "en" | "es",
  service: ServiceCategory,
  zip: ZipCode,
): PageVariation {
  if (locale !== "es") {
    return variation;
  }

  return assembleVariation(service, zip, "es");
}
