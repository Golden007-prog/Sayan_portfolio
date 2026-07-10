/**
 * Automated horizontal-overflow audit (§275, §267). Loads every route at the
 * five audited widths and reports any element wider than the viewport, plus
 * any document-level horizontal scroll. Exits non-zero on a regression.
 *
 * Usage: node scripts/overflow-audit.mjs [baseUrl]
 */
import puppeteer from "puppeteer-core";

const base = process.argv[2] ?? "http://localhost:3170";
const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const ROUTES = ["/", "/uses", "/projects/helios-mainframe-modernization", "/nope"];
const WIDTHS = [360, 768, 1024, 1440, 1920];

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"],
});

let failures = 0;

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900 });
    await page.goto(base + route, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 900));

    const result = await page.evaluate(() => {
      /*
       * `scrollWidth > clientWidth` is not proof of a horizontal scrollbar:
       * `overflow-x: clip` still reports the overflowing content width. The
       * only authoritative test is whether the viewport actually scrolls.
       */
      const before = window.scrollX;
      window.scrollTo(99999, window.scrollY);
      const docOverflow = window.scrollX > 0;
      window.scrollTo(before, window.scrollY);
      const vw = document.documentElement.clientWidth;
      const offenders = [];
      for (const el of document.querySelectorAll("*")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        // Ignore fixed decorative layers and anything explicitly allowed to bleed
        const cs = getComputedStyle(el);
        if (cs.position === "fixed" || el.hasAttribute("data-fx-layer")) continue;
        if (r.right > vw + 1 || r.left < -1) {
          offenders.push(
            `${el.tagName.toLowerCase()}.${String(el.className || "").split(" ")[0]} ` +
              `left=${Math.round(r.left)} right=${Math.round(r.right)}`,
          );
        }
        if (offenders.length > 4) break;
      }
      return { docOverflow, offenders, scrollWidth: document.documentElement.scrollWidth, vw };
    });

    const bad = result.docOverflow;
    if (bad) failures++;
    const tag = bad ? "FAIL" : "ok  ";
    console.log(
      `${tag} ${String(width).padStart(4)}px ${route.padEnd(42)} ` +
        (bad ? `scrollWidth ${result.scrollWidth} > ${result.vw}` : ""),
    );
    if (bad && result.offenders.length) {
      result.offenders.forEach((o) => console.log(`       ↳ ${o}`));
    }
    await page.close();
  }
}

await browser.close();
console.log(failures ? `\n${failures} viewport(s) scroll horizontally.` : "\nNo horizontal overflow at any audited width.");
process.exit(failures ? 1 : 0);
