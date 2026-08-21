import type { AppLocale } from "@/lib/i18n";
import { DEFAULT_LOCALE, isAppLocale } from "@/lib/i18n";
import { currentPhaseService, currentPhaseStateIds } from "@/lib/ssot";

export function citySlug(city: string) {
  return city
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function stateSlug(stateId: string) {
  return stateId.trim().toLowerCase();
}

export function parseStateId(stateSlugValue: string) {
  return stateSlugValue.trim().toUpperCase();
}

export function isPhaseStateSlug(value: string) {
  return currentPhaseStateIds().some(
    (id) => id.toLowerCase() === value.trim().toLowerCase(),
  );
}

type DirectoryPathInput = {
  locale?: AppLocale;
  service: string;
  state: string;
  city: string;
  zip?: string;
};

function joinPath(parts: string[]) {
  return `/${parts.filter(Boolean).join("/")}`;
}

/** Public URL. Default locale uses as-needed (no `/en` prefix). */
export function directoryPath({
  locale = DEFAULT_LOCALE,
  service,
  state,
  city,
  zip,
}: DirectoryPathInput) {
  const parts = [service, stateSlug(state), citySlug(city)];
  if (zip) {
    parts.push(zip);
  }
  if (locale === DEFAULT_LOCALE) {
    return joinPath(parts);
  }
  return joinPath([locale, ...parts]);
}

export function localeHomePath(locale: AppLocale = DEFAULT_LOCALE) {
  return locale === DEFAULT_LOCALE ? "/" : `/${locale}`;
}

export function stripLocalePrefix(pathname: string) {
  const stripped = pathname.replace(/^\/(en|es)(?=\/|$)/i, "");
  return stripped || "/";
}

export function switchLocalePath(pathname: string, locale: AppLocale) {
  const rest = stripLocalePrefix(pathname);
  if (locale === DEFAULT_LOCALE) {
    return rest;
  }
  if (rest === "/") {
    return `/${locale}`;
  }
  return `/${locale}${rest}`;
}

function injectCurrentService(segments: string[]) {
  const service = currentPhaseService().slug;
  if (!segments[0]) {
    return segments;
  }

  const [first, city, zip, extra] = segments;
  if (first.toLowerCase() === service) {
    return [service, ...segments.slice(1)];
  }

  const isCityHubOrZip =
    Boolean(city) &&
    !extra &&
    (!zip || /^\d{5}$/.test(zip));

  if (isPhaseStateSlug(first) && isCityHubOrZip) {
    return [service, first.toLowerCase(), city, ...(zip ? [zip] : [])];
  }

  return segments;
}

/**
 * App Router lives under `/[locale]/...`. Map public as-needed URLs
 * (and `/tx/dallas/75201` shortcuts) onto that internal tree.
 */
export function toInternalPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  let locale: AppLocale = DEFAULT_LOCALE;
  let rest = segments;

  const maybeLocale = segments[0]?.toLowerCase();
  if (isAppLocale(maybeLocale)) {
    locale = maybeLocale;
    rest = segments.slice(1);
  }

  rest = injectCurrentService(rest);
  return joinPath([locale, ...rest]);
}
