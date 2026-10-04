import { currentSeoYear } from "@/lib/content";
import type { FaqItem } from "@/lib/types";
import type {
  DensityBand,
  DispatchStep,
  HeroPanel,
  JobEstimate,
  LayoutId,
  PageChrome,
  PricingTableLabels,
  SectionKey,
} from "@/lib/variation/types";

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
  phoneDisplay: string;
};

export type IntentHook = (ctx: CopyContext) => { headline: string; support: string };

export type IntentPack = {
  hooks: IntentHook[];
  intro: (ctx: CopyContext) => {
    heading: string;
    paragraphs: string[];
    checklistHeading: string;
    localHeading: string;
    localBody: string;
  };
  aside: (ctx: CopyContext) => {
    title: string;
    body: string;
    metric: string;
    metricLabel: string;
  };
  chips: (ctx: CopyContext) => {
    primaryLabel: string;
    primaryValue: string;
    secondaryLabel: string;
    secondaryValue: string;
  };
  dps: (ctx: CopyContext) => { heading: string; body: string };
  process: (ctx: CopyContext) => {
    heading: string;
    intro: string;
    steps: DispatchStep[];
  };
  checklist: string[];
  requiredFaqs: (ctx: CopyContext) => FaqItem[];
  extraFaqs: (ctx: CopyContext) => FaqItem[];
  pricing: (ctx: CopyContext) => { heading: string; intro: string };
  faqHeading: (ctx: CopyContext) => string;
  faqLead: (ctx: CopyContext) => string;
  meta: (ctx: CopyContext) => string;
  neighborsEmpty: (stateName: string) => string;
};

export const URBAN_DENSITY_THRESHOLD = 5000;

export const LAYOUT_IDS: readonly LayoutId[] = [
  "emergency",
  "compliance",
  "neighborhood",
  "cost",
] as const;

export const HERO_PANEL: Record<LayoutId, HeroPanel> = {
  emergency: "dispatch",
  cost: "pricing",
  compliance: "compliance",
  neighborhood: "neighbors",
};

export const LAYOUT_ORDERS: Record<LayoutId, SectionKey[]> = {
  emergency: ["process", "pricing", "checklist", "local", "dps", "faq"],
  compliance: ["dps", "checklist", "pricing", "process", "local", "faq"],
  neighborhood: ["local", "process", "pricing", "checklist", "dps", "faq"],
  cost: ["pricing", "process", "checklist", "local", "dps", "faq"],
};

export const PAGE_CHROME_EN: PageChrome = {
  asideDispatch: "Typical dispatch target",
  asideZip: "This ZIP",
  asideArea: "Area type",
};

export const PRICING_TABLE_EN: PricingTableLabels = {
  service: "Service",
  cost: "Catalog range",
  dispatch: "Dispatch target",
  note: "Local note",
  disclaimer:
    "Job prices are a shared catalog, not a survey of this ZIP. Density is not used to invent a local rate. The technician confirms the quote on site before work begins. Dispatch times are typical targets from the service listing, not a guaranteed arrival.",
};

export function classifyDensity(density: number | null): DensityBand {
  return density != null && density >= URBAN_DENSITY_THRESHOLD
    ? "urban"
    : "suburban";
}

export function densityLabel(band: DensityBand) {
  return band === "urban" ? "High-density urban" : "Suburban residential";
}

export function densityCopy(ctx: CopyContext) {
  if (ctx.densityBand === "urban") {
    return `${ctx.place} sits in a high-density urban corridor${ctx.county !== "the local" ? ` of ${ctx.county} County` : ""}. Tight street grids, garage podiums, and after-hours office lockouts are common, so ZipProLink routes locksmiths who already cover this ZIP instead of sending a suburban-only tech across town.`;
  }

  return `${ctx.place} is a suburban residential pocket${ctx.county !== "the local" ? ` in ${ctx.county} County` : ""}. Driveways, HOA gates, and detached-home lockouts dominate night calls, so dispatch favors techs staged near neighborhood arterials rather than downtown-only crews.`;
}

function countyLabel(ctx: CopyContext) {
  return ctx.county === "the local" ? "this county" : `${ctx.county} County`;
}

