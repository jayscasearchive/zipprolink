import { HOTLINE_DISPLAY } from "@/lib/constants";
import { currentSeoYear } from "@/lib/content";
import type { FaqItem } from "@/lib/types";
import type { DensityBand, JobEstimate, SectionKey } from "@/lib/variation/types";

export type CopyContext = {
  city: string;
  county: string;
  stateName: string;
  stateId: string;
  zip: string;
  place: string;
  shortName: string;
  serviceLabel: string;
  responseTime: string;
  priceRange: string;
  densityBand: DensityBand;
  densityLabel: string;
  densityCopy: string;
  populationLabel: string;
};

export const URBAN_DENSITY_THRESHOLD = 5000;

export function classifyDensity(density: number | null): DensityBand {
  return density != null && density >= URBAN_DENSITY_THRESHOLD
    ? "urban"
    : "suburban";
}

export function densityLabel(band: DensityBand) {
  return band === "urban"
    ? "High-density urban"
    : "Suburban residential";
}

export function densityCopy(ctx: CopyContext) {
  if (ctx.densityBand === "urban") {
    return `${ctx.place} sits in a high-density urban corridor${ctx.county !== "the local" ? ` of ${ctx.county} County` : ""}. Tight street grids, garage podiums, and after-hours office lockouts are common, so ZipProLink routes locksmiths who already cover this ZIP instead of sending a suburban-only tech across town.`;
  }

  return `${ctx.place} is a suburban residential pocket${ctx.county !== "the local" ? ` in ${ctx.county} County` : ""}. Driveways, HOA gates, and detached-home lockouts dominate night calls, so dispatch favors techs staged near neighborhood arterials rather than downtown-only crews.`;
}

type HookBuilder = (ctx: CopyContext) => { headline: string; support: string };

export const HERO_HOOKS: HookBuilder[] = [
  (ctx) => {
    const year = currentSeoYear();
    return {
      headline: `${year} Locksmith Cost & 24/7 Emergency Dispatch in ${ctx.city}, ${ctx.stateId} ${ctx.zip}`,
      support: `Typical ${ctx.city} jobs run ${ctx.priceRange}. A licensed ${ctx.serviceLabel} can be routed to ZIP ${ctx.zip} in about ${ctx.responseTime}. No-obligation estimate before any work.`,
    };
  },
  (ctx) => {
    const year = currentSeoYear();
    return {
      headline: `${year} Locksmith Cost & 24/7 Emergency Dispatch in ${ctx.city}, ${ctx.stateId} ${ctx.zip}`,
      support: `${ctx.densityLabel} coverage in ${ctx.county} County. Call ${HOTLINE_DISPLAY} for a live dispatch window of ${ctx.responseTime} and an upfront cost range.`,
    };
  },
  (ctx) => {
    const year = currentSeoYear();
    return {
      headline: `${year} Locksmith Cost & 24/7 Emergency Dispatch in ${ctx.city}, ${ctx.stateId} ${ctx.zip}`,
      support: `Compare lockout, rekey, and smart-lock cost ranges for ${ctx.place}. Nights, weekends, and holidays stay open. Typical jobs ${ctx.priceRange}.`,
    };
  },
  (ctx) => {
    const year = currentSeoYear();
    return {
      headline: `${year} Locksmith Cost & 24/7 Emergency Dispatch in ${ctx.city}, ${ctx.stateId} ${ctx.zip}`,
      support: `Local routing across ${ctx.county} County. Average arrival ${ctx.responseTime}. You approve the on-site estimate before any drilling or rekey work.`,
    };
  },
  (ctx) => {
    const year = currentSeoYear();
    return {
      headline: `${year} Locksmith Cost & 24/7 Emergency Dispatch in ${ctx.city}, ${ctx.stateId} ${ctx.zip}`,
      support: `${ctx.populationLabel} This ${ctx.densityLabel.toLowerCase()} ZIP is staffed 24/7. Licensed techs only — TX DPS Private Security standards apply.`,
    };
  },
  (ctx) => {
    const year = currentSeoYear();
    return {
      headline: `${year} Locksmith Cost & 24/7 Emergency Dispatch in ${ctx.city}, ${ctx.stateId} ${ctx.zip}`,
      support: `If you are locked out of a home, car, or office in ${ctx.place}, call ${HOTLINE_DISPLAY}. Typical response ${ctx.responseTime}; typical range ${ctx.priceRange}.`,
    };
  },
];

