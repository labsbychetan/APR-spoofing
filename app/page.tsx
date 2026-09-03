"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Terminal,
  Activity,
  CheckCircle2,
  XCircle,
  Eye,
  Lock,
  Server,
  Layers,
  HelpCircle,
  FileCode2,
} from "lucide-react";
import { parseUserAgentDetails } from "@/lib/telemetry-collector";

export default function LandingPage() {
  const [clientPreview, setClientPreview] = useState<{
    ua: string;
    family: string;
    os: string;
    device: string;
    screen: string;
    viewport: string;
    dpr: number;
    tz: string;
    lang: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = window.navigator.userAgent;
      const parsed = parseUserAgentDetails(ua);
      setClientPreview({
        ua,
        family: parsed.family,
        os: parsed.osFamily,
        device: parsed.deviceCategory,
        screen: `${window.screen.width} × ${window.screen.height}`,
        viewport: `${window.innerWidth} × ${window.innerHeight}`,
        dpr: window.devicePixelRatio || 1,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        lang: window.navigator.language || "en",
      });
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border-subtle bg-surface-300 py-16 lg:py-24 cyber-grid-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-100 border border-cyber-blue/30 text-cyber-blue text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse-slow" />
                <span>CYBER DEFENSE TRAINING MODULE</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-100">
                  Cyber Telemetry Lab
                </h1>
                <p className="text-lg sm:text-xl text-cyber-cyan/90 font-medium">
                  Authorized Security Awareness & Network Telemetry Demonstration
                </p>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl pt-2">
                  Understand how normal web requests, HTTP headers, and browser properties expose technical telemetry.
                  Learn how defenders analyze traffic in SOC environments and how to distinguish statistical device metadata from individual identity.
                </p>
              </div>

              {/* Notice Box */}
              <div className="p-3.5 rounded-lg bg-surface-100/90 border border-border-highlight text-xs text-slate-300 flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-cyber-amber shrink-0 mt-0.5" />
                <p className="leading-normal">
                  <strong className="text-slate-100">Authorized Educational Disclaimer:</strong> This demonstration collects limited technical telemetry with the participant&apos;s explicit knowledge. Do not use this system against devices or users without authorization.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/consent"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-slate-950 bg-cyber-blue hover:bg-sky-300 transition-all shadow-lg shadow-cyber-blue/10"
                >
                  <span>Start Demonstration</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium text-slate-200 bg-surface-100 hover:bg-surface-50 border border-border-highlight transition-all"
                >
                  <Activity className="w-4 h-4 text-cyber-emerald" />
                  <span>SOC Dashboard</span>
                </Link>

                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 transition-all"
                >
                  <Terminal className="w-4 h-4 text-cyber-purple" />
                  <span>Kali / Wireshark Docs</span>
                </Link>
              </div>
            </div>

            {/* Hero Right: Live Browser Technical Snapshot */}
            <div className="lg:col-span-5">
              <div className="p-5 rounded-xl bg-surface-200/95 border border-border-highlight shadow-2xl backdrop-blur-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-cyber-blue" />
                    <span className="text-xs font-mono font-semibold uppercase text-slate-200">
                      Live Client Environment
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-50 text-slate-400 border border-border-subtle">
                    NOT YET TRANSMITTED
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  Below is the technical information currently exposed by your web browser JavaScript runtime before any packet is sent:
                </p>

                <div className="space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-surface-300 border border-border-subtle">
                    <span className="text-slate-500">Browser / OS:</span>
                    <span className="text-slate-200 font-medium">
                      {clientPreview ? `${clientPreview.family} (${clientPreview.os})` : "Detecting..."}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-surface-300 border border-border-subtle">
                    <span className="text-slate-500">Device Category:</span>
                    <span className="text-cyber-cyan uppercase font-semibold">
                      {clientPreview?.device || "detecting"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-surface-300 border border-border-subtle">
                    <span className="text-slate-500">Screen / Viewport:</span>
                    <span className="text-slate-300">
                      {clientPreview ? `${clientPreview.screen} (vp: ${clientPreview.viewport})` : "..."}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-surface-300 border border-border-subtle">
                    <span className="text-slate-500">Timezone / Locale:</span>
                    <span className="text-slate-300">
                      {clientPreview ? `${clientPreview.tz} | ${clientPreview.lang}` : "..."}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/consent"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded bg-surface-100 hover:bg-surface-50 border border-border-highlight text-xs font-semibold text-cyber-blue transition-colors"
                  >
                    Proceed to Consent & Transmission Test
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Comparison Matrix: What is Collected vs What is NOT Collected */}
      <section className="py-16 bg-surface-200 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
              Data Boundary & Privacy Architecture
            </h2>
            <p className="text-sm text-slate-400">
              A foundational cybersecurity principle is <strong>data minimization</strong>. Review what benign telemetry standard browsers reveal vs what is strictly protected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* What IS Collected */}
            <div className="p-6 rounded-xl bg-surface-100 border border-cyber-emerald/30 space-y-4">
              <div className="flex items-center gap-3 border-b border-border-subtle pb-3">
                <div className="p-2 rounded-lg bg-cyber-emerald/10 text-cyber-emerald">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 text-base">
                    What This Demonstration Collects
                  </h3>
                  <p className="text-xs text-slate-400">
                    Standard technical parameters exposed by HTTP & DOM APIs
                  </p>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyber-emerald font-bold">✓</span>
                  <span><strong>Browser & OS Family:</strong> User-Agent string, Edge/Chrome/Firefox/Safari family.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-emerald font-bold">✓</span>
                  <span><strong>Display Metrics:</strong> Screen resolution, window inner dimensions, device pixel ratio.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-emerald font-bold">✓</span>
                  <span><strong>Locale & Timezone:</strong> System timezone string (e.g. America/New_York) and preferred language.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-emerald font-bold">✓</span>
                  <span><strong>Browser Capabilities:</strong> JavaScript, cookies status, touch points count, online status.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-emerald font-bold">✓</span>
                  <span><strong>HTTP Request Headers:</strong> Method, Path, Accept-Language, Referer, server forwarding headers.</span>
                </li>
              </ul>
            </div>

            {/* What is NOT Collected */}
            <div className="p-6 rounded-xl bg-surface-100 border border-cyber-rose/30 space-y-4">
              <div className="flex items-center gap-3 border-b border-border-subtle pb-3">
                <div className="p-2 rounded-lg bg-cyber-rose/10 text-cyber-rose">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 text-base">
                    What Is Strictly NOT Collected
                  </h3>
                  <p className="text-xs text-slate-400">
                    Private user assets, identifiers, and prohibited payloads
                  </p>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyber-rose font-bold">✗</span>
                  <span><strong>No Passwords or Tokens:</strong> Zero authentication credentials or session keys.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-rose font-bold">✗</span>
                  <span><strong>No Keystrokes or Clipboard:</strong> No keylogging or clipboard listeners.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-rose font-bold">✗</span>
                  <span><strong>No Camera, Mic or Files:</strong> No media stream hardware access or file reading.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-rose font-bold">✗</span>
                  <span><strong>No GPS / Exact Location:</strong> No Geolocation API calls or physical coordinates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-rose font-bold">✗</span>
                  <span><strong>No Hardware IDs:</strong> No MAC address, IMEI, SIM, or persistent hardware identifiers.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Core Educational Pillars */}
      <section className="py-16 bg-surface-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-slate-100">
              Training Modules & Analysis Pathways
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Designed for classroom instruction, SOC analyst onboarding, and network fundamentals labs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Link
              href="/dashboard"
              className="p-6 rounded-xl bg-surface-100 border border-border-subtle hover:border-cyber-blue transition-all group space-y-3"
            >
              <div className="p-3 rounded-lg bg-cyber-blue/10 text-cyber-blue w-fit group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-100 group-hover:text-cyber-blue transition-colors">
                1. SOC Telemetry Collector
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Experience how a security operations analyst inspects incoming web telemetry, compares client-reported attributes against server headers, and detects anomalies.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyber-blue pt-2">
                Open SOC Interface <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/docs"
              className="p-6 rounded-xl bg-surface-100 border border-border-subtle hover:border-cyber-purple transition-all group space-y-3"
            >
              <div className="p-3 rounded-lg bg-cyber-purple/10 text-cyber-purple w-fit group-hover:scale-105 transition-transform">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-100 group-hover:text-cyber-purple transition-colors">
                2. Kali & Network Analysis
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Understand what an on-path network observer sees in Wireshark/tcpdump vs encrypted HTTPS traffic, and how TLS protects application payload data.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyber-purple pt-2">
                View Kali Architecture <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/exercise"
              className="p-6 rounded-xl bg-surface-100 border border-border-subtle hover:border-cyber-emerald transition-all group space-y-3"
            >
              <div className="p-3 rounded-lg bg-cyber-emerald/10 text-cyber-emerald w-fit group-hover:scale-105 transition-transform">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-100 group-hover:text-cyber-emerald transition-colors">
                3. Practical Student Quiz
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Answer guided questions analyzing telemetry payloads, evaluate the core question: <em>&ldquo;Does this telemetry identify the person?&rdquo;</em> and generate a report.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyber-emerald pt-2">
                Launch Student Exercise <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

          </div>
        </div>
      </section>
    </div>
  );
}