export const EN_INTENTS: Record<LayoutId, IntentPack> = {
  emergency: {
    hooks: [
      (ctx) => ({
        headline: `24/7 Emergency Locksmith Dispatch in ${ctx.city}, ${ctx.stateId} ${ctx.zip}`,
        support: `Locked out of a home, car, or office in ${ctx.place}? Call ${ctx.phoneDisplay}. We can connect you with an independent locksmith when one is available. Typical listing window: ${ctx.responseTime}. You approve the on-site estimate before any work.`,
      }),
      (ctx) => ({
        headline: `Locked Out in ${ctx.city} ${ctx.zip}? Live Emergency Locksmith Routing`,
        support: `Night, weekend, and holiday lockouts in ${countyLabel(ctx)} stay on a live desk. Typical arrival ${ctx.responseTime}. Keep the door closed and share the exact building or cross-street.`,
      }),
    ],
    intro: (ctx) => ({
      heading: `When a lockout hits ${ctx.city} ${ctx.zip}`,
      paragraphs: [
        `Most ${ctx.zip} calls start the same way: keys on the counter, a dead fob in a parking garage, or a snapped key in a ${ctx.densityBand === "urban" ? "high-rise" : "front-door"} cylinder after midnight. ZipProLink is the emergency desk for that moment — a live dispatch path into ${countyLabel(ctx)}, not a coupon farm.`,
        `Because ${ctx.place} is a ${ctx.densityLabel.toLowerCase()} ZIP, techs who already run ${ctx.city} nights get the ticket first. You hear the arrival window (${ctx.responseTime}) before anyone rolls.`,
      ],
      checklistHeading: `What a ${ctx.city} emergency locksmith handles tonight`,
      localHeading: `Nearby ZIPs on the ${ctx.city} emergency board`,
      localBody: `These codes share the same ${ctx.stateId} dispatch desk as ${ctx.zip}. If you are just outside this ZIP, open the closest listing so the matched tech is already in ${countyLabel(ctx)}.`,
    }),
    aside: (ctx) => ({
      title: "Emergency window",
      body: `Lockout tickets in ${ctx.zip} usually clear in ${ctx.responseTime}. Call ${ctx.phoneDisplay} with the exact building or subdivision.`,
      metric: ctx.responseTime,
      metricLabel: "Typical arrival",
    }),
    chips: (ctx) => ({
      primaryLabel: "Dispatch",
      primaryValue: ctx.responseTime,
      secondaryLabel: "Estimate",
      secondaryValue: "On site before work",
    }),
    dps: (ctx) => ({
      heading: `Licensed emergency access in ${ctx.city}`,
      body: `Texas Occupations Code Chapter 1702 puts locksmith companies under TX DPS Private Security. Emergency routing to ${ctx.zip} still requires a company that can legally service ${countyLabel(ctx)}. Ask to see licensing before you authorize drilling.`,
    }),
    process: (ctx) => ({
      heading: `How emergency dispatch works in ${ctx.zip}`,
      intro: `Three steps, then we try to match an independent technician for ${ctx.place}. Call ${ctx.phoneDisplay}.`,
      steps: [
        {
          step: 1,
          title: "24/7 lockout intake",
          detail: `Tell us ZIP ${ctx.zip}, the lock type, and whether anyone is inside. Nights and holidays are staffed.`,
        },
        {
          step: 2,
          title: "Closest available tech",
          detail: `We match a ${countyLabel(ctx)} locksmith already covering this ${ctx.densityLabel.toLowerCase()} board instead of a distant statewide queue.`,
        },
        {
          step: 3,
          title: "Arrival and go-ahead",
          detail: `The tech confirms occupancy, inspects the cylinder or vehicle, and quotes before work. You approve — then they open or rekey.`,
        },
      ],
    }),
    checklist: [
      "Home, apartment, and HOA-gate lockouts after hours",
      "Vehicle door and ignition lockouts in parking structures",
      "Broken-key extraction without replacing the whole cylinder",
      "Rekey after a move, roommate change, or break-in",
      "Lockout help when a child, pet, or elder is inside",
      "Office suite and storefront failures the same night",
    ],
    requiredFaqs: (ctx) => [
      {
        question: `How fast can a locksmith reach ${ctx.place} in an emergency?`,
        answer: `The listed dispatch target for this service is ${ctx.responseTime}. That is not a measured average for ${ctx.zip}. ${ctx.densityBand === "urban" ? "Downtown and mid-rise calls" : "Suburban driveway calls"} are referred to independent technicians when one is available in ${countyLabel(ctx)}. Call ${ctx.phoneDisplay} with the exact building or cross-street.`,
      },
      {
        question: `What should I do while I wait for a locksmith in ${ctx.zip}?`,
        answer: `Stay with the door or vehicle, keep pets and kids accounted for, and do not force the cylinder. Have photo ID ready. If someone is locked inside, say so on the intake call so the ticket is prioritized.`,
      },
      {
        question: `Is after-hours emergency locksmith service available in ${ctx.city} on weekends?`,
        answer: `Yes. Coverage is 24/7, including weekends and Texas holidays. ${ctx.zip} stays on a live desk — you are not waiting for Monday-morning shop hours.`,
      },
    ],
    extraFaqs: (ctx) => [
      {
        question: `Can you open my car in ${ctx.zip} without damaging the door?`,
        answer: `Non-destructive vehicle entry is the default for ${ctx.city} lockouts. Drilling or replacing hardware is a last resort and is quoted before it happens.`,
      },
      {
        question: `Will a locksmith from another ${ctx.city} ZIP still come to ${ctx.zip}?`,
        answer: `Yes, if that tech is the closest available. Neighboring codes on this page share the ${ctx.stateId} board. We still prefer a ${countyLabel(ctx)} tech already near ${ctx.zip}.`,
      },
      {
        question: `Do I pay just to get an emergency quote in ${ctx.city}?`,
        answer: `No. You are not charged to hear the on-site estimate. Confirm the total before any lockout, rekey, or hardware work begins.`,
      },
      {
        question: `What if a child or pet is locked inside in ${ctx.zip}?`,
        answer: `Say so immediately on the call. Intake flags the ticket so the nearest available tech is pushed first across the ${ctx.city} board.`,
      },
      {
        question: `Can the tech rekey the same visit after an emergency lockout in ${ctx.city}?`,
        answer: `Often yes, when the cylinders allow. Rekeying after a lockout is a common ${ctx.zip} follow-up and is quoted before any pins are changed.`,
      },
    ],
    pricing: (ctx) => ({
      heading: `Emergency locksmith ranges for ${ctx.city} ${ctx.zip}`,
      intro: `Typical jobs land in ${ctx.priceRange}. The table is a planning range — the arriving tech confirms the number on site.`,
    }),
    faqHeading: (ctx) => `Emergency locksmith questions for ${ctx.zip}`,
    faqLead: (ctx) =>
      `Dispatch-first answers for ${ctx.place}. Cost and licensing details still appear below — this block stays on arrival time.`,
    meta: (ctx) =>
      `24/7 emergency locksmith dispatch in ${ctx.city}, ${ctx.stateId} ${ctx.zip}. Typical arrival ${ctx.responseTime}. Call ${ctx.phoneDisplay} for live routing.`.slice(
        0,
        160,
      ),
    neighborsEmpty: (stateName) =>
      `Nearby ZIP listings for ${stateName} will appear here as coverage expands.`,
  },
  cost: {
    hooks: [
      (ctx) => {
        const year = currentSeoYear();
        return {
          headline: `${year} Locksmith Cost in ${ctx.city}, ${ctx.stateId} ${ctx.zip}`,
          support: `Typical ${ctx.city} jobs run ${ctx.priceRange}. Arrival window about ${ctx.responseTime}. Nothing here is a binding bid — you approve the on-site estimate before drilling or rekeying.`,
        };
      },
      (ctx) => ({
        headline: `Locksmith Prices & Dispatch Ranges for ${ctx.city} ${ctx.zip}`,
        support: `Compare lockout, rekey, and smart-lock ranges for ${ctx.place}. ${ctx.densityLabel} pricing is adjusted for this ZIP, not a statewide blob.`,
      }),
    ],
    intro: (ctx) => ({
      heading: `What emergency locksmith work costs in ${ctx.zip}`,
      paragraphs: [
        `Callers in ${ctx.city} want the number before anyone rolls. For ${ctx.place}, the service listing uses ${ctx.priceRange} as a planning band, with a typical dispatch target of ${ctx.responseTime}. Density here affects parking and drive time in the copy, not a local price table. The job rows are a shared catalog so ${ctx.zip} is not treated as a measured local survey.`,
        `Nothing on this page is a binding bid. Texas locksmiths confirm the cylinder, vehicle, or storefront on site. You approve the estimate before drilling, rekeying, or replacing hardware.`,
      ],
      checklistHeading: `Job types priced for ${ctx.city} nights`,
      localHeading: `Compare neighboring ${ctx.stateId} ZIP cost pages`,
      localBody: `Open a closer code if you are not actually in ${ctx.zip}. Each listing carries its own local range so ${countyLabel(ctx)} pages do not clone one statewide price block.`,
    }),
    aside: (ctx) => ({
      title: "Upfront range",
      body: `${ctx.priceRange} covers most ${ctx.zip} lockouts and rekeys. Specialty safes, commercial panic hardware, or high-security cylinders are quoted after inspection.`,
      metric: ctx.priceRange,
      metricLabel: "Typical jobs",
    }),
    chips: (ctx) => ({
      primaryLabel: "Cost",
      primaryValue: ctx.priceRange,
      secondaryLabel: "Dispatch",
      secondaryValue: ctx.responseTime,
    }),
    dps: (ctx) => ({
      heading: `Quotes still sit under TX DPS rules in ${ctx.city}`,
      body: `A low number does not waive licensing. Companies dispatched to ${ctx.zip} operate under Texas Occupations Code Chapter 1702. Confirm the company license when the tech arrives — price and legality are separate checks.`,
    }),
    process: (ctx) => ({
      heading: `How a ${ctx.zip} quote is confirmed`,
      intro: `Ranges on this page are planning numbers. The on-site estimate is the number you approve.`,
      steps: [
        {
          step: 1,
          title: "Share the job type",
          detail: `Lockout, rekey, extraction, or hardware — ZIP ${ctx.zip} and lock type let us start inside ${ctx.priceRange}.`,
        },
        {
          step: 2,
          title: "Tech inspects on site",
          detail: `High-security cylinders, commercial panic bars, or damaged vehicles can move the number. You hear that before work starts.`,
        },
        {
          step: 3,
          title: "You approve, then work begins",
          detail: `No hidden trip-fee bait. Pay after you accept the estimate for this ${ctx.city} visit.`,
        },
      ],
    }),
    checklist: [
      "Car lockout ranges for street and garage jobs",
      "House and apartment lockout ranges for ${city} ${zip}",
      "Rekey after a move, roommate change, or lost key",
      "Smart-lock install quoted before pairing",
      "Broken-key extraction when the cylinder can be saved",
      "After-hours work stays inside the published band unless the job changes",
    ],
    requiredFaqs: (ctx) => [
      {
        question: `What does emergency locksmith service cost in ${ctx.zip}?`,
        answer: `Most ${ctx.city} emergency jobs land in ${ctx.priceRange}. High-security cylinders, commercial panic bars, or safe work are quoted after inspection. You get the number before drilling or rekeying starts.`,
      },
      {
        question: `Do ${ctx.city} locksmiths add a separate trip or after-hours fee?`,
        answer: `Ask on the intake call. The ranges on this ${ctx.zip} page are all-in planning bands for typical jobs. If a trip or holiday adder applies, it must be stated before the tech rolls.`,
      },
      {
        question: `When do I pay for locksmith work in ${ctx.zip}?`,
        answer: `After you approve the on-site estimate. Most ${ctx.city} technicians take cards, debit, and digital wallets. You are not charged just to hear the quote.`,
      },
    ],
    extraFaqs: (ctx) => [
      {
        question: `Why is urban ${ctx.city} pricing sometimes higher than a suburban ZIP?`,
        answer: `Parking, garage access, and after-hours building rules add time. ${ctx.zip} is classified ${ctx.densityLabel.toLowerCase()}, so the table is lifted or left flat for that pattern — not copied from another Texas city.`,
      },
      {
        question: `Is the price range on this page a guaranteed bid for ${ctx.place}?`,
        answer: `No. It is a local planning range. The arriving locksmith inspects the lock or vehicle in ${ctx.zip} and you approve the actual number.`,
      },
      {
        question: `How much does a rekey cost after a lockout in ${ctx.city}?`,
        answer: `Rekey is listed separately in the table. Combining a lockout and rekey on one visit is common in ${ctx.zip} and is still quoted line by line.`,
      },
      {
        question: `Are smart-lock installs included in the ${ctx.priceRange} band?`,
        answer: `Usually not. Hardware and pairing are quoted on site. The published band is for typical emergency entry and standard rekey work in ${ctx.zip}.`,
      },
      {
        question: `Can I compare this ${ctx.zip} table with a neighbor ZIP?`,
        answer: `Yes. Use the nearby listings on this page. Each code keeps its own range so ${countyLabel(ctx)} does not share one cloned statewide table.`,
      },
    ],
    pricing: (ctx) => {
      const year = currentSeoYear();
      return {
        heading: `${year} ${ctx.shortName} cost & dispatch times in ${ctx.city}`,
        intro: `${ctx.city} emergency cost ranges and typical arrival windows for ZIP ${ctx.zip}, adjusted for this ${ctx.densityLabel.toLowerCase()} area.`,
      };
    },
    faqHeading: (ctx) => `Locksmith cost questions for ${ctx.zip}`,
    faqLead: (ctx) =>
      `Price-first answers for ${ctx.place}. Dispatch and licensing still apply — this block stays on what you pay.`,
    meta: (ctx) => {
      const year = currentSeoYear();
      return `${year} locksmith cost in ${ctx.city}, ${ctx.stateId} ${ctx.zip}. Typical range ${ctx.priceRange}. Dispatch about ${ctx.responseTime}.`.slice(
        0,
        160,
      );
    },
    neighborsEmpty: (stateName) =>
      `Nearby ZIP listings for ${stateName} will appear here as coverage expands.`,
  },
  compliance: {
    hooks: [
      (ctx) => ({
        headline: `Licensed Locksmith in ${ctx.city}, ${ctx.stateId} ${ctx.zip} (TX DPS)`,
        support: `Texas Occupations Code Chapter 1702 puts locksmith companies under the Texas Department of Public Safety Private Security Program. ZipProLink routes ${ctx.zip} jobs to companies that can legally service ${countyLabel(ctx)}.`,
      }),
      (ctx) => ({
        headline: `TX DPS Locksmith Standards for ${countyLabel(ctx)} · ${ctx.zip}`,
        support: `Ask the arriving tech for the company license before any drilling in ${ctx.place}. Insurance on the truck is part of the same check — a cheap unlicensed call is not a shortcut.`,
      }),
    ],
    intro: (ctx) => ({
      heading: `Licensed work in ${countyLabel(ctx)}, not a gray-market pickup`,
      paragraphs: [
        `For ${ctx.place}, the filter is legal: ZipProLink only routes technicians who can service this ZIP under TX DPS Private Security rules. ${ctx.city} ${ctx.zip} is ${ctx.densityLabel.toLowerCase()} territory, which changes staging, not the licensing bar.`,
        `If a caller in ${ctx.zip} needs a rekey after a break-in, the paper trail has to stand up in ${countyLabel(ctx)}. You can ask for the company license name before work begins.`,
      ],
      checklistHeading: `Compliant locksmith jobs we route in ${ctx.zip}`,
      localHeading: `Licensed ${countyLabel(ctx)} ZIPs next to ${ctx.zip}`,
      localBody: `These nearby ${ctx.stateName} codes use the same licensed bench. Opening a neighbor ZIP keeps internal links honest and keeps ${ctx.city} looking like a cluster, not cloned pages.`,
    }),
    aside: (ctx) => ({
      title: "Compliance snapshot",
      body: `TX DPS Private Security standards apply to locksmith dispatch in ${ctx.city}. Ask the arriving tech for company licensing details before work begins in ${ctx.zip}.`,
      metric: "TX DPS",
      metricLabel: "Licensing floor",
    }),
    chips: (ctx) => ({
      primaryLabel: "License",
      primaryValue: "TX DPS PSB",
      secondaryLabel: "Dispatch",
      secondaryValue: ctx.responseTime,
    }),
    dps: (ctx) => ({
      heading: `What “licensed in Texas” means for ${ctx.zip}`,
      body: `TX DPS requires locksmith companies to hold Private Security licensing, carry the insurance the program expects, and follow local emergency-access rules. Before work starts in ${ctx.place}, you can ask the arriving tech for the company license name. If it cannot be produced, do not authorize drilling.`,
    }),
    process: (ctx) => ({
      heading: `How we keep ${ctx.zip} jobs inside the law`,
      intro: `Referral matching is not a license. The company that arrives holds TX DPS authorization.`,
      steps: [
        {
          step: 1,
          title: "Intake on a real ZIP",
          detail: `We pin ${ctx.zip} so the ticket is not sent as a statewide “mobile key” job.`,
        },
        {
          step: 2,
          title: "Licensed company match",
          detail: `The routed shop must be able to work ${countyLabel(ctx)} under Chapter 1702 — ZipProLink does not send unlicensed operators.`,
        },
        {
          step: 3,
          title: "On-site verification",
          detail: `You may ask for licensing and proof of occupancy or vehicle ownership before any force is used.`,
        },
      ],
    }),
    checklist: [
      "TX DPS Private Security–eligible companies only",
      "Proof of occupancy or vehicle ownership when the situation allows",
      "Non-destructive entry first — drilling only when the cylinder is dead",
      "Rekey after break-in with a paper trail for ${county} County",
      "Insurance on the truck before hardware is replaced",
      "No gray-market “mobile key” operators dispatched to ${zip}",
    ],
    requiredFaqs: (ctx) => [
      {
        question: `Are locksmiths in ${ctx.city} required to hold a TX DPS PSB license?`,
        answer: `Yes. Texas Occupations Code Chapter 1702 places locksmith companies under the Texas Department of Public Safety Private Security Bureau. ZipProLink is a referral matching service — the arriving company holds the license. Ask to see it on site before authorizing work in ${ctx.zip}.`,
      },
      {
        question: `Does ZipProLink itself hold the TX DPS locksmith license?`,
        answer: `No. ZipProLink is a directory and dispatch layer for ${ctx.place}. The locksmith company that arrives holds the TX DPS Private Security authorization. We do not send unlicensed operators to ${ctx.zip}.`,
      },
      {
        question: `What proof should I show a locksmith in ${ctx.zip}?`,
        answer: `Photo ID plus proof you belong at the address or vehicle (lease, registration, plate/VIN) when the situation allows. Dispatchers brief the tech to verify on site under TX DPS emergency-access norms.`,
      },
    ],
    extraFaqs: (ctx) => [
      {
        question: `What if the arriving tech cannot show a license in ${ctx.city}?`,
        answer: `Do not authorize drilling or rekeying. Call ${ctx.phoneDisplay} so we can rematch a company that can legally service ${ctx.zip}.`,
      },
      {
        question: `Does a cheaper unlicensed locksmith save money in ${ctx.zip}?`,
        answer: `It risks property damage, no insurance, and no Chapter 1702 standing. Licensed routing is the floor for ${countyLabel(ctx)}, not an upsell.`,
      },
      {
        question: `Are vehicle lockouts in ${ctx.city} treated the same as home lockouts under TX DPS?`,
        answer: `The company still needs proper licensing. Proof of vehicle ownership (registration, plate, VIN) is the usual on-site check for ${ctx.zip} car jobs.`,
      },
      {
        question: `Who is insured — ZipProLink or the technician in ${ctx.zip}?`,
        answer: `The independent contractor / locksmith company carries the insurance. ZipProLink refers; we do not employ the tech who arrives at ${ctx.place}.`,
      },
      {
        question: `Can HOA or building security in ${ctx.city} require extra ID?`,
        answer: `Yes. Urban and gated ${ctx.densityLabel.toLowerCase()} properties often add their own access rules on top of TX DPS. Have ID ready for ${ctx.zip}.`,
      },
    ],
    pricing: (ctx) => ({
      heading: `Licensed-job cost ranges in ${ctx.city} ${ctx.zip}`,
      intro: `Typical licensed work still lands in ${ctx.priceRange}. A lower unlicensed number is not a valid substitute in ${countyLabel(ctx)}.`,
    }),
    faqHeading: (ctx) => `Licensing questions for ${ctx.zip}`,
    faqLead: (ctx) =>
      `TX DPS–first answers for ${ctx.place}. Price and arrival time still matter — this block stays on who is legal to send.`,
    meta: (ctx) =>
      `Locksmith referral in ${ctx.city}, ${ctx.stateId} ${ctx.zip}. TX DPS Private Security referral routing for ${countyLabel(ctx)}. Call ${ctx.phoneDisplay}.`.slice(
        0,
        160,
      ),
    neighborsEmpty: (stateName) =>
      `Nearby ZIP listings for ${stateName} will appear here as coverage expands.`,
  },
  neighborhood: {
    hooks: [
      (ctx) => ({
        headline: `Locksmith Near ${ctx.city} ${ctx.zip} — Local ZIP Cluster`,
        support: `${ctx.place} is pinned to real neighboring codes, not a statewide footer dump. ${ctx.populationLabel}Use the cluster on this page if you are on the edge of ${ctx.zip}.`,
      }),
      (ctx) => ({
        headline: `${ctx.zip} Locksmith Coverage Map in ${ctx.city}, ${ctx.stateId}`,
        support: `${ctx.densityCopy} Adjacent listings below are the actual ${ctx.stateId} board for this pocket of ${countyLabel(ctx)}.`,
      }),
    ],
    intro: (ctx) => ({
      heading: `A field guide to ${ctx.place}`,
      paragraphs: [
        `${ctx.zip} is ${ctx.city}, ${ctx.stateId} — ${countyLabel(ctx)} — and ${ctx.populationLabel.toLowerCase()}The local pattern is ${ctx.densityLabel.toLowerCase()}: ${ctx.densityBand === "urban" ? "stacked housing, paid parking, and late office lockouts" : "single-family streets, school-zone evenings, and garage-door keypad failures"}.`,
        `This page is built for that geography. Neighbor ZIPs are distance-ranked for this cluster, not sorted as strings across Texas. Response targets stay near ${ctx.responseTime}; quotes start in ${ctx.priceRange}.`,
      ],
      checklistHeading: `Services residents in ${ctx.city} ${ctx.zip} request most`,
      localHeading: `Adjacent coverage around ${ctx.zip}`,
      localBody: `These codes are the local mesh for ${ctx.place}. Stay inside ${ctx.city} / ${countyLabel(ctx)} when you can. Crossing into a neighbor ZIP still keeps you on this metro’s locksmith board — not a Dallas dump on a Houston page.`,
    }),
    aside: (ctx) => ({
      title: "Neighborhood read",
      body: ctx.densityCopy,
      metric: ctx.zip,
      metricLabel: "This ZIP",
    }),
    chips: (ctx) => ({
      primaryLabel: "Area",
      primaryValue: ctx.city,
      secondaryLabel: "County",
      secondaryValue:
        ctx.county === "the local" ? ctx.stateId : ctx.county,
    }),
    dps: (ctx) => ({
      heading: `Local routing still means licensed techs in ${ctx.city}`,
      body: `A nearby ZIP is not a shortcut around TX DPS. Companies covering ${ctx.zip} and its cluster still operate under Chapter 1702. Ask for licensing when the van arrives.`,
    }),
    process: (ctx) => ({
      heading: `How we match ${ctx.zip} to a nearby tech`,
      intro: `Geography first: the closest available licensed locksmith on this cluster, then the estimate.`,
      steps: [
        {
          step: 1,
          title: "Confirm the code",
          detail: `If you are closer to a neighbor listed on this page, open that ZIP so intake is not guessing across ${countyLabel(ctx)}.`,
        },
        {
          step: 2,
          title: "Match inside the cluster",
          detail: `We prefer a tech already running this ${ctx.densityLabel.toLowerCase()} pocket over a distant statewide queue.`,
        },
        {
          step: 3,
          title: "Dispatch and on-site estimate",
          detail: `Arrival target ${ctx.responseTime}. You approve the number before work in ${ctx.place}.`,
        },
      ],
    }),
    checklist: [
      "24/7 residential lockouts across ${city} ${zip}",
      "Trunk and vehicle lockouts near ${county} County arterials",
      "On-site key cutting when the original is lost",
      "HOA-gate and mailbox lock changes in this cluster",
      "Smart lock pairing after a lockout",
      "Lock inspection after attempted burglary",
    ],
    requiredFaqs: (ctx) => [
      {
        question: `Is this locksmith page only for ZIP ${ctx.zip}?`,
        answer: `It is built for ${ctx.place}. If you are on the boundary, use a neighboring code on this page — those links are real nearby ZIPs, not a Texas-wide list.`,
      },
      {
        question: `Will a locksmith from another ${ctx.city} ZIP still come to ${ctx.zip}?`,
        answer: `Yes, if they are the closest available. The cluster on this page shares the ${ctx.stateId} board. We still prefer a ${countyLabel(ctx)} tech already near ${ctx.zip} so deadhead time does not eat the arrival window.`,
      },
      {
        question: `How is ${ctx.zip} different from a generic statewide locksmith page?`,
        answer: `Copy, FAQs, and neighbor links are tied to ${ctx.city} ${ctx.zip} — ${ctx.densityLabel.toLowerCase()} ${countyLabel(ctx)}, local price bands, and distance-ranked adjacent codes.`,
      },
    ],
    extraFaqs: (ctx) => [
      {
        question: `What if GPS says I am not in ${ctx.zip}?`,
        answer: `Open the neighbor ZIP on this page that matches your map pin. Intake works better when the code matches the actual block in ${ctx.city}.`,
      },
      {
        question: `Do you cover HOA gates and apartments in this ${ctx.city} cluster?`,
        answer: `Yes. ${ctx.densityBand === "urban" ? "Podium garages and mid-rise entries" : "Gated HOAs and detached-home laterals"} are common in ${ctx.zip}. Mention gate codes on the call.`,
      },
      {
        question: `How fast is a neighborhood dispatch in ${ctx.zip}?`,
        answer: `Target arrival is ${ctx.responseTime} when a tech is already on this cluster. Crossing the whole metro takes longer — that is why the nearby ZIPs are listed.`,
      },
      {
        question: `Can I use this page if I work in ${ctx.city} but live in a neighbor ZIP?`,
        answer: `Use the ZIP where the lockout is. The mesh on this page exists so you can jump to that code without a statewide search.`,
      },
      {
        question: `Why do some nearby listings sit in a different city name than ${ctx.city}?`,
        answer: `USPS city labels and county lines do not always match. Distance, not the city string, is what placed them next to ${ctx.zip}.`,
      },
    ],
    pricing: (ctx) => ({
      heading: `Local job ranges for the ${ctx.zip} cluster`,
      intro: `Planning band ${ctx.priceRange} for this ${ctx.densityLabel.toLowerCase()} pocket of ${ctx.city}. Neighbor ZIPs keep their own pages.`,
    }),
    faqHeading: (ctx) => `Neighborhood questions for ${ctx.zip}`,
    faqLead: (ctx) =>
      `Local-mesh answers for ${ctx.place}. Nearby ZIPs on this page are distance-ranked, not statewide filler.`,
    meta: (ctx) =>
      `Locksmith near ${ctx.city} ${ctx.zip}. Local ${countyLabel(ctx)} ZIP cluster, ${ctx.responseTime} dispatch, typical ${ctx.priceRange}.`.slice(
        0,
        160,
      ),
    neighborsEmpty: (stateName) =>
      `Nearby ZIP listings for ${stateName} will appear here as coverage expands.`,
  },
};