export const LAYOUT_ORDERS: Record<
  "emergency" | "compliance" | "neighborhood" | "cost",
  SectionKey[]
> = {
  emergency: ["process", "pricing", "checklist", "local", "dps", "faq"],
  compliance: ["dps", "checklist", "pricing", "process", "local", "faq"],
  neighborhood: ["local", "process", "pricing", "checklist", "dps", "faq"],
  cost: ["pricing", "process", "checklist", "local", "dps", "faq"],
};

export const LAYOUT_IDS = [
  "emergency",
  "compliance",
  "neighborhood",
  "cost",
] as const;

type IntroBuilder = (ctx: CopyContext) => {
  heading: string;
  paragraphs: string[];
  asideTitle: string;
  asideBody: string;
  checklistHeading: string;
  localHeading: string;
  localBody: string;
};

export const BODY_TEMPLATES: IntroBuilder[] = [
  (ctx) => ({
    heading: `When a lockout hits ${ctx.city} ${ctx.zip}`,
    paragraphs: [
      `Most ${ctx.zip} calls start the same way: keys on the kitchen counter, a dead car fob in a parking garage, or a snapped key in a ${ctx.densityBand === "urban" ? "high-rise" : "front-door"} cylinder after midnight. ZipProLink is the ${ctx.city} emergency desk for that moment — not a coupon farm, a live dispatch path into ${ctx.county} County.`,
      `Because ${ctx.place} is a ${ctx.densityLabel.toLowerCase()} ZIP, we do not treat it like a statewide average. Techs who already run ${ctx.city} nights get the ticket first. You hear the arrival window (${ctx.responseTime}) before anyone rolls, and the price conversation stays inside ${ctx.priceRange} unless the job changes on site.`,
    ],
    asideTitle: "Emergency window",
    asideBody: `Lockout tickets in ${ctx.zip} usually clear in ${ctx.responseTime}. Keep the door closed and call ${HOTLINE_DISPLAY} so we can pin your exact building or subdivision.`,
    checklistHeading: `What a ${ctx.city} emergency locksmith actually handles`,
    localHeading: `How ${ctx.zip} sits on the ${ctx.city} map`,
    localBody: `Neighboring ZIPs below share the same ${ctx.stateId} dispatch board. If you are just outside ${ctx.zip}, pick the closest listing so the matched tech is already in ${ctx.county} County.`,
  }),
  (ctx) => ({
    heading: `Licensed work in ${ctx.county} County, not a gray-market pickup`,
    paragraphs: [
      `Texas Occupations Code Chapter 1702 puts locksmith companies under the Texas Department of Public Safety Private Security Program. For ${ctx.place}, that is the filter: ZipProLink only routes technicians who can legally service this ZIP under TX DPS rules, with insurance on the truck.`,
      `${ctx.city} ${ctx.zip} is ${ctx.densityLabel.toLowerCase()} territory. That changes staging — ${ctx.densityBand === "urban" ? "garage access, elevator rooms, and office suites" : "gated HOAs, detached homes, and long suburban laterals"} — but it does not change the licensing bar. If a caller in ${ctx.zip} needs a rekey after a break-in, the paper trail has to stand up in ${ctx.county} County.`,
    ],
    asideTitle: "Compliance snapshot",
    asideBody: `TX DPS Private Security standards apply to locksmith dispatch in ${ctx.city}. Ask the arriving tech for company licensing details before work begins.`,
    checklistHeading: `Covered locksmith jobs for ${ctx.zip}`,
    localHeading: `${ctx.county} County ZIPs next to ${ctx.zip}`,
    localBody: `These nearby ${ctx.stateName} codes use the same licensed bench. Opening a neighbor ZIP keeps internal links honest and helps Google see ${ctx.city} as a cluster, not cloned pages.`,
  }),
  (ctx) => ({
    heading: `A field guide to ${ctx.place}`,
    paragraphs: [
      `${ctx.zip} is ${ctx.city}, ${ctx.stateId} — ${ctx.county} County — and ${ctx.populationLabel.toLowerCase()} The local pattern is ${ctx.densityLabel.toLowerCase()}: ${ctx.densityBand === "urban" ? "stacked housing, paid parking, and late office lockouts" : "single-family streets, school-zone evenings, and garage-door keypad failures"}.`,
      `This page is built for that geography. Response targets stay near ${ctx.responseTime}, quotes start in ${ctx.priceRange}, and the neighboring ZIP module below is the actual ${ctx.stateId} board for this cluster, not a national footer dump.`,
    ],
    asideTitle: "Neighborhood read",
    asideBody: `${ctx.densityCopy}`,
    checklistHeading: `Services residents in ${ctx.city} ${ctx.zip} request most`,
    localHeading: `Adjacent coverage around ${ctx.zip}`,
    localBody: `Stay inside ${ctx.city} / ${ctx.county} County when you can. Crossing into a neighbor ZIP still keeps you on the Texas locksmith network for this metro.`,
  }),
  (ctx) => ({
    heading: `What emergency locksmith work costs in ${ctx.zip}`,
    paragraphs: [
      `Callers in ${ctx.city} want the number before the van moves. For ${ctx.place}, typical emergency work lands in ${ctx.priceRange}, with an arrival window around ${ctx.responseTime}. Urban density nudges parking and after-hours complexity; suburban density nudges drive time — the table below splits common jobs so ${ctx.zip} is not stuck with a generic statewide blob.`,
      `Nothing on this page is a binding bid. Texas locksmiths confirm the cylinder, vehicle, or storefront on site. You approve the estimate before drilling, rekeying, or replacing hardware. That is the local rule for ${ctx.county} County dispatch through ZipProLink.`,
    ],
    asideTitle: "Upfront range",
    asideBody: `${ctx.priceRange} covers most ${ctx.zip} lockouts and rekeys. Specialty safes, commercial panic hardware, or high-security cylinders are quoted separately after inspection.`,
    checklistHeading: `Job types priced for ${ctx.city} nights`,
    localHeading: `Other ${ctx.stateId} ZIPs on this dispatch board`,
    localBody: `Use a neighbor listing if you are closer to that code. It keeps the matched tech’s deadhead time down in ${ctx.county} County.`,
  }),
];

