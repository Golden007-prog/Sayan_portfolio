# Feature audit — 304 features

Every numbered feature in §6 of `CLAUDE_CODE_PORTFOLIO_PROMPT.md` was checked against the
actual source in `src/`, `public/`, `next.config.ts` and `README.md` — not against the `§n`
comments, which were treated as claims rather than evidence. Where behaviour could only be
settled by looking at output, it was verified against the running production build
(rendered HTML for metadata, the Konami comment, preconnect hints, GitHub repo cards and the
404 route; `npx eslint` for lint; gzip measurement for chunk budgets; `Get-ChildItem` for
media weights). Several section files were being edited by other agents during the audit;
they are judged on the source as it stood, and the two places where that mattered are noted.

**Summary: ✅ 273 · ⚠️ 26 · ❌ 5 — of 304.**

---

### A · Loading Experience / Preloader (1–14)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 1 | Glass preloader, SC monogram stroke-drawn | ✅ | `src/components/shell/Preloader.tsx` | |
| 2 | 0→100 counter tied to real fonts/poster/video load | ✅ | `src/components/shell/Preloader.tsx` | |
| 3 | Rotating mono word ticker (COBOL→…→PORTFOLIO) | ✅ | `src/components/shell/Preloader.tsx` | |
| 4 | Slim progress bar with gradient shimmer | ✅ | `src/components/shell/Preloader.tsx` | |
| 5 | Exit: dual clip-path curtain wipe | ✅ | `src/components/shell/Preloader.tsx` | |
| 6 | Hero entrance chained to preloader completion | ✅ | `src/components/sections/Hero.tsx` | |
| 7 | Plays once per session (sessionStorage) | ✅ | `src/components/shell/Preloader.tsx` | |
| 8 | Reduced motion → 300ms fade | ✅ | `src/components/shell/Preloader.tsx` | |
| 9 | Skip button fades in after 4s | ✅ | `src/components/shell/Preloader.tsx` | |
| 10 | Minimum display time 1.2s | ✅ | `src/components/shell/Preloader.tsx` | |
| 11 | Theme-aware, no white flash | ✅ | `src/components/shell/Preloader.tsx` | |
| 12 | Rotating microcopy under the bar | ✅ | `src/components/shell/Preloader.tsx` | |
| 13 | GSAP context + timeline cleaned up on unmount | ✅ | `src/components/shell/Preloader.tsx` | |
| 14 | Glass top progress bar on route changes | ✅ | `src/components/providers/RouteTransition.tsx` | |

### B · Navigation (15–36)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 15 | Fixed glass navbar, hairline border, inset highlight | ✅ | `src/components/shell/Navbar.tsx` | |
| 16 | Auto-hide down / reveal up via y-transform | ✅ | `src/components/shell/Navbar.tsx` | |
| 17 | Compresses after 80px (height, blur, bg alpha) | ✅ | `src/components/shell/Navbar.tsx` | |
| 18 | Scroll-spy active link via IntersectionObserver | ✅ | `src/components/shell/Navbar.tsx` | |
| 19 | Magnetic hover on every nav link | ✅ | `src/components/shell/Navbar.tsx` | |
| 20 | Underline indicator slides between links (layoutId) | ✅ | `src/components/shell/Navbar.tsx` | |
| 21 | SC logo flips 180° to サ on hover | ✅ | `src/components/shell/Navbar.tsx` | |
| 22 | "Let's Talk" pill with conic gradient border | ✅ | `src/components/shell/Navbar.tsx` | |
| 23 | Mobile full-screen frosted overlay menu | ✅ | `src/components/shell/MobileMenu.tsx` | |
| 24 | Menu links reveal with staggered clip-path masks | ✅ | `src/components/shell/MobileMenu.tsx` | |
| 25 | Hamburger morphs into X (two-line SVG) | ✅ | `src/components/shell/MobileMenu.tsx` | |
| 26 | Body scroll locked while menu open (Lenis stop) | ✅ | `src/components/shell/MobileMenu.tsx` | |
| 27 | ESC closes; focus trapped and returned on close | ✅ | `src/components/shell/MobileMenu.tsx` | |
| 28 | Live Bengaluru IST clock in menu + footer | ✅ | `src/components/primitives/LiveClock.tsx` | |
| 29 | "Open to opportunities" badge, pulsing green dot | ✅ | `src/components/shell/Navbar.tsx` | |
| 30 | GitHub + LinkedIn icon buttons, hover lift + glow | ✅ | `src/components/shell/Navbar.tsx` | |
| 31 | Full tab order, visible custom focus rings | ✅ | `src/app/globals.css` | |
| 32 | Command palette on Cmd/Ctrl+K | ✅ | `src/components/shell/CommandPalette.tsx` | |
| 33 | Palette fuzzy search + arrows + Enter | ✅ | `src/components/shell/CommandPalette.tsx` | |
| 34 | Anchors smooth-scroll via Lenis with header offset | ✅ | `src/components/providers/SmoothScroll.tsx` | |
| 35 | "Skip to content" link, first focusable | ✅ | `src/app/layout.tsx` | |
| 36 | Theme toggle: sun↔moon morph + rotation | ✅ | `src/components/primitives/ThemeToggle.tsx` | |

