"use client";

import type { ReactNode } from "react";
import type { AppLocale } from "@/lib/i18n";
import type { CallClickPlacement } from "@/lib/telemetry";

type CallClickLinkProps = {
  href: string;
  locale: AppLocale;
  placement: CallClickPlacement;
  serviceSlug?: string | null;
  className?: string;
  ariaLabel: string;
  children: ReactNode;
};

function zipFromPath(pathname: string) {
  const match = pathname.match(/\/(\d{5})\/?$/);
  return match?.[1] ?? null;
}

export function CallClickLink({
  href,
  locale,
  placement,
  serviceSlug,
  className,
  ariaLabel,
  children,
}: CallClickLinkProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={className}
      onClick={() => {
        const path = window.location.pathname.split(/[?#]/, 1)[0] ?? "/";
        void fetch("/api/telemetry/call-click", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            path,
            locale,
            placement,
            zip: zipFromPath(path),
            service: serviceSlug ?? null,
          }),
          keepalive: true,
        }).catch(() => {
          /* tel: navigation must not wait on telemetry. */
        });
      }}
    >
      {children}
    </a>
  );
}
