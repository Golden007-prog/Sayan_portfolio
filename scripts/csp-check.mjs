/** Loads the page in headless Chrome and prints console errors + CSP violations. */
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:3141/";
const chrome =
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"],
});
const page = await browser.newPage();

const errors = [];
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning") errors.push(`[${m.type()}] ${m.text()}`);
});
page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));

await page.evaluateOnNewDocument(() => {
  window.__csp = [];
  document.addEventListener("securitypolicyviolation", (e) => {
    window.__csp.push(`${e.violatedDirective} blocked ${e.blockedURI} (${e.sourceFile}:${e.lineNumber})`);
  });
});

await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
await new Promise((r) => setTimeout(r, 2500));

const csp = await page.evaluate(() => window.__csp ?? []);

console.log("=== CONSOLE (errors/warnings) ===");
console.log(errors.length ? errors.join("\n") : "  none");
console.log("=== CSP VIOLATIONS ===");
console.log(csp.length ? csp.join("\n") : "  none");

await browser.close();
process.exit(errors.length || csp.length ? 1 : 0);
