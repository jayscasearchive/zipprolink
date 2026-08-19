import { currentPhaseService } from "@/lib/ssot";

export const SITE_NAME = "ZipProLink";
export const SITE_TAGLINE = "24/7 Emergency Locksmith Cost & Dispatch · Texas";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://zipprolink.com";

/** Formatted number shown in the UI. */
export const HOTLINE_DISPLAY = "1-800-000-0000";
/** E.164 dial string for `href="tel:+1..."`. */
export const HOTLINE_E164 = "+18000000000";
export const HOTLINE_TEL = `tel:${HOTLINE_E164}`;

export const REFERRAL_DISCLAIMER =
  "ZipProLink is a free referral service that connects users with local professional service providers. All contractors are independent and ZipProLink does not warrant or guarantee any work performed. It is the responsibility of the homeowner to verify that the hired contractor furnishes the necessary license and insurance required for the work being performed.";

export const TCPA_DISCLAIMER =
  "Calls may be recorded for quality and training purposes.";

export const STICKY_TRUST_BADGES = [
  "24/7 Live Dispatch",
  "No Obligation Estimate",
  "Direct Tech Connection",
] as const;

const phaseService = currentPhaseService().slug;

export const TEST_CITIES = [
  {
    city: "Houston",
    state: "TX",
    zip: "77002",
    service: phaseService,
  },
  {
    city: "Austin",
    state: "TX",
    zip: "78701",
    service: phaseService,
  },
  {
    city: "Dallas",
    state: "TX",
    zip: "75201",
    service: phaseService,
  },
  {
    city: "San Antonio",
    state: "TX",
    zip: "78205",
    service: phaseService,
  },
] as const;
