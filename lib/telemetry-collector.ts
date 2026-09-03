import { ClientTelemetryPayload } from "./types/telemetry";

export function parseUserAgentDetails(ua: string) {
  let family = "Unknown Browser";
  let version = "Unknown";
  let osFamily = "Unknown OS";
  let deviceCategory: "mobile" | "tablet" | "desktop" | "unknown" = "desktop";

  // Browser Family Detection
  if (/Edg\/([0-9.]+)/i.test(ua)) {
    family = "Microsoft Edge";
    version = ua.match(/Edg\/([0-9.]+)/i)?.[1] || "Unknown";
  } else if (/OPR\/([0-9.]+)/i.test(ua) || /Opera/i.test(ua)) {
    family = "Opera";
    version = ua.match(/(?:OPR|Opera)\/([0-9.]+)/i)?.[1] || "Unknown";
  } else if (/Chrome\/([0-9.]+)/i.test(ua) && !/Chromium/i.test(ua)) {
    family = "Google Chrome";
    version = ua.match(/Chrome\/([0-9.]+)/i)?.[1] || "Unknown";
  } else if (/Firefox\/([0-9.]+)/i.test(ua)) {
    family = "Mozilla Firefox";
    version = ua.match(/Firefox\/([0-9.]+)/i)?.[1] || "Unknown";
  } else if (/Safari\/([0-9.]+)/i.test(ua) && !/Chrome/i.test(ua)) {
    family = "Apple Safari";
    version = ua.match(/Version\/([0-9.]+)/i)?.[1] || "Unknown";
  }

  // OS Detection
  if (/Windows NT 10.0/i.test(ua)) osFamily = "Windows 10/11";
  else if (/Windows NT 6.3/i.test(ua)) osFamily = "Windows 8.1";
  else if (/Windows NT 6.1/i.test(ua)) osFamily = "Windows 7";
  else if (/Windows/i.test(ua)) osFamily = "Windows";
  else if (/Android ([0-9.]+)/i.test(ua)) {
    osFamily = `Android ${ua.match(/Android ([0-9.]+)/i)?.[1] || ""}`.trim();
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    osFamily = "Apple iOS";
  } else if (/Mac OS X ([0-9._]+)/i.test(ua)) {
    osFamily = "macOS";
  } else if (/CrOS/i.test(ua)) {
    osFamily = "ChromeOS";
  } else if (/Linux/i.test(ua)) {
    osFamily = "Linux";
  }

  // Device Category Detection
  if (/Tablet|iPad/i.test(ua) || (osFamily === "Apple iOS" && window?.navigator?.maxTouchPoints > 1 && !/iPhone/i.test(ua))) {
    deviceCategory = "tablet";
  } else if (/Mobi|Android|iPhone|iPod/i.test(ua)) {
    deviceCategory = "mobile";
  } else {
    deviceCategory = "desktop";
  }

  return { family, version, osFamily, deviceCategory };
}

export function collectClientTelemetry(): ClientTelemetryPayload {
  if (typeof window === "undefined") {
    throw new Error("collectClientTelemetry must be invoked in browser client environment");
  }

  const ua = window.navigator.userAgent || "Unknown";
  const { family, version, osFamily, deviceCategory } = parseUserAgentDetails(ua);

  // Timezone resolution
  let timezone = "UTC";
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    timezone = "Unknown";
  }

  // Performance timings (safe navigation timing API)
  let pageLoadDurationMs: number | undefined = undefined;
  let domInteractiveMs: number | undefined = undefined;
  try {
    const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    if (navEntries.length > 0) {
      const entry = navEntries[0];
      pageLoadDurationMs = Math.round(entry.loadEventEnd > 0 ? entry.loadEventEnd - entry.startTime : performance.now());
      domInteractiveMs = Math.round(entry.domInteractive - entry.startTime);
    }
  } catch {
    // Navigation timing fallback
  }

  // Client generated unique request ID (UUID)
  let clientGeneratedId = "cid_" + Math.random().toString(36).substring(2, 11);
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try {
      clientGeneratedId = crypto.randomUUID();
    } catch {
      // fallback
    }
  }

  return {
    consentGranted: true,
    consentTimestamp: new Date().toISOString(),
    browser: {
      userAgent: ua,
      family,
      version,
      osFamily,
      deviceCategory,
      language: window.navigator.language || "en-US",
      languages: Array.from(window.navigator.languages || [window.navigator.language || "en-US"]),
      timezone,
    },
    display: {
      screenWidth: window.screen.width || 0,
      screenHeight: window.screen.height || 0,
      devicePixelRatio: window.devicePixelRatio || 1,
      viewportWidth: window.innerWidth || 0,
      viewportHeight: window.innerHeight || 0,
      colorDepth: window.screen.colorDepth || 24,
    },
    capabilities: {
      javascriptEnabled: true,
      cookiesEnabled: window.navigator.cookieEnabled ?? true,
      onlineStatus: window.navigator.onLine ?? true,
      touchSupportPoints: window.navigator.maxTouchPoints || 0,
      hardwareConcurrency: window.navigator.hardwareConcurrency || undefined,
    },
    timing: {
      clientTimestamp: new Date().toISOString(),
      clientTimezone: timezone,
      pageLoadDurationMs,
      domInteractiveMs,
    },
    clientGeneratedId,
  };
}
