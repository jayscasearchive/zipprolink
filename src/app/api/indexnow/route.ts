import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/constants";
import {
  INDEXNOW_ENDPOINT,
  INDEXNOW_KEY,
  INDEXNOW_KEY_FILE,
} from "@/lib/indexnow";
import { getSitemapUrlList } from "@/lib/sitemap-urls";

async function submitIndexNow() {
  const urlList = await getSitemapUrlList();
  const host = new URL(SITE_URL).host;
  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY_FILE}`,
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
