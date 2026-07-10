/**
 * Generates the favicon set (§265) and the static OG image (§A10, §257)
 * from code — brand look, no AI-text risk. Run: node scripts/gen-icons.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const PUB = path.resolve("public");
mkdirSync(path.join(PUB, "media"), { recursive: true });

const monogram = (size, pad = 0) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7C5CFF"/>
      <stop offset="1" stop-color="#22D3EE"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#05060A"/>
  <rect x="${size * 0.06}" y="${size * 0.06}" width="${size * 0.88}" height="${size * 0.88}"
        rx="${size * 0.18}" fill="none" stroke="url(#g)" stroke-opacity="0.5" stroke-width="${Math.max(1, size * 0.015)}"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
        font-family="Arial, sans-serif" font-weight="700"
        font-size="${size * (0.42 - pad)}" fill="url(#g)">SC</text>
</svg>`;

// favicon.svg (crisp at any size)
writeFileSync(path.join(PUB, "favicon.svg"), monogram(64));

// PNG set
const png = async (size, file, pad = 0) =>
  sharp(Buffer.from(monogram(size, pad))).png().toFile(path.join(PUB, file));

await png(192, "icon-192.png");
await png(512, "icon-512.png");
await png(512, "icon-maskable-512.png", 0.1); // extra safe-zone padding
await png(180, "apple-touch-icon.png");

// favicon.ico from 32+16
const p32 = await sharp(Buffer.from(monogram(32))).png().toBuffer();
const p16 = await sharp(Buffer.from(monogram(16))).png().toBuffer();
writeFileSync(path.join(PUB, "favicon.ico"), await pngToIco([p16, p32]));

// OG image 1200×630 — name + role over the aurora-glass look
const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7C5CFF"/>
      <stop offset="1" stop-color="#22D3EE"/>
    </linearGradient>
    <radialGradient id="a1" cx="0.2" cy="0.1" r="0.7">
      <stop offset="0" stop-color="#7C5CFF" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#7C5CFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="a2" cx="0.9" cy="0.9" r="0.8">
      <stop offset="0" stop-color="#22D3EE" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#22D3EE" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#05060A"/>
  <rect width="1200" height="630" fill="url(#a1)"/>
  <rect width="1200" height="630" fill="url(#a2)"/>
  <rect x="60" y="60" width="1080" height="510" rx="28" fill="#FFFFFF" fill-opacity="0.05"
        stroke="#FFFFFF" stroke-opacity="0.14"/>
  <text x="110" y="200" font-family="Arial, sans-serif" font-size="26" letter-spacing="8"
        fill="#9AA3B5">PRODUCT ANALYST (ISG) · COGNIZANT</text>
  <text x="106" y="310" font-family="Arial, sans-serif" font-weight="700" font-size="86"
        fill="#F4F6FB">SAYAN CHAKRABORTY</text>
  <text x="110" y="390" font-family="Arial, sans-serif" font-size="34" fill="url(#g)">
    Mainframe Developer · AI Explorer</text>
  <text x="110" y="470" font-family="Arial, sans-serif" font-size="24" fill="#9AA3B5">
    Bridging legacy mainframes with modern AI — COBOL · DB2 · watsonx.ai</text>
</svg>`;
await sharp(Buffer.from(og)).jpeg({ quality: 88 }).toFile(path.join(PUB, "media", "og-image.jpg"));

console.log("ICONS + OG DONE");
