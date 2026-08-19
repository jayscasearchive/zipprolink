import type { ServiceCategory } from "@/lib/types";

export const LOCALES = ["en", "es"] as const;
export const DEFAULT_LOCALE = "en" as const;

export type AppLocale = (typeof LOCALES)[number];

export function isAppLocale(value: string | undefined): value is AppLocale {
  return value === "en" || value === "es";
}

export function parseLocale(value: string | undefined): AppLocale {
  return isAppLocale(value) ? value : DEFAULT_LOCALE;
}

export const PHONE_DID = {
  en: {
    display: process.env.NEXT_PUBLIC_PHONE_EN_DISPLAY ?? "1-800-000-0000",
    e164: process.env.NEXT_PUBLIC_PHONE_EN ?? "+18000000000",
  },
  es: {
    display: process.env.NEXT_PUBLIC_PHONE_ES_DISPLAY ?? "1-888-000-0000",
    e164: process.env.NEXT_PUBLIC_PHONE_ES ?? "+18880000000",
  },
} as const;

export type LocalePhone = {
  display: string;
  e164: string;
  tel: string;
};

function normalizeE164(value: string | null | undefined, fallback: string) {
  if (!value?.trim()) {
    return fallback;
  }
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  if (value.trim().startsWith("+") && digits.length >= 10) {
    return `+${digits}`;
  }
  return fallback;
}

