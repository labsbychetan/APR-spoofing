import { TelemetryRecord, TelemetryStats } from "./types/telemetry";

// In-memory global store across serverless executions / dev server hot reloads
const globalForTelemetry = globalThis as unknown as {
  telemetryEvents: TelemetryRecord[] | undefined;
  rateLimitMap: Map<string, { count: number; resetTime: number }> | undefined;
};

export const MAX_STORED_EVENTS = 200;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_PER_WINDOW = 40; // 40 requests per IP per minute

// Initial Seed Events for immediate instructor classroom demonstration
const INITIAL_DEMO_EVENTS: TelemetryRecord[] = [
  {
    id: "evt_seed_android_01",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    clientTelemetry: {
      consentGranted: true,
      consentTimestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      browser: {
        userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.88 Mobile Safari/537.36",
        family: "Google Chrome",
        version: "128.0.6613.88",
        osFamily: "Android 14",
        deviceCategory: "mobile",
        language: "en-US",
        languages: ["en-US", "en"],
        timezone: "America/New_York",
      },
      display: {
        screenWidth: 1080,
        screenHeight: 2400,
        devicePixelRatio: 2.625,
        viewportWidth: 412,
        viewportHeight: 915,
        colorDepth: 24,
      },
      capabilities: {
        javascriptEnabled: true,
        cookiesEnabled: true,
        onlineStatus: true,
        touchSupportPoints: 5,
        hardwareConcurrency: 8,
      },
      timing: {
        clientTimestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        clientTimezone: "America/New_York",
        pageLoadDurationMs: 420,
        domInteractiveMs: 180,
      },
      clientGeneratedId: "seed-cid-001",
    },
    serverMetadata: {
      requestTimestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      httpMethod: "POST",
      requestPath: "/api/telemetry",
      userAgentHeader: "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.88 Mobile Safari/537.36",
      acceptHeader: "application/json, text/plain, */*",
      acceptLanguageHeader: "en-US,en;q=0.9",
      acceptEncodingHeader: "gzip, deflate, br, zstd",
      refererHeader: "https://cyber-telemetry-lab.vercel.app/consent",
      forwardedFor: "198.51.100.42",
      realIp: "198.51.100.42",
      secChUa: '"Chromium";v="128", "Google Chrome";v="128", "Not;A=Brand";v="24"',
      secChUaMobile: "?1",
      secChUaPlatform: '"Android"',
      protocol: "https",
      host: "cyber-telemetry-lab.vercel.app",
    },
    analysis: {
      sourceClassification: "Authorized Educational Telemetry",
      identificationPotential: "Low - Statistical & Technical Only (Non-PII)",
      riskAssessment: "Benign Technical Observation",
      summaryPoints: [
        "Mobile browser footprint detected: High DPR (2.625) and touch capability (5 points).",
        "Timezone (America/New_York) and language (en-US) correlate with client system locale.",
        "No PII, keystrokes, GPS coordinates, or credentials exposed.",
      ],
    },
  },
  {
    id: "evt_seed_desktop_02",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    clientTelemetry: {
      consentGranted: true,
      consentTimestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      browser: {
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0",
        family: "Microsoft Edge",
        version: "130.0.0.0",
        osFamily: "Windows 10/11",
        deviceCategory: "desktop",
        language: "en-GB",
        languages: ["en-GB", "en-US", "en"],
        timezone: "Europe/London",
      },
      display: {
        screenWidth: 1920,
        screenHeight: 1080,
        devicePixelRatio: 1,
        viewportWidth: 1920,
        viewportHeight: 968,
        colorDepth: 24,
      },
      capabilities: {
        javascriptEnabled: true,
        cookiesEnabled: true,
        onlineStatus: true,
        touchSupportPoints: 0,
        hardwareConcurrency: 16,
      },
      timing: {
        clientTimestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        clientTimezone: "Europe/London",
        pageLoadDurationMs: 310,
        domInteractiveMs: 140,
      },
      clientGeneratedId: "seed-cid-002",
    },
    serverMetadata: {
      requestTimestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      httpMethod: "POST",
      requestPath: "/api/telemetry",
      userAgentHeader: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0",
      acceptHeader: "application/json, text/plain, */*",
      acceptLanguageHeader: "en-GB,en;q=0.9",
      acceptEncodingHeader: "gzip, deflate, br",
      refererHeader: "https://cyber-telemetry-lab.vercel.app/",
      forwardedFor: "203.0.113.19",
      realIp: "203.0.113.19",
      secChUa: '"Microsoft Edge";v="130", "Chromium";v="130", "Not?A_Brand";v="99"',
      secChUaMobile: "?0",
      secChUaPlatform: '"Windows"',
      protocol: "https",
      host: "cyber-telemetry-lab.vercel.app",
    },
    analysis: {
      sourceClassification: "Authorized Educational Telemetry",
      identificationPotential: "Low - Statistical & Technical Only (Non-PII)",
      riskAssessment: "Benign Technical Observation",
      summaryPoints: [
        "Desktop workstation footprint detected: 1080p display, 16-core CPU concurrency, 0 touch points.",
        "Edge Client Hints (sec-ch-ua-platform: Windows) confirmed server-side.",
        "No PII or identity information exposed.",
      ],
    },
  },
];

export function getTelemetryStore(): TelemetryRecord[] {
  if (!globalForTelemetry.telemetryEvents) {
    globalForTelemetry.telemetryEvents = [...INITIAL_DEMO_EVENTS];
  }
  return globalForTelemetry.telemetryEvents;
}

export function addTelemetryRecord(record: TelemetryRecord): TelemetryRecord {
  const store = getTelemetryStore();
  store.unshift(record);
  if (store.length > MAX_STORED_EVENTS) {
    store.length = MAX_STORED_EVENTS;
  }
  return record;
}

export function clearTelemetryStore(): void {
  globalForTelemetry.telemetryEvents = [];
}

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  if (!globalForTelemetry.rateLimitMap) {
    globalForTelemetry.rateLimitMap = new Map();
  }

  const now = Date.now();
  const entry = globalForTelemetry.rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    globalForTelemetry.rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX_PER_WINDOW - 1 };
  }

  if (entry.count >= RATE_LIMIT_MAX_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX_PER_WINDOW - entry.count };
}

export function computeTelemetryStats(records: TelemetryRecord[]): TelemetryStats {
  const stats: TelemetryStats = {
    totalEvents: records.length,
    mobileEvents: 0,
    desktopEvents: 0,
    tabletEvents: 0,
    browserDistribution: {},
    osDistribution: {},
    deviceDistribution: {},
    recentRequests: 0,
    lastEventTimestamp: records.length > 0 ? records[0].timestamp : null,
  };

  const oneHourAgo = Date.now() - 1000 * 60 * 60;

  for (const rec of records) {
    const dev = rec.clientTelemetry.browser.deviceCategory || "desktop";
    if (dev === "mobile") stats.mobileEvents += 1;
    else if (dev === "tablet") stats.tabletEvents += 1;
    else stats.desktopEvents += 1;

    stats.deviceDistribution[dev] = (stats.deviceDistribution[dev] || 0) + 1;

    const browser = rec.clientTelemetry.browser.family || "Other";
    stats.browserDistribution[browser] = (stats.browserDistribution[browser] || 0) + 1;

    const os = rec.clientTelemetry.browser.osFamily || "Other";
    stats.osDistribution[os] = (stats.osDistribution[os] || 0) + 1;

    const recTime = new Date(rec.timestamp).getTime();
    if (recTime >= oneHourAgo) {
      stats.recentRequests += 1;
    }
  }

  return stats;
}
