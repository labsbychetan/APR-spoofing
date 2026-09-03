import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs py-8 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Disclaimer Box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded bg-amber-100 text-amber-700 shrink-0 mt-0.5 border border-amber-200">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <p className="text-slate-900 font-semibold">
                Authorized Educational Training Platform
              </p>
              <p className="text-slate-600 text-xs leading-relaxed max-w-3xl">
                This demonstration collects limited technical telemetry strictly with participant consent.
                Do not deploy or use telemetry gathering mechanisms against systems or individuals without explicit prior authorization.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-mono font-medium text-slate-700 shadow-soft">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Ephemeral In-Memory Storage
            </span>
          </div>
        </div>

        {/* Footer Navigation & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2 text-slate-500 border-t border-slate-100">
          <p>
            © {new Date().getFullYear()} Cyber Telemetry Lab. Built for security awareness, defensive training, and protocol inspection.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-blue-600 font-medium transition-colors">
              Lab Overview
            </Link>
            <Link href="/consent" className="hover:text-blue-600 font-medium transition-colors">
              Consent Flow
            </Link>
            <Link href="/dashboard" className="hover:text-blue-600 font-medium transition-colors">
              SOC Dashboard
            </Link>
            <Link href="/docs" className="hover:text-blue-600 font-medium transition-colors">
              Network Docs
            </Link>
            <Link href="/defenses" className="hover:text-blue-600 font-medium transition-colors">
              Defensive Hardening
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
