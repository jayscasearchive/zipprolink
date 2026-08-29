export const NEIGHBOR_RADIUS_MILES = 10;
export const NEIGHBOR_FALLBACK_CAP_MILES = 25;
export const NEIGHBOR_MIN_PREFERRED = 4;
export const NEIGHBOR_LIMIT = 8;

export type GeoZip = {
  zip_code: string;
  city: string;
  county_name: string | null;
  state_id: string;
  state_name: string;
  latitude: number;
  longitude: number;
};

export type RankedNeighbor = {
  zip: GeoZip;
  miles: number;
};

export function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function hasValidCoordinates(zip: {
  latitude: unknown;
  longitude: unknown;
}): boolean {
  return (
    toFiniteNumber(zip.latitude) != null && toFiniteNumber(zip.longitude) != null
  );
}

export function toGeoZip(zip: {
  zip_code: string;
  city: string;
  county_name: string | null;
  state_id: string;
  state_name: string;
  latitude: unknown;
  longitude: unknown;
}): GeoZip | null {
  const latitude = toFiniteNumber(zip.latitude);
  const longitude = toFiniteNumber(zip.longitude);
  if (latitude == null || longitude == null) {
    return null;
  }

  return {
    zip_code: zip.zip_code,
    city: zip.city,
    county_name: zip.county_name,
    state_id: zip.state_id,
    state_name: zip.state_name,
    latitude,
    longitude,
  };
}

export function haversineMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadiusMiles = 3958.7613;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return 2 * earthRadiusMiles * Math.asin(Math.min(1, Math.sqrt(a)));
}

/**
 * True local mesh: never pad with far statewide ZIPs.
 * 1) within 10 miles (max `limit`)
 * 2) if fewer than 4, same city or county within 25 miles
 * 3) stop even if still under 4
 */
export function pickNeighboringZips(
  origin: GeoZip,
  candidates: GeoZip[],
  limit = NEIGHBOR_LIMIT,
): RankedNeighbor[] {
  const ranked = candidates
    .filter((candidate) => candidate.zip_code !== origin.zip_code)
    .map((candidate) => ({
      zip: candidate,
      miles: haversineMiles(
        origin.latitude,
        origin.longitude,
        candidate.latitude,
        candidate.longitude,
      ),
    }))
    .sort(
      (a, b) => a.miles - b.miles || a.zip.zip_code.localeCompare(b.zip.zip_code),
    );

  const selected = ranked
    .filter((candidate) => candidate.miles <= NEIGHBOR_RADIUS_MILES)
    .slice(0, limit);

  if (selected.length >= NEIGHBOR_MIN_PREFERRED || selected.length >= limit) {
    return selected;
  }

  const chosen = new Set(selected.map((candidate) => candidate.zip.zip_code));
  const originCounty = origin.county_name?.trim().toLowerCase() ?? "";
  const originCity = origin.city.trim().toLowerCase();

  const fallback = ranked.filter((candidate) => {
    if (chosen.has(candidate.zip.zip_code)) {
      return false;
    }
    if (candidate.miles > NEIGHBOR_FALLBACK_CAP_MILES) {
      return false;
    }
    const county = candidate.zip.county_name?.trim().toLowerCase() ?? "";
    const city = candidate.zip.city.trim().toLowerCase();
    return city === originCity || (Boolean(originCounty) && county === originCounty);
  });

  for (const candidate of fallback) {
    if (selected.length >= limit) {
      break;
    }
    selected.push(candidate);
  }

  return selected;
}
