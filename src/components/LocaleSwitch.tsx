"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, type AppLocale } from "@/lib/i18n";
import { switchLocalePath } from "@/lib/paths";

export function LocaleSwitch({ locale }: { locale: AppLocale }) {
  const pathname = usePathname() ?? "/";

  return (
    <nav aria-label="Language" className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em]">
      {LOCALES.map((item) => {
        const href = switchLocalePath(pathname, item);
        const active = item === locale;
        return (
          <Link
            key={item}
            href={href}
            hrefLang={item}
            className={
              active
                ? "rounded-full bg-white/15 px-2 py-1 text-white"
                : "rounded-full px-2 py-1 text-white/55 hover:text-white"
            }
          >
            {item}
          </Link>
        );
      })}
    </nav>
  );
}
