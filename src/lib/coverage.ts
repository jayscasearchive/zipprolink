/**
 * Distinguishes geographic ZIP rows from confirmed serviceability.
 *
 * `service_coverage` is a label on already-published geography.
 * It is not publish control. Existing TX `zip_codes` pages stay live
 * even when this table is missing, empty, or unreadable.
 * New ZIP pages are created only by the verified publish script plus a rebuild.
 */
export type CoverageStatus = "serviceable" | "geo_only";

export type CoverageSource = "service_coverage" | "zip_codes";

export type CoverageRecord = {
  zip_code: string;
  status: "active" | "paused" | "blocked";
  source: string;
  verified_at: string | null;
};

export type PublishedCoverage = {
  status: CoverageStatus;
  source: CoverageSource;
  verified: boolean;
};

/** `null` index means the coverage table is absent or unreadable. */
export function resolvePublishedCoverage(
  zipCode: string,
  coverageByZip: Map<string, CoverageRecord> | null,
): PublishedCoverage {
  if (!coverageByZip) {
    return {
      status: "geo_only",
      source: "zip_codes",
      verified: false,
    };
  }

  const row = coverageByZip.get(zipCode);
  if (row?.status === "active") {
    return {
      status: "serviceable",
      source: "service_coverage",
      verified: Boolean(row.verified_at),
    };
  }

  return {
    status: "geo_only",
    source: "zip_codes",
    verified: false,
  };
}
