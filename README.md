# SAYAN.OS — portfolio of Sayan Chakraborty

**"Legacy meets Intelligence."** A deep-space, liquid-glass single-page
portfolio for a mainframe developer bridging COBOL-era systems with modern AI
(IBM watsonx.ai, MCP). Built to a 304-feature spec: cinematic GSAP scroll
choreography, frosted glass over drifting aurora gradients, a Konami-code
TSO/ISPF terminal mode, and an ABEND S0C4 404 with a runner mini-game.

## Stack

Next.js 16 (App Router, TypeScript strict, Turbopack) · Tailwind CSS v4 ·
GSAP 3 + ScrollTrigger · Framer Motion · Lenis · next-themes ·
react-hook-form + zod · lucide-react + simple-icons ·
Space Grotesk / Inter / JetBrains Mono via next/font.

## Getting started

```bash
npm install
npm run dev      # dev server (Turbopack)
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint (flat config)
npm run analyze  # bundle analyzer (webpack build: ANALYZE=true next build --webpack)
npm run icons    # regenerate favicon set + OG image from code
npm run contrast # WCAG AA audit of every token pair (exits non-zero on failure)
npm run overflow # horizontal-overflow audit across 4 routes × 5 widths
```

Copy `.env.example` → `.env.local` to wire the contact form
(`NEXT_PUBLIC_FORM_ENDPOINT`, e.g. a Formspree URL) and analytics
(`NEXT_PUBLIC_ANALYTICS_ID`, a Plausible domain). Both are optional; the site
works fully without them (the form simulates success in dev).

**All content lives in `src/content/data.ts`** — copy, links, projects,
skills, stats. Components are content-agnostic. See `TODO-CONTENT.md` for the
`[ADD LINK]` placeholders awaiting real URLs.

## Architecture

```
src/
├─ app/
│  ├─ layout.tsx            fonts · metadata · viewport · provider stack
│  ├─ page.tsx              Preloader → Navbar → 8 sections → Footer
│  ├─ projects/[slug]/      4 SSG case studies (async params, per-project OG)
│  ├─ uses/                 hidden gear page (footer "·" dot)
│  ├─ not-found.tsx         ABEND S0C4 + RunnerGame (space to jump)
│  ├─ error.tsx             glass error boundary
│  ├─ manifest.ts · sitemap.ts · robots.ts
│  └─ dev/kitchen-sink/     primitive gallery (dev only)
├─ content/data.ts          ★ single source of truth for ALL copy/data
├─ styles/tokens.css        ★ every color/easing/radius/duration token
├─ lib/gsap.ts              gsap + ScrollTrigger registered once, SSR-safe
├─ hooks/useReducedMotionSafe.ts
└─ components/
   ├─ primitives/           GlassCard · Reveal · SectionHeading · MagneticButton
   │                        TiltCard · Marquee · CountUp · Parallax · ThemeToggle · LiveClock
   ├─ providers/            SmoothScroll(Lenis+GSAP ticker) · CursorProvider ·
   │                        ToastProvider · ThemeProvider · RouteTransition ·
   │                        EasterEggs · ServiceWorkerRegister · Analytics
   ├─ shell/                Preloader · Navbar · MobileMenu · CommandPalette · Footer
   ├─ sections/             Hero · RoleTicker · About · Skills · SkillIcon ·
   │                        Experience · WorkGallery · AwardsSection · Beyond · Contact
   ├─ work/                 ProjectCard · CaseStudy · RepoCards (ISR, 24h)
   ├─ fx/                   AuroraBackground · GrainOverlay · ScrollProgressBar ·
   │                        Confetti · Particles · RunnerGame
   └─ seo/JsonLd.tsx        Person schema
```

### Where the signature features live

