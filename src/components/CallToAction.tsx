import { Phone } from "lucide-react";
import { ReferralDisclaimer } from "@/components/ReferralDisclaimer";
import {
  getDictionary,
  getLocalePhone,
  type AppLocale,
} from "@/lib/i18n";
import type { ServiceCategory } from "@/lib/types";

type CallToActionProps = {
  locale: AppLocale;
  variant?: "header" | "hero" | "sticky" | "footer";
  service?: ServiceCategory | null;
};

export function CallToAction({
  locale,
  variant = "hero",
  service,
}: CallToActionProps) {
  const copy = getDictionary(locale);
  const phone = getLocalePhone(locale, service);
  const isHeader = variant === "header";
  const isSticky = variant === "sticky";
  const isFooter = variant === "footer";
  const isHero = variant === "hero";
  const showLegal = isHero;

  const buttonClass = isHeader
    ? "inline-flex shrink-0 items-center gap-2 rounded-full bg-emergency px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emergency-dark"
    : isSticky
      ? "flex h-11 w-full max-w-full items-center justify-center gap-2 rounded-lg bg-emergency px-3 text-sm font-semibold text-white"
      : isFooter
        ? "inline-flex items-center gap-2 text-sm font-semibold"
        : "inline-flex h-14 w-full max-w-full items-center justify-center gap-2 rounded-xl bg-emergency px-6 text-lg font-semibold shadow-lg shadow-emergency/30 transition hover:bg-emergency-dark";

  return (
    <div
      className={
        isSticky || isHero
          ? "flex w-full min-w-0 max-w-full flex-col"
          : "flex min-w-0 max-w-full flex-col"
      }
    >
      {isHero ? (
        <p className="mb-2 max-w-full text-sm font-medium break-words text-amber-200">
          {copy.ivr}
        </p>
      ) : null}
      <a
        href={phone.tel}
        aria-label={`${copy.callNow} ${phone.display}`}
        className={buttonClass}
      >
        <Phone className={isHeader || isFooter || isSticky ? "h-4 w-4 shrink-0" : "h-5 w-5 shrink-0"} aria-hidden />
        {isHeader ? (
          <>
            <span className="hidden sm:inline">{phone.display}</span>
            <span className="sm:hidden">{copy.callNow}</span>
          </>
        ) : isFooter ? (
          phone.display
        ) : isSticky ? (
          <span className="truncate">
            {copy.callNow} · {phone.display}
          </span>
        ) : (
          <>
            {copy.callNow} · {phone.display}
          </>
        )}
      </a>
      {showLegal ? (
        <div className="mt-2 min-w-0 max-w-full">
          <ReferralDisclaimer locale={locale} compact tone="muted" />
        </div>
      ) : null}
    </div>
  );
}
