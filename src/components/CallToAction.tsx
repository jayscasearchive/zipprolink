import { Phone } from "lucide-react";
import { ReferralDisclaimer } from "@/components/ReferralDisclaimer";
import { getDictionary, getLocalePhone, type AppLocale } from "@/lib/i18n";

type CallToActionProps = {
  locale: AppLocale;
  variant?: "header" | "hero" | "sticky" | "footer";
};

export function CallToAction({
  locale,
  variant = "hero",
}: CallToActionProps) {
  const copy = getDictionary(locale);
  const phone = getLocalePhone(locale);
  const isHeader = variant === "header";
  const isSticky = variant === "sticky";
  const isFooter = variant === "footer";
  const isHero = variant === "hero";

  const buttonClass = isHeader
    ? "inline-flex items-center gap-2 rounded-full bg-emergency px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emergency-dark"
    : isSticky
      ? "flex w-full items-center justify-center gap-2 rounded-xl bg-emergency px-4 py-3.5 text-base font-semibold text-white shadow-sm"
      : isFooter
        ? "inline-flex items-center gap-2 text-sm font-semibold"
        : "inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-emergency px-6 text-lg font-semibold shadow-lg shadow-emergency/30 transition hover:bg-emergency-dark";

  return (
    <div className={isSticky || isHero ? "flex w-full flex-col" : "flex flex-col"}>
      {!isFooter ? (
        <p
          className={
            isHeader
              ? "mb-1 max-w-[14rem] text-[10px] leading-3 text-white/70 sm:max-w-none"
              : isSticky
                ? "mb-1.5 text-center text-[11px] font-medium text-navy"
                : "mb-2 text-sm font-medium text-amber-200"
          }
        >
          {copy.ivr}
        </p>
      ) : null}
      <a
        href={phone.tel}
        aria-label={`${copy.callNow} ${phone.display}`}
        className={buttonClass}
      >
        <Phone className={isHeader || isFooter ? "h-4 w-4" : "h-5 w-5"} aria-hidden />
        {isHeader ? (
          <>
            <span className="hidden sm:inline">{phone.display}</span>
            <span className="sm:hidden">{copy.callNow}</span>
          </>
        ) : isFooter ? (
          phone.display
        ) : (
          <>
            {copy.callNow} · {phone.display}
          </>
        )}
      </a>
      <div className={isSticky || isHeader ? "mt-1.5" : "mt-2"}>
          <ReferralDisclaimer
            locale={locale}
            compact
            tone={isFooter || isHero || isHeader ? "muted" : "light"}
          />
        </div>
    </div>
  );
}
