/**
 * Measures LCP with and without the preloader, under identical CPU/network
 * throttling, to attribute the mobile LCP cost. Diagnostic only.
 */
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:3170/";
const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";

async function measure(skipPreloader) {
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.emulate({
    viewport: { width: 412, height: 823, isMobile: true, hasTouch: true, deviceScaleFactor: 2.6 },
    userAgent: "Mozilla/5.0 (Linux; Android 11; moto g power) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36",
  });
  const client = await page.createCDPSession();
  await client.send("Network.enable");
  await client.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  if (skipPreloader) {
    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem("preloaded", "1");
    });
  }

  await page.goto(url, { waitUntil: "load", timeout: 90000 });
  await new Promise((r) => setTimeout(r, 6000));

  const lcp = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const entries = performance.getEntriesByType("largest-contentful-paint");
        if (entries.length) return resolve(entries[entries.length - 1].startTime);
        new PerformanceObserver((l) => {
          const e = l.getEntries();
          resolve(e[e.length - 1].startTime);
        }).observe({ type: "largest-contentful-paint", buffered: true });
        setTimeout(() => resolve(-1), 2000);
      }),
  );

  await browser.close();
  return lcp;
}

const withPre = await measure(false);
const without = await measure(true);
console.log(`LCP with preloader:    ${withPre.toFixed(0)} ms`);
console.log(`LCP preloader skipped: ${without.toFixed(0)} ms`);
console.log(`Preloader attributable delta: ${(withPre - without).toFixed(0)} ms`);