export const LOCKSMITH_CHECKLISTS: string[][] = [
  [
    "Home, apartment, and HOA-gate lockouts after hours",
    "Vehicle door and ignition lockouts in parking structures",
    "Broken-key extraction without replacing the whole cylinder",
    "Rekey after a move, roommate change, or break-in",
    "Deadbolt and smart-lock upgrade on occupied property",
    "Office suite and storefront lock failure the same night",
  ],
  [
    "Non-destructive entry first — drilling only when the cylinder is dead",
    "Car lockouts for fobs that died on a ${city} street",
    "Master-key and classroom-function hardware for small offices",
    "Mailbox, laundry-room, and storage-unit lock changes",
    "Lockout help when a child, pet, or elder is inside",
    "Emergency board-up coordination if a door was forced",
  ],
  [
    "24/7 residential lockouts across ${city} ${zip}",
    "Trunk and vehicle lockouts near ${county} County arterials",
    "On-site key cutting when the original is lost",
    "High-security and bump-resistant cylinder swaps",
    "Smart lock pairing after a lockout (Schlage, Yale, August-class)",
    "Lock inspection after attempted burglary",
  ],
];

export const DPS_TRUST: Array<(ctx: CopyContext) => { heading: string; body: string }> = [
  (ctx) => ({
    heading: `TX DPS licensing is the floor in ${ctx.city}`,
    body: `Locksmith companies operating in ${ctx.stateName} fall under Texas Occupations Code Chapter 1702 and the Texas Department of Public Safety (TX DPS) Private Security Program. ZipProLink listings for ${ctx.zip} are a dispatch directory: we route work to technicians who can legally service ${ctx.county} County, not unlicensed “mobile key” operators.`,
  }),
  (ctx) => ({
    heading: `What “licensed in Texas” means for ${ctx.zip}`,
    body: `TX DPS requires locksmith companies to hold Private Security licensing, carry the insurance the program expects, and follow local emergency-access rules. Before work starts in ${ctx.place}, you can ask the arriving tech for the company license name. If it cannot be produced, do not authorize drilling.`,
  }),
  (ctx) => ({
    heading: `Emergency access guidelines for ${ctx.county} County`,
    body: `Texas emergency locksmith calls still need proof of occupancy or vehicle ownership when the situation allows — a lease, ID, plate, or VIN. Dispatchers for ${ctx.city} ${ctx.zip} brief the tech to verify on site. That protects residents and keeps the job inside TX DPS Private Security norms instead of a forced-entry free-for-all.`,
  }),
];

