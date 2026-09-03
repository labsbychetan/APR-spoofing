"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Send,
  Eye,
  Terminal,
  Activity,
  RotateCcw,
  Lock,
} from "lucide-react";
import { collectClientTelemetry } from "@/lib/telemetry-collector";
import { ClientTelemetryPayload } from "@/lib/types/telemetry";

export default function ConsentPage() {
  const [payloadPreview, setPayloadPreview] = useState<ClientTelemetryPayload | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEvent, setSubmittedEvent] = useState<{
    success: boolean;
    id?: string;
    message?: string;
    error?: string;
    timestamp?: string;
  } | null>(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const preview = collectClientTelemetry();
        setPayloadPreview(preview);
      } catch (err) {
        console.error("Failed to collect preview telemetry:", err);
      }
    }
  }, []);

  const handleConsentAndSubmit = async () => {
    setIsSubmitting(true);
    setSubmittedEvent(null);

    try {
      const telemetryData = collectClientTelemetry();
      
      // Store consent token only for this browser session in sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("lab_consent_granted", "true");
        sessionStorage.setItem("lab_consent_timestamp", new Date().toISOString());
      }

      const response = await fetch("/api/telemetry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(telemetryData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmittedEvent({
          success: true,
          id: data.id,
          message: data.message,
          timestamp: data.timestamp || new Date().toISOString(),
        });
      } else {
        setSubmittedEvent({
          success: false,
          error: data.error || "Failed to submit telemetry payload",
        });
      }
    } catch (err) {
      setSubmittedEvent({
        success: false,
        error: "Network error transmitting telemetry to serverless endpoint.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsCancelled(true);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("lab_consent_granted");
    }
  };

  const handleReset = () => {
    setIsCancelled(false);
    setSubmittedEvent(null);
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Breadcrumb & Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/" className="hover:text-cyber-blue">Lab Overview</Link>
          <span>/</span>
          <span className="text-slate-200">Consent & Telemetry Dispatch</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          Training Consent & Dispatch Control
        </h1>
        <p className="text-sm text-slate-400">
          In ethical cybersecurity operations, consent and authorization are mandatory prerequisites before initiating technical telemetry recording.
        </p>
      </div>

      {/* State 1: Cancelled */}
      {isCancelled && (
        <div className="p-6 rounded-xl bg-surface-100 border border-cyber-amber/40 space-y-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-cyber-amber" />
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Telemetry Transmission Cancelled</h2>
              <p className="text-xs text-slate-400">No telemetry packets were transmitted to the training server.</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            As per cybersecurity training protocol, without participant consent, zero network requests were made to the telemetry API endpoint.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-cyber-blue text-slate-950 hover:bg-sky-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Review Consent Again</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-surface-50 text-slate-300 hover:bg-surface-200 border border-border-subtle transition-colors"
            >
              Return to Overview
            </Link>
          </div>
        </div>
      )}

      {/* State 2: Successfully Submitted */}
      {submittedEvent && submittedEvent.success && (
        <div className="p-6 rounded-xl bg-surface-100 border border-cyber-emerald/50 space-y-6 animate-fade-in shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-100">
                  Telemetry Successfully Dispatched & Recorded
                </h2>
                <p className="text-xs text-slate-400">
                  Receipt ID: <span className="font-mono text-cyber-cyan">{submittedEvent.id}</span>
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/30">
              HTTP 201 CREATED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 rounded-lg bg-surface-300 border border-border-subtle space-y-1">
              <span className="text-slate-500">API Endpoint:</span>
              <p className="text-slate-200">POST /api/telemetry</p>
            </div>
            <div className="p-3 rounded-lg bg-surface-300 border border-border-subtle space-y-1">
              <span className="text-slate-500">Server Timestamp:</span>
              <p className="text-slate-200">{submittedEvent.timestamp}</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-surface-200 border border-border-highlight space-y-2">
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Next Step for Students & Instructors:</strong> Open the <strong>SOC Dashboard</strong> to observe how this event was received, how headers were parsed, and how network observers categorize your browser footprint.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-cyber-emerald hover:bg-emerald-400 text-slate-950 transition-colors shadow-md"
            >
              <Activity className="w-4 h-4" />
              <span>Inspect Event in SOC Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/exercise"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium bg-surface-50 hover:bg-surface-200 text-slate-200 border border-border-subtle transition-colors"
            >
              <span>Proceed to Practical Exercise</span>
            </Link>

            <button
              onClick={handleConsentAndSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-surface-50 transition-colors ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Send Another Sample Packet</span>
            </button>
          </div>
        </div>
      )}

      {/* State 3: Error during submission */}
      {submittedEvent && !submittedEvent.success && (
        <div className="p-4 rounded-xl bg-surface-100 border border-cyber-rose/50 space-y-3">
          <div className="flex items-center gap-2 text-cyber-rose">
            <XCircle className="w-5 h-5" />
            <span className="font-semibold text-sm">Transmission Error</span>
          </div>
          <p className="text-xs text-slate-300">{submittedEvent.error}</p>
          <button
            onClick={handleConsentAndSubmit}
            className="px-3 py-1.5 rounded bg-surface-50 text-xs text-slate-200 border border-border-subtle hover:bg-surface-200"
          >
            Retry Submission
          </button>
        </div>
      )}

      {/* Primary Consent Panel */}
      {!submittedEvent && !isCancelled && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-surface-100 border border-border-highlight shadow-xl space-y-6">
            
            {/* Header / Notice */}
            <div className="flex items-start gap-4 border-b border-border-subtle pb-5">
              <div className="p-3 rounded-lg bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-100">
                  Training Consent Notice
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  This page is part of an <strong>authorized cybersecurity training exercise</strong>. If you continue, the demonstration may record limited technical information such as browser type, operating system information, screen dimensions, language, timezone, timestamp, and request metadata.
                </p>
              </div>
            </div>

            {/* Strict Non-Collection Assurance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-surface-300 border border-cyber-emerald/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyber-emerald">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorized Telemetry Parameters</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Browser family & version, OS category, display resolution, viewport size, system timezone, preferred language, touch support, and HTTP request headers.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-surface-300 border border-cyber-rose/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyber-rose">
                  <XCircle className="w-4 h-4" />
                  <span>Guaranteed Excluded / Protected Items</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Zero passwords, session cookies, auth tokens, contacts, files, camera/mic streams, GPS coordinates, IMEI/MAC addresses, clipboard data, or keystrokes.
                </p>
              </div>
            </div>

            {/* Pre-flight Technical Packet Inspector */}
            <div className="p-4 rounded-lg bg-surface-200 border border-border-subtle space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyber-blue" />
                  <span className="text-xs font-semibold text-slate-200">
                    Pre-Flight Payload Inspection (Client-Side Preview)
                  </span>
                </div>
                <button
                  onClick={() => setShowRawJson(!showRawJson)}
                  className="text-[11px] font-mono text-cyber-cyan hover:underline"
                >
                  {showRawJson ? "Show Formatted View" : "Show Raw JSON"}
                </button>
              </div>

              {showRawJson ? (
                <pre className="p-3 rounded bg-surface-300 text-[11px] font-mono text-slate-300 overflow-x-auto border border-border-subtle max-h-56">
                  {JSON.stringify(payloadPreview, null, 2)}
                </pre>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded bg-surface-300 border border-border-subtle">
                    <span className="text-slate-500 block text-[10px]">BROWSER</span>
                    <span className="text-slate-200 truncate block">
                      {payloadPreview?.browser.family || "..."}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-300 border border-border-subtle">
                    <span className="text-slate-500 block text-[10px]">OS</span>
                    <span className="text-slate-200 truncate block">
                      {payloadPreview?.browser.osFamily || "..."}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-300 border border-border-subtle">
                    <span className="text-slate-500 block text-[10px]">SCREEN RES</span>
                    <span className="text-slate-200 truncate block">
                      {payloadPreview ? `${payloadPreview.display.screenWidth}x${payloadPreview.display.screenHeight}` : "..."}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-surface-300 border border-border-subtle">
                    <span className="text-slate-500 block text-[10px]">TIMEZONE</span>
                    <span className="text-slate-200 truncate block">
                      {payloadPreview?.browser.timezone || "..."}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Consent Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border-subtle">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Lock className="w-3.5 h-3.5 text-cyber-emerald" />
                <span>Session storage only • No tracking cookies deployed</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-1/2 sm:w-auto px-5 py-2.5 rounded-lg text-xs font-semibold text-slate-300 bg-surface-50 hover:bg-surface-200 border border-border-highlight transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConsentAndSubmit}
                  disabled={isSubmitting}
                  className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold text-slate-950 bg-cyber-blue hover:bg-sky-300 transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Transmitting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>I Understand & Start</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
