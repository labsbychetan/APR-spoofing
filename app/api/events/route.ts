import { NextRequest, NextResponse } from "next/server";
import {
  clearTelemetryStore,
  computeTelemetryStats,
  getTelemetryStore,
} from "@/lib/telemetry-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const store = getTelemetryStore();
    const stats = computeTelemetryStats(store);

    const search = req.nextUrl.searchParams.get("q")?.toLowerCase();
    const deviceFilter = req.nextUrl.searchParams.get("device");
    const browserFilter = req.nextUrl.searchParams.get("browser");
    const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") || 50), 100);

    let filtered = [...store];

    if (deviceFilter && deviceFilter !== "all") {
      filtered = filtered.filter(
        (e) => e.clientTelemetry.browser.deviceCategory.toLowerCase() === deviceFilter.toLowerCase()
      );
    }

    if (browserFilter && browserFilter !== "all") {
      filtered = filtered.filter(
        (e) => e.clientTelemetry.browser.family.toLowerCase().includes(browserFilter.toLowerCase())
      );
    }

    if (search) {
      filtered = filtered.filter((e) => {
        const ua = e.clientTelemetry.browser.userAgent.toLowerCase();
        const os = e.clientTelemetry.browser.osFamily.toLowerCase();
        const id = e.id.toLowerCase();
        const ip = (e.serverMetadata.forwardedFor || e.serverMetadata.realIp || "").toLowerCase();
        const tz = e.clientTelemetry.browser.timezone.toLowerCase();
        return ua.includes(search) || os.includes(search) || id.includes(search) || ip.includes(search) || tz.includes(search);
      });
    }

    const paginatedEvents = filtered.slice(0, limit);

    return NextResponse.json(
      {
        success: true,
        stats,
        totalMatching: filtered.length,
        events: paginatedEvents,
        serverTime: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching telemetry events:", error);
    return NextResponse.json(
      { success: false, error: "Failed to query telemetry events" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    clearTelemetryStore();
    return NextResponse.json({
      success: true,
      message: "Telemetry session store cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing telemetry store:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear telemetry session store" },
      { status: 500 }
    );
  }
}