### C · Hero (37–58)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 37 | 100svh hero with hero-loop video background | ✅ | `src/components/sections/Hero.tsx` | |
| 38 | muted/autoplay/loop/playsinline, webm→mp4, poster | ✅ | `src/components/sections/Hero.tsx` | |
| 39 | Readability stack: scrim + grain + vignette | ✅ | `src/components/sections/Hero.tsx` | |
| 40 | Per-letter clip-path mask rise, ~30ms stagger | ✅ | `src/components/sections/Hero.tsx` | |
| 41 | Role typewriter ticker with blinking cursor | ✅ | `src/components/sections/RoleTicker.tsx` | |
| 42 | Intro sentence animates blur(12px) → sharp | ✅ | `src/components/sections/Hero.tsx` | |
| 43 | Two glass CTAs: View Work + Download Resume | ✅ | `src/components/sections/Hero.tsx` | |
| 44 | Mouse-parallax at three depths, max 12px, lerped | ✅ | `src/components/sections/Hero.tsx` | |
| 45 | 4 floating glass chips with individual drift loops | ✅ | `src/components/sections/Hero.tsx` | |
| 46 | Scroll indicator fades out after first scroll | ✅ | `src/components/sections/Hero.tsx` | |
| 47 | Stats strip counts up, incl. 9→0 defects gag | ✅ | `src/components/sections/Hero.tsx` | |
| 48 | Aurora blobs visible behind hero glass | ⚠️ | `src/components/fx/AuroraBackground.tsx` | Aurora is fixed at `-z-10`; the full-bleed hero video/poster occludes it. |
| 49 | Headline glow text-shadow in dark mode only | ✅ | `src/components/sections/Hero.tsx` | |
| 50 | Video pauses on hidden tab / reduced motion / save-data | ✅ | `src/components/sections/Hero.tsx` | |
| 51 | Scroll-out: content scales 0.94 + fades (scrub) | ✅ | `src/components/sections/Hero.tsx` | |
| 52 | Location chip "📍 Bengaluru · IST" in mono | ✅ | `src/components/sections/Hero.tsx` | |
| 53 | Trust line in muted micro-caps | ✅ | `src/components/sections/Hero.tsx` | |
| 54 | Custom ::selection tinted by brand gradient | ✅ | `src/app/globals.css` | |
| 55 | Name hover toggles fill ↔ outline stroke | ✅ | `src/app/globals.css` | |
| 56 | Reduced motion: static poster, parallax off | ✅ | `src/components/sections/Hero.tsx` | |
| 57 | Hero is the Konami activation zone | ⚠️ | `src/components/providers/EasterEggs.tsx` | `data-konami-zone` is never read; the listener is global, not hero-scoped. |
| 58 | Headline fluid clamp 44→128px, balanced wrap | ✅ | `src/styles/tokens.css` | |

### D · About (59–72)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 59 | Two-column glass panel, stacks on mobile | ✅ | `src/components/sections/About.tsx` | |
| 60 | Portrait in glass frame, gradient ring + 6° tilt | ✅ | `src/components/sections/About.tsx` | |
| 61 | Bio reveals line-by-line with mask animation | ✅ | `src/components/sections/About.tsx` | |
| 62 | Key phrases highlighted in gradient text | ✅ | `src/components/sections/About.tsx` | |
| 63 | Three "What I do" cards, hover lift + icon nudge | ✅ | `src/components/sections/About.tsx` | |
| 64 | Hand-drawn SVG underline draws on scroll | ✅ | `src/components/sections/About.tsx` | |
| 65 | Language chips with animated proficiency bars | ✅ | `src/components/sections/About.tsx` | |
| 66 | "Save contact" downloads a generated vCard | ✅ | `src/components/sections/About.tsx` | |
| 67 | Fun-fact rotator | ✅ | `src/components/sections/About.tsx` | |
| 68 | about-ambient.mp4 as subtle parallax backdrop | ✅ | `src/components/sections/About.tsx` | |
| 69 | Badge row: CGPA 8.30 + SIH 2022 mono chips | ✅ | `src/components/sections/About.tsx` | |
| 70 | Section deep-linkable via #about (all sections) | ✅ | `src/app/page.tsx` | |
| 71 | All images lazy-load with blur-up placeholders | ⚠️ | `src/components/sections/Beyond.tsx` | Beyond photos and the case prev/next covers lazy-load with no `blurDataURL`. |
| 72 | Descriptive alt text; decorative layers aria-hidden | ✅ | `src/components/sections/About.tsx` | |

### E · Skills (73–92)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 73 | Bento grid, one tile per group, asymmetric spans | ✅ | `src/components/sections/Skills.tsx` | |
| 74 | Tile: mono index, group name, count badge | ✅ | `src/components/sections/Skills.tsx` | |
| 75 | Skill chips show simple-icons with fallback | ✅ | `src/components/sections/SkillIcon.tsx` | |
| 76 | Chip hover: lift + glow + context tooltip | ✅ | `src/components/sections/Skills.tsx` | |
| 77 | Full-width seamless marquee, pauses on hover | ✅ | `src/components/primitives/Marquee.tsx` | |
| 78 | Second marquee row, opposite direction + speed | ✅ | `src/components/sections/Skills.tsx` | |
| 79 | Filter tabs with sliding glass pill | ✅ | `src/components/sections/Skills.tsx` | |
| 80 | Filtering animates with FLIP layout transitions | ✅ | `src/components/sections/Skills.tsx` | |
| 81 | View toggle chips ↔ bars, bars animate to level | ✅ | `src/components/sections/Skills.tsx` | |
| 82 | Cursor-following radial spotlight on tiles | ✅ | `src/components/primitives/GlassCard.tsx` | |
| 83 | Count-up "25+ technologies · 4 disciplines" | ✅ | `src/components/sections/Skills.tsx` | |
| 84 | Chips keyboard-focusable; tooltip shows on focus | ✅ | `src/components/sections/Skills.tsx` | |
| 85 | Icons from one bundled module, no per-icon requests | ✅ | `src/components/sections/SkillIcon.tsx` | |
| 86 | "Currently exploring" callout with pulsing border | ✅ | `src/components/sections/Skills.tsx` | |
| 87 | Tiles tilt toward cursor, max 6°, spring back | ✅ | `src/components/primitives/TiltCard.tsx` | |
| 88 | Heading underline gradient wipe on scroll-in | ✅ | `src/components/primitives/SectionHeading.tsx` | |
| 89 | Grid tiles stagger in at 60ms | ✅ | `src/components/sections/Skills.tsx` | |
| 90 | Missing icon → auto monogram chip | ✅ | `src/components/sections/SkillIcon.tsx` | |
| 91 | Click chip copies name → glass toast | ✅ | `src/components/sections/Skills.tsx` | |
| 92 | Reduced motion: static marquee, no tilt/spotlight | ⚠️ | `src/components/primitives/GlassCard.tsx` | Marquee and tilt collapse, but the cursor spotlight still tracks. |

