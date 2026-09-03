"use client";

import Link from "next/link";
import {
  Terminal,
  ShieldCheck,
  Lock,
  Layers,
  Network,
  Server,
  Smartphone,
  Eye,
  ArrowRight,
  Code,
  FileText,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

type DocTab = "architecture" | "comparison" | "kali" | "tls";

const ARCH_ASCII = `+-----------------------+
|  Student Mobile Device |  (Exposes: Screen Res, DPR, UserAgent, Viewport, Timezone)
+-----------------------+
           |
           |  [ HTTPS / TLS 1.3 Tunnel (Encrypted Application Payload) ]
           v
+-----------------------+
|  Vercel Edge Gateway  |  (Terminates TLS, Adds X-Forwarded-For, Forwarded IP headers)
+-----------------------+
           |
           |  [ JSON POST /api/telemetry ]
           v
+-----------------------+
| Telemetry API Route   |  (Validates Schema, Enforces Size Limits, Strips PII)
+-----------------------+
           |
           |  [ Ephemeral In-Memory Store ]
           v
+-----------------------+
| Instructor SOC Console |  (Real-Time SOC Event Stream, Header & Display Inspector)
+-----------------------+`;

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<DocTab>("architecture");

  return (
    <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-2 border-b border-border-subtle pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/" className="hover:text-cyber-blue">Lab Overview</Link>
          <span>/</span>
          <span className="text-slate-200">Network Telemetry Reference</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/30">
            <Terminal className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Kali Linux &amp; Network Telemetry Demonstration Guide
          </h1>
        </div>
        <p className="text-sm text-slate-400 max-w-3xl">
          Technical reference for cybersecurity instructors and students explaining the boundaries between Browser JavaScript, Server HTTP Headers, and Network Packet Capture.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border-subtle pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("architecture")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "architecture"
              ? "bg-cyber-blue text-slate-950 shadow-md"
              : "bg-surface-100 text-slate-300 hover:bg-surface-50 border border-border-subtle"
          }`}
        >
          1. Architecture Data Flow
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("comparison")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "comparison"
              ? "bg-cyber-blue text-slate-950 shadow-md"
              : "bg-surface-100 text-slate-300 hover:bg-surface-50 border border-border-subtle"
          }`}
        >
          2. The 3 Telemetry Layers
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("tls")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "tls"
              ? "bg-cyber-blue text-slate-950 shadow-md"
              : "bg-surface-100 text-slate-300 hover:bg-surface-50 border border-border-subtle"
          }`}
        >
          3. HTTPS &amp; TLS Encryption Mechanics
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("kali")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "kali"
              ? "bg-cyber-blue text-slate-950 shadow-md"
              : "bg-surface-100 text-slate-300 hover:bg-surface-50 border border-border-subtle"
          }`}
        >
          4. Kali Linux / Wireshark Classroom Lab
        </button>
      </div>

      {/* Tab 1: Architecture Data Flow */}
      {activeTab === "architecture" && (
        <div className="space-y-8 animate-fade-in">
          <div className="p-6 rounded-xl bg-surface-100 border border-border-highlight space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Network className="w-5 h-5 text-cyber-blue" />
              <span>End-to-End Telemetry Architecture</span>
            </h2>

            <div className="p-5 rounded-lg bg-surface-300 border border-border-subtle font-mono text-xs text-slate-300 overflow-x-auto space-y-4">
              <div className="text-center sm:text-left text-cyber-cyan font-semibold">
                [DATA FLOW PIPELINE]
              </div>
              <pre className="text-slate-300 leading-relaxed">
                {ARCH_ASCII}
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-surface-200 border border-border-subtle space-y-2">
                <h3 className="font-semibold text-slate-200">1. Client-Side Collection Stage</h3>
                <p className="text-slate-400 leading-relaxed">
                  Upon explicit participant consent on <code className="text-cyber-cyan">/consent</code>, client JavaScript queries the Window, Screen, and Navigator APIs. Zero private files, keystrokes, or sensors are accessed.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-surface-200 border border-border-subtle space-y-2">
                <h3 className="font-semibold text-slate-200">2. Serverless Processing Stage</h3>
                <p className="text-slate-400 leading-relaxed">
                  The API parses incoming JSON, extracts standard HTTP headers provided by the HTTP request, and combines them into an educational security observation record.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: The 3 Telemetry Layers */}
      {activeTab === "comparison" && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-xl bg-surface-100 border border-border-highlight space-y-6">
            <h2 className="text-lg font-bold text-slate-100">
              Comparing The Three Observational Layers
            </h2>
            <p className="text-xs text-slate-400">
              A common confusion in web security is confusing what the browser application code can see vs what the web server sees vs what an intermediate network observer sees.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Layer 1: Browser Telemetry */}
              <div className="p-5 rounded-xl bg-surface-200 border border-cyber-blue/30 space-y-3">
                <div className="p-2 rounded-lg bg-cyber-blue/10 text-cyber-blue w-fit">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-100 text-sm">
                  1. Browser DOM Telemetry
                </h3>
                <p className="text-[11px] text-slate-400">
                  Voluntarily sent by client-side script in the webpage.
                </p>
                <ul className="text-xs space-y-1.5 text-slate-300 font-mono">
                  <li>• Screen resolution (width × height)</li>
                  <li>• Viewport inner dimensions</li>
                  <li>• Device Pixel Ratio (DPR)</li>
                  <li>• Client system timezone string</li>
                  <li>• Touch point hardware count</li>
                  <li>• Battery/Performance API timings</li>
                </ul>
              </div>

              {/* Layer 2: HTTP Request Metadata */}
              <div className="p-5 rounded-xl bg-surface-200 border border-cyber-purple/30 space-y-3">
                <div className="p-2 rounded-lg bg-cyber-purple/10 text-cyber-purple w-fit">
                  <Server className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-100 text-sm">
                  2. HTTP Request Headers
                </h3>
                <p className="text-[11px] text-slate-400">
                  Transmitted automatically by HTTP client software with every request.
                </p>
                <ul className="text-xs space-y-1.5 text-slate-300 font-mono">
                  <li>• HTTP Method (GET, POST)</li>
                  <li>• User-Agent header</li>
                  <li>• Accept-Language preference</li>
                  <li>• Referer (source URL)</li>
                  <li>• Sec-CH-UA (Client Hints)</li>
                  <li>• Client Public IP / Proxy headers</li>
                </ul>
              </div>

              {/* Layer 3: Packet Capture */}
              <div className="p-5 rounded-xl bg-surface-200 border border-cyber-emerald/30 space-y-3">
                <div className="p-2 rounded-lg bg-cyber-emerald/10 text-cyber-emerald w-fit">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-100 text-sm">
                  3. Network / Packet Capture
                </h3>
                <p className="text-[11px] text-slate-400">
                  Observed by Wireshark/tcpdump on physical/wireless link.
                </p>
                <ul className="text-xs space-y-1.5 text-slate-300 font-mono">
                  <li>• Source &amp; Dest MAC (Local segment)</li>
                  <li>• Source &amp; Dest IP addresses</li>
                  <li>• TCP Ports (e.g. 443 HTTPS)</li>
                  <li>• TLS Handshake &amp; SNI hostname</li>
                  <li>• Packet size, frequency &amp; timing</li>
                  <li className="text-cyber-rose font-bold">✗ HTTP body is ENCRYPTED</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Tab 3: TLS Encryption Mechanics */}
      {activeTab === "tls" && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-xl bg-surface-100 border border-border-highlight space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyber-emerald" />
              <span>HTTPS &amp; TLS Transport Security Reality</span>
            </h2>

            <div className="p-4 rounded-lg bg-surface-200 border border-cyber-emerald/30 space-y-2">
              <span className="text-xs font-mono font-bold text-cyber-emerald uppercase">
                Core Cryptographic Guarantee:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                HTTPS utilizes Transport Layer Security (TLS 1.2 / TLS 1.3). All HTTP headers, URL paths, query strings, cookies, and JSON telemetry payloads are encrypted in transit between the client device and the Vercel edge gateway.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-lg bg-surface-300 border border-cyber-emerald/20 space-y-2">
                <span className="text-cyber-emerald font-bold">VISIBLE TO NETWORK SNIFFER:</span>
                <ul className="space-y-1 text-slate-300">
                  <li>✓ Target IP address &amp; Port 443</li>
                  <li>✓ Destination Hostname (TLS SNI field)</li>
                  <li>✓ Packet transmission timestamp</li>
                  <li>✓ Byte length of encrypted packets</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-surface-300 border border-cyber-rose/20 space-y-2">
                <span className="text-cyber-rose font-bold">PROTECTED / ENCRYPTED IN TRANSIT:</span>
                <ul className="space-y-1 text-slate-300">
                  <li>✗ Complete URL path (e.g. /api/telemetry)</li>
                  <li>✗ HTTP Headers (User-Agent, Accept)</li>
                  <li>✗ Telemetry JSON payload content</li>
                  <li>✗ Cookies and session credentials</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Kali Linux Classroom Guide */}
      {activeTab === "kali" && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-xl bg-surface-100 border border-border-highlight space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyber-purple" />
              <span>Classroom Exercise: Authorized Packet Inspection via Kali Linux</span>
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              Instructors can run an authorized packet capture on their local training interface while generating telemetry from a test mobile or laptop client:
            </p>

            {/* Terminal Command 1 */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-200">
                1. Capture Port 443 Traffic with tcpdump on Kali:
              </span>
              <pre className="p-3 rounded-lg bg-surface-300 text-xs font-mono text-cyber-cyan overflow-x-auto border border-border-subtle">
                {"sudo tcpdump -i eth0 -nn -s 0 -v 'tcp port 443' -w /tmp/telemetry_capture.pcap"}
              </pre>
            </div>

            {/* Terminal Command 2 */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-200">
                2. Inspect TLS Handshake &amp; SNI with tshark:
              </span>
              <pre className="p-3 rounded-lg bg-surface-300 text-xs font-mono text-cyber-cyan overflow-x-auto border border-border-subtle">
                {'tshark -r /tmp/telemetry_capture.pcap -Y "tls.handshake.type == 1" -T fields -e ip.src -e ip.dst -e tls.handshake.extensions_server_name'}
              </pre>
            </div>

            {/* Terminal Command 3 */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-200">
                3. Observe HTTP Request Handshake via verbose curl:
              </span>
              <pre className="p-3 rounded-lg bg-surface-300 text-xs font-mono text-cyber-cyan overflow-x-auto border border-border-subtle">
                {'curl -v -X POST https://your-lab.vercel.app/api/telemetry -H "Content-Type: application/json" -d \'{"consentGranted": true, "browser": {"family": "CurlCLI", "deviceCategory": "desktop"}, "display": {"screenWidth": 1920, "screenHeight": 1080, "viewportWidth": 1920, "viewportHeight": 1080, "devicePixelRatio": 1}}\''}
              </pre>
            </div>

            <div className="p-4 rounded-lg bg-surface-200 border border-cyber-amber/30 text-xs text-slate-300 space-y-1">
              <span className="text-cyber-amber font-semibold">Instructor Discussion Prompt:</span>
              <p>
                Have students compare the raw Wireshark hex dump of the encrypted TLS Application Data packet with the parsed JSON event shown in the SOC Dashboard. Why is the payload readable in the dashboard but opaque in the pcap?
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
