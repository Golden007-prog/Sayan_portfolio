import type { NextConfig } from "next";

/**
 * Dual deploy targets:
 * — Default: server build (Vercel) with security headers + image optimization.
 * — GITHUB_PAGES=true: static export for github.io with basePath
 *   /Sayan_portfolio, unoptimized images (no image server), and no headers()
 *   (GitHub Pages cannot set response headers).
 */
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? "/Sayan_portfolio" : "";

/**
 * CSP kept minimal (§293): 'unsafe-inline' is required by next-themes'
 * no-FOUC script and GSAP-injected style attributes.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://plausible.io",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://avatars.githubusercontent.com",
  "media-src 'self'",
  "font-src 'self'",
  "connect-src 'self' https://api.github.com https://plausible.io https://formspree.io",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  ...(isPages
    ? { output: "export" as const, basePath, trailingSlash: true }
    : {}),
  // Inject here (not via shell) — Git Bash/MSYS mangles leading-slash env
  // values into Windows paths, silently corrupting every asset URL.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: {
    qualities: [75, 82],
    remotePatterns: [{ protocol: "https", hostname: "avatars.githubusercontent.com" }],
    ...(isPages ? { unoptimized: true } : {}),
  },
  ...(isPages
    ? {}
    : {
        headers: async () => [
          {
            source: "/(.*)",
            headers: [
              { key: "X-Frame-Options", value: "DENY" },
              { key: "X-Content-Type-Options", value: "nosniff" },
              { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
              { key: "Content-Security-Policy", value: csp },
              { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
            ],
          },
          {
            source: "/media/(.*)",
            headers: [
              { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
            ],
          },
        ],
      }),
};

/**
 * Next 16 builds with Turbopack by default, and ANY webpack config —
 * including @next/bundle-analyzer's — fails the build. So the analyzer
 * wraps the config only when ANALYZE=true, and `npm run analyze` opts
 * back into webpack via `next build --webpack` (§237).
 */
async function withAnalyzer(config: NextConfig): Promise<NextConfig> {
  if (process.env.ANALYZE !== "true") return config;
  const { default: bundleAnalyzer } = await import("@next/bundle-analyzer");
  return bundleAnalyzer({ enabled: true })(config);
}

export default withAnalyzer(nextConfig);
