"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Activity,
  Search,
  RefreshCw,
  Smartphone,
  Laptop,
  Globe,
  Clock,
  Shield,
  Trash2,
  Copy,
  Check,
  X,
  Cpu,
  Layers,
} from "lucide-react";
import { TelemetryRecord, TelemetryStats } from "@/lib/types/telemetry";
import { formatDate } from "@/lib/utils";

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
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50">
      
      {/* Top Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              SOC Telemetry Analyst Console
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Live instructor analysis stream. Inspect benign device telemetry, compare HTTP client headers, and evaluate request characteristics.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors shadow-soft ${
              autoRefresh
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
            <span>{autoRefresh ? "Live Polling Active" : "Polling Paused"}</span>
          </button>

          <button
            type="button"
            onClick={() => fetchEvents()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 shadow-soft"
            title="Refresh feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          {/* Synthetic injector for testing different profiles */}
          <div className="hidden sm:flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-soft">
            <span className="text-[10px] font-mono font-semibold text-slate-400 px-1.5">SIMULATE:</span>
            <button
              type="button"
              onClick={() => handleSimulateSyntheticEvent("mobile")}
              className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
            >
              + iOS Mobile
            </button>
            <button
              type="button"
              onClick={() => handleSimulateSyntheticEvent("desktop")}
              className="px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors"
            >
              + Linux Desktop
            </button>
          </div>

          <button
            type="button"
            onClick={handleClearData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shadow-soft"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Feed</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Total Events</span>
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold font-mono text-slate-900">{stats.totalEvents}</p>
            <span className="text-[10px] text-slate-400 block font-medium">Session buffer</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Mobile Devices</span>
              <Smartphone className="w-4 h-4 text-cyan-600" />
            </div>
            <p className="text-2xl font-extrabold font-mono text-cyan-700">{stats.mobileEvents}</p>
            <span className="text-[10px] text-slate-400 block font-medium">Touch / High-DPR</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Workstations</span>
              <Laptop className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-extrabold font-mono text-purple-700">{stats.desktopEvents}</p>
            <span className="text-[10px] text-slate-400 block font-medium">Desktop / Laptop</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Browsers</span>
              <Globe className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold font-mono text-slate-900">
              {Object.keys(stats.browserDistribution).length}
            </p>
            <span className="text-[10px] text-slate-400 block font-medium">Distinct families</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">OS Families</span>
              <Cpu className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-extrabold font-mono text-slate-900">
              {Object.keys(stats.osDistribution).length}
            </p>
            <span className="text-[10px] text-slate-400 block font-medium">Operating systems</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Recent (1h)</span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold font-mono text-slate-900">{stats.recentRequests}</p>
            <span className="text-[10px] text-slate-400 block font-medium">Activity velocity</span>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-soft">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events by IP, User-Agent, OS, Timezone, or Event ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={deviceFilter}
            onChange={(e) => setDeviceFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Devices</option>
            <option value="mobile">Mobile Only</option>
            <option value="desktop">Desktop Only</option>
            <option value="tablet">Tablet Only</option>
          </select>

          <select
            value={browserFilter}
            onChange={(e) => setBrowserFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-500"
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
            <span className="text-xs font-mono font-semibold text-slate-500">
              SHOWING {events.length} RECORDED EVENT{events.length === 1 ? "" : "S"}
            </span>
            <span className="text-[11px] text-slate-500">
              Click any event row to open SOC Inspector
            </span>
          </div>

          {events.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-dashed border-slate-300 space-y-3 shadow-soft">
              <Activity className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm text-slate-800 font-bold">No Telemetry Events Recorded</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No telemetry packets match your current filter. Run a consent demo or use the simulate button above.
              </p>
              <Link
                href="/consent"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                Trigger New Telemetry Event
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {events.map((evt) => {
                const isSelected = selectedEvent?.id === evt.id;
                const dev = evt.clientTelemetry.browser.deviceCategory;
                const isMobile = dev === "mobile";

                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? "bg-blue-50/50 border-blue-400 shadow-md ring-1 ring-blue-400"
                        : "bg-white hover:bg-slate-50/90 border-slate-200 shadow-soft"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-slate-500">{formatDate(evt.timestamp)}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-blue-700 font-bold">{evt.id}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                            isMobile
                              ? "bg-cyan-50 text-cyan-800 border-cyan-200"
                              : "bg-purple-50 text-purple-800 border-purple-200"
                          }`}
                        >
                          {dev.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                          {evt.clientTelemetry.browser.osFamily}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 text-xs font-mono">
                      <div className="min-w-0">
                        <span className="text-slate-400 text-[10px] block font-sans font-medium">BROWSER:</span>
                        <span className="text-slate-900 font-semibold truncate block">
                          {evt.clientTelemetry.browser.family}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <span className="text-slate-400 text-[10px] block font-sans font-medium">SCREEN / VIEWPORT:</span>
                        <span className="text-slate-700 truncate block">
                          {evt.clientTelemetry.display.screenWidth}x{evt.clientTelemetry.display.screenHeight} ({evt.clientTelemetry.display.viewportWidth}x{evt.clientTelemetry.display.viewportHeight})
                        </span>
                      </div>

                      <div className="min-w-0">
                        <span className="text-slate-400 text-[10px] block font-sans font-medium">TIMEZONE / LOCALE:</span>
                        <span className="text-slate-700 truncate block">
                          {evt.clientTelemetry.browser.timezone} ({evt.clientTelemetry.browser.language})
                        </span>
                      </div>

                      <div className="min-w-0">
                        <span className="text-slate-400 text-[10px] block font-sans font-medium">NETWORK PROXY IP:</span>
                        <span className="text-blue-700 font-bold truncate block">
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
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 space-y-5 sticky top-24 shadow-card">
            
            {/* Inspector Header */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-mono font-bold uppercase text-slate-800">
                    SOC Event Deep-Dive
                  </span>
                </div>
                <p className="text-xs font-mono font-bold text-blue-700">
                  {selectedEvent.id}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={copyEventJson}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs"
                  title="Copy JSON Record"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 border border-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Inspector Navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-100 pb-2">
              <button
                type="button"
                onClick={() => setDetailTab("overview")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  detailTab === "overview"
                    ? "bg-slate-100 text-blue-700 border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Summary
              </button>
              <button
                type="button"
                onClick={() => setDetailTab("browser")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  detailTab === "browser"
                    ? "bg-slate-100 text-blue-700 border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Client DOM
              </button>
              <button
                type="button"
                onClick={() => setDetailTab("server")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  detailTab === "server"
                    ? "bg-slate-100 text-blue-700 border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Server Headers
              </button>
              <button
                type="button"
                onClick={() => setDetailTab("json")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  detailTab === "json"
                    ? "bg-slate-100 text-blue-700 border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Raw JSON
              </button>
            </div>

            {/* Tab 1: Analysis Summary */}
            {detailTab === "overview" && (
              <div className="space-y-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-bold uppercase text-[11px]">SOC Assessment</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-sans text-xs">
                    {selectedEvent.analysis.identificationPotential}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-slate-600 text-[11px] block font-sans font-bold">
                    Telemetry Observations:
                  </span>
                  <ul className="space-y-1.5 text-slate-700 font-sans text-xs">
                    {selectedEvent.analysis.summaryPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold mt-0.5">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1 font-sans">
                  <span className="text-amber-900 font-bold text-[11px] block">
                    Important Analytical Caveat:
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    While these attributes reveal device capabilities, display metrics, and language preferences, they do NOT constitute identity or physical address.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Browser Telemetry */}
            {detailTab === "browser" && (
              <div className="space-y-3 text-xs font-mono max-h-96 overflow-y-auto pr-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] font-sans font-semibold">USER AGENT (DOM):</span>
                  <p className="text-slate-800 break-all text-[11px]">
                    {selectedEvent.clientTelemetry.browser.userAgent}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[10px] font-sans font-semibold">SCREEN DIMENSIONS:</span>
                    <p className="text-slate-900 font-bold">{selectedEvent.clientTelemetry.display.screenWidth} x {selectedEvent.clientTelemetry.display.screenHeight}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[10px] font-sans font-semibold">DEVICE PIXEL RATIO:</span>
                    <p className="text-slate-900 font-bold">{selectedEvent.clientTelemetry.display.devicePixelRatio}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[10px] font-sans font-semibold">TOUCH POINTS:</span>
                    <p className="text-slate-900 font-bold">{selectedEvent.clientTelemetry.capabilities.touchSupportPoints}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[10px] font-sans font-semibold">CPU CONCURRENCY:</span>
                    <p className="text-slate-900 font-bold">{selectedEvent.clientTelemetry.capabilities.hardwareConcurrency || "N/A"}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] font-sans font-semibold">PERFORMANCE TIMING:</span>
                  <p className="text-slate-700 text-[11px]">
                    Load: {selectedEvent.clientTelemetry.timing.pageLoadDurationMs ? `${selectedEvent.clientTelemetry.timing.pageLoadDurationMs}ms` : "N/A"} | DOM: {selectedEvent.clientTelemetry.timing.domInteractiveMs ? `${selectedEvent.clientTelemetry.timing.domInteractiveMs}ms` : "N/A"}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Server Request Metadata */}
            {detailTab === "server" && (
              <div className="space-y-3 text-xs font-mono max-h-96 overflow-y-auto pr-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] font-sans font-semibold">HTTP REQUEST LINE:</span>
                  <p className="text-blue-700 font-bold">
                    {selectedEvent.serverMetadata.httpMethod} {selectedEvent.serverMetadata.requestPath} ({selectedEvent.serverMetadata.protocol?.toUpperCase()})
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] font-sans font-semibold">ACCEPT-LANGUAGE:</span>
                  <p className="text-slate-700">{selectedEvent.serverMetadata.acceptLanguageHeader || "N/A"}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] font-sans font-semibold">SEC-CH-UA CLIENT HINTS:</span>
                  <p className="text-slate-700 break-all text-[11px]">{selectedEvent.serverMetadata.secChUa || "Not provided by browser"}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] font-sans font-semibold">FORWARDED FOR (PROXY/CDN):</span>
                  <p className="text-emerald-700 font-bold">{selectedEvent.serverMetadata.forwardedFor || selectedEvent.serverMetadata.realIp || "Direct Connection"}</p>
                </div>
              </div>
            )}

            {/* Tab 4: Raw JSON */}
            {detailTab === "json" && (
              <pre className="p-3.5 rounded-xl bg-slate-50 text-[11px] font-mono text-slate-800 overflow-x-auto border border-slate-200 max-h-96">
                {JSON.stringify(selectedEvent, null, 2)}
              </pre>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
