export interface BrowserDisplayMetrics {
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  viewportWidth: number;
  viewportHeight: number;
  colorDepth?: number;
}

export interface BrowserCapabilities {
  javascriptEnabled: boolean;
  cookiesEnabled: boolean;
  onlineStatus: boolean;
  touchSupportPoints: number;
  hardwareConcurrency?: number;
  deviceMemory?: number;
}

export interface ClientTimingInfo {
  clientTimestamp: string;
  clientTimezone: string;
  pageLoadDurationMs?: number;
  domInteractiveMs?: number;
}

export interface ClientTelemetryPayload {
  consentGranted: boolean;
  consentTimestamp: string;
  browser: {
    userAgent: string;
    family: string;
    version: string;
    osFamily: string;
    deviceCategory: "mobile" | "tablet" | "desktop" | "unknown";
    language: string;
    languages: string[];
    timezone: string;
  };
  display: BrowserDisplayMetrics;
  capabilities: BrowserCapabilities;
  timing: ClientTimingInfo;
  clientGeneratedId: string;
}

export interface ServerRequestMetadata {
  requestTimestamp: string;
  httpMethod: string;
  requestPath: string;
  userAgentHeader: string;
  acceptHeader?: string;
  acceptLanguageHeader?: string;
  acceptEncodingHeader?: string;
  refererHeader?: string;
  forwardedFor?: string;
  realIp?: string;
  secChUa?: string;
  secChUaMobile?: string;
  secChUaPlatform?: string;
  protocol?: string;
  host?: string;
}

export interface TelemetryRecord {
  id: string;
  timestamp: string;
  clientTelemetry: ClientTelemetryPayload;
  serverMetadata: ServerRequestMetadata;
  analysis: {
    sourceClassification: "Authorized Educational Telemetry";
    identificationPotential: "Low - Statistical & Technical Only (Non-PII)";
    riskAssessment: "Benign Technical Observation";
    summaryPoints: string[];
  };
}

export interface TelemetryStats {
  totalEvents: number;
  mobileEvents: number;
  desktopEvents: number;
  tabletEvents: number;
  browserDistribution: Record<string, number>;
  osDistribution: Record<string, number>;
  deviceDistribution: Record<string, number>;
  recentRequests: number;
  lastEventTimestamp: string | null;
}

export interface QuizQuestion {
  id: number;
  question: string;
  category: "browser" | "server" | "network" | "privacy" | "security";
  description: string;
  options: {
    label: string;
    value: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  criticalAnalysis?: string;
}
