import { locationLabel, priceRange, shortServiceName, currentSeoYear } from "@/lib/content";
import type { ServiceCategory, ZipCode } from "@/lib/types";
import { hashZipCode, pickIndex, pickUnique } from "@/lib/variation/hash";
import {
  BODY_TEMPLATES,
  DPS_TRUST,
  HERO_HOOKS,
  LAYOUT_IDS,
  LAYOUT_ORDERS,
  LOCKSMITH_CHECKLISTS,
  buildMetaDescription,
  classifyDensity,
  densityCopy,
  densityLabel,
  emptyPopulationFallback,
  faqPool,
  interpolateList,
  locksmithJobs,
  populationLabel,
  processCopy,
  type CopyContext,
} from "@/lib/variation/pools";
import type { PageVariation } from "@/lib/variation/types";

export function buildCopyContext(
  service: ServiceCategory,
  zip: ZipCode,
): CopyContext {
  const band = classifyDensity(zip.density);
  const shortName = shortServiceName(service);
  const place = locationLabel(zip);
  const county = zip.county_name?.trim() || "the local";
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
    densityLabel: densityLabel(band),
    densityCopy: "",
    populationLabel: populationLabel(zip.population),
  };
  ctx.densityCopy = densityCopy(ctx);
  ctx.populationLabel = emptyPopulationFallback(ctx);
  return ctx;
}

export function buildPageVariation(
  service: ServiceCategory,
  zip: ZipCode,
): PageVariation {
  const hash = hashZipCode(zip.zip_code, service.slug);
  const ctx = buildCopyContext(service, zip);

  const layoutId = LAYOUT_IDS[pickIndex(hash, LAYOUT_IDS.length, 1)];
  const hero = HERO_HOOKS[pickIndex(hash, HERO_HOOKS.length, 2)](ctx);
  const body = BODY_TEMPLATES[pickIndex(hash, BODY_TEMPLATES.length, 3)](ctx);
  const dps = DPS_TRUST[pickIndex(hash, DPS_TRUST.length, 4)](ctx);
  const process = processCopy(ctx);

  const checklistSource =
    LOCKSMITH_CHECKLISTS[pickIndex(hash, LOCKSMITH_CHECKLISTS.length, 5)] ??
    LOCKSMITH_CHECKLISTS[0];
  const checklist = interpolateList(checklistSource, ctx);

  const faqCount = 4 + pickIndex(hash, 2, 6);
  const faqs = pickUnique(faqPool(ctx), hash ^ 0x9e3779b9, faqCount);

  const urbanLift = ctx.densityBand === "urban" ? 1.08 : 1;

  return {
    hash,
    layoutId,
    sectionOrder: LAYOUT_ORDERS[layoutId],
    densityBand: ctx.densityBand,
    densityLabel: ctx.densityLabel,
    densityCopy: ctx.densityCopy,
    headline: hero.headline,
    heroSupport: hero.support,
    asideTitle: body.asideTitle,
    asideBody: body.asideBody,
    introHeading: body.heading,
    introParagraphs: body.paragraphs,
    checklistHeading: body.checklistHeading,
    checklist,
    localHeading: body.localHeading,
    localBody: body.localBody,
    dpsHeading: dps.heading,
    dpsBody: dps.body,
    processHeading: process.heading,
    processIntro: process.intro,
    processSteps: process.steps,
    pricingHeading: `${currentSeoYear()} ${ctx.shortName} cost & dispatch times in ${ctx.city}`,
    pricingIntro: `${ctx.city} emergency cost ranges and typical arrival windows for ZIP ${ctx.zip}, adjusted for this ${ctx.densityLabel.toLowerCase()} area.`,
    jobEstimates: locksmithJobs(ctx, urbanLift),
    faqs,
    metaDescription: buildMetaDescription(ctx),
  };
}
