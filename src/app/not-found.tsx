import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StickyCallBar } from "@/components/StickyCallBar";
import { DEFAULT_LOCALE, getDictionary } from "@/lib/i18n";
import { localeHomePath } from "@/lib/paths";

export default function NotFound() {
  const copy = getDictionary(DEFAULT_LOCALE);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50">
      <SiteHeader locale={DEFAULT_LOCALE} />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emergency">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-navy">
          {copy.notFoundTitle}
        </h1>
        <p className="mt-3 text-slate-600">{copy.notFoundBody}</p>
        <Link
          href={localeHomePath(DEFAULT_LOCALE)}
          className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-emergency px-5 text-sm font-semibold text-white hover:bg-emergency-dark"
        >
          {copy.backHome}
        </Link>
      </main>
      <SiteFooter locale={DEFAULT_LOCALE} />
      <StickyCallBar locale={DEFAULT_LOCALE} />
    </div>
  );
}