### F · Experience (93–108)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 93 | Gradient timeline line draws with scroll (scrub) | ✅ | `src/components/sections/Experience.tsx` | |
| 94 | Node dots pulse once as the line reaches them | ✅ | `src/components/sections/Experience.tsx` | |
| 95 | Cognizant domain tracks as animated tabs | ✅ | `src/components/sections/Experience.tsx` | |
| 96 | Desktop sticky left column, bullets scroll right | ✅ | `src/components/sections/Experience.tsx` | |
| 97 | Period chips in JetBrains Mono | ✅ | `src/components/sections/Experience.tsx` | |
| 98 | Bullets reveal one-by-one, 80ms stagger | ✅ | `src/components/sections/Experience.tsx` | |
| 99 | "Present" node has a live pulsing ring | ✅ | `src/components/sections/Experience.tsx` | |
| 100 | Internship cards on the same, lighter timeline | ✅ | `src/components/sections/Experience.tsx` | |
| 101 | Company monograms in circular glass coins | ✅ | `src/components/sections/Experience.tsx` | |
| 102 | Card hover: rotating conic-gradient border | ✅ | `src/components/sections/Experience.tsx` | |
| 103 | "Zero critical defects" shimmering badge | ✅ | `src/components/sections/Experience.tsx` | |
| 104 | Domain tags as mono chips | ✅ | `src/components/sections/Experience.tsx` | |
| 105 | Mobile: single left-rail timeline | ✅ | `src/components/sections/Experience.tsx` | |
| 106 | Education block closes the timeline | ✅ | `src/components/sections/Experience.tsx` | |
| 107 | Print stylesheet = clean single-column resume | ⚠️ | `src/app/globals.css` | Chrome hidden and glass flattened, but grids stay multi-column in print. |
| 108 | JSON-LD describes current role + employer | ✅ | `src/components/seo/JsonLd.tsx` | |

### G · Selected Work / Projects (109–130)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 109 | Desktop horizontally-pinned GSAP gallery | ✅ | `src/components/sections/WorkGallery.tsx` | |
| 110 | All 4 projects as large glass case cards | ✅ | `src/components/sections/WorkGallery.tsx` | |
| 111 | Card: cover, mono index, title, subtitle, chips | ✅ | `src/components/work/ProjectCard.tsx` | |
| 112 | Hover: cover 1.06, caption slides up, arrow -45° | ✅ | `src/components/work/ProjectCard.tsx` | |
| 113 | Cursor morphs to "VIEW →" pill over cards | ✅ | `src/components/providers/CursorProvider.tsx` | |
| 114 | Click → case page with shared-element transition | ⚠️ | `src/components/work/CaseStudy.tsx` | No `layoutId`; only the destination cover sets `viewTransitionName`. |
| 115 | Case: hero media → Problem → Approach → Impact | ✅ | `src/components/work/CaseStudy.tsx` | |
| 116 | Prev/Next nav with edge-hover cover preview | ✅ | `src/components/work/CaseStudy.tsx` | |
| 117 | Per-project GitHub button with [ADD LINK] | ✅ | `src/components/work/CaseStudy.tsx` | |
| 118 | "More on GitHub" end-card, animated star/fork | ✅ | `src/components/sections/WorkGallery.tsx` | |
| 119 | Live GitHub repos fetched at build (revalidate 24h) | ✅ | `src/components/work/RepoCards.tsx` | |
| 120 | Skeleton shimmer; hides gracefully on API failure | ✅ | `src/components/work/RepoCards.tsx` | |
| 121 | Case metrics count up on view | ✅ | `src/components/work/CaseStudy.tsx` | |
| 122 | Project accent tints glow, chips, case details | ✅ | `src/components/work/ProjectCard.tsx` | |
| 123 | Cards tilt toward the cursor (shared TiltCard) | ✅ | `src/components/primitives/TiltCard.tsx` | |
| 124 | Touch: snap carousel with progress dots + swipe | ✅ | `src/components/sections/WorkGallery.tsx` | |
| 125 | Horizontal scroll-progress bar under the gallery | ✅ | `src/components/sections/WorkGallery.tsx` | |
| 126 | Giant outlined "SELECTED WORK" parallaxes slower | ✅ | `src/components/sections/WorkGallery.tsx` | |
| 127 | Per-case OG image + title via generateMetadata | ✅ | `src/app/projects/[slug]/page.tsx` | |
| 128 | Breadcrumb "← All work" with underline-draw hover | ✅ | `src/components/work/CaseStudy.tsx` | |
| 129 | Unknown slug → styled 404, never a crash | ✅ | `src/app/projects/[slug]/page.tsx` | |
| 130 | Case pages get scroll-triggered reveals | ✅ | `src/components/work/CaseStudy.tsx` | |

