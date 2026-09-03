import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";

export const metadata: Metadata = {
  title: "Cyber Telemetry Lab | Authorized Security Awareness & Telemetry",
  description:
    "An authorized educational web telemetry training demonstration to teach students and defenders about browser telemetry, HTTP headers, and network visibility.",
  keywords: [
    "cybersecurity training",
    "web telemetry",
    "HTTP headers",
    "SOC analyst",
    "network security",
    "browser fingerprinting defense",
    "packet capture",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-background text-slate-900 flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900 font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
