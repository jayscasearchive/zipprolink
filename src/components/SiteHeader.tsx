import Link from "next/link";
import { Phone, ShieldCheck, Zap } from "lucide-react";
import { HOTLINE_DISPLAY, HOTLINE_TEL, SITE_NAME } from "@/lib/constants";

type SiteHeaderProps = {
  compact?: boolean;
};

export function SiteHeader({ compact = false }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/95 text-white backdrop-blur">
      <div
        className={`mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 ${compact ? "h-14" : "h-16"} sm:px-6`}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emergency shadow-sm">
            <Zap className="h-5 w-5 text-white" aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block font-semibold tracking-tight">{SITE_NAME}</span>
            <span className="hidden text-[11px] uppercase tracking-[0.16em] text-white/60 sm:block">
              Emergency Home Services
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 sm:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            24/7 Hotline
          </span>
          <a
            href={HOTLINE_TEL}
            className="inline-flex items-center gap-2 rounded-full bg-emergency px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emergency-dark"
          >
            <Phone className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">{HOTLINE_DISPLAY}</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </div>
    </header>
  );
}
