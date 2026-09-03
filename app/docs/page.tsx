"use client";

import Link from "next/link";
import {
  Terminal,
  Lock,
  Network,
  Server,
  Smartphone,
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
    <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-slate-50">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <Link href="/" className="hover:text-blue-600 font-medium">Lab Overview</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Network Telemetry Reference</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
            <Terminal className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kali Linux &amp; Network Telemetry Demonstration Guide
          </h1>
        </div>
        <p className="text-sm text-slate-600 max-w-3xl">
          Technical reference for cybersecurity instructors and students explaining the boundaries between Browser JavaScript, Server HTTP Headers, and Network Packet Capture.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("architecture")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-soft ${
            activeTab === "architecture"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
          }`}
        >
          1. Architecture Data Flow
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("comparison")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-soft ${
            activeTab === "comparison"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
          }`}
        >
          2. The 3 Telemetry Layers
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("tls")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-soft ${
            activeTab === "tls"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
          }`}
        >
          3. HTTPS &amp; TLS Encryption Mechanics
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("kali")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-soft ${
            activeTab === "kali"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
          }`}
        >
          4. Kali Linux / Wireshark Classroom Lab
        </button>
      </div>

      {/* Tab 1: Architecture Data Flow */}
      {activeTab === "architecture" && (
        <div className="space-y-8 animate-fade-in">
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-card space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Network className="w-5 h-5 text-blue-600" />
              <span>End-to-End Telemetry Architecture</span>
            </h2>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 overflow-x-auto space-y-4">
              <div className="text-center sm:text-left text-blue-700 font-bold">
                [DATA FLOW PIPELINE]
              </div>
              <pre className="text-slate-800 leading-relaxed font-bold">
                {ARCH_ASCII}
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900">1. Client-Side Collection Stage</h3>
                <p className="text-slate-600 leading-relaxed">
                  Upon explicit participant consent on <code className="text-blue-700 font-bold">/consent</code>, client JavaScript queries the Window, Screen, and Navigator APIs. Zero private files, keystrokes, or sensors are accessed.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900">2. Serverless Processing Stage</h3>
                <p className="text-slate-600 leading-relaxed">
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
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-card space-y-6">
            <h2 className="text-lg font-bold text-slate-900">
              Comparing The Three Observational Layers
            </h2>
            <p className="text-xs text-slate-600">
              A common confusion in web security is confusing what the browser application code can see vs what the web server sees vs what an intermediate network observer sees.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Layer 1: Browser Telemetry */}
              <div className="p-6 rounded-2xl bg-white border border-blue-200 shadow-soft space-y-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 w-fit border border-blue-100">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  1. Browser DOM Telemetry
                </h3>
                <p className="text-[11px] text-slate-500">
                  Voluntarily sent by client-side script in the webpage.
                </p>
                <ul className="text-xs space-y-1.5 text-slate-700 font-mono">
                  <li>• Screen resolution (width × height)</li>
                  <li>• Viewport inner dimensions</li>
                  <li>• Device Pixel Ratio (DPR)</li>
                  <li>• Client system timezone string</li>
                  <li>• Touch point hardware count</li>
                  <li>• Battery/Performance API timings</li>
                </ul>
              </div>

              {/* Layer 2: HTTP Request Metadata */}
              <div className="p-6 rounded-2xl bg-white border border-purple-200 shadow-soft space-y-3">
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 w-fit border border-purple-100">
                  <Server className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  2. HTTP Request Headers
                </h3>
                <p className="text-[11px] text-slate-500">
                  Transmitted automatically by HTTP client software with every request.
                </p>
                <ul className="text-xs space-y-1.5 text-slate-700 font-mono">
                  <li>• HTTP Method (GET, POST)</li>
                  <li>• User-Agent header</li>
                  <li>• Accept-Language preference</li>
                  <li>• Referer (source URL)</li>
                  <li>• Sec-CH-UA (Client Hints)</li>
                  <li>• Client Public IP / Proxy headers</li>
                </ul>
              </div>

              {/* Layer 3: Packet Capture */}
              <div className="p-6 rounded-2xl bg-white border border-emerald-200 shadow-soft space-y-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 w-fit border border-emerald-100">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  3. Network / Packet Capture
                </h3>
                <p className="text-[11px] text-slate-500">
                  Observed by Wireshark/tcpdump on physical/wireless link.
                </p>
                <ul className="text-xs space-y-1.5 text-slate-700 font-mono">
                  <li>• Source &amp; Dest MAC (Local segment)</li>
                  <li>• Source &amp; Dest IP addresses</li>
                  <li>• TCP Ports (e.g. 443 HTTPS)</li>
                  <li>• TLS Handshake &amp; SNI hostname</li>
                  <li>• Packet size, frequency &amp; timing</li>
                  <li className="text-rose-600 font-bold">✗ HTTP body is ENCRYPTED</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Tab 3: TLS Encryption Mechanics */}
      {activeTab === "tls" && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-card space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              <span>HTTPS &amp; TLS Transport Security Reality</span>
            </h2>

            <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-800 uppercase">
                Core Cryptographic Guarantee:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                HTTPS utilizes Transport Layer Security (TLS 1.2 / TLS 1.3). All HTTP headers, URL paths, query strings, cookies, and JSON telemetry payloads are encrypted in transit between the client device and the Vercel edge gateway.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <span className="text-emerald-800 font-bold">VISIBLE TO NETWORK SNIFFER:</span>
                <ul className="space-y-1 text-slate-700 font-sans">
                  <li>✓ Target IP address &amp; Port 443</li>
                  <li>✓ Destination Hostname (TLS SNI field)</li>
                  <li>✓ Packet transmission timestamp</li>
                  <li>✓ Byte length of encrypted packets</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
                <span className="text-rose-800 font-bold">PROTECTED / ENCRYPTED IN TRANSIT:</span>
                <ul className="space-y-1 text-slate-700 font-sans">
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
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-card space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-purple-600" />
              <span>Classroom Exercise: Authorized Packet Inspection via Kali Linux</span>
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed">
              Instructors can run an authorized packet capture on their local training interface while generating telemetry from a test mobile or laptop client:
            </p>

            {/* Terminal Command 1 */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800">
                1. Capture Port 443 Traffic with tcpdump on Kali:
              </span>
              <pre className="p-3.5 rounded-xl bg-slate-100 text-xs font-mono text-blue-950 font-semibold overflow-x-auto border border-slate-200 shadow-soft">
                {"sudo tcpdump -i eth0 -nn -s 0 -v 'tcp port 443' -w /tmp/telemetry_capture.pcap"}
              </pre>
            </div>

            {/* Terminal Command 2 */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800">
                2. Inspect TLS Handshake &amp; SNI with tshark:
              </span>
              <pre className="p-3.5 rounded-xl bg-slate-100 text-xs font-mono text-blue-950 font-semibold overflow-x-auto border border-slate-200 shadow-soft">
                {'tshark -r /tmp/telemetry_capture.pcap -Y "tls.handshake.type == 1" -T fields -e ip.src -e ip.dst -e tls.handshake.extensions_server_name'}
              </pre>
            </div>

            {/* Terminal Command 3 */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800">
                3. Observe HTTP Request Handshake via verbose curl:
              </span>
              <pre className="p-3.5 rounded-xl bg-slate-100 text-xs font-mono text-blue-950 font-semibold overflow-x-auto border border-slate-200 shadow-soft">
                {'curl -v -X POST https://your-lab.vercel.app/api/telemetry -H "Content-Type: application/json" -d \'{"consentGranted": true, "browser": {"family": "CurlCLI", "deviceCategory": "desktop"}, "display": {"screenWidth": 1920, "screenHeight": 1080, "viewportWidth": 1920, "viewportHeight": 1080, "devicePixelRatio": 1}}\''}
              </pre>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <span className="text-amber-900 font-bold">Instructor Discussion Prompt:</span>
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