export function interpolateList(items: string[], ctx: CopyContext) {
  return items.map((item) =>
    item
      .replaceAll("${city}", ctx.city)
      .replaceAll("${zip}", ctx.zip)
      .replaceAll("${county}", ctx.county),
  );
}

export function locksmithJobs(ctx: CopyContext, urbanLift: number): JobEstimate[] {
  const bump = (min: number, max: number) => {
    const low = Math.round(min * urbanLift);
    const high = Math.round(max * urbanLift);
    return `$${low} – $${high}`;
  };

  return [
    {
      job: "Car Lockout",
      price: bump(55, 140),
      time: ctx.responseTime,
      note: `Street or lot in ${ctx.city} ${ctx.zip}`,
    },
    {
      job: "House Lockout",
      price: bump(45, 125),
      time: ctx.responseTime,
      note: ctx.densityBand === "urban" ? "Garage / high-rise access extra if gated" : "Detached-home entry, non-destructive first",
    },
    {
      job: "Rekeying",
      price: bump(80, 165),
      time: ctx.responseTime,
      note: "Per lock after a move, roommate change, or lost-key event",
    },
    {
      job: "Smart Lock Installation",
      price: bump(110, 240),
      time: ctx.responseTime,
      note: "Hardware quoted on site before pairing",
    },
    {
      job: "Broken Key Extraction",
      price: bump(70, 155),
      time: ctx.responseTime,
      note: "Cylinder saved when the wafer stack allows",
    },
  ];
}

export function processCopy(ctx: CopyContext) {
  return {
    heading: `How dispatch works in ${ctx.zip}`,
    intro: `Three steps, then a licensed tech is moving toward ${ctx.place}. No app maze — call ${HOTLINE_DISPLAY}.`,
    steps: [
      {
        step: 1,
        title: "24/7 call intake",
        detail: `Tell us the ZIP (${ctx.zip}), the lock type, and whether anyone is inside. Nights and holidays are staffed.`,
      },
      {
        step: 2,
        title: "Nearby technician matching",
        detail: `We match a ${ctx.county} County locksmith already covering this ${ctx.densityLabel.toLowerCase()} board instead of a distant statewide queue.`,
      },
      {
        step: 3,
        title: "Arrival and on-site estimate",
        detail: `The tech confirms occupancy, inspects the cylinder or vehicle, and quotes before work. You approve the number — then they open or rekey.`,
      },
    ],
  };
}

export function requiredFaqs(ctx: CopyContext): FaqItem[] {
  return [
    {
      question: `How fast can a locksmith reach ${ctx.place} in an emergency?`,
      answer: `Average dispatch for ${ctx.zip} is ${ctx.responseTime}. ${ctx.densityBand === "urban" ? "Downtown and mid-rise calls" : "Suburban driveway calls"} in ${ctx.city} are matched to techs already in ${ctx.county} County. Call ${HOTLINE_DISPLAY} with the exact building or cross-street.`,
    },
    {
      question: `What payment methods do locksmiths in ${ctx.zip} accept?`,
      answer: `Most ${ctx.city} technicians take major credit cards, debit, and digital wallets after you approve the on-site estimate. You are not charged to get the quote. Confirm the total before any lockout, rekey, or hardware work begins.`,
    },
    {
      question: `Are locksmiths in ${ctx.city} required to hold a TX DPS PSB license?`,
      answer: `Yes. Texas Occupations Code Chapter 1702 places locksmith companies under the Texas Department of Public Safety Private Security Bureau (TX DPS PSB). ZipProLink is a referral matching service — the arriving company holds the license. Ask to see it on site before authorizing work in ${ctx.zip}.`,
    },
  ];
}

