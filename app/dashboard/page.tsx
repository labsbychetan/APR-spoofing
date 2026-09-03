"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Activity,
  Search,
  Filter,
  RefreshCw,
  Smartphone,
  Laptop,
  Tablet,
  Globe,
  Clock,
  Shield,
  Trash2,
  ExternalLink,
  PlusCircle,
  Copy,
  Check,
  X,
  Server,
  Monitor,
  Cpu,
  Layers,
  Info,
} from "lucide-react";
import { TelemetryRecord, TelemetryStats } from "@/lib/types/telemetry";
import { formatDate, formatFullDate, truncate } from "@/lib/utils";

export default function SOCDashboardPage() {
  const [events, setEvents] = useState<TelemetryRecord[]>([]);
  const [stats, setStats] = useState<TelemetryStats | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TelemetryRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [browserFilter, setBrowserFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [copiedJson, setCopiedJson] = useState(false);
  const [detailTab, setDetailTab] = useState<"overview" | "browser" | "server" | "json">("overview");

  const fetchEvents = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (deviceFilter !== "all") params.set("device", deviceFilter);
      if (browserFilter !== "all") params.set("browser", browserFilter);

      const res = await fetch(`/api/events?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
        setStats(data.stats || null);
        // If an event is selected, keep it synced if possible
        if (selectedEvent) {
          const updated = (data.events as TelemetryRecord[]).find((e) => e.id === selectedEvent.id);
          if (updated) setSelectedEvent(updated);
        }
      }
    } catch (err) {
      console.error("Failed to load telemetry events:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, deviceFilter, browserFilter, selectedEvent]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Polling interval
  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => {
      fetchEvents();
    }, 4000);
    return () => clearInterval(timer);
  }, [autoRefresh, fetchEvents]);

  const handleClearData = async () => {
    if (confirm("Are you sure you want to clear all in-memory telemetry records from this training session?")) {
      try {
        await fetch("/api/events", { method: "DELETE" });
        setSelectedEvent(null);
        fetchEvents();
      } catch (err) {
        console.error("Failed to clear telemetry events:", err);
      }
    }
  };

  const handleSimulateSyntheticEvent = async (deviceType: "mobile" | "desktop") => {
    try {
      const mockPayload = {
        consentGranted: true,
        consentTimestamp: new Date().toISOString(),
        browser: deviceType === "mobile" ? {
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
          family: "Apple Safari",
          version: "17.5",
          osFamily: "Apple iOS",
          deviceCategory: "mobile" as const,
          language: "fr-FR",
          languages: ["fr-FR", "en-US"],
          timezone: "Europe/Paris",
        } : {
          userAgent: "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0",
          family: "Mozilla Firefox",
          version: "128.0",
          osFamily: "Linux",
          deviceCategory: "desktop" as const,
          language: "de-DE",
          languages: ["de-DE", "en"],
          timezone: "Europe/Berlin",
        },
        display: deviceType === "mobile" ? {
          screenWidth: 393,
          screenHeight: 852,
          devicePixelRatio: 3,
          viewportWidth: 393,
          viewportHeight: 720,
          colorDepth: 30,
        } : {
          screenWidth: 2560,
          screenHeight: 1440,
          devicePixelRatio: 1.25,
          viewportWidth: 2560,
          viewportHeight: 1320,
          colorDepth: 24,
        },
        capabilities: {
          javascriptEnabled: true,
          cookiesEnabled: true,
          onlineStatus: true,
          touchSupportPoints: deviceType === "mobile" ? 5 : 0,
          hardwareConcurrency: deviceType === "mobile" ? 6 : 12,
        },
        timing: {
          clientTimestamp: new Date().toISOString(),
          clientTimezone: deviceType === "mobile" ? "Europe/Paris" : "Europe/Berlin",
          pageLoadDurationMs: 380,
          domInteractiveMs: 160,
        },
        clientGeneratedId: "sim_" + Math.random().toString(36).substring(2, 8),
      };

      await fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockPayload),
      });

      fetchEvents();
    } catch (err) {
      console.error("Simulation failed:", err);
    }
  };

  const copyEventJson = () => {
    if (selectedEvent) {
      navigator.clipboard.writeText(JSON.stringify(selectedEvent, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-border-subtle pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/30">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              SOC Telemetry Analyst Console
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Live instructor analysis stream. Inspect benign device telemetry, compare HTTP client headers, and evaluate request characteristics.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              autoRefresh
                ? "bg-cyber-emerald/10 text-cyber-emerald border-cyber-emerald/30"
                : "bg-surface-100 text-slate-400 border-border-subtle hover:bg-surface-50"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? "bg-cyber-emerald animate-pulse" : "bg-slate-500"}`} />
            <span>{autoRefresh ? "Live Polling Active" : "Polling Paused"}</span>
          </button>

          <button
            onClick={() => fetchEvents()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-100 text-slate-300 hover:bg-surface-50 border border-border-subtle"
            title="Refresh feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          {/* Synthetic injector for testing different profiles */}
          <div className="hidden sm:flex items-center gap-1 bg-surface-100 p-1 rounded-lg border border-border-subtle">
            <span className="text-[10px] font-mono text-slate-500 px-1.5">SIMULATE:</span>
            <button
              onClick={() => handleSimulateSyntheticEvent("mobile")}
              className="px-2 py-0.5 rounded text-[11px] bg-surface-200 hover:bg-surface-50 text-cyber-blue border border-border-subtle"
            >
              + iOS Mobile
            </button>
            <button
              onClick={() => handleSimulateSyntheticEvent("desktop")}
              className="px-2 py-0.5 rounded text-[11px] bg-surface-200 hover:bg-surface-50 text-cyber-purple border border-border-subtle"
            >
              + Linux Desktop
            </button>
          </div>

          <button
            onClick={handleClearData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-cyber-rose bg-cyber-rose/10 hover:bg-cyber-rose/20 border border-cyber-rose/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Feed</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-xl bg-surface-100 border border-border-subtle space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs">Total Events</span>
              <Layers className="w-4 h-4 text-cyber-blue" />
            </div>
            <p className="text-2xl font-bold font-mono text-slate-100">{stats.totalEvents}</p>
            <span className="text-[10px] text-slate-500 block">Session buffer</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-100 border border-border-subtle space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs">Mobile Devices</span>
              <Smartphone className="w-4 h-4 text-cyber-cyan" />
            </div>
            <p className="text-2xl font-bold font-mono text-cyber-cyan">{stats.mobileEvents}</p>
            <span className="text-[10px] text-slate-500 block">Touch / High-DPR</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-100 border border-border-subtle space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs">Workstations</span>
              <Laptop className="w-4 h-4 text-cyber-purple" />
            </div>
            <p className="text-2xl font-bold font-mono text-cyber-purple">{stats.desktopEvents}</p>
            <span className="text-[10px] text-slate-500 block">Desktop / Laptop</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-100 border border-border-subtle space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs">Browsers</span>
              <Globe className="w-4 h-4 text-cyber-emerald" />
            </div>
            <p className="text-2xl font-bold font-mono text-slate-100">
              {Object.keys(stats.browserDistribution).length}
            </p>
            <span className="text-[10px] text-slate-500 block">Distinct families</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-100 border border-border-subtle space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs">OS Families</span>
              <Cpu className="w-4 h-4 text-cyber-amber" />
            </div>
            <p className="text-2xl font-bold font-mono text-slate-100">
              {Object.keys(stats.osDistribution).length}
            </p>
            <span className="text-[10px] text-slate-500 block">Operating systems</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-100 border border-border-subtle space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs">Recent (1h)</span>
              <Clock className="w-4 h-4 text-cyber-blue" />
            </div>
            <p className="text-2xl font-bold font-mono text-slate-100">{stats.recentRequests}</p>
            <span className="text-[10px] text-slate-500 block">Activity velocity</span>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-surface-100 p-3 rounded-xl border border-border-subtle">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events by IP, User-Agent, OS, Timezone, or Event ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-200 border border-border-subtle rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyber-blue"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={deviceFilter}
            onChange={(e) => setDeviceFilter(e.target.value)}
            className="bg-surface-200 border border-border-subtle rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyber-blue"
          >
            <option value="all">All Devices</option>
            <option value="mobile">Mobile Only</option>
            <option value="desktop">Desktop Only</option>
            <option value="tablet">Tablet Only</option>
          </select>

          <select
            value={browserFilter}
            onChange={(e) => setBrowserFilter(e.target.value)}
            className="bg-surface-200 border border-border-subtle rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyber-blue"
          >
            <option value="all">All Browsers</option>
            <option value="Chrome">Chrome</option>
            <option value="Edge">Edge</option>
            <option value="Safari">Safari</option>
            <option value="Firefox">Firefox</option>
            <option value="Opera">Opera</option>
          </select>
        </div>
      </div>

      {/* Main Events Grid + Event Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Main: Live Event Table / List */}
        <div className={`space-y-3 ${selectedEvent ? "lg:col-span-7" : "lg:col-span-12"}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">
              SHOWING {events.length} RECORDED EVENT{events.length === 1 ? "" : "S"}
            </span>
            <span className="text-[11px] text-slate-500">
              Click any event row to open SOC Inspector
            </span>
          </div>

          {events.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-surface-100 border border-dashed border-border-subtle space-y-3">
              <Activity className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-300 font-medium">No Telemetry Events Recorded</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No telemetry packets match your current filter. Run a consent demo or use the simulate button above.
              </p>
              <Link
                href="/consent"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-cyber-blue text-slate-950 hover:bg-sky-300"
              >
                Trigger New Telemetry Event
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {events.map((evt) => {
                const isSelected = selectedEvent?.id === evt.id;
                const dev = evt.clientTelemetry.browser.deviceCategory;
                const isMobile = dev === "mobile";

                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? "bg-surface-50 border-cyber-blue shadow-lg"
                        : "bg-surface-100 hover:bg-surface-50/80 border-border-subtle"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-slate-400">{formatDate(evt.timestamp)}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-cyber-blue font-semibold">{evt.id}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold border ${
                            isMobile
                              ? "bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/30"
                              : "bg-cyber-purple/10 text-cyber-purple border-cyber-purple/30"
                          }`}
                        >
                          {dev.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-200 text-slate-300 border border-border-subtle">
                          {evt.clientTelemetry.browser.osFamily}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 text-[10px] block">BROWSER:</span>
                        <span className="text-slate-200 truncate block">
                          {evt.clientTelemetry.browser.family}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 text-[10px] block">SCREEN / VIEWPORT:</span>
                        <span className="text-slate-300 truncate block">
                          {evt.clientTelemetry.display.screenWidth}x{evt.clientTelemetry.display.screenHeight} ({evt.clientTelemetry.display.viewportWidth}x{evt.clientTelemetry.display.viewportHeight})
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 text-[10px] block">TIMEZONE / LOCALE:</span>
                        <span className="text-slate-300 truncate block">
                          {evt.clientTelemetry.browser.timezone} ({evt.clientTelemetry.browser.language})
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 text-[10px] block">NETWORK PROXY IP:</span>
                        <span className="text-cyber-cyan truncate block">
                          {evt.serverMetadata.forwardedFor || evt.serverMetadata.realIp || "Direct"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Event Inspector Panel */}
        {selectedEvent && (
          <div className="lg:col-span-5 p-5 rounded-xl bg-surface-100 border border-border-highlight space-y-5 sticky top-24 shadow-2xl">
            
            {/* Inspector Header */}
            <div className="flex items-start justify-between gap-2 border-b border-border-subtle pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyber-blue" />
                  <span className="text-xs font-mono font-bold uppercase text-slate-200">
                    SOC Event Deep-Dive
                  </span>
                </div>
                <p className="text-xs font-mono text-cyber-blue">
                  {selectedEvent.id}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={copyEventJson}
                  className="p-1.5 rounded bg-surface-200 hover:bg-surface-50 text-slate-300 border border-border-subtle text-xs"
                  title="Copy JSON Record"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-cyber-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-1.5 rounded bg-surface-200 hover:bg-surface-50 text-slate-400 hover:text-slate-200 border border-border-subtle"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Inspector Navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-border-subtle pb-2">
              <button
                onClick={() => setDetailTab("overview")}
                className={`px-2.5 py-1 rounded text-xs font-medium ${
                  detailTab === "overview"
                    ? "bg-surface-200 text-cyber-blue border border-border-highlight"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => setDetailTab("browser")}
                className={`px-2.5 py-1 rounded text-xs font-medium ${
                  detailTab === "browser"
                    ? "bg-surface-200 text-cyber-blue border border-border-highlight"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Client DOM
              </button>
              <button
                onClick={() => setDetailTab("server")}
                className={`px-2.5 py-1 rounded text-xs font-medium ${
                  detailTab === "server"
                    ? "bg-surface-200 text-cyber-blue border border-border-highlight"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Server Headers
              </button>
              <button
                onClick={() => setDetailTab("json")}
                className={`px-2.5 py-1 rounded text-xs font-medium ${
                  detailTab === "json"
                    ? "bg-surface-200 text-cyber-blue border border-border-highlight"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Raw JSON
              </button>
            </div>

            {/* Tab 1: Analysis Summary */}
            {detailTab === "overview" && (
              <div className="space-y-4 text-xs font-mono">
                <div className="p-3 rounded-lg bg-surface-200 border border-border-subtle space-y-2">
                  <div className="flex items-center gap-2 text-cyber-emerald">
                    <Shield className="w-3.5 h-3.5" />
                    <span className="font-semibold uppercase text-[11px]">SOC Assessment</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans text-xs">
                    {selectedEvent.analysis.identificationPotential}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-slate-400 text-[11px] block font-sans font-semibold">
                    Telemetry Observations:
                  </span>
                  <ul className="space-y-1.5 text-slate-300 font-sans text-xs">
                    {selectedEvent.analysis.summaryPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyber-blue mt-0.5">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-surface-300 border border-cyber-amber/30 space-y-1 font-sans">
                  <span className="text-cyber-amber font-semibold text-[11px] block">
                    Important Analytical Caveat:
                  </span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    While these attributes reveal device capabilities, display metrics, and language preferences, they do NOT constitute identity or physical address.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Browser Telemetry */}
            {detailTab === "browser" && (
              <div className="space-y-3 text-xs font-mono max-h-96 overflow-y-auto pr-1">
                <div className="p-2.5 rounded bg-surface-200 border border-border-subtle space-y-1">
                  <span className="text-slate-500 text-[10px]">USER AGENT (DOM):</span>
                  <p className="text-slate-300 break-all text-[11px]">
                    {selectedEvent.clientTelemetry.browser.userAgent}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-surface-200 border border-border-subtle">
                    <span className="text-slate-500 text-[10px]">SCREEN DIMENSIONS:</span>
                    <p className="text-slate-200">{selectedEvent.clientTelemetry.display.screenWidth} x {selectedEvent.clientTelemetry.display.screenHeight}</p>
                  </div>
                  <div className="p-2 rounded bg-surface-200 border border-border-subtle">
                    <span className="text-slate-500 text-[10px]">DEVICE PIXEL RATIO:</span>
                    <p className="text-slate-200">{selectedEvent.clientTelemetry.display.devicePixelRatio}</p>
                  </div>
                  <div className="p-2 rounded bg-surface-200 border border-border-subtle">
                    <span className="text-slate-500 text-[10px]">TOUCH POINTS:</span>
                    <p className="text-slate-200">{selectedEvent.clientTelemetry.capabilities.touchSupportPoints}</p>
                  </div>
                  <div className="p-2 rounded bg-surface-200 border border-border-subtle">
                    <span className="text-slate-500 text-[10px]">CPU CONCURRENCY:</span>
                    <p className="text-slate-200">{selectedEvent.clientTelemetry.capabilities.hardwareConcurrency || "N/A"}</p>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-surface-200 border border-border-subtle space-y-1">
                  <span className="text-slate-500 text-[10px]">PERFORMANCE TIMING:</span>
                  <p className="text-slate-300 text-[11px]">
                    Load: {selectedEvent.clientTelemetry.timing.pageLoadDurationMs ? `${selectedEvent.clientTelemetry.timing.pageLoadDurationMs}ms` : "N/A"} | DOM: {selectedEvent.clientTelemetry.timing.domInteractiveMs ? `${selectedEvent.clientTelemetry.timing.domInteractiveMs}ms` : "N/A"}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Server Request Metadata */}
            {detailTab === "server" && (
              <div className="space-y-3 text-xs font-mono max-h-96 overflow-y-auto pr-1">
                <div className="p-2.5 rounded bg-surface-200 border border-border-subtle space-y-1">
                  <span className="text-slate-500 text-[10px]">HTTP REQUEST LINE:</span>
                  <p className="text-cyber-cyan font-semibold">
                    {selectedEvent.serverMetadata.httpMethod} {selectedEvent.serverMetadata.requestPath} ({selectedEvent.serverMetadata.protocol?.toUpperCase()})
                  </p>
                </div>

                <div className="p-2.5 rounded bg-surface-200 border border-border-subtle space-y-1">
                  <span className="text-slate-500 text-[10px]">ACCEPT-LANGUAGE:</span>
                  <p className="text-slate-300">{selectedEvent.serverMetadata.acceptLanguageHeader || "N/A"}</p>
                </div>

                <div className="p-2.5 rounded bg-surface-200 border border-border-subtle space-y-1">
                  <span className="text-slate-500 text-[10px]">SEC-CH-UA CLIENT HINTS:</span>
                  <p className="text-slate-300 break-all text-[11px]">{selectedEvent.serverMetadata.secChUa || "Not provided by browser"}</p>
                </div>

                <div className="p-2.5 rounded bg-surface-200 border border-border-subtle space-y-1">
                  <span className="text-slate-500 text-[10px]">FORWARDED FOR (PROXY/CDN):</span>
                  <p className="text-cyber-emerald">{selectedEvent.serverMetadata.forwardedFor || selectedEvent.serverMetadata.realIp || "Direct Connection"}</p>
                </div>
              </div>
            )}

            {/* Tab 4: Raw JSON */}
            {detailTab === "json" && (
              <pre className="p-3 rounded bg-surface-300 text-[11px] font-mono text-slate-300 overflow-x-auto border border-border-subtle max-h-96">
                {JSON.stringify(selectedEvent, null, 2)}
              </pre>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
