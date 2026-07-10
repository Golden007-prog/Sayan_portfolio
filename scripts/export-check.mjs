/**
 * Post-export sanity checks for the GitHub Pages build (`out/`).
 * Guards the two failure modes that survive a green build and only surface
 * in production: a double basePath prefix, and Windows path leakage from a
 * shell-provided env var. Exits non-zero on either.
 */
import { readFileSync } from "node:fs";
import { globSync } from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
const files = globSync("**/*.html", { cwd: OUT }).map((f) => path.join(OUT, f));

if (files.length === 0) {
  console.error("No HTML in out/ — run `GITHUB_PAGES=true npm run build` first.");
  process.exit(1);
}

const CHECKS = [
  {
    name: "double basePath (og:image resolved against metadataBase twice)",
    pattern: /Sayan_portfolio\/Sayan_portfolio/,
  },
  {
    name: "Windows path leaked into an asset URL (MSYS rewrote a /-prefixed env var)",
    pattern: /C:\/(Program|Users)/,
  },
  { name: "unresolved template literal in output", pattern: /\$\{bp\}/ },
];

let failures = 0;
for (const file of files) {
  const html = readFileSync(file, "utf8");
  for (const { name, pattern } of CHECKS) {
    if (pattern.test(html)) {
      failures++;
      console.error(`FAIL ${path.relative(OUT, file)} — ${name}`);
      const hit = html.match(new RegExp(`[^"']*${pattern.source}[^"']*`));
      if (hit) console.error(`       ${hit[0].slice(0, 120)}`);
    }
  }
}

console.log(
  failures
    ? `\n${failures} problem(s) across ${files.length} exported pages.`
    : `\nExport clean: ${files.length} pages, no basePath or path-leak defects.`,
);
process.exit(failures ? 1 : 0);
