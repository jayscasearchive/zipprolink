import type { ServiceCategory, ZipCode } from "@/lib/types";

const SERVICE_SHORT_NAME: Record<string, string> = {
  locksmith: "Locksmith",
  plumbing: "Plumbing",
};

export function shortServiceName(service: Pick<ServiceCategory, "slug" | "name">) {
  return (
    SERVICE_SHORT_NAME[service.slug] ??
    service.name.replace(/^Emergency\s+/i, "").replace(/\s+Service$/i, "")
  );
}

export function locationLabel(zip: Pick<ZipCode, "city" | "state_id" | "zip_code">) {
  return `${zip.city}, ${zip.state_id} ${zip.zip_code}`;
}

export function priceRange(service: ServiceCategory) {
  return `$${service.avg_price_min} – $${service.avg_price_max}`;
}

export function currentSeoYear(date = new Date()) {
  return date.getFullYear();
}
