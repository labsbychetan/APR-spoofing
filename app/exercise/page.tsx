"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckSquare,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Award,
  BookOpen,
  Layers,
  ChevronRight,
} from "lucide-react";
import { QuizQuestion } from "@/lib/types/telemetry";

const LAB_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: "browser",
    question: "1. How does a web server determine the visitor's Browser Family & Version?",
    description: "Scenario: A server logs an incoming request from Google Chrome 128 or Edge 130.",
    options: [
      {
        label: "Via the User-Agent header and Client Hints (Sec-CH-UA) sent by the HTTP client.",
        value: "A",
        isCorrect: true,
        explanation: "Correct! The browser automatically includes the 'User-Agent' string and modern Client Hints (Sec-CH-UA) in the HTTP request headers."
      },
      {
        label: "By scanning the client computer's Program Files folder.",
        value: "B",
        isCorrect: false,
        explanation: "Incorrect. The browser sandbox strictly prevents web pages from reading the local filesystem."
      },
      {
        label: "By querying the computer's BIOS serial number.",
        value: "C",
        isCorrect: false,
        explanation: "Incorrect. BIOS information is isolated from standard web browser runtimes."
      }
    ]
  },
  {
    id: 2,
    category: "browser",
    question: "2. How does the application determine the Operating System (e.g. Windows, Android, macOS)?",
    description: "Scenario: The SOC analyst observes 'Android 14' or 'Windows 11' in the event stream.",
    options: [
      {
        label: "The web application reads the OS kernel license key.",
        value: "A",
        isCorrect: false,
        explanation: "Incorrect. No operating system license or kernel internals are accessible to web applications."
      },
      {
        label: "Through the platform tokens present in the User-Agent string and Sec-CH-UA-Platform header.",
        value: "B",
        isCorrect: true,
        explanation: "Correct! Standard HTTP User-Agent strings contain OS architecture tokens (e.g., 'Windows NT 10.0', 'Android 14', 'Macintosh')."
      },
      {
        label: "By executing an unauthorized root shell on the device.",
        value: "C",
        isCorrect: false,
        explanation: "Incorrect. Web applications run in a non-privileged browser sandbox."
      }
    ]
  },
  {
    id: 3,
    category: "browser",
    question: "3. What distinguishes a Mobile device footprint from a Desktop in browser telemetry?",
    description: "Scenario: Comparing smartphone vs laptop event records.",
    options: [
      {
        label: "Mobile devices report multi-point touch support, higher Device Pixel Ratios (2.0-3.5+), and mobile User-Agent tokens.",
        value: "A",
        isCorrect: true,
        explanation: "Correct! High DPR displays, navigator.maxTouchPoints > 0, and viewport dimensions (e.g. 393x852) clearly distinguish mobile form factors."
      },
      {
        label: "Mobile devices transmit their cellular phone number to every website.",
        value: "B",
        isCorrect: false,
        explanation: "Incorrect. Web browsers never expose phone numbers or SIM credentials."
      },
      {
        label: "Desktop computers do not use HTTP headers.",
        value: "C",
        isCorrect: false,
        explanation: "Incorrect. Both mobile and desktop devices use identical HTTP/HTTPS protocols."
      }
    ]
  },
  {
    id: 4,
    category: "browser",
    question: "4. What is the difference between Screen Dimensions and Viewport Dimensions?",
    description: "Scenario: A monitor is 1920x1080, but the viewport is 1280x720.",
    options: [
      {
        label: "Screen dimensions represent the physical display resolution, while viewport is the browser window's inner rendering area.",
        value: "A",
        isCorrect: true,
        explanation: "Correct! window.screen.width/height is the hardware screen size, while window.innerWidth/innerHeight represents the active browser window."
      },
      {
        label: "They are completely identical and never differ.",
        value: "B",
        isCorrect: false,
        explanation: "Incorrect. A user can resize their browser window, open developer tools, or use multi-window layouts."
      }
    ]
  },
  {
    id: 5,
    category: "browser",
    question: "5. How does the web application observe Language Preferences?",
    description: "Scenario: The server observes 'en-US,en;q=0.9' or 'fr-FR'.",
    options: [
      {
        label: "Via navigator.language in JavaScript and the Accept-Language HTTP header.",
        value: "A",
        isCorrect: true,
        explanation: "Correct! Browsers send the Accept-Language header to assist in content localization."
      },
      {
        label: "By listening to the microphone for spoken audio.",
        value: "B",
        isCorrect: false,
        explanation: "Incorrect. Microphones require explicit browser permission prompts and are not used for language negotiation."
      }
    ]
  },
  {
    id: 6,
    category: "browser",
    question: "6. How is the client Timezone extracted?",
    description: "Scenario: 'America/New_York' or 'Asia/Kolkata' appears in the log.",
    options: [
      {
        label: "From the browser's Intl.DateTimeFormat API and Date.getTimezoneOffset().",
        value: "A",
        isCorrect: true,
        explanation: "Correct! The ECMAScript Internationalization API provides the client operating system's configured timezone."
      },
      {
        label: "By tracking satellite GPS signals.",
        value: "B",
        isCorrect: false,
        explanation: "Incorrect. Timezone is a system clock setting, not a GPS satellite lock."
      }
    ]
  },
  {
    id: 7,
    category: "server",
    question: "7. Which metadata is observed by the SERVER rather than the browser client script?",
    description: "Scenario: Distinguishing HTTP transport headers from DOM attributes.",
    options: [
      {
        label: "TCP Source IP, X-Forwarded-For proxy chain, and incoming HTTP request method/protocol.",
        value: "A",
        isCorrect: true,
        explanation: "Correct! The server socket and reverse proxy see the IP connection and protocol handshake directly."
      },
      {
        label: "The user's monitor refresh rate and GPU model.",
        value: "B",
        isCorrect: false,
        explanation: "Incorrect. Monitor refresh rate and GPU attributes are client-side rendering details."
      }
    ]
  },
  {
    id: 8,
    category: "browser",
    question: "8. Which telemetry attributes are voluntarily supplied by client JavaScript?",
    description: "Scenario: Code executed in the browser sandbox.",
    options: [
      {
        label: "Screen dimensions, DPR, touch capabilities, and Navigation Timing (DOM interactive / page load duration).",
        value: "A",
        isCorrect: true,
        explanation: "Correct! These properties are retrieved via standard Web APIs (window.screen, performance.getEntriesByType) and posted to the backend."
      },
      {
        label: "The ISP's physical fiber optic router address.",
        value: "B",
        isCorrect: false,
        explanation: "Incorrect. ISP infrastructure routing is external to client JavaScript."
      }
    ]
  },
  {
    id: 9,
    category: "security",
    question: "9. Which of the following information can a normal webpage NEVER access?",
    description: "Scenario: Reviewing the browser security sandbox boundaries.",
    options: [
      {
        label: "Hardware MAC address, local file contents, stored passwords, keystrokes on other tabs, and silent camera feeds.",
        value: "A",
        isCorrect: true,
        explanation: "Correct! The browser security model (Same-Origin Policy, sandboxing, and permissions model) strictly prohibits access to hardware MAC, files, and unauthorized peripherals."
      },
      {
        label: "Browser name and operating system family.",
        value: "B",
        isCorrect: false,
        explanation: "Incorrect. Standard User-Agent headers routinely reveal browser and OS family."
      }
    ]
  },
  {
    id: 10,
    category: "privacy",
    question: "10. CRITICAL QUESTION: Does this technical telemetry prove a specific person's identity?",
    description: "Scenario: An analyst sees Chrome 128 on Windows 11 with 1920x1080 resolution in New York.",
    options: [
      {
        label: "NO. Technical telemetry represents device and software characteristics shared by millions of users; it does NOT equate to personal identity or exact physical location.",
        value: "A",
        isCorrect: true,
        explanation: "CORRECT & ESSENTIAL LESSON: Technical telemetry provides statistical and diagnostic clues (e.g. device category, browser version, general region), but should NEVER be treated as conclusive proof of human identity."
      },
      {
        label: "YES. Having a 1080p screen and Chrome proves exactly which human is sitting at the keyboard.",
        value: "B",
        isCorrect: false,
        explanation: "INCORRECT! Millions of devices share identical screen resolutions, browser versions, and OS configurations. Conflating statistical technical telemetry with personal identity is a critical analytical fallacy."
      }
    ]
  }
];