### H · Awards & Hackathons (131–142)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 131 | Trophy-case grid of 3 glass cards | ✅ | `src/components/sections/AwardsSection.tsx` | |
| 132 | World Record card: cursor-following holo sheen | ✅ | `src/components/sections/AwardsSection.tsx` | |
| 133 | One-time confetti burst (≤150 particles) on view | ✅ | `src/components/fx/Confetti.tsx` | |
| 134 | Cards flip on click/tap to reveal detail | ✅ | `src/components/sections/AwardsSection.tsx` | |
| 135 | External link chips on each card | ⚠️ | `src/components/sections/AwardsSection.tsx` | The SIH card renders no chip — its `link` in `data.ts` is an empty string. |
| 136 | Year chips + organization monograms | ✅ | `src/components/sections/AwardsSection.tsx` | |
| 137 | Medal/trophy SVGs with idle animations | ✅ | `src/components/sections/AwardsSection.tsx` | |
| 138 | Compact achievements marquee above the grid | ✅ | `src/components/sections/AwardsSection.tsx` | |
| 139 | Helios card back lists the full stack | ✅ | `src/content/data.ts` | |
| 140 | Ambient particles, capped, paused off-screen | ✅ | `src/components/fx/Particles.tsx` | |
| 141 | Flip cards stay screen-reader accessible | ✅ | `src/components/sections/AwardsSection.tsx` | |
| 142 | Confetti loaded lazily near the viewport | ✅ | `src/components/sections/AwardsSection.tsx` | |

### I · Beyond the Terminal (143–152)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 143 | Split section: editing/design + trekking | ✅ | `src/components/sections/Beyond.tsx` | |
| 144 | Two polaroid cards with ±2° hover wobble | ✅ | `src/components/sections/Beyond.tsx` | |
| 145 | Trekking card with slow parallax pan | ✅ | `src/components/sections/Beyond.tsx` | |
| 146 | Editing card styled as filmstrip with playhead | ✅ | `src/components/sections/Beyond.tsx` | |
| 147 | Tool badges: Premiere Pro · Illustrator | ✅ | `src/components/sections/Beyond.tsx` | |
| 148 | Rotating motto line | ✅ | `src/components/sections/Beyond.tsx` | |
| 149 | SVG mountain-ridge divider draws on scroll | ✅ | `src/components/sections/Beyond.tsx` | |
| 150 | Sparkle cursor-trail only inside this section | ✅ | `src/components/providers/CursorProvider.tsx` | |
| 151 | Copy is warm and human, not corporate | ✅ | `src/content/data.ts` | |
| 152 | Images art-directed: different crops per breakpoint | ✅ | `src/components/sections/Beyond.tsx` | |

### J · Contact (153–170)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 153 | Oversized headline with per-word rise reveal | ✅ | `src/components/sections/Contact.tsx` | |
| 154 | Giant magnetic email button: copy + mailto | ✅ | `src/components/sections/Contact.tsx` | |
| 155 | Copy fires a toast with a self-drawing checkmark | ✅ | `src/components/providers/ToastProvider.tsx` | |
| 156 | Contact form on glass: name, email, message | ✅ | `src/components/sections/Contact.tsx` | |
| 157 | Floating labels animate up on focus/fill | ✅ | `src/components/sections/Contact.tsx` | |
| 158 | zod validation: inline errors + shake on invalid | ✅ | `src/components/sections/Contact.tsx` | |
| 159 | Submit: gradient sweep → paper-plane fly-off | ✅ | `src/components/sections/Contact.tsx` | |
| 160 | Swappable form action + .env.example + README note | ✅ | `src/components/sections/Contact.tsx` | |
| 161 | Anti-spam: honeypot + minimum-time trap | ✅ | `src/components/sections/Contact.tsx` | |
| 162 | Phone + location rows with copy-on-click | ✅ | `src/components/sections/Contact.tsx` | |
| 163 | Big pill links to LinkedIn/GitHub, arrows slide | ✅ | `src/components/sections/Contact.tsx` | |
| 164 | Availability line "replies within 24h" | ✅ | `src/components/sections/Contact.tsx` | |
| 165 | Calendly slot commented out and documented | ✅ | `src/components/sections/Contact.tsx` | |
| 166 | Success: micro-confetti + thank-you copy | ✅ | `src/components/sections/Contact.tsx` | |
| 167 | Network failure: friendly retry, data preserved | ✅ | `src/components/sections/Contact.tsx` | |
| 168 | Errors in aria-live; focus moves to first invalid | ✅ | `src/components/sections/Contact.tsx` | |
| 169 | Message textarea auto-grows | ✅ | `src/components/sections/Contact.tsx` | |
| 170 | Submit disabled + spinner during flight | ✅ | `src/components/sections/Contact.tsx` | |

### K · Footer (171–182)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 171 | Oversized name watermark marquee behind content | ✅ | `src/components/shell/Footer.tsx` | |
| 172 | Gradient hairline top border on glass | ✅ | `src/components/shell/Footer.tsx` | |
| 173 | Columns: section links · socials · contact | ✅ | `src/components/shell/Footer.tsx` | |
| 174 | Back-to-top with circular scroll-progress ring | ✅ | `src/components/shell/Footer.tsx` | |
| 175 | "Made in Bengaluru 🇮🇳 · live IST clock" | ✅ | `src/components/shell/Footer.tsx` | |
| 176 | Copyright year computed automatically | ✅ | `src/components/shell/Footer.tsx` | |
| 177 | Colophon: designed & built by Sayan | ✅ | `src/components/shell/Footer.tsx` | |
| 178 | Tiny stack icons with tooltips in the colophon | ✅ | `src/components/shell/Footer.tsx` | |
| 179 | Version tag read from package.json | ⚠️ | `src/components/shell/Footer.tsx` | Reads `site.version` ("1.0.0") from `data.ts`; package.json says "0.1.0". |
| 180 | Footer revealed by a parallax curtain lift | ✅ | `src/components/shell/Footer.tsx` | |
| 181 | Unlabeled "·" dot links to hidden /uses | ✅ | `src/components/shell/Footer.tsx` | |
| 182 | Konami hint as HTML comment + console line | ⚠️ | `src/app/layout.tsx` | Console line ships; the JSX `{/* … */}` never emits an HTML comment. |

