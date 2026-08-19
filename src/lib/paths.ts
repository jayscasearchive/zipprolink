import type { AppLocale } from "@/lib/i18n";
import { DEFAULT_LOCALE } from "@/lib/i18n";

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

type DirectoryPathInput = {
  locale?: AppLocale;
  service: string;
  state: string;
  city: string;
  zip?: string;
};

export function directoryPath({
  locale = DEFAULT_LOCALE,
  service,
  state,
  city,
  zip,
}: DirectoryPathInput) {
  const parts = [
    locale,
    service,
    stateSlug(state),
    citySlug(city),
  ];
  if (zip) {
    parts.push(zip);
  }
  return `/${parts.join("/")}`;
}

export function localeHomePath(locale: AppLocale = DEFAULT_LOCALE) {
  return `/${locale}`;
}
