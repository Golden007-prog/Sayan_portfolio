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

## Accessibility & motion

WCAG 2.1 AA targeted. Contrast (WCAG relative luminance, computed):

| Pair | Ratio | |
| --- | --- | --- |
| Dark: body `#F4F6FB` on `#05060A` | ≈ 18.9:1 | AAA |
| Dark: muted `#9AA3B5` on `#05060A` | ≈ 7.9:1 | AA ✓ (≥4.5) |
| Light: body `#0B0F1A` on `#F6F7FB` | ≈ 17.6:1 | AAA |
| Light: muted `#55607A` on `#F6F7FB` | ≈ 5.8:1 | AA ✓ |

Glass surfaces add ≤9% white/62% white alpha; composited ratios stay above
4.5:1 for muted text in both themes. `prefers-reduced-motion` collapses every
animation to ≤200ms fades globally (`globals.css`) plus per-component
`useReducedMotionSafe()` gates (video → poster, marquees → static rows, tilt/
parallax/cursor off). `prefers-contrast: more` strengthens borders and glass
alpha. Full keyboard operability: menu and palette trap and restore focus;
tabs, flip cards, carousel dots and chips are all focusable with visible
gradient rings.

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

## Deploy (Vercel)

1. Push to GitHub, import in Vercel — zero config (static-first + ISR).
2. Set env vars from `.env.example` if using the form/analytics.
3. After the first deploy, update `site.url` in `src/content/data.ts` to the
   live domain (drives metadataBase, sitemap, canonicals, JSON-LD), and
   redeploy.

## Feature audit

The full 304-item checklist audit lives in [`FEATURES.md`](./FEATURES.md).
