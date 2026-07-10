/**
 * Downloads the Higgsfield-generated assets and optimizes them into
 * /public/media: JPGs ≤1920px via sharp, hero video ≤3MB h264+webm via
 * ffmpeg-static, poster frame extracted (§4 workflow).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3F1bLQuJ6GcSVbPE8tk9RcUCI4F";
const MEDIA = path.resolve("public/media");
mkdirSync(MEDIA, { recursive: true });

const images = [
  { url: `${CDN}/hf_20260710_120131_3c972f77-c0c6-42f7-8768-f2b194230f18.png`, out: "proj-helios.jpg", width: 1920 },
  { url: `${CDN}/hf_20260710_120133_f9ba79e4-93f3-40f0-a236-36e04bb9e887.png`, out: "proj-reports.jpg", width: 1920 },
  { url: `${CDN}/hf_20260710_120136_070db623-9090-4e7e-8844-a22e9ff09ace.png`, out: "proj-fintech.jpg", width: 1920 },
  { url: `${CDN}/hf_20260710_120138_836a8248-6207-4ad6-925a-6b6b27ec45da.png`, out: "proj-endevor.jpg", width: 1920 },
  { url: `${CDN}/hf_20260710_120149_73e1f2ec-d863-4b22-9b40-a0e1ba026aa4.png`, out: "beyond-trek.jpg", width: 1200 },
  { url: `${CDN}/hf_20260710_120154_cbee7f8e-1a62-40fa-a95c-9405a0b6b448.png`, out: "beyond-edit.jpg", width: 1200 },
  { url: `${CDN}/hf_20260710_120128_3807d547-f09c-4b76-bd38-cd5420c01b21.png`, out: "about-portrait.png", width: 1080 },
];

const videos = [
  { url: `${CDN}/hf_20260710_120117_9ff79dfc-1166-4386-9f4e-2fbdb08703f1.mp4`, base: "hero-loop", webm: true, poster: "hero-poster.jpg" },
  { url: `${CDN}/hf_20260710_120121_7ce38373-b672-48e1-9265-20c52b4eaf93.mp4`, base: "about-ambient", webm: false, poster: null },
];

async function fetchBuf(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

for (const img of images) {
  const buf = await fetchBuf(img.url);
  const pipeline = sharp(buf).resize({ width: img.width, withoutEnlargement: true });
  const out = path.join(MEDIA, img.out);
  if (img.out.endsWith(".png")) {
    await pipeline.png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(out);
  } else {
    await pipeline.jpeg({ quality: 82, mozjpeg: true }).toFile(out);
  }
  console.log(`${img.out}: ${(statSync(out).size / 1024).toFixed(0)} KB`);
}

for (const vid of videos) {
  const raw = path.join(MEDIA, `${vid.base}-raw.mp4`);
  writeFileSync(raw, await fetchBuf(vid.url));
  const mp4 = path.join(MEDIA, `${vid.base}.mp4`);
  execFileSync(ffmpegPath, [
    "-y", "-i", raw, "-an", "-c:v", "libx264", "-crf", "26", "-preset", "slow",
    "-vf", "scale=1280:-2", "-movflags", "+faststart", mp4,
  ], { stdio: "pipe" });
  console.log(`${vid.base}.mp4: ${(statSync(mp4).size / 1024).toFixed(0)} KB`);
  if (vid.webm) {
    const webm = path.join(MEDIA, `${vid.base}.webm`);
    execFileSync(ffmpegPath, [
      "-y", "-i", raw, "-an", "-c:v", "libvpx-vp9", "-crf", "40", "-b:v", "0",
      "-vf", "scale=1280:-2", webm,
    ], { stdio: "pipe" });
    console.log(`${vid.base}.webm: ${(statSync(webm).size / 1024).toFixed(0)} KB`);
  }
  if (vid.poster) {
    const poster = path.join(MEDIA, vid.poster);
    execFileSync(ffmpegPath, [
      "-y", "-i", raw, "-ss", "0.5", "-frames:v", "1", "-q:v", "3", poster,
    ], { stdio: "pipe" });
    console.log(`${vid.poster}: ${(statSync(poster).size / 1024).toFixed(0)} KB`);
  }
  execFileSync(process.platform === "win32" ? "cmd" : "rm", process.platform === "win32" ? ["/c", "del", raw.replaceAll("/", "\\")] : ["-f", raw]);
}

console.log("ASSETS DONE");