export function interpolateList(items: string[], ctx: CopyContext) {
  return items.map((item) =>
    item
      .replaceAll("${city}", ctx.city)
      .replaceAll("${zip}", ctx.zip)
      .replaceAll("${county}", ctx.county),
  );
}

export function locksmithJobs(
  ctx: CopyContext,
  locale: "en" | "es" = "en",
): JobEstimate[] {
  const range = (min: number, max: number) => `$${min} – $${max}`;

  if (locale === "es") {
    return [
      {
        job: "Apertura de auto",
        price: range(55, 140),
        time: ctx.responseTime,
        note: `Calle o estacionamiento en ${ctx.city} ${ctx.zip}`,
      },
      {
        job: "Apertura de casa",
        price: range(45, 125),
        time: ctx.responseTime,
        note:
          ctx.densityBand === "urban"
            ? "Acceso a garage / torre puede sumar si hay control"
            : "Casa unifamiliar, entrada no destructiva primero",
      },
      {
        job: "Cambio de combinación (rekey)",
        price: range(80, 165),
        time: ctx.responseTime,
        note: "Por cerradura tras mudanza, cambio de roomie o llave perdida",
      },
      {
        job: "Instalación de cerradura inteligente",
        price: range(110, 240),
        time: ctx.responseTime,
        note: "El herraje se cotiza en sitio antes de emparejar",
      },
      {
        job: "Extracción de llave rota",
        price: range(70, 155),
        time: ctx.responseTime,
        note: "Se conserva el cilindro cuando el mecanismo lo permite",
      },
    ];
  }

  return [
    {
      job: "Car Lockout",
      price: range(55, 140),
      time: ctx.responseTime,
      note: `Street or lot in ${ctx.city} ${ctx.zip}`,
    },
    {
      job: "House Lockout",
      price: range(45, 125),
      time: ctx.responseTime,
      note:
        ctx.densityBand === "urban"
          ? "Garage / high-rise access extra if gated"
          : "Detached-home entry, non-destructive first",
    },
    {
      job: "Rekeying",
      price: range(80, 165),
      time: ctx.responseTime,
      note: "Per lock after a move, roommate change, or lost-key event",
    },
    {
      job: "Smart Lock Installation",
      price: range(110, 240),
      time: ctx.responseTime,
      note: "Hardware quoted on site before pairing",
    },
    {
      job: "Broken Key Extraction",
      price: range(70, 155),
      time: ctx.responseTime,
      note: "Cylinder saved when the wafer stack allows",
    },
  ];
}

export function populationLabel(population: number | null) {
  if (population == null || population <= 0) {
    return "";
  }
  return `About ${population.toLocaleString("en-US")} people live in this ZIP.`;
}

export function emptyPopulationFallback(ctx: CopyContext) {
  return ctx.populationLabel
    ? `${ctx.populationLabel} `
    : `This ${ctx.county === "the local" ? ctx.city : `${ctx.county} County`} ZIP is on the live ${ctx.city} board. `;
}

export function populationLabelEs(population: number | null) {
  if (population == null || population <= 0) {
    return "";
  }
  return `En este ZIP viven unas ${population.toLocaleString("es-US")} personas.`;
}

export function emptyPopulationFallbackEs(ctx: CopyContext) {
  return ctx.populationLabel
    ? `${ctx.populationLabel} `
    : `Este ZIP ${ctx.county === "the local" ? `de ${ctx.city}` : `del condado de ${ctx.county}`} está en la red de ${ctx.city}. `;
}
