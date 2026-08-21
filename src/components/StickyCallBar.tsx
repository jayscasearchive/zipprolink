import { CallToAction } from "@/components/CallToAction";
import type { AppLocale } from "@/lib/i18n";
import type { ServiceCategory } from "@/lib/types";

export function StickyCallBar({
  locale,
  service,
}: {
  locale: AppLocale;
  service?: ServiceCategory | null;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 md:hidden">
      <div className="pointer-events-auto mx-auto w-full max-w-full overflow-hidden border-t border-navy/15 bg-navy px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <CallToAction locale={locale} variant="sticky" service={service} />
      </div>
    </div>
  );
}
