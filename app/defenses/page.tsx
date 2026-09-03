"use client";

import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Eye,
  Sliders,
  Database,
  FileCheck,
  Server,
  Globe,
  ArrowRight,
  Terminal,
} from "lucide-react";

export default function DefensesPage() {
  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Breadcrumb & Header */}
      <div className="space-y-2 border-b border-border-subtle pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/" className="hover:text-cyber-blue">Lab Overview</Link>
          <span>/</span>
          <span className="text-slate-200">Defensive Hardening</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyber-amber/10 text-cyber-amber border border-cyber-amber/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Threat Analysis & Defensive Hardening
          </h1>
        </div>
        <p className="text-sm text-slate-400">
          Understanding what adversaries could infer from browser telemetry and how security architects and software engineers reduce exposure.
        </p>
      </div>

      {/* Section 1: What Could an Attacker Learn? */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded bg-cyber-rose/10 text-cyber-rose border border-cyber-rose/30">
            <Eye className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            1. What Could an Attacker Learn?
          </h2>
        </div>

        <div className="p-6 rounded-xl bg-surface-100 border border-border-highlight space-y-6">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Consider a typical benign telemetry record collected from an unauthenticated visitor:
          </p>

          <div className="p-4 rounded-lg bg-surface-300 border border-border-subtle font-mono text-xs text-slate-200 space-y-1">
            <p><span className="text-slate-500">Browser:</span> Chrome 128.0</p>
            <p><span className="text-slate-500">OS:</span> Android 14</p>
            <p><span className="text-slate-500">Device:</span> Mobile</p>
            <p><span className="text-slate-500">Language:</span> en-IN</p>
            <p><span className="text-slate-500">Timezone:</span> Asia/Kolkata</p>
            <p><span className="text-slate-500">Screen:</span> 1080 × 2400</p>
            <p><span className="text-slate-500">Viewport:</span> 412 × 915</p>
          </div>

          <div className="p-4 rounded-lg bg-surface-200 border border-cyber-amber/30 space-y-2">
            <span className="text-xs font-mono font-bold text-cyber-amber uppercase">
              Key Cybersecurity Finding:
            </span>
            <blockquote className="text-xs text-slate-200 italic leading-relaxed">
              &ldquo;Technical telemetry can contribute to browser/device fingerprinting when combined with multiple entropy sources, but individual fields should not automatically be interpreted as a person&apos;s identity or physical location.&rdquo;
            </blockquote>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-surface-200 border border-border-subtle space-y-2">
              <h3 className="font-semibold text-slate-200">What It Reveals (Statistical Clues):</h3>
              <ul className="space-y-1.5 text-slate-400">
                <li>• General device category (e.g. handheld smartphone)</li>
                <li>• Approximate regional timezone alignment</li>
                <li>• Rendering engine capabilities for layout matching</li>
                <li>• Broad OS software version for patch level assessment</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-surface-200 border border-border-subtle space-y-2">
              <h3 className="font-semibold text-slate-200">What It NEVER Proves (Identity Limits):</h3>
              <ul className="space-y-1.5 text-slate-400">
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
          <div className="p-1.5 rounded bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/30">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            2. How Defenders Reduce Exposure
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Defense 1: HTTPS & Transport Security */}
          <div className="p-5 rounded-xl bg-surface-100 border border-border-subtle space-y-3">
            <div className="flex items-center gap-2 text-cyber-blue font-semibold text-sm">
              <Lock className="w-4 h-4" />
              <h3>1. HTTPS & HSTS Enforcement</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Encrypt all HTTP transport using TLS 1.3. Enforce Strict-Transport-Security (<code className="text-cyber-cyan font-mono">HSTS</code>) to prevent SSL stripping attacks and ensure payload privacy across intermediate network hops.
            </p>
          </div>

          {/* Defense 2: Content Security Policy (CSP) */}
          <div className="p-5 rounded-xl bg-surface-100 border border-border-subtle space-y-3">
            <div className="flex items-center gap-2 text-cyber-emerald font-semibold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <h3>2. Strict Content Security Policy (CSP)</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Define explicit whitelist origins for script execution and network requests via <code className="text-cyber-cyan font-mono">connect-src</code> and <code className="text-cyber-cyan font-mono">script-src</code> headers to prevent unauthorized third-party exfiltration scripts.
            </p>
          </div>

          {/* Defense 3: Data Minimization & Consent */}
          <div className="p-5 rounded-xl bg-surface-100 border border-border-subtle space-y-3">
            <div className="flex items-center gap-2 text-cyber-cyan font-semibold text-sm">
              <Sliders className="w-4 h-4" />
              <h3>3. Data Minimization & Ephemeral Storage</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Only collect the minimal telemetry necessary for diagnostic health. Avoid building persistent cross-session behavioral profiles and enforce aggressive time-to-live (<code className="text-cyber-cyan font-mono">TTL</code>) log retention rules.
            </p>
          </div>

          {/* Defense 4: Cookie Hardening */}
          <div className="p-5 rounded-xl bg-surface-100 border border-border-subtle space-y-3">
            <div className="flex items-center gap-2 text-cyber-purple font-semibold text-sm">
              <Database className="w-4 h-4" />
              <h3>4. SameSite & Secure Cookie Flags</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Always set <code className="text-cyber-cyan font-mono">SameSite=Lax</code> or <code className="text-cyber-cyan font-mono">SameSite=Strict</code> alongside <code className="text-cyber-cyan font-mono">Secure</code> and <code className="text-cyber-cyan font-mono">HttpOnly</code> to prevent CSRF cross-origin leaks and unauthorized JavaScript cookie reading.
            </p>
          </div>

          {/* Defense 5: Rate Limiting */}
          <div className="p-5 rounded-xl bg-surface-100 border border-border-subtle space-y-3">
            <div className="flex items-center gap-2 text-cyber-amber font-semibold text-sm">
              <Server className="w-4 h-4" />
              <h3>5. API Rate Limiting & Anomaly Detection</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Deploy sliding-window rate limiters at edge proxies to prevent telemetry flooding, brute force attacks, and automated scanning traffic.
            </p>
          </div>

          {/* Defense 6: Privacy-Preserving Analytics */}
          <div className="p-5 rounded-xl bg-surface-100 border border-border-subtle space-y-3">
            <div className="flex items-center gap-2 text-cyber-rose font-semibold text-sm">
              <Globe className="w-4 h-4" />
              <h3>6. Privacy-Preserving Analytics</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Respect client <code className="text-cyber-cyan font-mono">Sec-GPC</code> (Global Privacy Control) and <code className="text-cyber-cyan font-mono">DNT</code> headers. Use cookieless, aggregated page counters instead of invasive fingerprinting engines.
            </p>
          </div>

        </div>
      </section>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-surface-100 hover:bg-surface-50 border border-border-highlight text-slate-200 transition-colors"
        >
          ← Return to SOC Dashboard
        </Link>
        <Link
          href="/exercise"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-cyber-blue hover:bg-sky-300 text-slate-950 transition-colors"
        >
          <span>Review Practical Exercise</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
