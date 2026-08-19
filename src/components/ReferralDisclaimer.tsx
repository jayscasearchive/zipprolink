import { getDictionary, type AppLocale } from "@/lib/i18n";

type ReferralDisclaimerProps = {
  locale: AppLocale;
  compact?: boolean;
  tone?: "light" | "dark" | "muted";
};

export function ReferralDisclaimer({
  locale,
  compact = false,
  tone = "light",
}: ReferralDisclaimerProps) {
  const copy = getDictionary(locale);
  const toneClass =
    tone === "dark"
      ? "text-white/55"
      : tone === "muted"
        ? "text-white/70"
        : "text-slate-500";

  return (
    <div className={toneClass}>
      <p className={compact ? "text-[10px] leading-4" : "text-[11px] leading-5 sm:text-xs sm:leading-6"}>
        {copy.referralDisclaimer}
      </p>
      {!compact ? (
        <p className="mt-2 text-[11px] leading-5 sm:text-xs">{copy.tcpaDisclaimer}</p>
      ) : (
        <p className="mt-1 text-[10px] leading-4">
          {copy.dpsShort} {copy.tcpaDisclaimer}
        </p>
      )}
    </div>
  );
}