### L · Global Animation & Micro-interactions (183–204)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 183 | Lenis smooth scroll synced to the GSAP ticker | ✅ | `src/components/providers/SmoothScroll.tsx` | |
| 184 | 2px gradient scroll-progress bar at viewport top | ✅ | `src/components/fx/ScrollProgressBar.tsx` | |
| 185 | Shared SectionHeading: index + wipe + rise | ✅ | `src/components/primitives/SectionHeading.tsx` | |
| 186 | Declarative `<Reveal variant=…>` system | ✅ | `src/components/primitives/Reveal.tsx` | |
| 187 | Children stagger 40–80ms, never all at once | ✅ | `src/components/primitives/Reveal.tsx` | |
| 188 | `Parallax` utility with speed prop | ✅ | `src/components/primitives/Parallax.tsx` | |
| 189 | Cursor: 8px dot + 36px ring, mix-blend-difference | ✅ | `src/components/providers/CursorProvider.tsx` | |
| 190 | Cursor states: link, drag, view, text | ⚠️ | `src/components/providers/CursorProvider.tsx` | The "drag" state is coded but no element ever sets `data-cursor="drag"`. |
| 191 | Cursor fully disabled on coarse pointers | ✅ | `src/components/providers/CursorProvider.tsx` | |
| 192 | `MagneticButton` primitive on all primary CTAs | ✅ | `src/components/primitives/MagneticButton.tsx` | |
| 193 | Button hover: sweep + 2px lift + shadow bloom | ✅ | `src/components/primitives/MagneticButton.tsx` | |
| 194 | Link underline draws left→right, exits right | ✅ | `src/app/globals.css` | |
| 195 | All images zoom 1.04–1.08 inside clipped frames | ⚠️ | `src/components/work/ProjectCard.tsx` | Only project covers zoom (1.06); portrait/Beyond don't, prev/next uses 1.10. |
| 196 | Route transitions: glass curtain wipe 0.45s in/out | ✅ | `src/components/providers/RouteTransition.tsx` | |
| 197 | Pinning rationed — hero exit + work gallery only | ✅ | `src/components/sections/WorkGallery.tsx` | |
| 198 | Text-scramble on the hero role ticker hover | ✅ | `src/components/sections/RoleTicker.tsx` | |
| 199 | Shared eased, locale-formatted `CountUp` | ✅ | `src/components/primitives/CountUp.tsx` | |
| 200 | Glass toast stack, auto-dismiss, swipe-to-dismiss | ✅ | `src/components/providers/ToastProvider.tsx` | |
| 201 | Subtle click ripple (≤10% opacity, 400ms) | ✅ | `src/components/primitives/MagneticButton.tsx` | |
| 202 | Global reduced-motion switch as a hook + CSS | ✅ | `src/hooks/useReducedMotionSafe.ts` | |
| 203 | Every GSAP timeline in gsap.context(), killed | ✅ | `src/lib/gsap.ts` | |
| 204 | Marquees on the GSAP ticker, IO-paused off-screen | ✅ | `src/components/primitives/Marquee.tsx` | |

### M · Glassmorphism System (205–216)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 205 | One `.glass` recipe powers all surfaces | ⚠️ | `src/app/globals.css` | One-off inline blurs in Preloader, Navbar, RouteTransition, ProjectCard caption. |
| 206 | Three depth tiers used intentionally | ✅ | `src/components/primitives/GlassCard.tsx` | |
| 207 | Inset top-edge highlight on every glass surface | ✅ | `src/app/globals.css` | |
| 208 | Animated conic-gradient border variant (8s) | ✅ | `src/app/globals.css` | |
| 209 | `AuroraBackground`: 3 blurred blobs, slow drift | ✅ | `src/components/fx/AuroraBackground.tsx` | |
| 210 | `GrainOverlay`: fixed, 3%, pointer-events none | ⚠️ | `src/components/fx/GrainOverlay.tsx` | `z-[5]` paints above most section content rather than below it. |
| 211 | Tooltips, toasts, modals, palette share the tokens | ✅ | `src/app/globals.css` | |
| 212 | Diagonal light-sheen sweep on hover (0.8s) | ✅ | `src/app/globals.css` | |
| 213 | Light theme re-tunes glass (white 62%) | ✅ | `src/styles/tokens.css` | |
| 214 | `@supports not (backdrop-filter)` opaque fallback | ✅ | `src/app/globals.css` | |
| 215 | Text never sits on a blurred layer itself | ✅ | `src/app/globals.css` | |
| 216 | ≤3 large blurred regions; transform/opacity only | ✅ | `src/components/fx/AuroraBackground.tsx` | |

### N · Theme System (217–226)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 217 | next-themes, class strategy, no-flash script | ✅ | `src/components/providers/ThemeProvider.tsx` | |
| 218 | Toggle morphs sun↔moon; matches resolved theme | ✅ | `src/components/primitives/ThemeToggle.tsx` | |
| 219 | Theme cross-fade via View Transitions + fallback | ✅ | `src/components/primitives/ThemeToggle.tsx` | |
| 220 | 100% of colors flow from CSS variables | ⚠️ | `src/app/globals.css` | Hard-coded rgba/hex remain in glow shadows, vignette, focus ring, theme-color. |
| 221 | Defaults to system; manual choice persists | ✅ | `src/components/providers/ThemeProvider.tsx` | |
| 222 | `<meta name="theme-color">` updates with theme | ✅ | `src/components/providers/ThemeProvider.tsx` | |
| 223 | Hero video wears a heavier scrim in light mode | ✅ | `src/styles/tokens.css` | |
| 224 | Skill bars and timeline gradients recolor per theme | ✅ | `src/styles/tokens.css` | |
| 225 | Scrollbar and ::selection styled per theme | ✅ | `src/app/globals.css` | |
| 226 | Both themes verified against WCAG AA, documented | ✅ | `scripts/contrast.mjs` | |

