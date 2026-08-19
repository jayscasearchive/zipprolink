import Link from "next/link";
import { ShieldCheck, Zap } from "lucide-react";
import { CallToAction } from "@/components/CallToAction";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import { SITE_NAME } from "@/lib/constants";
import { getDictionary, type AppLocale } from "@/lib/i18n";
import { localeHomePath } from "@/lib/paths";

type SiteHeaderProps = {
  locale: AppLocale;
  compact?: boolean;
};

export function SiteHeader({ locale, compact = false }: SiteHeaderProps) {
  const copy = getDictionary(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/95 text-white backdrop-blur">
      <div
        className={`mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 ${compact ? "h-16" : "h-[4.5rem]"} sm:px-6`}
      >
        <Link href={localeHomePath(locale)} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emergency shadow-sm">
            <Zap className="h-5 w-5 text-white" aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block font-semibold tracking-tight">{SITE_NAME}</span>
            <span className="hidden text-[11px] uppercase tracking-[0.16em] text-white/60 sm:block">
              {copy.headerSubtitle}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <LocaleSwitch locale={locale} />
          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 lg:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            {copy.hotlineBadge}
          </span>
          <CallToAction locale={locale} variant="header" />
        </div>
      </div>
    </header>
  );
}
