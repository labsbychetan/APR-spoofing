# Cyber Telemetry Lab

> **Authorized Security Awareness, Network Telemetry & Defensive Analysis Training Demonstration**

A production-grade, educational web application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**, designed for direct deployment on **Vercel** or local execution.

This lab teaches cybersecurity students and practitioners what technical information a standard web request and browser environment expose, how HTTP headers function, what SOC telemetry analysis looks like, and how defenders harden systems against excessive data exposure.

---

## 🛡️ Authorized Educational Demonstration Notice

> **This demonstration collects limited, benign technical telemetry strictly with the participant's knowledge and consent.**
> 
> It does **NOT** collect passwords, authentication tokens, cookies, contacts, files, camera/microphone streams, precise GPS coordinates, IMEI, MAC addresses, keystrokes, or clipboard contents. Do not deploy or use telemetry gathering mechanisms against systems or individuals without authorization.

---

## 🏛️ System Architecture

```text
+-----------------------+
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
+-----------------------+
```

---

## 🚀 Local Installation & Quick Start

### Prerequisites
- Node.js 18.17+ or 20+
- npm, yarn, or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## ☁️ Vercel Deployment Guide

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket).
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your `cyber-telemetry-lab` repository.
4. Framework preset will automatically detect **Next.js**.
5. (Optional) Configure environment variables from `.env.example`:
   - `RATE_LIMIT_MAX_REQUESTS`: `40`
   - `MAX_STORED_EVENTS`: `200`
6. Click **Deploy**.
7. Open your generated Vercel production URL (e.g. `https://your-lab.vercel.app`).

---

## 🎓 Classroom Setup & Instructor Walkthrough

Follow these steps for a live cybersecurity training module:

1. **Open the Training Page:**
   - Instructor shares the lab URL with students on their laptops and smartphones.
2. **Review Consent & Data Boundaries:**
   - Students navigate to `/consent` and inspect the pre-flight payload preview before transmission.
3. **Generate Telemetry Events:**
   - Students click **"I Understand & Start"**. The browser transmits standard technical parameters (`POST /api/telemetry`).
4. **Open the SOC Instructor Dashboard:**
   - Open `/dashboard` on the instructor projector.
   - Observe live incoming events from mobile and desktop devices.
5. **Inspect Event Details:**
   - Click on any event to open the deep-dive inspector.
   - Compare **Client DOM Telemetry** (screen dimensions, DPR, touch points) with **Server HTTP Headers** (`Accept-Language`, `User-Agent`, `x-forwarded-for`).
6. **Demonstrate Network Packet Capture (Kali Linux / Wireshark):**
   - In Kali Linux or Wireshark, capture traffic on port 443:
     ```bash
     sudo tcpdump -i eth0 -nn -v 'tcp port 443'
     ```
   - Show students that while packet length, IP addresses, and SNI domain are visible, **HTTPS encrypts the HTTP URL path, headers, and JSON body**.
7. **Complete the Practical Exercise:**
   - Students complete the 10-question guided quiz on `/exercise` and evaluate:
     > *"Does this telemetry identify the person?"*
8. **Discuss Defensive Hardening:**
   - Review defensive mitigations on `/defenses` (CSP, SameSite cookies, HTTPS, GPC/DNT, data minimization).

---

## 📊 Telemetry Parameters Summary

| Category | Telemetry Attribute | Source | Educational Purpose |
| :--- | :--- | :--- | :--- |
| **Browser** | User-Agent, Browser Family | DOM & HTTP Header | Teaches browser engine detection & client hints |
| **Platform** | OS Family (Android, Windows, macOS, Linux) | User-Agent | Demonstrates platform token analysis |
| **Device** | Device Category (Mobile/Desktop/Tablet) | Heuristics | Highlights touch support and form-factor clues |
| **Display** | Screen Width, Height, DPR, Viewport | DOM Window/Screen | Explains layout responsiveness vs fingerprinting |
| **Locale** | Timezone string, System Language | Intl API & Accept-Language | Illustrates regional locale negotiation |
| **Capabilities** | Cookies enabled, Touch Points, JS status | DOM Navigator API | Teaches runtime capability discovery |
| **Server** | Method, Path, Proxy Forwarding headers | HTTP Request | Teaches reverse-proxy and CDN header routing |

---

## 🔒 Security & Privacy Architecture

- **No Persistence of PII:** Telemetry is retained ephemerally in serverless in-memory buffers for live demonstration only.
- **Strict Size Bounds:** API routes enforce a 32KB payload ceiling to prevent flood abuse.
- **In-Memory Rate Limiting:** Sliding-window rate limiter prevents excessive submissions.
- **No Third-Party Trackers:** Zero advertising pixels, cookies, or external tracker scripts.
- **Session Data Wipe:** The dashboard provides a one-click session purge (`DELETE /api/events`).

---

## 📄 License
Educational & Authorized Cybersecurity Training Material.
