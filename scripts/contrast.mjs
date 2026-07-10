/**
 * Audits every text/background token pair against WCAG 2.1 AA (4.5:1 for
 * normal text). Exits non-zero on any failure so it can gate CI.
 * Run: node scripts/contrast.mjs
 */
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (fg, bg) => {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
};

const AA = 4.5;

const themes = {
  dark: {
    bg: "#05060a",
    pairs: {
      "body text": "#f4f6fb",
      "muted text": "#9aa3b5",
      "accent-1-text": "#7c5cff",
      "accent-2-text": "#22d3ee",
      "accent-3-text": "#f472b6",
      "accent-4-text": "#34d399",
    },
  },
  light: {
    bg: "#f6f7fb",
    pairs: {
      "body text": "#0b0f1a",
      "muted text": "#55607a",
      "accent-1-text": "#5b3fd4",
      "accent-2-text": "#0b6f87",
      "accent-3-text": "#b02a68",
      "accent-4-text": "#0d7350",
    },
  },
};

let failed = 0;
for (const [theme, { bg, pairs }] of Object.entries(themes)) {
  console.log(`\n${theme.toUpperCase()}  (bg ${bg})`);
  for (const [name, fg] of Object.entries(pairs)) {
    const r = ratio(fg, bg);
    const ok = r >= AA;
    if (!ok) failed++;
    console.log(`  ${ok ? "PASS" : "FAIL"}  ${name.padEnd(16)} ${fg}  ${r.toFixed(2)}:1`);
  }
}

// White text on the solid accent fill (achievement badge, filled buttons)
const solid = "#5b3fd4";
const rSolid = ratio("#ffffff", solid);
console.log(`\nWHITE ON --accent-solid ${solid}: ${rSolid.toFixed(2)}:1`);
if (rSolid < AA) failed++;

console.log(failed ? `\n${failed} pair(s) below ${AA}:1` : `\nAll pairs meet WCAG AA (${AA}:1).`);
process.exit(failed ? 1 : 0);
