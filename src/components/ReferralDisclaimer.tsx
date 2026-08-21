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
    <div className={`min-w-0 max-w-full overflow-x-hidden ${toneClass}`}>
      <p
        className={
          compact
            ? "text-[10px] leading-4 wrap-break-word [overflow-wrap:anywhere]"
            : "text-[11px] leading-5 wrap-break-word [overflow-wrap:anywhere] sm:text-xs sm:leading-6"
        }
      >
        {copy.referralDisclaimer}
      </p>
      {!compact ? (
        <p className="mt-2 text-[11px] leading-5 wrap-break-word [overflow-wrap:anywhere] sm:text-xs">
          {copy.tcpaDisclaimer}
        </p>
      ) : (
        <p className="mt-1 text-[10px] leading-4 wrap-break-word [overflow-wrap:anywhere]">
          {copy.dpsShort} {copy.tcpaDisclaimer}
        </p>
      )}
    </div>
  );
}
