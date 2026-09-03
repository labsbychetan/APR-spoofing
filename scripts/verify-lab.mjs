// Automated Verification Script for Cyber Telemetry Lab
async function runTests() {
  const baseUrl = "http://localhost:3000";
  let passed = 0;
  let failed = 0;

  console.log("=== CYBER TELEMETRY LAB AUTOMATED VERIFICATION ===");

  // Helper
  const check = (testName, condition, detail = "") => {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} - ${detail}`);
      failed++;
    }
  };

  // 1. Check Landing Page HTML
  try {
    const res = await fetch(`${baseUrl}/`);
    const text = await res.text();
    check("Landing Page GET /", res.status === 200);
    check("Contains 'Cyber Telemetry Lab'", text.includes("Cyber Telemetry Lab"));
    check("Contains 'Authorized Security Awareness'", text.includes("Authorized Security Awareness"));
    check("Contains Disclaimer", text.includes("Authorized Educational Disclaimer"));
  } catch (err) {
    check("Landing Page GET /", false, err.message);
  }

  // 2. Check Consent Page HTML
  try {
    const res = await fetch(`${baseUrl}/consent`);
    const text = await res.text();
    check("Consent Page GET /consent", res.status === 200);
    check("Contains 'Training Consent Notice'", text.includes("Training Consent Notice"));
    check("Contains 'I Understand & Start'", text.includes("I Understand"));
  } catch (err) {
    check("Consent Page GET /consent", false, err.message);
  }

  // 3. Check Dashboard Page HTML
  try {
    const res = await fetch(`${baseUrl}/dashboard`);
    const text = await res.text();
    check("Dashboard Page GET /dashboard", res.status === 200);
    check("Contains 'SOC Telemetry Analyst Console'", text.includes("SOC Telemetry Analyst Console"));
  } catch (err) {
    check("Dashboard Page GET /dashboard", false, err.message);
  }

  // 4. Check Docs Page HTML
  try {
    const res = await fetch(`${baseUrl}/docs`);
    const text = await res.text();
    check("Docs Page GET /docs", res.status === 200);
    check("Contains 'Kali Linux & Network Telemetry'", text.includes("Kali Linux"));
    check("Contains 'HTTPS & TLS'", text.includes("HTTPS"));
  } catch (err) {
    check("Docs Page GET /docs", false, err.message);
  }

  // 5. Check Exercise Page HTML
  try {
    const res = await fetch(`${baseUrl}/exercise`);
    const text = await res.text();
    check("Exercise Page GET /exercise", res.status === 200);
    check("Contains 'Practical Exercise: Web Telemetry Analysis'", text.includes("Practical Exercise"));
    check("Contains Core Question 'Does this technical telemetry prove a specific person'", text.includes("identify the person") || text.includes("identity"));
  } catch (err) {
    check("Exercise Page GET /exercise", false, err.message);
  }

  // 6. Check Defenses Page HTML
  try {
    const res = await fetch(`${baseUrl}/defenses`);
    const text = await res.text();
    check("Defenses Page GET /defenses", res.status === 200);
    check("Contains 'What Could an Attacker Learn?'", text.includes("What Could an Attacker Learn"));
    check("Contains 'How Defenders Reduce Exposure'", text.includes("How Defenders Reduce Exposure"));
  } catch (err) {
    check("Defenses Page GET /defenses", false, err.message);
  }

  // 7. Test POST /api/telemetry (Valid Payload)
  let createdEventId = null;
  try {
    const payload = {
      consentGranted: true,
      consentTimestamp: new Date().toISOString(),
      browser: {
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0 Safari/537.36",
        family: "Google Chrome",
        version: "130.0.0.0",
        osFamily: "Windows 11",
        deviceCategory: "desktop",
        language: "en-US",
        languages: ["en-US", "en"],
        timezone: "America/New_York",
      },
      display: {
        screenWidth: 1920,
        screenHeight: 1080,
        devicePixelRatio: 1,
        viewportWidth: 1920,
        viewportHeight: 940,
        colorDepth: 24,
      },
      capabilities: {
        javascriptEnabled: true,
        cookiesEnabled: true,
        onlineStatus: true,
        touchSupportPoints: 0,
        hardwareConcurrency: 16,
      },
      timing: {
        clientTimestamp: new Date().toISOString(),
        clientTimezone: "America/New_York",
        pageLoadDurationMs: 280,
        domInteractiveMs: 120,
      },
      clientGeneratedId: "test_verification_01",
    };

    const res = await fetch(`${baseUrl}/api/telemetry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    check("POST /api/telemetry Status 201", res.status === 201);
    check("POST /api/telemetry returns success: true", data.success === true);
    check("POST /api/telemetry returns event ID", Boolean(data.id));
    createdEventId = data.id;
  } catch (err) {
    check("POST /api/telemetry", false, err.message);
  }

  // 8. Test POST /api/telemetry Validation (Missing Consent)
  try {
    const invalidPayload = {
      consentGranted: false, // Disallowed
      browser: { family: "Opera" },
    };

    const res = await fetch(`${baseUrl}/api/telemetry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidPayload),
    });

    check("POST /api/telemetry rejects without consent (403)", res.status === 403);
  } catch (err) {
    check("POST /api/telemetry validation", false, err.message);
  }

  // 9. Test GET /api/events
  try {
    const res = await fetch(`${baseUrl}/api/events`);
    const data = await res.json();
    check("GET /api/events Status 200", res.status === 200);
    check("GET /api/events returns stats", Boolean(data.stats));
    check("GET /api/events totalEvents >= 1", data.stats.totalEvents >= 1);
    check("GET /api/events includes newly submitted event", data.events.some((e) => e.id === createdEventId));
  } catch (err) {
    check("GET /api/events", false, err.message);
  }

  console.log(`\n=== RESULTS: ${passed} PASSED, ${failed} FAILED ===\n`);
  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