### O · Performance (227–240)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 227 | `next/image` for every raster asset, accurate sizes | ✅ | `src/components/work/ProjectCard.tsx` | |
| 228 | Hero video ≤3MB, mp4 + webm, poster paints first | ✅ | `public/media/` | |
| 229 | Fonts self-hosted via next/font, swap, latin | ✅ | `src/app/layout.tsx` | |
| 230 | Heavy extras loaded via next/dynamic on demand | ⚠️ | `src/components/sections/AwardsSection.tsx` | Only Confetti; the palette is conditionally mounted, the 404 game is static. |
| 231 | Below-fold sections lazy-mounted via IO wrapper | ❌ | — | No lazy-mount wrapper exists; every section mounts eagerly with the page. |
| 232 | Lighthouse ≥95 across 4 categories, documented | ❌ | — | No Lighthouse scores or targets recorded in the README or anywhere else. |
| 233 | CLS < 0.05 — explicit aspect-ratio box per media | ✅ | `src/components/work/ProjectCard.tsx` | |
| 234 | LCP < 2.5s — poster prioritized, headline SSR text | ✅ | `src/components/sections/Hero.tsx` | |
| 235 | Composite-only animations; will-change removed | ⚠️ | `src/components/sections/Contact.tsx` | clip-path/filter reveals aren't compositor-only; heading words keep will-change. |
| 236 | Scroll/resize work on the GSAP ticker or rAF | ⚠️ | `src/components/sections/Hero.tsx` | Hero's scroll-indicator and Footer's resize listeners are raw/unthrottled. |
| 237 | `ANALYZE=true` script; no client chunk > 180KB gz | ✅ | `next.config.ts` | |
| 238 | All routes static; GitHub data via ISR (86400) | ✅ | `src/components/work/RepoCards.tsx` | |
| 239 | preconnect/dns-prefetch for api.github.com | ❌ | `src/app/layout.tsx` | Declared in a manual `<head>` but absent from served HTML; no analytics hint. |
| 240 | 404/uses ship near-zero JS beyond the shell | ✅ | `src/app/uses/page.tsx` | |

### P · Accessibility (241–254)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 241 | Semantic landmarks, single h1, heading cascade | ✅ | `src/app/page.tsx` | |
| 242 | Full keyboard operability everywhere | ✅ | `src/components/sections/Experience.tsx` | |
| 243 | Custom focus-visible rings, never bare outline:none | ✅ | `src/app/globals.css` | |
| 244 | aria-current, aria-expanded, aria-label on icons | ✅ | `src/components/shell/Navbar.tsx` | |
| 245 | Meaningful alt text; decorative layers hidden | ✅ | `src/components/sections/About.tsx` | |
| 246 | AA contrast verified in both themes | ✅ | `scripts/contrast.mjs` | |
| 247 | prefers-reduced-motion honored on every path | ✅ | `src/hooks/useReducedMotionSafe.ts` | |
| 248 | Form errors: aria-live + focus to first invalid | ✅ | `src/components/sections/Contact.tsx` | |
| 249 | Focus trap in modal/menu/palette; focus restored | ✅ | `src/components/shell/MobileMenu.tsx` | |
| 250 | Touch targets ≥ 44×44px | ✅ | `src/components/sections/Skills.tsx` | |
| 251 | SR-only helper text on external links | ⚠️ | `src/components/work/RepoCards.tsx` | Repo cards, More-on-GitHub and award chips omit the "opens in new tab" text. |
| 252 | prefers-contrast: more strengthens borders/alpha | ✅ | `src/app/globals.css` | |
| 253 | lang="en"; every route has a descriptive title | ✅ | `src/app/layout.tsx` | |
| 254 | Usable at 200% zoom without horizontal scroll | ✅ | `src/app/globals.css` | |

### Q · SEO & Metadata (255–266)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 255 | Metadata API with title template | ✅ | `src/app/layout.tsx` | |
| 256 | Meta description ≤155 chars | ✅ | `src/content/data.ts` | |
| 257 | Complete OpenGraph + Twitter card tags | ✅ | `src/app/layout.tsx` | |
| 258 | JSON-LD Person schema with sameAs | ✅ | `src/components/seo/JsonLd.tsx` | |
| 259 | sitemap.xml + robots.txt via App Router | ✅ | `src/app/sitemap.ts` | |
| 260 | Canonical URLs on every route | ✅ | `src/app/layout.tsx` | |
| 261 | Natural keyword coverage | ✅ | `src/app/layout.tsx` | |
| 262 | humans.txt easter egg crediting the stack | ✅ | `public/humans.txt` | |
| 263 | Clean project slugs | ✅ | `src/content/data.ts` | |
| 264 | `rel="me"` on social links | ⚠️ | `src/components/sections/Contact.tsx` | Only the Contact pills carry it; nav, footer and menu socials do not. |
| 265 | Full favicon set + maskable icon in manifest | ✅ | `src/app/manifest.ts` | |
| 266 | Per-project OG metadata via generateMetadata | ✅ | `src/app/projects/[slug]/page.tsx` | |

