import { CallToAction } from "@/components/CallToAction";
import { ReferralDisclaimer } from "@/components/ReferralDisclaimer";
import { getDictionary, type AppLocale } from "@/lib/i18n";
import type { ServiceCategory } from "@/lib/types";

export function SiteFooter({
  locale,
  service,
}: {
  locale: AppLocale;
  service?: ServiceCategory | null;
}) {
  const copy = getDictionary(locale);

  return (
    <footer className="mt-auto border-t border-slate-200 bg-navy text-white">
      <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-5 px-4 pb-20 pt-8 sm:px-6 md:pb-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <p className="text-sm text-white/70">{copy.footerBrand}</p>
          <CallToAction locale={locale} variant="footer" service={service} />
        </div>
        <div className="border-t border-white/10 pt-5">
          <ReferralDisclaimer locale={locale} tone="dark" />
        </div>
      </div>
    </footer>
  );
}