function formatDidDisplay(e164: string, fallback: string) {
  const digits = e164.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return `${digits.slice(0, 1)}-${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return fallback;
}

export function getLocalePhone(
  locale: AppLocale,
  service?: Pick<ServiceCategory, "phone_en" | "phone_es"> | null,
): LocalePhone {
  const fallback = locale === "es" ? PHONE_DID.es : PHONE_DID.en;
  const raw = locale === "es" ? service?.phone_es : service?.phone_en;
  const e164 = normalizeE164(raw, fallback.e164);
  return {
    display: formatDidDisplay(e164, fallback.display),
    e164,
    tel: `tel:${e164}`,
  };
}

type Dictionary = {
  htmlLang: AppLocale;
  ivr: string;
  callNow: string;
  stickyBadges: readonly [string, string, string];
  referralDisclaimer: string;
  tcpaDisclaimer: string;
  dpsShort: string;
  homeTagline: string;
  homeH1: (year: number) => string;
  homeLead: string;
  coverageHeading: string;
  coverageLead: string;
  whyHeading: string;
  whyItems: { title: string; body: string }[];
  searchPlaceholder: string;
  searchButton: string;
  searchError: string;
  openPage: string;
  licensedLine: string;
  hotlineBadge: string;
  headerSubtitle: string;
  footerBrand: string;
  cityHubH1: (year: number, city: string, state: string) => string;
  cityHubLead: (city: string, count: number) => string;
  zipListHeading: string;
  breadcrumbHome: string;
  faqHeading: string;
  faqLead: (zip: string) => string;
  notFoundTitle: string;
  notFoundBody: string;
  backHome: string;
  coverageMissingTitle: string;
  coverageMissingBody: (display: string) => string;
};

export const dictionaries: Record<AppLocale, Dictionary> = {
  en: {
    htmlLang: "en",
    ivr: "Connects in 1-tap: Press 1 for Emergency Lockout / 2 for Commercial. Live dispatchers ready.",
    callNow: "Call Now",
    stickyBadges: [
      "24/7 Live Dispatch",
      "No Obligation Estimate",
      "Direct Tech Connection",
    ],
    referralDisclaimer:
      "ZipProLink is a free referral matching service that connects homeowners and drivers with independent, licensed local service technicians. ZipProLink does not directly provide locksmith, plumbing, or emergency services, nor does it employ technicians. All service providers are independent contractors responsible for maintaining their own licensing (including TX DPS PSB compliance) and insurance.",
    tcpaDisclaimer:
      "Calls may be recorded for quality and training purposes.",
    dpsShort:
      "TX DPS PSB referral matching service — independent contractors; verify license and insurance before work begins.",
    homeTagline: "24/7 Emergency Locksmith Cost & Dispatch · Texas",
    homeH1: (year) =>
      `${year} locksmith cost & 24/7 emergency dispatch in Texas, by ZIP.`,
    homeLead:
      "Compare typical locksmith cost ranges, then call for a no-obligation estimate. Licensed techs dispatched across Houston, Austin, Dallas, San Antonio, and Texas neighborhoods.",
    coverageHeading: "Texas locksmith coverage",
    coverageLead: "Phase 1 pilot pages for Texas emergency locksmith dispatch.",
    whyHeading: "Why ZipProLink",
    whyItems: [
      {
        title: "ZIP-level dispatch",
        body: "Every page is built around a real US ZIP so you reach a technician who actually covers your block.",
      },
      {
        title: "Upfront price ranges",
        body: "See typical emergency pricing before you call. No bait-and-switch trip fees or surprise after-hours markups.",
      },
      {
        title: "Always on",
        body: "Nights, weekends, and holidays included. Call the 24/7 hotline and we route the closest available pro.",
      },
    ],
    searchPlaceholder: "Enter Texas ZIP (e.g. 77002)",
    searchButton: "Find Help",
    searchError: "Enter a valid 5-digit US ZIP code.",
    openPage: "Open page",
    licensedLine: "Licensed · Insured · Available nights, weekends, and holidays",
    hotlineBadge: "24/7 Hotline",
    headerSubtitle: "Emergency Home Services",
    footerBrand: "ZipProLink · Texas Emergency Locksmith Directory",
    cityHubH1: (year, city, state) =>
      `${year} Locksmith Cost & 24/7 Emergency Dispatch in ${city}, ${state}`,
    cityHubLead: (city, count) =>
      `Compare locksmith cost ranges and live dispatch windows across ${count} ZIP codes in ${city}. Tap a ZIP for local pricing, or call for a no-obligation estimate.`,
    zipListHeading: "ZIP codes we dispatch in this city",
    breadcrumbHome: "Home",
    faqHeading: "Frequently asked questions",
    faqLead: (zip) => `Questions hashed to ${zip} — not a statewide FAQ clone.`,
    notFoundTitle: "Page not found",
    notFoundBody:
      "That directory URL does not exist. Search from the homepage or try a test city ZIP.",
    backHome: "Back to ZipProLink",
    coverageMissingTitle: "We do not have a live listing for this ZIP yet",
    coverageMissingBody: (display) =>
      `Check the service and 5-digit ZIP, or call ${display} for immediate dispatch.`,
  },
  es: {
    htmlLang: "es",
    ivr: "Conexión directa: Presione 1 para cerrajería de emergencia. Operadores listos.",
    callNow: "Llamar ahora",
    stickyBadges: [
      "Despacho en vivo 24/7",
      "Estimado sin obligación",
      "Conexión directa con el técnico",
    ],
    referralDisclaimer:
      "ZipProLink is a free referral matching service that connects homeowners and drivers with independent, licensed local service technicians. ZipProLink does not directly provide locksmith, plumbing, or emergency services, nor does it employ technicians. All service providers are independent contractors responsible for maintaining their own licensing (including TX DPS PSB compliance) and insurance.",
    tcpaDisclaimer:
      "Calls may be recorded for quality and training purposes.",
    dpsShort:
      "Servicio de referidos TX DPS PSB — contratistas independientes; verifique licencia y seguro antes de iniciar el trabajo.",
    homeTagline: "Costo y despacho de cerrajero de emergencia 24/7 · Texas",
    homeH1: (year) =>
      `${year} costo de cerrajero y despacho de emergencia 24/7 en Texas, por ZIP.`,
    homeLead:
      "Compare rangos de costo de cerrajero y llame para un estimado sin obligación. Técnicos con licencia en Houston, Austin, Dallas, San Antonio y vecindarios de Texas.",
    coverageHeading: "Cobertura de cerrajeros en Texas",
    coverageLead:
      "Páginas piloto de la fase 1 para despacho de cerrajeros de emergencia en Texas.",
    whyHeading: "Por qué ZipProLink",
    whyItems: [
      {
        title: "Despacho por ZIP",
        body: "Cada página está construida alrededor de un ZIP real de EE. UU. para conectar con un técnico que cubre su zona.",
      },
      {
        title: "Rangos de precio por adelantado",
        body: "Vea precios de emergencia típicos antes de llamar. Sin cargos ocultos ni recargos sorpresa.",
      },
      {
        title: "Siempre disponible",
        body: "Noches, fines de semana y feriados incluidos. Llame a la línea 24/7 y asignamos al profesional más cercano.",
      },
    ],
    searchPlaceholder: "Ingrese un ZIP de Texas (p. ej. 77002)",
    searchButton: "Buscar ayuda",
    searchError: "Ingrese un código postal de EE. UU. de 5 dígitos.",
    openPage: "Abrir página",
    licensedLine:
      "Con licencia · Asegurado · Disponible noches, fines de semana y feriados",
    hotlineBadge: "Línea 24/7",
    headerSubtitle: "Servicios de emergencia para el hogar",
    footerBrand: "ZipProLink · Directorio de cerrajeros de emergencia en Texas",
    cityHubH1: (year, city, state) =>
      `${year} Costo de cerrajero y despacho de emergencia 24/7 en ${city}, ${state}`,
    cityHubLead: (city, count) =>
      `Compare rangos de costo y tiempos de despacho en ${count} códigos ZIP de ${city}. Elija un ZIP para precios locales o llame para un estimado sin obligación.`,
    zipListHeading: "Códigos ZIP con despacho en esta ciudad",
    breadcrumbHome: "Inicio",
    faqHeading: "Preguntas frecuentes",
    faqLead: (zip) =>
      `Preguntas asociadas al ZIP ${zip}, no un FAQ genérico estatal.`,
    notFoundTitle: "Página no encontrada",
    notFoundBody:
      "Esa URL del directorio no existe. Busque desde el inicio o pruebe un ZIP de ciudad piloto.",
    backHome: "Volver a ZipProLink",
    coverageMissingTitle: "Aún no tenemos un listado en vivo para este ZIP",
    coverageMissingBody: (display) =>
      `Verifique el servicio y el ZIP de 5 dígitos, o llame al ${display} para despacho inmediato.`,
  },
};

export function getDictionary(locale: AppLocale) {
  return dictionaries[locale];
}
