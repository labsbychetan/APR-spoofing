import Link from "next/link";
import { ShieldAlert, Info, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-surface-300 text-slate-400 text-xs py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Disclaimer Box */}
        <div className="p-4 rounded-lg bg-surface-100/70 border border-border-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-cyber-amber shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-slate-200 font-medium">
                Authorized Educational Training Platform
              </p>
              <p className="text-slate-400 text-xs leading-relaxed max-w-3xl">
                This demonstration collects limited technical telemetry strictly with participant consent.
                Do not deploy or use telemetry gathering mechanisms against systems or individuals without explicit prior authorization.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-surface-50 border border-border-highlight text-[11px] font-mono text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald" />
              Ephemeral In-Memory Storage
            </span>
          </div>
        </div>

        {/* Footer Navigation & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2 text-slate-500">
          <p>
            © {new Date().getFullYear()} Cyber Telemetry Lab. Built for security awareness, defensive training, and protocol inspection.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">
              Lab Overview
            </Link>
            <Link href="/consent" className="hover:text-slate-300 transition-colors">
              Consent Flow
            </Link>
            <Link href="/dashboard" className="hover:text-slate-300 transition-colors">
              SOC Dashboard
            </Link>
            <Link href="/docs" className="hover:text-slate-300 transition-colors">
              Network Docs
            </Link>
            <Link href="/defenses" className="hover:text-slate-300 transition-colors">
              Defensive Hardening
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
