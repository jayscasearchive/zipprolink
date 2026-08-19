import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/constants";
import { getPhaseCoverageZips } from "@/lib/directory";
import { INDEXNOW_ENDPOINT, INDEXNOW_KEY } from "@/lib/indexnow";
import { directoryPath } from "@/lib/paths";
import { currentPhaseService } from "@/lib/ssot";

async function submitIndexNow() {
  const service = currentPhaseService();
  const zips = await getPhaseCoverageZips();
  const urlList = zips.map(
    (zip) =>
      `${SITE_URL}${directoryPath({
        locale: "en",
        service: service.slug,
        state: zip.state_id,
        city: zip.city,
        zip: zip.zip_code,
      })}`,
  );

  const host = new URL(SITE_URL).host;
  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  return {
    ok: response.ok,
    status: response.status,
    submitted: urlList.length,
    urlList,
  };
}

export async function GET() {
  const result = await submitIndexNow();
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}

export async function POST() {
  const result = await submitIndexNow();
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
