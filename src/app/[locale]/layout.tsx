import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { HtmlLang } from "@/components/HtmlLang";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StickyCallBar } from "@/components/StickyCallBar";
import { LOCALES, isAppLocale } from "@/lib/i18n";

export const revalidate = 86400;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <HtmlLang locale={locale} />
      <SiteHeader locale={locale} />
      <div className="flex min-h-full flex-1 flex-col">{children}</div>
      <SiteFooter locale={locale} />
      <StickyCallBar locale={locale} />
    </div>
  );
}
