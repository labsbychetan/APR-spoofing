"use client";

import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Eye,
  Sliders,
  Database,
  Server,
  Globe,
  ArrowRight,
} from "lucide-react";

export default function DefensesPage() {
  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 bg-slate-50">
      
      {/* Breadcrumb & Header */}
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <Link href="/" className="hover:text-blue-600 font-medium">Lab Overview</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Defensive Hardening</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Threat Analysis &amp; Defensive Hardening
          </h1>
        </div>
        <p className="text-sm text-slate-600">
          Understanding what adversaries could infer from browser telemetry and how security architects and software engineers reduce exposure.
        </p>
      </div>

      {/* Section 1: What Could an Attacker Learn? */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
            <Eye className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            1. What Could an Attacker Learn?
          </h2>
        </div>

        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-card space-y-6">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Consider a typical benign telemetry record collected from an unauthenticated visitor:
          </p>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 space-y-1 shadow-soft">
            <p><span className="text-slate-500 font-sans">Browser:</span> <strong className="text-slate-900">Chrome 128.0</strong></p>
            <p><span className="text-slate-500 font-sans">OS:</span> <strong className="text-slate-900">Android 14</strong></p>
            <p><span className="text-slate-500 font-sans">Device:</span> <strong className="text-blue-700">Mobile</strong></p>
            <p><span className="text-slate-500 font-sans">Language:</span> <strong className="text-slate-900">en-IN</strong></p>
            <p><span className="text-slate-500 font-sans">Timezone:</span> <strong className="text-slate-900">Asia/Kolkata</strong></p>
            <p><span className="text-slate-500 font-sans">Screen:</span> <strong className="text-slate-900">1080 × 2400</strong></p>
            <p><span className="text-slate-500 font-sans">Viewport:</span> <strong className="text-slate-900">412 × 915</strong></p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2">
            <span className="text-xs font-mono font-bold text-amber-900 uppercase">
              Key Cybersecurity Finding:
            </span>
            <blockquote className="text-xs text-amber-950 italic leading-relaxed">
              &ldquo;Technical telemetry can contribute to browser/device fingerprinting when combined with multiple entropy sources, but individual fields should not automatically be interpreted as a person&apos;s identity or physical location.&rdquo;
            </blockquote>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900">What It Reveals (Statistical Clues):</h3>
              <ul className="space-y-1.5 text-slate-600">
                <li>• General device category (e.g. handheld smartphone)</li>
                <li>• Approximate regional timezone alignment</li>
                <li>• Rendering engine capabilities for layout matching</li>
                <li>• Broad OS software version for patch level assessment</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900">What It NEVER Proves (Identity Limits):</h3>
              <ul className="space-y-1.5 text-slate-600">
                <li>✗ Does NOT prove who is holding the device</li>
                <li>✗ Does NOT give street-level GPS coordinates</li>
                <li>✗ Does NOT reveal account names, passwords, or emails</li>
                <li>✗ Does NOT access internal corporate networks or files</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How Defenders Reduce Exposure */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            2. How Defenders Reduce Exposure
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Defense 1: HTTPS & Transport Security */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-3">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
              <Lock className="w-4 h-4" />
              <h3>1. HTTPS &amp; HSTS Enforcement</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Encrypt all HTTP transport using TLS 1.3. Enforce Strict-Transport-Security (<code className="text-blue-700 font-mono font-bold">HSTS</code>) to prevent SSL stripping attacks and ensure payload privacy across intermediate network hops.
            </p>
          </div>

          {/* Defense 2: Content Security Policy (CSP) */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <h3>2. Strict Content Security Policy (CSP)</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Define explicit whitelist origins for script execution and network requests via <code className="text-emerald-700 font-mono font-bold">connect-src</code> and <code className="text-emerald-700 font-mono font-bold">script-src</code> headers to prevent unauthorized third-party exfiltration scripts.
            </p>
          </div>

          {/* Defense 3: Data Minimization & Consent */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-3">
            <div className="flex items-center gap-2 text-cyan-700 font-bold text-sm">
              <Sliders className="w-4 h-4" />
              <h3>3. Data Minimization &amp; Ephemeral Storage</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Only collect the minimal telemetry necessary for diagnostic health. Avoid building persistent cross-session behavioral profiles and enforce aggressive time-to-live (<code className="text-cyan-700 font-mono font-bold">TTL</code>) log retention rules.
            </p>
          </div>

          {/* Defense 4: Cookie Hardening */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-3">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
              <Database className="w-4 h-4" />
              <h3>4. SameSite &amp; Secure Cookie Flags</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Always set <code className="text-purple-700 font-mono font-bold">SameSite=Lax</code> or <code className="text-purple-700 font-mono font-bold">SameSite=Strict</code> alongside <code className="text-purple-700 font-mono font-bold">Secure</code> and <code className="text-purple-700 font-mono font-bold">HttpOnly</code> to prevent CSRF cross-origin leaks and unauthorized JavaScript cookie reading.
            </p>
          </div>

          {/* Defense 5: Rate Limiting */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-3">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
              <Server className="w-4 h-4" />
              <h3>5. API Rate Limiting &amp; Anomaly Detection</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Deploy sliding-window rate limiters at edge proxies to prevent telemetry flooding, brute force attacks, and automated scanning traffic.
            </p>
          </div>

          {/* Defense 6: Privacy-Preserving Analytics */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-3">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <Globe className="w-4 h-4" />
              <h3>6. Privacy-Preserving Analytics</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Respect client <code className="text-rose-700 font-mono font-bold">Sec-GPC</code> (Global Privacy Control) and <code className="text-rose-700 font-mono font-bold">DNT</code> headers. Use cookieless, aggregated page counters instead of invasive fingerprinting engines.
            </p>
          </div>

        </div>
      </section>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 transition-colors shadow-soft"
        >
          ← Return to SOC Dashboard
        </Link>
        <Link
          href="/exercise"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-md"
        >
          <span>Review Practical Exercise</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
