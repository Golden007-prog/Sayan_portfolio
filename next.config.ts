import type { NextConfig } from "next";

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
  images: {
    qualities: [75, 82],
    remotePatterns: [{ protocol: "https", hostname: "avatars.githubusercontent.com" }],
  },
  async headers() {
    return [
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
    ];
  },
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
