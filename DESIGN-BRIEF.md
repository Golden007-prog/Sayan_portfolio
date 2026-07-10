# DESIGN BRIEF — read this before writing any component

Deep-space glassmorphism portfolio ("Legacy meets Intelligence") for a mainframe
developer. Next.js 16 App Router + TS strict + Tailwind v4, GSAP 3 + ScrollTrigger,
Framer Motion, Lenis. Windows dev box.

## Hard rules

1. **All copy/data comes from `@/content/data`** — never hard-code content.
   Exports: `owner, skills, skillContext, experience, internships, education,
   awards, projects, beyondCode, heroStats, site, nav, heroCopy, aboutCopy,
   sectionCopy, exploringNow, preloader, usesPage, media`.
2. **Do NOT touch `src/app/page.tsx`, `layout.tsx`, `globals.css`, `tokens.css`
   or another agent's files.** Create only the files your task lists.
3. Client components: `"use client"` at top. Import gsap ONLY via
   `import { gsap, ScrollTrigger } from "@/lib/gsap"`.
4. Every GSAP animation inside `gsap.context(() => {...}, el)` with
   `return () => ctx.revert()` — strict-mode safe, zero leaks.
   **Never use `autoAlpha`.** It sets `visibility: hidden`, which removes the
   node from the accessibility tree — that silently hid every section heading
   from screen readers and broke heading order. Animate `opacity`.
5. Every animated component consumes `useReducedMotionSafe()` from
   `@/hooks/useReducedMotionSafe` and collapses to fades/static.
6. Animate ONLY `transform` / `opacity` (+ `clip-path` for masks). Reveal
   distance ≤ 48px. Stagger children 0.04–0.08s. Signature ease
   `power4.out` (GSAP default) / `var(--ease-out-soft)` in CSS.
7. Touch/hover gating: hover-only effects behind
   `window.matchMedia("(pointer: coarse)")` checks or `@media (hover:hover) and (pointer:fine)`.
8. a11y: semantic landmarks, aria-labels on icon buttons, focus-visible never
   suppressed, touch targets ≥44px, decorative layers `aria-hidden`.
9. Images: `next/image` with accurate `sizes`, explicit aspect-ratio container
   (`aspect-[16/10]` etc.), `alt` text; hover zoom stays inside `overflow-hidden` frame.

## CSS utilities available (globals.css)

- `.glass` / `.glass-1` (chips) / `.glass-3` (modals) — frosted surfaces
- `.glass-sheen` (hover light sweep), `.glass-conic` (rotating gradient border)
- `.container-site` (max-w 80rem + fluid gutter), `.eyebrow` (mono micro-label),
  `.mono-chip`, `.text-gradient`, `.link-underline`, `.headline-flip`, `.sr-only`
- Tailwind token colors: `bg-bg`, `bg-bg2`, `text-fg`, `text-muted-fg`;
  fonts `font-display`, `font-body`, `font-mono`
- CSS vars: `var(--gradient)`, `var(--glass-border)`, `var(--ease-out-soft)`,
  `var(--section-pad)`, `var(--nav-h)`

## Accent tokens — decoration vs. text (load-bearing)

`--accent-1..4` / `text-accent1..4` are the **vivid** brand values. Use them
only for decoration: glows, borders, bar fills, giant display type.

`--accent-1-text..4-text` / `text-accent1t..4t` are **surface-aware**. Use them
for anything readable: labels, chips, links, indices, form errors, meaningful
icons. On the light surface the vivid cyan measures 1.69:1 and green 1.80:1 —
both fail WCAG AA — so accent-colored *text* must use these.

Same split for gradients: `var(--gradient-text)` (and the `.text-gradient`
utility) for gradient-filled text; `var(--gradient)` for decorative fills.
`var(--accent-solid)` is a violet that white text clears 4.5:1 on, in both
themes. Verify any change with `npm run contrast`.

## Primitives (import from `@/components/primitives/*`, providers from `@/components/providers/*`)

- `<GlassCard tier={1|2|3} conic sheen spotlight className>` — div wrapper
- `<SectionHeading eyebrow heading underline className>` — animated header
- `<Reveal variant="fade-up|mask|blur|scale" delay stagger as start className>`
- `<MagneticButton strength variant="primary|ghost" href?|onClick?>` — CTA
- `<TiltCard maxDeg={6} className>` — 3D tilt wrapper
- `<Marquee speed direction={1|-1} pauseOnHover className aria-label>`
- `<CountUp value from suffix prefix duration className>`
- `<Parallax speed={0.2} className>` — scrubbed media layer
- `<ThemeToggle className>`, `<LiveClock className>`
- `useToast()` → `{ toast(msg, {icon:"check"|"info"}) }`
- `useSmoothScroll()` → `{ scrollTo(target,{immediate}), stop(), start() }`
- `useCursor()` → `{ sparkle, setSparkle }`

## Cursor states

Add `data-cursor="link|view|drag|text"` to interactive zones; the global
CursorProvider styles itself from these. Project cards use `data-cursor="view"`.

## Sections & anchors (home page assembly happens elsewhere)

Each section component: `<section id="<anchor>" aria-labelledby=...>` with
`py-[var(--section-pad)]` and `.container-site` inner wrapper. Anchors:
`about, skills, experience, work, awards, beyond, contact`. Hero has `id="home"`.
Export each section as a named export from its file.

## z-index map

aurora -10 · content 0 · grain 5 · terminal scanlines 90 · route curtain 100 ·
progress bar 110 · toasts 120 · preloader 130 · nav 60 · mobile menu 80 ·
palette/modals 95 · cursor 9999.

## Media files (in /public/media)

hero-loop.webm + hero-loop.mp4 + hero-poster.jpg (16:9) · about-portrait.png (4:5)
· about-ambient.mp4 · proj-*.jpg (16:9, paths in `projects[].cover`) ·
beyond-trek.jpg, beyond-edit.jpg (3:4).

## Voice

Copy is confident, warm, specific; mainframe vernacular is the house accent
(datasets, JCL, ABEND jokes). Minimalism wins ties: fewer elements, more
whitespace, stronger type.
