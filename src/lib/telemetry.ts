import { SITE_URL } from "@/lib/constants";
import { isAppLocale, type AppLocale } from "@/lib/i18n";

export const CALL_CLICK_PLACEMENTS = [
  "header",
  "hero",
  "sticky",
  "footer",
] as const;

export type CallClickPlacement = (typeof CALL_CLICK_PLACEMENTS)[number];

export type CallClickEvent = {
  path: string;
  locale: AppLocale;
  placement: CallClickPlacement;
  zip: string | null;
  service: string | null;
};

const ALLOWED_KEYS = new Set(["path", "locale", "placement", "zip", "service"]);
const PII_KEYS = ["phone", "tel", "e164", "display", "number", "did"];

function isPlacement(value: unknown): value is CallClickPlacement {
  return (
    typeof value === "string" &&
    (CALL_CLICK_PLACEMENTS as readonly string[]).includes(value)
  );
}

function pathnameOnly(value: string) {
  const trimmed = value.trim();
  const path = trimmed.split(/[?#]/, 1)[0] ?? "";
  if (!path.startsWith("/") || path.length > 512 || path.includes("\\")) {
    return null;
  }
  return path;
}

export function parseCallClickPayload(
  input: unknown,
): CallClickEvent | { error: string } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { error: "Invalid payload" };
  }

  const body = input as Record<string, unknown>;
  for (const key of Object.keys(body)) {
    if (!ALLOWED_KEYS.has(key)) {
      return { error: "Unexpected field" };
    }
  }
  for (const key of PII_KEYS) {
    if (key in body) {
      return { error: "PII fields are not allowed" };
    }
  }

  if (typeof body.path !== "string") {
    return { error: "Invalid path" };
  }
  const path = pathnameOnly(body.path);
  if (!path) {
    return { error: "Invalid path" };
  }

  if (!isAppLocale(typeof body.locale === "string" ? body.locale : "")) {
    return { error: "Invalid locale" };
  }

  if (!isPlacement(body.placement)) {
    return { error: "Invalid placement" };
  }

  const zip =
    typeof body.zip === "string" && /^\d{5}$/.test(body.zip) ? body.zip : null;
  const service =
    typeof body.service === "string" && /^[a-z0-9-]{1,40}$/.test(body.service)
      ? body.service
      : null;

  return {
    path,
    locale: body.locale as AppLocale,
    placement: body.placement,
    zip,
    service,
  };
}

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

export function telemetryClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return ip.slice(0, 64);
}

export function consumeTelemetryRateLimit(key: string) {
  const now = Date.now();
  const current = rateBuckets.get(key);
  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (current.count >= RATE_MAX) {
    return false;
  }
  current.count += 1;
  return true;
}

export function isAllowedTelemetryOrigin(origin: string | null) {
  if (!origin) {
    return true;
  }
  try {
    const incoming = new URL(origin);
    if (
      incoming.hostname === "localhost" ||
      incoming.hostname === "127.0.0.1"
    ) {
      return true;
    }
    return incoming.origin === new URL(SITE_URL).origin;
  } catch {
    return false;
  }
}
