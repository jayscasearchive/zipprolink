import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { HtmlLang } from "@/components/HtmlLang";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StickyCallBar } from "@/components/StickyCallBar";
import { LOCALES, isAppLocale } from "@/lib/i18n";
import { getServiceBySlug } from "@/lib/directory";
import { currentPhaseService } from "@/lib/ssot";

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

  const service = await getServiceBySlug(currentPhaseService().slug);

  return (
    <div className="flex min-h-dvh max-w-full flex-col">
      <HtmlLang locale={locale} />
      <SiteHeader locale={locale} service={service} />
      <div className="min-w-0 max-w-full flex-1 overflow-x-hidden">{children}</div>
      <SiteFooter locale={locale} service={service} />
      <StickyCallBar locale={locale} service={service} />
    </div>
  );
}
