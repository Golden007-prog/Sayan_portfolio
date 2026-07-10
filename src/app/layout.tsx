import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { CursorProvider } from "@/components/providers/CursorProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { RouteTransition } from "@/components/providers/RouteTransition";
import { EasterEggs } from "@/components/providers/EasterEggs";
import { ServiceWorkerRegister } from "@/components/providers/ServiceWorkerRegister";
import { Analytics } from "@/components/providers/Analytics";
import { AuroraBackground } from "@/components/fx/AuroraBackground";
import { GrainOverlay } from "@/components/fx/GrainOverlay";
import { ScrollProgressBar } from "@/components/fx/ScrollProgressBar";
import { site, owner, bp, media } from "@/content/data";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${owner.name} — Mainframe Developer · AI Explorer`,
    template: site.titleTemplate,
  },
  description: site.description,
  keywords: [
    "Mainframe Developer",
    "COBOL",
    "Product Analyst",
    "IBM watsonx.ai",
    "Bengaluru",
    "CICS",
    "DB2",
    "z/OS",
  ],
  authors: [{ name: owner.name, url: site.url }],
  openGraph: {
    type: "website",
    url: site.url,
    siteName: owner.name,
    title: `${owner.name} — Mainframe Developer · AI Explorer`,
    description: site.description,
    images: [{ url: media.ogImage, width: 1200, height: 630, alt: `${owner.name} — portfolio` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${owner.name} — Mainframe Developer · AI Explorer`,
    description: site.description,
    images: [media.ogImage],
  },
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: `${bp}/favicon.svg`, type: "image/svg+xml" },
      { url: `${bp}/favicon.ico`, sizes: "any" },
    ],
    apple: `${bp}/apple-touch-icon.png`,
  },
  manifest: `${bp}/manifest.webmanifest`,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#05060a" },
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: next-themes stamps the theme class pre-paint
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* §239 — RepoCards fetches api.github.com; avatars load from its CDN */}
        <link rel="preconnect" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {/* A JSX comment never reaches the DOM, so the Konami hint (§182) is
            injected as a real HTML comment for anyone reading view-source. */}
        <div hidden dangerouslySetInnerHTML={{ __html: "<!-- ↑↑↓↓←→←→BA -->" }} />
        <ThemeProvider>
          <SmoothScroll>
            <CursorProvider>
              <ToastProvider>
                <a href="#main" className="skip-link glass-3 text-sm font-medium">
                  Skip to content
                </a>
                <AuroraBackground />
                <GrainOverlay />
                <ScrollProgressBar />
                <RouteTransition>{children}</RouteTransition>
                <EasterEggs />
                <ServiceWorkerRegister />
                <Analytics />
              </ToastProvider>
            </CursorProvider>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