export default function StudentExercisePage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectOption = (questionId: number, value: string) => {
    if (showResults) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    let score = 0;
    LAB_QUESTIONS.forEach((q) => {
      const selected = answers[q.id];
      const correctOption = q.options.find((o) => o.isCorrect);
      if (selected === correctOption?.value) {
        score += 1;
      }
    });
    return score;
  };

  const score = calculateScore();
  const allAnswered = Object.keys(answers).length === LAB_QUESTIONS.length;

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-2 border-b border-border-subtle pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/" className="hover:text-cyber-blue">Lab Overview</Link>
          <span>/</span>
          <span className="text-slate-200">Student Exercise</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/30">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Practical Exercise: Web Telemetry Analysis
          </h1>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          <strong>Scenario:</strong> A security operations team wants to analyze what technical information a web application can observe during a training session, and where the boundaries of privacy lie.
        </p>
      </div>

      {/* Score Summary Card (When submitted) */}
      {showResults && (
        <div className="p-6 rounded-xl bg-surface-100 border border-cyber-emerald/40 space-y-5 shadow-2xl animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/30">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-100">
                  Lab Assessment Score: {score} / {LAB_QUESTIONS.length}
                </h2>
                <p className="text-xs text-slate-400">
                  {score === 10
                    ? "Exemplary understanding of web telemetry and privacy boundaries."
                    : "Good effort! Review the detailed explanations below to reinforce key cybersecurity concepts."}
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-surface-50 text-slate-200 hover:bg-surface-200 border border-border-subtle"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Exercise</span>
            </button>
          </div>

          {/* Key Takeaway Box */}
          <div className="p-4 rounded-lg bg-surface-200 border border-cyber-blue/30 space-y-2">
            <div className="flex items-center gap-2 text-cyber-blue text-xs font-bold uppercase font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Core Lesson Takeaway</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Technical telemetry can provide useful diagnostic and forensic clues, but individual fields should not automatically be interpreted as a person&apos;s identity or physical location.</strong>
            </p>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-8">
        {LAB_QUESTIONS.map((q) => {
          const selectedValue = answers[q.id];
          const isCorrect = q.options.find((o) => o.value === selectedValue)?.isCorrect;

          return (
            <div
              key={q.id}
              className={`p-6 rounded-xl border space-y-4 transition-all ${
                showResults
                  ? isCorrect
                    ? "bg-surface-100 border-cyber-emerald/40"
                    : "bg-surface-100 border-cyber-rose/40"
                  : "bg-surface-100 border-border-subtle hover:border-border-highlight"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-cyber-cyan font-semibold">
                    CATEGORY: {q.category.toUpperCase()}
                  </span>
                  {showResults && (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded font-mono ${
                        isCorrect
                          ? "bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/30"
                          : "bg-cyber-rose/10 text-cyber-rose border border-cyber-rose/30"
                      }`}
                    >
                      {isCorrect ? "CORRECT" : "INCORRECT"}
                    </span>
                  )}
                </div>
                <h2 className="text-base font-bold text-slate-100">{q.question}</h2>
                <p className="text-xs text-slate-400">{q.description}</p>
              </div>

              {/* Options */}
              <div className="space-y-2 pt-1">
                {q.options.map((opt) => {
                  const isOptionSelected = selectedValue === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={showResults}
                      onClick={() => handleSelectOption(q.id, opt.value)}
                      className={`w-full text-left p-3.5 rounded-lg border text-xs leading-relaxed transition-all flex items-start gap-3 ${
                        isOptionSelected
                          ? "bg-surface-50 border-cyber-blue text-slate-100 shadow-sm"
                          : "bg-surface-200 border-border-subtle text-slate-300 hover:bg-surface-50/60"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] shrink-0 border ${
                          isOptionSelected
                            ? "bg-cyber-blue text-slate-950 border-cyber-blue font-bold"
                            : "bg-surface-300 text-slate-400 border-border-subtle"
                        }`}
                      >
                        {opt.value}
                      </span>
                      <span className="flex-1">{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation (Shown upon submission) */}
              {showResults && (
                <div className="p-3.5 rounded-lg bg-surface-300 border border-border-subtle space-y-1 text-xs">
                  <span className="text-[11px] font-mono text-slate-400 font-semibold block">
                    ANALYTICAL EXPLANATION:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {q.options.find((o) => o.value === selectedValue)?.explanation ||
                      q.options.find((o) => o.isCorrect)?.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Submit Action */}
      {!showResults && (
        <div className="p-6 rounded-xl bg-surface-100 border border-border-highlight flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-200">
              Answered: {Object.keys(answers).length} / {LAB_QUESTIONS.length} Questions
            </p>
            <p className="text-[11px] text-slate-400">
              Complete all questions to grade your laboratory analysis.
            </p>
          </div>

          <button
            type="button"
            disabled={!allAnswered}
            onClick={() => setShowResults(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold bg-cyber-blue hover:bg-sky-300 text-slate-950 disabled:opacity-50 transition-all shadow-md"
          >
            <span>Submit Lab Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Navigation to Defenses */}
      <div className="pt-4 flex items-center justify-between border-t border-border-subtle text-xs">
        <Link href="/dashboard" className="text-slate-400 hover:text-slate-200">
          ← Back to SOC Dashboard
        </Link>
        <Link
          href="/defenses"
          className="inline-flex items-center gap-1.5 font-semibold text-cyber-blue hover:underline"
        >
          <span>Continue to Defensive Hardening</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
