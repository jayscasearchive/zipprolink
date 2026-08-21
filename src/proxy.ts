import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { resolveCoverageLocation } from "@/lib/directory";
import { DEFAULT_LOCALE, isAppLocale } from "@/lib/i18n";
import { directoryPath, toInternalPath } from "@/lib/paths";

const LEGACY_ZIP = /^\/(?:(en|es)\/)?([a-z0-9-]+)\/(\d{5})\/?$/i;
const INTERNAL_LOCALE_HEADER = "x-zipprolink-internal-locale";

function redirectPath(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url, 308);
}

function rewritePath(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const headers = new Headers(request.headers);
  headers.set(INTERNAL_LOCALE_HEADER, "1");
  return NextResponse.rewrite(url, { request: { headers } });
}

export async function proxy(request: NextRequest) {
  if (request.headers.get(INTERNAL_LOCALE_HEADER) === "1") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  const legacy = pathname.match(LEGACY_ZIP);
  if (legacy) {
    const rawLocale = legacy[1]?.toLowerCase();
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
      if (pathname.replace(/\/$/, "") !== target) {
        return redirectPath(request, target);
      }
    }
  }

  const first = pathname.split("/").filter(Boolean)[0]?.toLowerCase();

  // localePrefix: 'as-needed' — never keep `/en` on the public URL.
  if (first === DEFAULT_LOCALE) {
    const rest = pathname.replace(/^\/en(?=\/|$)/i, "") || "/";
    return redirectPath(request, rest);
  }

  const internal = toInternalPath(pathname);
  if (internal !== pathname.replace(/\/$/, "") && internal !== pathname) {
    return rewritePath(request, internal);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
