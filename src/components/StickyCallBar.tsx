import { CallToAction } from "@/components/CallToAction";
import { getDictionary, type AppLocale } from "@/lib/i18n";
import type { ServiceCategory } from "@/lib/types";

export function StickyCallBar({
  locale,
  service,
}: {
  locale: AppLocale;
  service?: ServiceCategory | null;
}) {
  const copy = getDictionary(locale);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-navy/10 bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgba(11,31,58,0.12)] backdrop-blur md:hidden">
      <ul className="mb-2 flex flex-wrap items-center justify-center gap-1.5">
        {copy.stickyBadges.map((badge) => (
          <li
            key={badge}
            className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold leading-4 text-emerald-800"
          >
            {badge}
          </li>
        ))}
      </ul>
      <CallToAction locale={locale} variant="sticky" service={service} />
    </div>
  );
}
