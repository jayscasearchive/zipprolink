import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { resolveCoverageLocation } from "@/lib/directory";
import { DEFAULT_LOCALE, isAppLocale } from "@/lib/i18n";
import { DirectoryUnavailableError } from "@/lib/query-errors";
import {
  directoryPath,
  parseDirectoryZipPath,
  shortcutRedirectTarget,
  toInternalPath,
} from "@/lib/paths";
import { currentPhaseService } from "@/lib/ssot";

const LEGACY_ZIP = /^\/(?:(en|es)\/)?([a-z0-9-]+)\/(\d{5})\/?$/i;
const INTERNAL_LOCALE_HEADER = "x-zipprolink-internal-locale";

function normalizedPathname(pathname: string) {
  try {
    return decodeURIComponent(pathname).replace(/\/$/, "") || "/";
  } catch {
    return pathname.replace(/\/$/, "") || "/";
  }
}

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

  // Broken inbound `/&` — GSC 404, not a directory page.
  if (normalizedPathname(pathname) === "/&") {
    return redirectPath(request, "/");
  }

  const legacy = pathname.match(LEGACY_ZIP);
  if (legacy) {
    const rawLocale = legacy[1]?.toLowerCase();
    const locale = isAppLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
    const service = legacy[2]?.toLowerCase() ?? "";
    const zip = legacy[3] ?? "";
    try {
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
    } catch (error) {
      if (!(error instanceof DirectoryUnavailableError)) {
        throw error;
      }
    }
  }

  const first = pathname.split("/").filter(Boolean)[0]?.toLowerCase();

  // localePrefix: 'as-needed' — never keep `/en` on the public URL.
  if (first === DEFAULT_LOCALE) {
    const rest = pathname.replace(/^\/en(?=\/|$)/i, "") || "/";
    return redirectPath(request, rest);
  }

  const directoryZip = parseDirectoryZipPath(normalizedPathname(pathname));
  if (directoryZip) {
    try {
      const data = await resolveCoverageLocation(
        currentPhaseService().slug,
        directoryZip.zip,
      );
      if (data) {
        const target = directoryPath({
          locale: directoryZip.locale,
          service: data.service.slug,
          state: data.zip.state_id,
          city: data.zip.city,
          zip: data.zip.zip_code,
        });
        if (normalizedPathname(pathname) !== target) {
          return redirectPath(request, target);
        }
      } else {
        const missing = request.nextUrl.clone();
        missing.pathname = "/_not-found";
        return NextResponse.rewrite(missing, { status: 404 });
      }
    } catch (error) {
      if (!(error instanceof DirectoryUnavailableError)) {
        throw error;
      }
      // DB outage: do not 308 to the wrong place or invent coverage-missing.
    }
  }

  const shortcut = shortcutRedirectTarget(pathname);
  if (shortcut) {
    return redirectPath(request, shortcut);
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
