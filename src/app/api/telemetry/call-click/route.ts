import { NextResponse } from "next/server";
import { isMissingRelationError } from "@/lib/query-errors";
import { getServiceRoleClient } from "@/lib/supabase-admin";
import {
  consumeTelemetryRateLimit,
  isAllowedTelemetryOrigin,
  parseCallClickPayload,
  telemetryClientKey,
} from "@/lib/telemetry";

function leadResponse(
  stored: "db" | "log" | "dropped",
  recorded: boolean,
) {
  return NextResponse.json(
    {
      recorded,
      stored,
      conversion: false,
      billed: false,
    },
    { status: 200 },
  );
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return leadResponse("dropped", false);
  }

  if (!isAllowedTelemetryOrigin(request.headers.get("origin"))) {
    return leadResponse("dropped", false);
  }

  if (!consumeTelemetryRateLimit(telemetryClientKey(request))) {
    return leadResponse("dropped", false);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return leadResponse("dropped", false);
  }

  const parsed = parseCallClickPayload(raw);
  if ("error" in parsed) {
    return NextResponse.json(
      { error: parsed.error, conversion: false, billed: false },
      { status: 400 },
    );
  }

  const row = {
    path: parsed.path,
    locale: parsed.locale,
    placement: parsed.placement,
    zip_code: parsed.zip,
    service_slug: parsed.service,
  };

  const admin = getServiceRoleClient();
  if (!admin) {
    console.info(
      JSON.stringify({
        type: "call_click",
        conversion: false,
        billed: false,
        stored: "log",
        ...row,
      }),
    );
    return leadResponse("log", true);
  }

  const { error } = await admin.from("call_click_events").insert(row);
  if (error) {
    if (isMissingRelationError(error)) {
      console.info(
        JSON.stringify({
          type: "call_click",
          conversion: false,
          billed: false,
          stored: "log",
          ...row,
        }),
      );
      return leadResponse("log", true);
    }

    console.error("call_click_events insert failed", error.message);
    return leadResponse("dropped", false);
  }

  return leadResponse("db", true);
}
