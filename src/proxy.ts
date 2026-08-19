import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { resolveCoverageLocation } from "@/lib/directory";
import { DEFAULT_LOCALE, isAppLocale } from "@/lib/i18n";
import { directoryPath } from "@/lib/paths";

const LEGACY_ZIP =
  /^\/(?:(en|es)\/)?([a-z0-9-]+)\/(\d{5})\/?$/i;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const legacy = pathname.match(LEGACY_ZIP);
  if (legacy) {
    const rawLocale = legacy[1];
    const locale = isAppLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
    const service = legacy[2]?.toLowerCase() ?? "";
    const zip = legacy[3] ?? "";
    const data = await resolveCoverageLocation(service, zip);
    if (data) {
      const target = directoryPath({
        locale,
        service: data.service.slug,
        state: data.zip.state_id,
        city: data.zip.city,
        zip: data.zip.zip_code,
      });
      if (pathname !== target) {
        return NextResponse.redirect(new URL(target, request.url), 308);
      }
    }
  }

  const first = pathname.split("/").filter(Boolean)[0];
  if (!first) {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url), 308);
  }

  if (!isAppLocale(first)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
