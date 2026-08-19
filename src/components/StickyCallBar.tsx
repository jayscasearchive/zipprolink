import { Phone } from "lucide-react";
import {
  HOTLINE_DISPLAY,
  HOTLINE_TEL,
  STICKY_TRUST_BADGES,
} from "@/lib/constants";

type StickyCallBarProps = {
  label?: string;
};

export function StickyCallBar({ label }: StickyCallBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-navy/10 bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgba(11,31,58,0.12)] backdrop-blur md:hidden">
      <ul className="mb-2 flex flex-wrap items-center justify-center gap-1.5">
        {STICKY_TRUST_BADGES.map((badge) => (
          <li
            key={badge}
            className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold leading-4 text-emerald-800"
          >
            {badge}
          </li>
        ))}
      </ul>
      <a
        href={HOTLINE_TEL}
        aria-label={`Call ZipProLink at ${HOTLINE_DISPLAY}`}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emergency px-4 py-3.5 text-base font-semibold text-white shadow-sm"
      >
        <Phone className="h-5 w-5" aria-hidden />
        Call Now · {HOTLINE_DISPLAY}
      </a>
      {label ? (
        <p className="mt-1.5 text-center text-[11px] text-slate-500">{label}</p>
      ) : null}
    </div>
  );
}
