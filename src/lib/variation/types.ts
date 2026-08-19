import type { FaqItem } from "@/lib/types";

export type DensityBand = "urban" | "suburban";

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

export type PageVariation = {
  hash: number;
  layoutId: "emergency" | "compliance" | "neighborhood" | "cost";
  sectionOrder: SectionKey[];
  densityBand: DensityBand;
  densityLabel: string;
  densityCopy: string;
  headline: string;
  heroSupport: string;
  asideTitle: string;
  asideBody: string;
  introHeading: string;
  introParagraphs: string[];
  checklistHeading: string;
  checklist: string[];
  localHeading: string;
  localBody: string;
  dpsHeading: string;
  dpsBody: string;
  processHeading: string;
  processIntro: string;
  processSteps: DispatchStep[];
  pricingHeading: string;
  pricingIntro: string;
  jobEstimates: JobEstimate[];
  faqs: FaqItem[];
  metaDescription: string;
};