### R · Responsive & Device (267–276)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 267 | Audited at 360/768/1024/1440/1920px | ⚠️ | — | Responsive by construction, but no recorded audit at the five widths. |
| 268 | Fluid type and spacing via clamp() | ✅ | `src/styles/tokens.css` | |
| 269 | Hover-only information has a touch equivalent | ⚠️ | `src/components/work/ProjectCard.tsx` | The caption bar (year · role · metric) only appears on hover; no tap state. |
| 270 | iOS safe-area insets for nav and footer | ⚠️ | `src/app/globals.css` | `.safe-*` used by the mobile menu and toasts; navbar and footer don't apply it. |
| 271 | svh/dvh units for hero height | ✅ | `src/components/sections/Hero.tsx` | |
| 272 | Hover effects gated behind hover:hover + pointer:fine | ✅ | `src/app/globals.css` | |
| 273 | Bento/timeline/gallery reflow to single column | ✅ | `src/components/sections/Skills.tsx` | |
| 274 | Art-directed crops per breakpoint | ✅ | `src/components/sections/Beyond.tsx` | |
| 275 | Zero horizontal scrollbars (automated dev audit) | ❌ | — | `overflow-x: clip` guards the body, but no automated overflow audit exists. |
| 276 | Tap-highlight color themed, no 300ms delay | ✅ | `src/app/globals.css` | |

### S · Easter Eggs & Delight (277–286)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 277 | Konami → green-phosphor TERMINAL MODE + toast | ✅ | `src/components/providers/EasterEggs.tsx` | |
| 278 | ASCII banner + section titles as dataset names | ✅ | `src/components/providers/EasterEggs.tsx` | |
| 279 | Styled console.log: ASCII art + hiring line | ✅ | `src/components/providers/EasterEggs.tsx` | |
| 280 | Typing "cobol" floats punch-card rain for 3s | ✅ | `src/components/providers/EasterEggs.tsx` | |
| 281 | Logo clicked 5× spins it and toasts | ✅ | `src/components/shell/Navbar.tsx` | |
| 282 | Hidden /uses page, linked only from the footer dot | ✅ | `src/app/uses/page.tsx` | |
| 283 | Cursor sparkle mode toggleable from the palette | ✅ | `src/components/shell/CommandPalette.tsx` | |
| 284 | Date-aware console greeting | ⚠️ | `src/components/providers/EasterEggs.tsx` | New Year and Diwali only; there is no site-anniversary greeting. |
| 285 | 404 page has a space-to-jump endless runner | ✅ | `src/components/fx/RunnerGame.tsx` | |
| 286 | Ctrl+P yields a clean printable resume layout | ✅ | `src/app/globals.css` | |

### T · PWA & Infrastructure Extras (287–294)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 287 | Web app manifest, installable, maskable icons | ✅ | `src/app/manifest.ts` | |
| 288 | Service worker with offline fallback page | ✅ | `public/sw.js` | |
| 289 | Privacy-friendly analytics stub behind an env flag | ✅ | `src/components/providers/Analytics.tsx` | |
| 290 | Custom scrollbar styling with native fallback | ✅ | `src/app/globals.css` | |
| 291 | React error boundary: glass "Something broke" card | ✅ | `src/app/error.tsx` | |
| 292 | All config via env, documented .env.example | ✅ | `next.config.ts` | |
| 293 | Security headers in next.config | ✅ | `next.config.ts` | |
| 294 | Optional Sentry wiring stubbed and commented | ❌ | — | No Sentry reference anywhere in the repo — not even a commented stub. |

### U · Code Quality & DX (295–304)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 295 | TypeScript strict; zero `any`; typed content models | ✅ | `tsconfig.json` | |
| 296 | ESLint + Prettier configured and passing | ⚠️ | `eslint.config.mjs` | Prettier is neither installed nor configured; eslint exits 0 with 2 warnings. |
| 297 | README documents the component tree | ✅ | `README.md` | |
| 298 | All copy/content lives in `src/content/data.ts` | ⚠️ | `src/components/sections/Contact.tsx` | Form microcopy, dataset names, 404/error/uses chrome copy live in components. |
| 299 | All design tokens in one `tokens.css` | ✅ | `src/styles/tokens.css` | |
| 300 | Primitives built once, reused everywhere | ✅ | `src/components/primitives/` | |
| 301 | `useReducedMotionSafe()` used by every animated component | ⚠️ | `src/components/providers/ToastProvider.tsx` | ToastProvider, ThemeToggle and ScrollProgressBar animate without the hook. |
| 302 | Non-obvious animation timelines carry a comment | ✅ | `src/components/sections/Hero.tsx` | |
| 303 | Scripts: dev · build · start · lint · analyze | ✅ | `package.json` | |
| 304 | README: setup, asset regen, deploy, audit table | ✅ | `README.md` | |

---

### Deferred / not implemented

**Not implemented (❌ — 5)**

- **231 · Lazy-mounted below-fold sections.** There is no IntersectionObserver mounting wrapper in the codebase. `Reveal` uses ScrollTrigger to *animate* sections, but every section is mounted with the page. The only IO-gated mount is the Confetti canvas in `AwardsSection`.
- **232 · Lighthouse ≥95 documented and met.** No scores are recorded in the README or any other file, so the target is neither documented nor demonstrated. Running Lighthouse against the production build and pasting the four numbers would close this.
- **239 · preconnect / dns-prefetch.** `src/app/layout.tsx` declares the hints inside a manual `<head>` element, but the served HTML from the production build contains no `preconnect`, no `dns-prefetch`, and no reference to `api.github.com` at all — Next drops the hand-written `<head>`. Emitting them through the Metadata API (or `ReactDOM.preconnect`) would fix it. The analytics-origin hint was never written.
- **275 · Automated overflow audit in dev.** `body { overflow-x: clip }` suppresses a horizontal scrollbar, but nothing checks for overflowing elements, so regressions would be hidden rather than caught.
- **294 · Sentry stub.** Nothing in the repo mentions Sentry, commented or otherwise.

**Partial (⚠️ — 26)**

