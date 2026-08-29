import { NextResponse } from "next/server";
import { resolveCoverageLocation } from "@/lib/directory";
import { currentPhaseService } from "@/lib/ssot";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const zip = url.searchParams.get("zip")?.trim() ?? "";
  const service =
    url.searchParams.get("service")?.trim() || currentPhaseService().slug;

  if (!/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: "Invalid ZIP" }, { status: 400 });
  }

  const data = await resolveCoverageLocation(service, zip);
  if (!data) {
    return NextResponse.json({ error: "ZIP not in coverage" }, { status: 404 });
  }

  return NextResponse.json({
    service: data.service.slug,
    state: data.zip.state_id,
    city: data.zip.city,
    zip: data.zip.zip_code,
  });
}