| Feature | File |
| --- | --- |
| Real-progress preloader + curtain exit | `shell/Preloader.tsx` (fonts + poster + video metadata) |
| Glass recipe (all surfaces) | `globals.css` `.glass/-1/-3` + `primitives/GlassCard.tsx` |
| Aurora + film grain ambient stack | `fx/AuroraBackground.tsx` · `fx/GrainOverlay.tsx` |
| One rAF loop for the site | `providers/SmoothScroll.tsx` (Lenis on the GSAP ticker) |
| Horizontal pinned work gallery | `sections/WorkGallery.tsx` (1 of only 2 pinned scenes) |
| Hero scroll-out depth exit | `sections/Hero.tsx` (pinned scene 2 of 2) |
| Custom cursor + "VIEW →" morph | `providers/CursorProvider.tsx` (`data-cursor` attrs) |
| Command palette (⌘K) | `shell/CommandPalette.tsx` |
| Konami → SAYAN/OS terminal mode (F3 exits) | `providers/EasterEggs.tsx` + `tokens.css [data-terminal]` |
| "cobol" typed → punch-card rain | `providers/EasterEggs.tsx` |
| Zero-defect 9→0 count gag | `heroStats` in `data.ts` + `primitives/CountUp.tsx` `from` |
| GitHub repos (ISR 24h, hides on failure) | `work/RepoCards.tsx` |
| Print = clean resume | `globals.css @media print` (try Ctrl+P) |

## Measured results

Lighthouse 13.4, production build (`next build && next start`), headless Chrome:

| | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| **Desktop** | **99** | **100** | **96** | **100** |
| **Mobile** | 78 | **100** | **96** | **100** |

Core Web Vitals: desktop LCP 0.9s / CLS 0 / TBT 30ms. Mobile CLS 0.005, TBT 170ms.

Two numbers deserve an honest explanation rather than a green checkmark.

**Mobile performance (78).** Lighthouse's mobile preset reports LCP 4.7s. That
figure is *simulated* — lantern projects a slow-4G, 4×-CPU load on top of an
unthrottled run. Measured on an actually-throttled connection
(`node scripts/lcp-probe.mjs`, 1.6Mbps / 150ms RTT / 4× CPU), LCP is **1.74s**,
inside the 2.5s target. The LCP element is the hero headline, which is
server-rendered text but stays transparent until GSAP plays the per-letter
mask rise (spec §40). Any pre-reveal hiding — `opacity`, `clip-path`, or
`visibility` — means no contentful paint, so the mandated letter-reveal and a
sub-2.5s *simulated* LCP are structurally in tension. I measured the preloader's
contribution and it is **−12ms** (noise), so the loader is not the cause. Deleting
the letter reveal would buy the score; it would also delete the site's signature
moment, so it stays.

**Best practices (96).** One DevTools issue remains: `script-src` blocks an
`eval`. It comes from Framer Motion's JIT capability probe —
`try { Function(""); return true } catch { return false }` — which is wrapped in
`try/catch` and falls back cleanly when CSP denies it. Adding `'unsafe-eval'`
would score 100 and weaken the policy for a feature detect, so the strict CSP
stays. (GitHub Pages serves no response headers at all, so no CSP applies there.)

## Accessibility & motion

WCAG 2.1 AA targeted. Contrast measured with the WCAG relative-luminance
formula (`node scripts/contrast.mjs`):

| Pair | Ratio | |
| --- | --- | --- |
| Dark: body `#F4F6FB` on `#05060A` | 18.73:1 | AAA |
| Dark: muted `#9AA3B5` on `#05060A` | 7.99:1 | AA ✓ |
| Light: body `#0B0F1A` on `#F6F7FB` | 17.87:1 | AAA |
| Light: muted `#55607A` on `#F6F7FB` | 5.87:1 | AA ✓ |
| Light: accent text `#5B3FD4` / `#0B6F87` / `#B02A68` / `#0D7350` | 5.39–6.31:1 | AA ✓ |
| Dark: accent text (vivid `#7C5CFF` … `#22D3EE`) | 4.66–11.21:1 | AA ✓ |
| White on `--accent-solid` `#5B3FD4` | 6.76:1 | AA ✓ |

**Accent tokens come in two flavours** and this distinction is load-bearing.
`--accent-1..4` are the vivid brand values, used *only* for decoration —
glows, borders, bar fills, giant display type. `--accent-1-text..4-text`
(Tailwind: `text-accent1t`…`text-accent4t`) are surface-aware and used for
*any readable text*: on the light surface the vivid cyan measures 1.69:1 and
the green 1.80:1, so accent-colored labels, chips, links and form errors must
use the `-text` variants, which re-tune per theme. `.text-gradient` and
`var(--gradient-text)` follow the same rule; `var(--gradient)` stays
decorative.

