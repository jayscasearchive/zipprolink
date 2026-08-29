import type { FaqItem } from "@/lib/types";

export type DensityBand = "urban" | "suburban";

export type LayoutId = "emergency" | "compliance" | "neighborhood" | "cost";

export type HeroPanel = "dispatch" | "pricing" | "compliance" | "neighbors";

export type SectionKey =
  | "process"
  | "pricing"
  | "checklist"
  | "local"
  | "dps"
  | "faq";

export type JobEstimate = {
  job: string;
  price: string;
  time: string;
  note: string;
};

export type DispatchStep = {
  step: number;
  title: string;
  detail: string;
};

export type PricingTableLabels = {
  service: string;
  cost: string;
  dispatch: string;
  note: string;
  disclaimer: string;
};

export type PageChrome = {
  asideDispatch: string;
  asideZip: string;
  asideArea: string;
};

export type PageVariation = {
  hash: number;
  layoutId: LayoutId;
  heroPanel: HeroPanel;
  showPricingInHero: boolean;
  showNeighborsInHero: boolean;
  sectionOrder: SectionKey[];
  densityBand: DensityBand;
  densityLabel: string;
  densityCopy: string;
  headline: string;
  heroSupport: string;
  asideTitle: string;
  asideBody: string;
  asideMetric: string;
  asideMetricLabel: string;
  chipPrimaryLabel: string;
  chipPrimaryValue: string;
  chipSecondaryLabel: string;
  chipSecondaryValue: string;
  introHeading: string;
  introParagraphs: string[];
  checklistHeading: string;
  checklist: string[];
  localHeading: string;
  localBody: string;
  neighborsEmpty: string;
  dpsHeading: string;
  dpsBody: string;
  processHeading: string;
  processIntro: string;
  processSteps: DispatchStep[];
  pricingHeading: string;
  pricingIntro: string;
  pricingTableLabels: PricingTableLabels;
  jobEstimates: JobEstimate[];
  faqHeading: string;
  faqLead: string;
  faqs: FaqItem[];
  metaDescription: string;
  chrome: PageChrome;
};
