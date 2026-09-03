"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ShieldAlert,
  ArrowRight,
  Terminal,
  Activity,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { parseUserAgentDetails } from "@/lib/telemetry-collector";

export default function LandingPage() {
  const [clientPreview, setClientPreview] = useState<{
    family: string;
    os: string;
    device: string;
    screen: string;
    viewport: string;
    tz: string;
    lang: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = window.navigator.userAgent;
      const parsed = parseUserAgentDetails(ua);
      setClientPreview({
        family: parsed.family,
        os: parsed.osFamily,
        device: parsed.deviceCategory,
        screen: `${window.screen.width} × ${window.screen.height}`,
        viewport: `${window.innerWidth} × ${window.innerHeight}`,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        lang: window.navigator.language || "en",
      });
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/80 hero-ambient-bg py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                <span>Security Awareness &amp; Network Telemetry</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Cyber Telemetry Lab
                </h1>
                <p className="text-base sm:text-lg text-blue-700 font-semibold leading-normal">
                  Authorized Security Awareness &amp; Network Telemetry Demonstration
                </p>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                  Explore how standard web requests, HTTP headers, and browser environments expose technical telemetry. Learn how defenders analyze traffic in SOC environments and why statistical metadata does not equal identity.
                </p>
              </div>

              {/* Disclaimer Banner */}
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-amber-900 block">Authorized Educational Disclaimer</span>
                  <p className="text-slate-600 leading-relaxed">
                    This demonstration collects limited technical telemetry with participant consent. Do not deploy or use this system against devices or users without prior authorization.
                  </p>
                </div>
              </div>

              {/* Aligned Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/consent"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <span>Start Demonstration</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors shadow-soft"
                >
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>SOC Dashboard</span>
                </Link>

                <Link
                  href="/docs"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <Terminal className="w-4 h-4 text-slate-500" />
                  <span>Kali / Wireshark Docs</span>
                </Link>
              </div>

            </div>

            {/* Right Column: Live Browser Technical Snapshot Panel */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-white border border-slate-200 shadow-card overflow-hidden">
                
                <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Client Environment Preview
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white text-slate-500 border border-slate-200">
                    NOT YET TRANSMITTED
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Below is the technical information currently exposed by your web browser JavaScript runtime before any packet is sent:
                  </p>

                  <div className="divide-y divide-slate-100 rounded-xl border border-slate-200/90 bg-slate-50/40 overflow-hidden text-xs font-mono">
                    <div className="grid grid-cols-3 p-3 items-center">
                      <span className="text-slate-500 font-sans font-medium">Browser / OS</span>
                      <span className="col-span-2 text-slate-900 font-bold text-right truncate">
                        {clientPreview ? `${clientPreview.family} (${clientPreview.os})` : "Detecting..."}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 p-3 items-center">
                      <span className="text-slate-500 font-sans font-medium">Device Type</span>
                      <span className="col-span-2 text-blue-700 font-bold text-right uppercase">
                        {clientPreview?.device || "Detecting..."}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 p-3 items-center">
                      <span className="text-slate-500 font-sans font-medium">Screen &amp; Viewport</span>
                      <span className="col-span-2 text-slate-800 text-right truncate">
                        {clientPreview ? `${clientPreview.screen} (vp: ${clientPreview.viewport})` : "..."}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 p-3 items-center">
                      <span className="text-slate-500 font-sans font-medium">Timezone &amp; Locale</span>
                      <span className="col-span-2 text-slate-800 text-right truncate">
                        {clientPreview ? `${clientPreview.tz} • ${clientPreview.lang}` : "..."}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/consent"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200/90 text-xs font-semibold text-blue-700 transition-colors shadow-soft"
                  >
                    <span>Proceed to Consent &amp; Transmission Test</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Comparison Matrix: What is Collected vs What is NOT Collected */}
      <section className="py-14 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Data Boundary &amp; Privacy Architecture
            </h2>
            <p className="text-sm text-slate-600">
              A foundational cybersecurity principle is <strong>data minimization</strong>. Review what benign telemetry standard browsers reveal vs what is strictly protected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* What IS Collected */}
            <div className="p-6 rounded-2xl bg-white border border-emerald-200 shadow-card space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      What This Demonstration Collects
                    </h3>
                    <p className="text-xs text-slate-500">
                      Standard technical parameters exposed by HTTP &amp; DOM APIs
                    </p>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-slate-700 pt-4">
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-600 font-bold text-sm leading-none mt-0.5">✓</span>
                    <span><strong>Browser &amp; OS Family:</strong> User-Agent string, Edge/Chrome/Firefox/Safari family.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-600 font-bold text-sm leading-none mt-0.5">✓</span>
                    <span><strong>Display Metrics:</strong> Screen resolution, window inner dimensions, device pixel ratio.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-600 font-bold text-sm leading-none mt-0.5">✓</span>
                    <span><strong>Locale &amp; Timezone:</strong> System timezone string (e.g. America/New_York) and preferred language.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-600 font-bold text-sm leading-none mt-0.5">✓</span>
                    <span><strong>Browser Capabilities:</strong> JavaScript, cookies status, touch points count, online status.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-600 font-bold text-sm leading-none mt-0.5">✓</span>
                    <span><strong>HTTP Request Headers:</strong> Method, Path, Accept-Language, Referer, server forwarding headers.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* What is NOT Collected */}
            <div className="p-6 rounded-2xl bg-white border border-rose-200 shadow-card space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      What Is Strictly NOT Collected
                    </h3>
                    <p className="text-xs text-slate-500">
                      Private user assets, identifiers, and prohibited payloads
                    </p>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-slate-700 pt-4">
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-600 font-bold text-sm leading-none mt-0.5">✗</span>
                    <span><strong>No Passwords or Tokens:</strong> Zero authentication credentials or session keys.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-600 font-bold text-sm leading-none mt-0.5">✗</span>
                    <span><strong>No Keystrokes or Clipboard:</strong> No keylogging or clipboard listeners.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-600 font-bold text-sm leading-none mt-0.5">✗</span>
                    <span><strong>No Camera, Mic or Files:</strong> No media stream hardware access or file reading.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-600 font-bold text-sm leading-none mt-0.5">✗</span>
                    <span><strong>No GPS / Exact Location:</strong> No Geolocation API calls or physical coordinates.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-600 font-bold text-sm leading-none mt-0.5">✗</span>
                    <span><strong>No Hardware IDs:</strong> No MAC address, IMEI, SIM, or persistent hardware identifiers.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Educational Pillars */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Training Modules &amp; Analysis Pathways
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Designed for classroom instruction, SOC analyst onboarding, and network fundamentals labs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Link
              href="/dashboard"
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-card transition-all group space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 w-fit border border-blue-100">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  1. SOC Telemetry Collector
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Experience how a security operations analyst inspects incoming web telemetry, compares client-reported attributes against server headers, and detects anomalies.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 pt-2">
                Open SOC Interface <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/docs"
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-card transition-all group space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 w-fit border border-purple-100">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  2. Kali &amp; Network Analysis
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Understand what an on-path network observer sees in Wireshark/tcpdump vs encrypted HTTPS traffic, and how TLS protects application payload data.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 pt-2">
                View Kali Architecture <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/exercise"
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-card transition-all group space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 w-fit border border-emerald-100">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  3. Practical Student Quiz
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Answer guided questions analyzing telemetry payloads, evaluate the core question: <em>&ldquo;Does this telemetry identify the person?&rdquo;</em> and generate a report.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 pt-2">
                Launch Student Exercise <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

          </div>
        </div>
      </section>

    </div>
  );
}