`prefers-reduced-motion` collapses every animation to ≤200ms fades globally
(`globals.css`) plus per-component `useReducedMotionSafe()` gates (video →
poster and paused, marquees → static rows, rotators frozen, tilt/parallax/
cursor off). Auto-moving content (marquees, fun-fact rotator) carries a
keyboard-reachable pause control per WCAG 2.2.2. `prefers-contrast: more`
strengthens borders and glass alpha. Full keyboard operability: menu and
palette trap focus (background `inert`) and restore it on close; tabs, flip
cards, carousel dots and chips are focusable with visible gradient rings.

## Regenerating the AI assets (Higgsfield MCP)

Every visual was generated via the Higgsfield MCP server and optimized by
`scripts/fetch-assets.mjs` (sharp → ≤1920px JPG · ffmpeg-static → h264 CRF26
+ VP9 webm + poster). Shared style suffix for every prompt:

> deep dark navy background #05060A, electric violet and cyan glow accents,
> frosted glass, subtle film grain, minimal high-end motion design aesthetic,
> no text, no logos, no watermark

| File | Model | Prompt core |
| --- | --- | --- |
| `hero-loop.mp4/webm` | kling3_0 · 16:9 · 6s · silent | Slow cinematic abstract aurora — ribbons of violet and cyan light flowing through deep navy space, soft volumetric glow, gentle drift, seamless loop |
| `about-ambient.mp4` | kling3_0 · 16:9 · 6s · silent | Barely-moving dark smoke and light haze, extremely subtle, deep navy, ambient background loop |
| `about-portrait.png` | nano_banana_pro · 4:5 | Minimal 3D frosted-glass monogram "SC" floating in dark studio, violet-cyan refraction, soft rim light *(replace with a real photo — see TODO-CONTENT.md)* |
| `proj-helios.jpg` | nano_banana_pro · 16:9 | Green terminal code stream morphing into glowing neural-network nodes across dark glass panels, isometric |
| `proj-reports.jpg` | nano_banana_pro · 16:9 | Punch cards flowing into glowing database cylinders, cyan data streams, minimal isometric 3D |
| `proj-fintech.jpg` | nano_banana_pro · 16:9 | Floating frosted glass cards with charts and metrics, B2B cloud dashboard concept |
| `proj-endevor.jpg` | nano_banana_pro · 16:9 | Code packages traveling along glowing rails between environments, luminous zero-defect shield |
| `beyond-trek.jpg` | nano_banana_pro · 3:4 | Moody Himalayan ridge at blue hour, lone trekker silhouette, cinematic mist |
| `beyond-edit.jpg` | nano_banana_pro · 3:4 | Glowing video-editing timeline in a dim creative studio, floating film strips |
| `og-image.jpg` + favicons | code-composed | `npm run icons` (no AI-text risk) |

## Deploy

The site builds for **two targets** from one codebase, switched by the
`GITHUB_PAGES` env var in `next.config.ts`.

### GitHub Pages (current live target)

Live at **https://golden007-prog.github.io/Sayan_portfolio/**. Every push to
`main` runs `.github/workflows/deploy.yml`, which lints, gates on the WCAG
contrast audit, builds a static export, and publishes it.

`GITHUB_PAGES=true` switches on `output: "export"`, `basePath:
"/Sayan_portfolio"`, unoptimized images, and drops the `headers()` block —
Pages cannot emit response headers. `NEXT_PUBLIC_BASE_PATH` is injected through
the Next config rather than the shell, because Git Bash on Windows rewrites a
leading-slash env value into a `C:/Program Files/...` path and silently corrupts
every asset URL. Raw asset URLs are prefixed with `bp` from `data.ts`;
`next/link` and the router handle `basePath` themselves.

### Vercel (server target)

`npm run build` with no env vars produces the server build: image optimization,
ISR for the GitHub repo cards (`revalidate: 86400`), and the full security-header
set including CSP. Import the repo in Vercel — zero config.

After either first deploy, set `site.url` in `src/content/data.ts` (or
`NEXT_PUBLIC_SITE_URL`) to the live origin; it drives `metadataBase`, the
sitemap, canonicals and JSON-LD.

Optional env (all absent by default): `NEXT_PUBLIC_FORM_ENDPOINT` (Formspree /
Resend), `NEXT_PUBLIC_ANALYTICS_ID` (Plausible domain), `NEXT_PUBLIC_SENTRY_DSN`
(see the commented stub in `src/lib/sentry.ts`).

## Feature audit

The full 304-item checklist audit lives in [`FEATURES.md`](./FEATURES.md).