export function faqPool(ctx: CopyContext): FaqItem[] {
  const label = ctx.serviceLabel;
  return [
    {
      question: `What does emergency ${label} service cost in ${ctx.zip}?`,
      answer: `Most ${ctx.city} emergency jobs land in ${ctx.priceRange}. High-security cylinders, commercial panic bars, or safe work are quoted after inspection. You get the number before drilling or rekeying starts.`,
    },
    {
      question: `Can you open my car in ${ctx.zip} without damaging the door?`,
      answer: `Non-destructive vehicle entry is the default for ${ctx.city} lockouts. Air wedges, long-reach tools, and decoded locks come first. Drilling or replacing hardware is a last resort and is quoted before it happens.`,
    },
    {
      question: `Do you rekey after a break-in or roommate change in ${ctx.city}?`,
      answer: `Yes. Rekeying is one of the most common ${ctx.zip} follow-ups after a lockout. The tech can rekey existing hardware the same visit when the cylinders allow, which is usually faster and cheaper than a full lock swap.`,
    },
    {
      question: `What should I have ready before the locksmith arrives in ${ctx.county} County?`,
      answer: `Photo ID, proof you belong at the address or vehicle (lease, registration, plate/VIN), and the ZIP (${ctx.zip}). If a child or pet is inside, say so on the intake call so the ticket is prioritized.`,
    },
    {
      question: `Is after-hours ${label} service available on weekends in ${ctx.zip}?`,
      answer: `Coverage is 24/7, including weekends and Texas holidays. ${ctx.densityLabel} ZIPs like ${ctx.zip} still get a live intake desk — you are not waiting for Monday-morning shop hours.`,
    },
    {
      question: `Will a locksmith from another ${ctx.city} ZIP still come to ${ctx.zip}?`,
      answer: `Yes, if that tech is the closest available. Neighboring codes on this page share the ${ctx.stateId} board. We still prefer a ${ctx.county} County tech already near ${ctx.zip} so deadhead time does not eat the arrival window.`,
    },
    {
      question: `Does ZipProLink itself hold the TX DPS locksmith license?`,
      answer: `ZipProLink is a directory and dispatch layer for ${ctx.place}. The locksmith company that arrives holds the TX DPS Private Security / locksmith authorization. We do not send unlicensed operators to ${ctx.zip}.`,
    },
    {
      question: `How is ${ctx.zip} different from a generic statewide locksmith page?`,
      answer: `This listing is wired to ${ctx.city} ${ctx.zip} — ${ctx.densityLabel.toLowerCase()} ${ctx.county} County, local price bands, and neighbor ZIPs. Copy, FAQ, and job table are hashed to this code so ${ctx.zip} does not clone another Texas page.`,
    },
  ];
}

export function populationLabel(population: number | null) {
  if (population == null || population <= 0) {
    return "";
  }
  return `About ${population.toLocaleString("en-US")} people live in this ZIP.`;
}

export function buildMetaDescription(ctx: CopyContext) {
  const year = currentSeoYear();
  return `${year} ${ctx.shortName} cost in ${ctx.city}, ${ctx.stateId} ${ctx.zip}. Typical range ${ctx.priceRange}. 24/7 emergency dispatch in ${ctx.responseTime}. Call ${HOTLINE_DISPLAY} for a no-obligation estimate.`.slice(
    0,
    160,
  );
}

export function emptyPopulationFallback(ctx: CopyContext) {
  return ctx.populationLabel
    ? `${ctx.populationLabel} `
    : `This ${ctx.county} County ZIP is on the live ${ctx.city} board. `;
}
