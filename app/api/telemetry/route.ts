import { NextRequest, NextResponse } from "next/server";
import {
  ClientTelemetryPayload,
  ServerRequestMetadata,
  TelemetryRecord,
} from "@/lib/types/telemetry";
import {
  addTelemetryRecord,
  checkRateLimit,
} from "@/lib/telemetry-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Enforce payload size limit (max 32KB to protect against flood)
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 32 * 1024) {
      return NextResponse.json(
        { success: false, error: "Payload exceeds allowable educational size limit (32KB)" },
        { status: 413 }
      );
    }

    // 2. Extract Client IP for benign rate limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : realIp || "127.0.0.1";

    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please wait before submitting more training telemetry.",
        },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    // 3. Parse JSON Body
    let body: ClientTelemetryPayload;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Malformed JSON payload" },
        { status: 400 }
      );
    }

    // 4. Validate Schema & Consent Verification
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid payload format" },
        { status: 400 }
      );
    }

    if (!body.consentGranted) {
      return NextResponse.json(
        {
          success: false,
          error: "Consent required. Telemetry is only collected upon explicit user consent.",
        },
        { status: 403 }
      );
    }

    if (!body.browser || typeof body.browser !== "object" || !body.display) {
      return NextResponse.json(
        { success: false, error: "Missing required browser or display telemetry objects" },
        { status: 422 }
      );
    }

    // Sanitize and trim strings to prevent oversized payloads
    const sanitizedBrowser = {
      userAgent: String(body.browser.userAgent || "").slice(0, 500),
      family: String(body.browser.family || "Unknown").slice(0, 60),
      version: String(body.browser.version || "Unknown").slice(0, 40),
      osFamily: String(body.browser.osFamily || "Unknown").slice(0, 60),
      deviceCategory: (["mobile", "tablet", "desktop", "unknown"].includes(body.browser.deviceCategory)
        ? body.browser.deviceCategory
        : "unknown") as "mobile" | "tablet" | "desktop" | "unknown",
      language: String(body.browser.language || "en").slice(0, 20),
      languages: Array.isArray(body.browser.languages)
        ? body.browser.languages.slice(0, 6).map((l) => String(l).slice(0, 20))
        : [String(body.browser.language || "en").slice(0, 20)],
      timezone: String(body.browser.timezone || "UTC").slice(0, 60),
    };

    const sanitizedDisplay = {
      screenWidth: Number(body.display.screenWidth) || 0,
      screenHeight: Number(body.display.screenHeight) || 0,
      devicePixelRatio: Number(body.display.devicePixelRatio) || 1,
      viewportWidth: Number(body.display.viewportWidth) || 0,
      viewportHeight: Number(body.display.viewportHeight) || 0,
      colorDepth: Number(body.display.colorDepth) || 24,
    };

    const sanitizedCapabilities = {
      javascriptEnabled: Boolean(body.capabilities?.javascriptEnabled ?? true),
      cookiesEnabled: Boolean(body.capabilities?.cookiesEnabled ?? true),
      onlineStatus: Boolean(body.capabilities?.onlineStatus ?? true),
      touchSupportPoints: Number(body.capabilities?.touchSupportPoints) || 0,
      hardwareConcurrency: body.capabilities?.hardwareConcurrency ? Number(body.capabilities.hardwareConcurrency) : undefined,
    };

    const sanitizedTiming = {
      clientTimestamp: String(body.timing?.clientTimestamp || new Date().toISOString()),
      clientTimezone: sanitizedBrowser.timezone,
      pageLoadDurationMs: body.timing?.pageLoadDurationMs ? Number(body.timing.pageLoadDurationMs) : undefined,
      domInteractiveMs: body.timing?.domInteractiveMs ? Number(body.timing.domInteractiveMs) : undefined,
    };

    // 5. Extract Server-Side Request Metadata (Headers the server sees on every HTTP request)
    const serverMetadata: ServerRequestMetadata = {
      requestTimestamp: new Date().toISOString(),
      httpMethod: req.method,
      requestPath: req.nextUrl.pathname,
      userAgentHeader: req.headers.get("user-agent") || "N/A",
      acceptHeader: req.headers.get("accept") || undefined,
      acceptLanguageHeader: req.headers.get("accept-language") || undefined,
      acceptEncodingHeader: req.headers.get("accept-encoding") || undefined,
      refererHeader: req.headers.get("referer") || undefined,
      forwardedFor: forwarded || undefined,
      realIp: realIp || undefined,
      secChUa: req.headers.get("sec-ch-ua") || undefined,
      secChUaMobile: req.headers.get("sec-ch-ua-mobile") || undefined,
      secChUaPlatform: req.headers.get("sec-ch-ua-platform") || undefined,
      protocol: req.headers.get("x-forwarded-proto") || "https",
      host: req.headers.get("host") || undefined,
    };

    // 6. Educational Analysis Generation
    const summaryPoints: string[] = [
      `Client platform identified as ${sanitizedBrowser.osFamily} running ${sanitizedBrowser.family} (${sanitizedBrowser.deviceCategory} layout).`,
      `Client-side reported viewport: ${sanitizedDisplay.viewportWidth}x${sanitizedDisplay.viewportHeight} (DPR: ${sanitizedDisplay.devicePixelRatio}).`,
      `Timezone reported as ${sanitizedBrowser.timezone}; Accept-Language header requested '${serverMetadata.acceptLanguageHeader || "default"}'.`,
      "Crucial security finding: No private credentials, GPS, passwords, or personal identity were exposed.",
    ];

    const recordId = "evt_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now().toString(36);

    const record: TelemetryRecord = {
      id: recordId,
      timestamp: new Date().toISOString(),
      clientTelemetry: {
        consentGranted: true,
        consentTimestamp: String(body.consentTimestamp || new Date().toISOString()),
        browser: sanitizedBrowser,
        display: sanitizedDisplay,
        capabilities: sanitizedCapabilities,
        timing: sanitizedTiming,
        clientGeneratedId: String(body.clientGeneratedId || recordId).slice(0, 60),
      },
      serverMetadata,
      analysis: {
        sourceClassification: "Authorized Educational Telemetry",
        identificationPotential: "Low - Statistical & Technical Only (Non-PII)",
        riskAssessment: "Benign Technical Observation",
        summaryPoints,
      },
    };

    addTelemetryRecord(record);

    return NextResponse.json(
      {
        success: true,
        message: "Telemetry received",
        id: record.id,
        timestamp: record.timestamp,
        rateLimitRemaining: rateLimit.remaining,
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error processing telemetry:", error);
    return NextResponse.json(
      { success: false, error: "Internal telemetry processing error" },
      { status: 500 }
    );
  }
}
