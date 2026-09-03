"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Activity, Terminal, BookOpen, CheckSquare, ShieldAlert, Cpu } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { name: "Lab Overview", href: "/", icon: ShieldCheck },
  { name: "Consent Demo", href: "/consent", icon: Cpu },
  { name: "SOC Dashboard", href: "/dashboard", icon: Activity },
  { name: "Kali / Network Docs", href: "/docs", icon: Terminal },
  { name: "Student Exercise", href: "/exercise", icon: CheckSquare },
  { name: "Defenses", href: "/defenses", icon: ShieldAlert },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface-300/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tag */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-lg bg-surface-100 border border-border-highlight group-hover:border-cyber-blue transition-colors">
              <ShieldCheck className="w-5 h-5 text-cyber-blue" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-100 tracking-tight text-base group-hover:text-cyber-blue transition-colors">
                  Cyber Telemetry Lab
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/30 font-medium">
                  Authorized
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Security Awareness & Network Telemetry
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? "bg-surface-100 text-cyber-blue border border-border-highlight shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-surface-200"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyber-blue" : "text-slate-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mode Indicator & Action */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400 bg-surface-100 px-2.5 py-1 rounded-full border border-border-subtle">
              <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-pulse-slow" />
              <span>LAB_MODE: ACTIVE</span>
            </div>

            <Link
              href="/consent"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-900 bg-cyber-blue hover:bg-sky-300 rounded-md transition-colors shadow-sm"
            >
              Start Demo
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-surface-100 border border-border-subtle"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border-subtle bg-surface-200 px-4 pt-2 pb-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-surface-100 text-cyber-blue border border-border-highlight"
                    : "text-slate-300 hover:bg-surface-100"
                }`}
              >
                <Icon className="w-4 h-4 text-cyber-blue" />
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