- **48 · Aurora behind hero glass.** `AuroraBackground` is `fixed … -z-10`; the hero's full-bleed video (or poster) paints over it, so no aurora is visible through the hero's glass chips.
- **57 · Hero as Konami zone.** The hero carries a `data-konami-zone` attribute that nothing reads; `EasterEggs` listens on `window`, so the code works anywhere on the page rather than in the hero specifically.
- **71 · Blur-up placeholders on all images.** The portrait and the project covers pass `blurDataURL`; the Beyond polaroids and the case-page prev/next covers do not.
- **92 · Reduced motion in Skills.** Marquees flatten to wrapped rows and tilt is disabled, but `GlassCard`'s cursor spotlight keeps tracking because it is a CSS hover effect, not a motion-gated one.
- **107 · Print as single-column resume.** The print stylesheet hides chrome, flattens glass and strips shadows, but no rule forces the section grids to one column, so multi-column layouts survive into print.
- **114 · Shared-element transition to the case page.** Navigation works and the case-page cover sets `viewTransitionName`, but `ProjectCard` has no matching `layoutId` or view-transition name and Next's view-transition support is not enabled, so nothing morphs.
- **135 · External link chip on each award card.** The SIH card's `link` is an empty string in `data.ts`, so it renders no chip at all; the other two show the `[ADD LINK]` placeholder.
- **179 · Version tag from package.json.** The chip renders `site.version` from `data.ts` ("1.0.0"); `package.json` still says "0.1.0", so the two can drift.
- **182 · Konami hint as an HTML comment.** The console line is there, but `{/* ↑↑↓↓←→←→BA */}` is a JSX comment — it is stripped at compile time and never reaches the HTML. Confirmed absent from the rendered page.
- **190 · Cursor drag state.** `applyState` implements `drag` (shows ⟷), but no element in the site sets `data-cursor="drag"`, so it can never fire.
- **195 · Images zoom 1.04–1.08 in clipped frames.** Project covers do (1.06). The About portrait and both Beyond photos have no hover zoom, and the prev/next preview scales to 1.10.
- **205 · One glass recipe for all surfaces.** `Preloader`, `Navbar`, `RouteTransition`, the `ProjectCard` caption bar and the palette scrim each inline their own `backdrop-filter` instead of going through `.glass*`.
- **210 · GrainOverlay below content.** It is fixed, tiling, 3% and `pointer-events: none` as specified, but `z-[5]` places it above section content rather than below it.
- **220 · All colors from CSS variables.** Hard-coded values remain: the hero vignette and headline glow, magnetic/social hover shadows, the focus-ring glow, the filmstrip sprocket backing, the cursor's white, and the `themeColor` hexes in `layout.tsx`.
- **230 · Heavy extras via next/dynamic.** Only `Confetti` uses it. The command palette is conditionally mounted (its shell stays in the initial bundle), and `RunnerGame` is a static import in `not-found.tsx`.
- **235 · Composite-only animations, will-change removed.** The hero now clears `will-change` after its intro, but Contact's heading words keep it permanently, and the clip-path / `filter: blur()` reveals used throughout are not compositor-only properties.
- **236 · Scroll/resize through the ticker or rAF.** The navbar and the work carousel are rAF-throttled, but the hero's scroll-indicator listener and the footer's resize listener run unthrottled on every event.
- **251 · SR-only text on external links.** Present on the nav, mobile menu, footer and contact links; missing from the repo cards, the More-on-GitHub end card, and the award link chips.
- **264 · `rel="me"` on social links.** Only the two Contact pills use `rel="me noopener"`. The navbar, mobile menu and footer socials use `rel="noopener noreferrer"`.
- **267 · Audited at five widths.** Layouts use fluid clamps and responsive grids throughout, but there is no screenshot set or audit record for 360/768/1024/1440/1920.
- **269 · Touch equivalent for hover-only info.** The project card's caption bar carries year, role and headline metric, and only slides up on hover — a touch user never sees it.
- **270 · iOS safe-area insets for nav and footer.** `.safe-top` / `.safe-bottom` exist and are used by the mobile menu and toast stack; the navbar and footer never apply them.
- **284 · Date-aware console greeting.** New Year and a Diwali lookup table are implemented; the site-anniversary greeting the spec asks for is absent.
- **296 · ESLint + Prettier passing.** ESLint is configured and exits 0. Prettier is not a dependency and has no config. At audit time `npx eslint` also printed two `no-unused-vars` warnings in `AwardsSection.tsx`, which another agent was mid-edit on; those have since resolved.
- **298 · All copy in `data.ts`.** Contact's form labels, validation messages and status lines; `EasterEggs`' dataset names; and the 404, error-boundary and /uses chrome copy are all hard-coded in components.
- **301 · `useReducedMotionSafe()` in every animated component.** `ToastProvider`, `ThemeToggle` and `ScrollProgressBar` run Framer Motion / GSAP animations without consulting the hook; they rely on the global CSS collapse, which does not reach JS-driven animation.

**Context on two items that were judged in the project's favour**

- **238 · ISR.** On a server deploy (Vercel) `RepoCards` fetches with `next: { revalidate: 86400 }`, exactly as specified. Under the current GitHub Pages target (`output: "export"`) ISR is impossible, so the fetch switches to `cache: "force-cache"` and the repo list is baked at build time. Verified: the deployed HTML contains six real repositories.
- **293 · Security headers.** `next.config.ts` sets `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and a minimal CSP. They are skipped when `GITHUB_PAGES=true`, because static Pages hosting cannot emit response headers — a platform limit, not a gap in the code.

**Not directly readable during this audit**

`.env.example` is blocked by a tooling permission rule, so feature 292 was judged from its consumers (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_FORM_ENDPOINT`, `NEXT_PUBLIC_ANALYTICS_ID`, `NEXT_PUBLIC_BASE_PATH`) and the README section that documents them. The file exists and is 19 lines long.
