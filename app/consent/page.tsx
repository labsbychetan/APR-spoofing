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
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-50">
      
      {/* Breadcrumb & Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <Link href="/" className="hover:text-blue-600 font-medium">Lab Overview</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Consent &amp; Telemetry Dispatch</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Training Consent &amp; Dispatch Control
        </h1>
        <p className="text-sm text-slate-600">
          In ethical cybersecurity operations, consent and authorization are mandatory prerequisites before initiating technical telemetry recording.
        </p>
      </div>

      {/* State 1: Cancelled */}
      {isCancelled && (
        <div className="p-6 rounded-2xl bg-white border border-amber-300 space-y-4 shadow-card animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Telemetry Transmission Cancelled</h2>
              <p className="text-xs text-slate-500">No telemetry packets were transmitted to the training server.</p>
            </div>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            As per cybersecurity training protocol, without participant consent, zero network requests were made to the telemetry API endpoint.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Review Consent Again</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors"
            >
              Return to Overview
            </Link>
          </div>
        </div>
      )}

      {/* State 2: Successfully Submitted */}
      {submittedEvent && submittedEvent.success && (
        <div className="p-6 rounded-2xl bg-white border border-emerald-300 space-y-6 animate-fade-in shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Telemetry Successfully Dispatched &amp; Recorded
                </h2>
                <p className="text-xs text-slate-500">
                  Receipt ID: <span className="font-mono text-blue-700 font-semibold">{submittedEvent.id}</span>
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              HTTP 201 CREATED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 text-[11px] font-sans">API Endpoint:</span>
              <p className="text-slate-900 font-bold">POST /api/telemetry</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 text-[11px] font-sans">Server Timestamp:</span>
              <p className="text-slate-900 font-bold">{submittedEvent.timestamp}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs text-blue-900 leading-relaxed">
            <p>
              <strong>Next Step for Students &amp; Instructors:</strong> Open the <strong>SOC Dashboard</strong> to observe how this event was received, how headers were parsed, and how network observers categorize your browser footprint.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-md"
            >
              <Activity className="w-4 h-4" />
              <span>Inspect Event in SOC Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/exercise"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors"
            >
              <span>Proceed to Practical Exercise</span>
            </Link>

            <button
              onClick={handleConsentAndSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Send Another Sample Packet</span>
            </button>
          </div>
        </div>
      )}

      {/* State 3: Error during submission */}
      {submittedEvent && !submittedEvent.success && (
        <div className="p-5 rounded-2xl bg-white border border-rose-300 space-y-3 shadow-card">
          <div className="flex items-center gap-2 text-rose-700">
            <XCircle className="w-5 h-5" />
            <span className="font-bold text-sm">Transmission Error</span>
          </div>
          <p className="text-xs text-slate-600">{submittedEvent.error}</p>
          <button
            onClick={handleConsentAndSubmit}
            className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-xs text-slate-800 font-medium border border-slate-300 hover:bg-slate-200"
          >
            Retry Submission
          </button>
        </div>
      )}

      {/* Primary Consent Panel */}
      {!submittedEvent && !isCancelled && (
        <div className="space-y-6">
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-card space-y-6">
            
            {/* Header / Notice */}
            <div className="flex items-start gap-4 border-b border-slate-100 pb-6">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900">
                  Training Consent Notice
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  This page is part of an <strong>authorized cybersecurity training exercise</strong>. If you continue, the demonstration may record limited technical information such as browser type, operating system information, screen dimensions, language, timezone, timestamp, and request metadata.
                </p>
              </div>
            </div>

            {/* Strict Non-Collection Assurance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Authorized Telemetry Parameters</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Browser family &amp; version, OS category, display resolution, viewport size, system timezone, preferred language, touch support, and HTTP request headers.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Guaranteed Excluded / Protected Items</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Zero passwords, session cookies, auth tokens, contacts, files, camera/mic streams, GPS coordinates, IMEI/MAC addresses, clipboard data, or keystrokes.
                </p>
              </div>
            </div>

            {/* Pre-flight Technical Packet Inspector */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Pre-Flight Payload Inspection (Client-Side Preview)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRawJson(!showRawJson)}
                  className="text-[11px] font-mono font-medium text-blue-600 hover:underline"
                >
                  {showRawJson ? "Show Formatted View" : "Show Raw JSON"}
                </button>
              </div>

              {showRawJson ? (
                <pre className="p-3 rounded-xl bg-white text-[11px] font-mono text-slate-800 overflow-x-auto border border-slate-200 max-h-56">
                  {JSON.stringify(payloadPreview, null, 2)}
                </pre>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                  <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-soft">
                    <span className="text-slate-400 block text-[10px] font-sans font-semibold">BROWSER</span>
                    <span className="text-slate-900 font-bold truncate block">
                      {payloadPreview?.browser.family || "..."}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-soft">
                    <span className="text-slate-400 block text-[10px] font-sans font-semibold">OS</span>
                    <span className="text-slate-900 font-bold truncate block">
                      {payloadPreview?.browser.osFamily || "..."}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-soft">
                    <span className="text-slate-400 block text-[10px] font-sans font-semibold">SCREEN RES</span>
                    <span className="text-slate-900 font-bold truncate block">
                      {payloadPreview ? `${payloadPreview.display.screenWidth}x${payloadPreview.display.screenHeight}` : "..."}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-soft">
                    <span className="text-slate-400 block text-[10px] font-sans font-semibold">TIMEZONE</span>
                    <span className="text-slate-900 font-bold truncate block">
                      {payloadPreview?.browser.timezone || "..."}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Consent Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Session storage only • No tracking cookies deployed</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-1/2 sm:w-auto px-5 py-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors shadow-soft"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConsentAndSubmit}
                  disabled={isSubmitting}
                  className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Transmitting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>I Understand &amp; Start</span>
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
