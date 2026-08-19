import { Phone } from "lucide-react";
import {
  HOTLINE_DISPLAY,
  HOTLINE_TEL,
  REFERRAL_DISCLAIMER,
  TCPA_DISCLAIMER,
} from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-navy text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pb-32 pt-8 md:pb-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/70">
            ZipProLink · Texas Emergency Locksmith Directory
          </p>
          <a
            href={HOTLINE_TEL}
            className="inline-flex items-center gap-2 text-sm font-semibold"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {HOTLINE_DISPLAY}
          </a>
        </div>
        <div className="space-y-3 border-t border-white/10 pt-5 text-[11px] leading-5 text-white/55 sm:text-xs sm:leading-6">
          <p>{REFERRAL_DISCLAIMER}</p>
          <p>{TCPA_DISCLAIMER}</p>
        </div>
      </div>
    </footer>
  );
}
