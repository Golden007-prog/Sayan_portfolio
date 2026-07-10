# Feature audit — 304 features

Every numbered feature in §6 of `CLAUDE_CODE_PORTFOLIO_PROMPT.md` was checked against the
actual source in `src/`, `public/`, `scripts/`, `next.config.ts` and `README.md` — not against
the `§n` comments, which were treated as claims rather than evidence. Anything that could only
be settled from output was verified by running it: the served HTML of the current production
build (resource hints, the Konami comment, the single `h1`, the GitHub repo cards, the 404
route), `npx eslint`, `node scripts/contrast.mjs`, `node scripts/overflow-audit.mjs`
(20/20 viewports pass), and a gzip measurement of every client chunk. Where a verdict rests on
a judgement call rather than a mechanical check, the note says so.

**Summary: ✅ 287 · ⚠️ 16 · ❌ 1 — of 304.**

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
| 37 | 100svh hero with hero-loop video background | ⚠️ | `src/components/sections/Hero.tsx` | Video mounts only at ≥768px after idle; phones always get the static poster. |
| 38 | muted/autoplay/loop/playsinline, webm→mp4, poster | ✅ | `src/components/sections/Hero.tsx` | |
| 39 | Readability stack: scrim + grain + vignette | ✅ | `src/components/sections/Hero.tsx` | |
| 40 | Per-letter clip-path mask rise, ~30ms stagger | ✅ | `src/components/sections/Hero.tsx` | |
| 41 | Role typewriter ticker with blinking cursor | ✅ | `src/components/sections/RoleTicker.tsx` | |
| 42 | Intro sentence animates blur(12px) → sharp | ✅ | `src/components/sections/Hero.tsx` | |
| 43 | Two glass CTAs: View Work + Download Resume | ✅ | `src/components/sections/Hero.tsx` | |
| 44 | Mouse-parallax at three depths, max 12px, lerped | ✅ | `src/components/sections/Hero.tsx` | |
| 45 | 4 floating glass chips with individual drift loops | ✅ | `src/components/sections/Hero.tsx` | |
| 46 | Scroll indicator fades out after first scroll | ✅ | `src/components/sections/Hero.tsx` | |
| 47 | Stats strip counts up, incl. 9→0 defects gag | ✅ | `src/components/primitives/CountUp.tsx` | |
| 48 | Aurora blobs visible behind hero glass | ⚠️ | `src/components/fx/AuroraBackground.tsx` | Aurora sits at `-z-10`; the hero's full-bleed video/poster paints over it. |
| 49 | Headline glow text-shadow in dark mode only | ✅ | `src/components/sections/Hero.tsx` | |
| 50 | Video pauses on hidden tab / off-screen / reduced motion | ✅ | `src/components/sections/Hero.tsx` | |
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
| 71 | All images lazy-load with blur-up placeholders | ✅ | `src/components/sections/Beyond.tsx` | |
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
| 92 | Reduced motion: static marquee, no tilt/spotlight | ⚠️ | `src/components/primitives/GlassCard.tsx` | Marquee and tilt collapse, but the CSS-hover spotlight is never motion-gated. |

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
| 103 | "Zero critical defects" shimmering achievement badge | ✅ | `src/components/sections/Experience.tsx` | |
| 104 | Domain tags as mono chips | ✅ | `src/components/sections/Experience.tsx` | |
| 105 | Mobile: single left-rail timeline | ✅ | `src/components/sections/Experience.tsx` | |
| 106 | Education block closes the timeline | ✅ | `src/components/sections/Experience.tsx` | |
| 107 | Print stylesheet = clean single-column resume | ⚠️ | `src/app/globals.css` | Chrome hidden and glass flattened, but section grids stay multi-column. |
| 108 | JSON-LD describes current role + employer | ✅ | `src/components/seo/JsonLd.tsx` | |

### G · Selected Work / Projects (109–130)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 109 | Desktop horizontally-pinned GSAP gallery | ✅ | `src/components/sections/WorkGallery.tsx` | |
| 110 | All 4 projects as large glass case cards | ✅ | `src/components/sections/WorkGallery.tsx` | |
| 111 | Card: cover, mono index, title, subtitle, chips | ✅ | `src/components/work/ProjectCard.tsx` | |
| 112 | Hover: cover 1.06, caption slides up, arrow -45° | ✅ | `src/components/work/ProjectCard.tsx` | |
| 113 | Cursor morphs to "VIEW →" pill over cards | ✅ | `src/components/providers/CursorProvider.tsx` | |
| 114 | Click → case page with shared-element transition | ✅ | `src/components/work/ProjectCard.tsx` | |
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
| 179 | Version tag read from package.json | ⚠️ | `src/components/shell/Footer.tsx` | Renders `site.version` from `data.ts`, not an import of package.json; now in sync. |
| 180 | Footer revealed by a parallax curtain lift | ✅ | `src/components/shell/Footer.tsx` | |
| 181 | Unlabeled "·" dot links to hidden /uses | ✅ | `src/components/shell/Footer.tsx` | |
| 182 | Konami hint as HTML comment + console line | ✅ | `src/app/layout.tsx` | |

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
| 190 | Cursor states: link, drag, view, text | ⚠️ | `src/components/providers/CursorProvider.tsx` | The `drag` state is implemented but no element sets `data-cursor="drag"`. |
| 191 | Cursor fully disabled on coarse pointers | ✅ | `src/components/providers/CursorProvider.tsx` | |
| 192 | `MagneticButton` primitive on all primary CTAs | ✅ | `src/components/primitives/MagneticButton.tsx` | |
| 193 | Button hover: sweep + 2px lift + shadow bloom | ✅ | `src/components/primitives/MagneticButton.tsx` | |
| 194 | Link underline draws left→right, exits right | ✅ | `src/app/globals.css` | |
| 195 | All images zoom 1.04–1.08 inside clipped frames | ✅ | `src/components/work/ProjectCard.tsx` | |
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
| 205 | One `.glass` recipe powers all surfaces | ⚠️ | `src/app/globals.css` | Inline `backdrop-filter` in Preloader, Navbar, RouteTransition, palette, caption. |
| 206 | Three depth tiers used intentionally | ✅ | `src/components/primitives/GlassCard.tsx` | |
| 207 | Inset top-edge highlight on every glass surface | ✅ | `src/app/globals.css` | |
| 208 | Animated conic-gradient border variant (8s) | ✅ | `src/app/globals.css` | |
| 209 | `AuroraBackground`: 3 blurred blobs, slow drift | ✅ | `src/components/fx/AuroraBackground.tsx` | |
| 210 | `GrainOverlay`: fixed, 3%, above color, below content | ✅ | `src/components/fx/GrainOverlay.tsx` | |
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
| 220 | 100% of colors flow from CSS variables | ⚠️ | `src/components/sections/Hero.tsx` | Hard-coded rgba/hex remain in glow shadows, hero vignette, focus ring, theme-color. |
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
| 230 | Heavy extras loaded via next/dynamic on demand | ⚠️ | `src/components/sections/AwardsSection.tsx` | Only Confetti; the palette is conditionally mounted, the 404 game is a static import. |
| 231 | Below-fold sections lazy-mounted via IO wrapper | ❌ | — | Deliberately skipped: it would strip six sections from the SSR HTML. |
| 232 | Lighthouse ≥95 across 4 categories, documented | ⚠️ | `README.md` | Measured and documented; mobile Performance is 78, desktop meets ≥95 on all four. |
| 233 | CLS < 0.05 — explicit aspect-ratio box per media | ✅ | `src/app/globals.css` | |
| 234 | LCP < 2.5s — poster prioritized, headline SSR text | ✅ | `src/components/sections/Hero.tsx` | |
| 235 | Composite-only animations; will-change removed | ⚠️ | `src/components/sections/Contact.tsx` | clip-path/filter reveals aren't compositor-only; the heading keeps `will-change`. |
| 236 | Scroll/resize work on the GSAP ticker or rAF | ⚠️ | `src/components/sections/Hero.tsx` | One raw listener left: passive, a single `scrollY` read, detaches on first scroll. |
| 237 | `ANALYZE=true` script; no client chunk > 180KB gz | ✅ | `next.config.ts` | |
| 238 | All routes static; GitHub data via ISR (86400) | ✅ | `src/components/work/RepoCards.tsx` | |
| 239 | preconnect/dns-prefetch for api.github.com | ✅ | `src/app/layout.tsx` | |
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
| 251 | SR-only helper text on external links | ✅ | `src/components/work/RepoCards.tsx` | |
| 252 | prefers-contrast: more strengthens borders/alpha | ✅ | `src/app/globals.css` | |
| 253 | lang="en"; every route has a descriptive title | ✅ | `src/app/layout.tsx` | |
| 254 | Usable at 200% zoom without horizontal scroll | ✅ | `scripts/overflow-audit.mjs` | |

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
| 264 | `rel="me"` on social links | ✅ | `src/components/shell/Navbar.tsx` | |
| 265 | Full favicon set + maskable icon in manifest | ✅ | `src/app/manifest.ts` | |
| 266 | Per-project OG metadata via generateMetadata | ✅ | `src/app/projects/[slug]/page.tsx` | |

### R · Responsive & Device (267–276)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 267 | Audited at 360/768/1024/1440/1920px | ✅ | `scripts/overflow-audit.mjs` | |
| 268 | Fluid type and spacing via clamp() | ✅ | `src/styles/tokens.css` | |
| 269 | Hover-only information has a touch equivalent | ✅ | `src/components/work/ProjectCard.tsx` | |
| 270 | iOS safe-area insets for nav and footer | ✅ | `src/components/shell/Navbar.tsx` | |
| 271 | svh/dvh units for hero height | ✅ | `src/components/sections/Hero.tsx` | |
| 272 | Hover effects gated behind hover:hover + pointer:fine | ✅ | `src/app/globals.css` | |
| 273 | Bento/timeline/gallery reflow to single column | ✅ | `src/components/sections/Skills.tsx` | |
| 274 | Art-directed crops per breakpoint | ✅ | `src/components/sections/Beyond.tsx` | |
| 275 | Zero horizontal scrollbars (automated dev audit) | ✅ | `scripts/overflow-audit.mjs` | |
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
| 284 | Date-aware console greeting | ✅ | `src/components/providers/EasterEggs.tsx` | |
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
| 294 | Optional Sentry wiring stubbed and commented | ✅ | `src/lib/sentry.ts` | |

### U · Code Quality & DX (295–304)

| # | Feature | Status | File | Note |
| --- | --- | --- | --- | --- |
| 295 | TypeScript strict; zero `any`; typed content models | ✅ | `tsconfig.json` | |
| 296 | ESLint + Prettier configured and passing | ⚠️ | `eslint.config.mjs` | ESLint is clean (exit 0, no warnings); Prettier is neither installed nor configured. |
| 297 | README documents the component tree | ✅ | `README.md` | |
| 298 | All copy/content lives in `src/content/data.ts` | ⚠️ | `src/components/shell/CommandPalette.tsx` | Palette, Preloader, WorkGallery and Experience still hard-code shell microcopy. |
| 299 | All design tokens in one `tokens.css` | ✅ | `src/styles/tokens.css` | |
| 300 | Primitives built once, reused everywhere | ✅ | `src/components/primitives/` | |
| 301 | `useReducedMotionSafe()` used by every animated component | ✅ | `src/hooks/useReducedMotionSafe.ts` | |
| 302 | Non-obvious animation timelines carry a comment | ✅ | `src/components/sections/Hero.tsx` | |
| 303 | Scripts: dev · build · start · lint · analyze | ✅ | `package.json` | |
| 304 | README: setup, asset regen, deploy, audit table | ✅ | `README.md` | |

---

### Deferred / not implemented

**Not implemented (❌ — 1)**

- **231 · Lazy-mounted below-fold sections.** Deliberately skipped, not overlooked. Mounting About, Skills, Experience, Work, Awards, Beyond and Contact behind an IntersectionObserver would remove all of their prose from the server-rendered HTML, costing real SEO weight and breaking the page for no-JS readers, in exchange for deferring components that are already cheap. The costly extras are deferred instead: `Confetti` ships in its own chunk via `next/dynamic` and only mounts once the awards section is within 400px of the viewport, the hero video waits for `requestIdleCallback`, and the About ambient video attaches its `src` on first reveal.

**Partial (⚠️ — 16)**

- **37 · Hero video background.** The `<video>` only mounts on viewports ≥768px and only after `requestIdleCallback` fires, so phones and small tablets always see the static poster. This is a deliberate LCP trade (explained in the README's mobile-performance analysis), but it means the spec'd video background is absent on the devices most visitors will use.
- **48 · Aurora behind hero glass.** `AuroraBackground` is `fixed … -z-10`; the hero's full-bleed video (or poster) paints over it, so no aurora shows through the hero's glass chips. Every other section layers over it as intended.
- **57 · Hero as Konami zone.** The hero still carries a `data-konami-zone` attribute that nothing reads. `EasterEggs` listens on `window`, so the code fires anywhere on the page rather than in the hero specifically — a superset of the requirement, but the marker is dead.
- **92 · Reduced motion in Skills.** Marquees flatten to wrapped rows and `TiltCard` disables itself, but `GlassCard`'s cursor spotlight is a pure CSS hover effect with no `useReducedMotionSafe()` gate, so the radial gradient still tracks the pointer.
- **107 · Print as single-column resume.** The print stylesheet hides chrome, flattens glass and strips shadows, but no rule collapses the section grids, so the bento, the two-column About panel and the case-study rail all survive into print as multi-column layouts.
- **135 · External link chip on each award card.** The SIH card's `link` is an empty string in `data.ts`, so it renders no chip at all. The other two show the dashed `[ADD LINK]` placeholder as designed.
- **179 · Version tag from package.json.** `package.json` now reads `1.0.0` and matches, so nothing is wrong on screen — but the chip still renders `site.version` from `data.ts` rather than importing the manifest, which is exactly the duplication the requirement exists to prevent. `resolveJsonModule` is already enabled, so `import pkg from "../../package.json"` would close it.
- **190 · Cursor drag state.** `applyState` implements `drag` (shows ⟷) but nothing anywhere sets `data-cursor="drag"`, so it can never fire. The toast stack is the site's one draggable surface and it doesn't opt in.
- **205 · One glass recipe for all surfaces.** `Preloader`, `Navbar`, `RouteTransition`, the `ProjectCard` caption bar and the command-palette scrim each inline their own `backdrop-filter` rather than composing `.glass*`. The values match the recipe today, so this is a maintenance risk rather than a visual one.
- **220 · All colors from CSS variables.** Hard-coded values remain in the hero vignette and headline glow, the magnetic and social hover shadows, the focus-ring glow, the filmstrip sprocket backing, and the `themeColor` hexes in `layout.tsx`. The canvas fallbacks in `Confetti`, `Particles` and `RunnerGame` read `getComputedStyle` first and only fall back to a literal, which is reasonable.
- **230 · Heavy extras via next/dynamic.** Only `Confetti` uses it. The command palette is conditionally mounted (its shell and keyboard listener must stay in the initial bundle for the shortcut to work), and `RunnerGame` is a static import in `not-found.tsx` — cheap, but not the mechanism the spec names.
- **232 · Lighthouse ≥95 across four categories.** Now measured and honestly documented rather than absent: desktop 99/100/96/100, mobile 78/100/96/100. Desktop meets the bar; mobile Performance does not. The README explains why — the simulated mobile LCP of 4.7s is driven by the mandated per-letter headline reveal (§40), which keeps the LCP element transparent until GSAP plays it, while a real throttled measurement puts LCP at 1.74s. The number is the honest one, so this row cannot be ✅.
- **235 · Composite-only animations, will-change removed.** The hero now clears `will-change` when its intro completes, and the remaining declarations (marquee track, gallery track, filmstrip playhead) sit on continuously-animating elements where they belong. Two gaps stand: Contact's heading words keep `will-change-transform` permanently after a one-shot reveal, and the clip-path and `filter: blur()` reveals the spec itself mandates are not compositor-only properties.
- **236 · Scroll/resize through the ticker or rAF.** The footer's resize handler is now rAF-throttled, and the navbar and carousel already were. One raw listener remains — the hero's scroll indicator — but it is passive, performs a single `scrollY` read per event, and removes itself the first time the page scrolls past 32px. The practical cost is nil; it simply isn't the mechanism the clause specifies.
- **296 · ESLint + Prettier passing.** `npx eslint` exits 0 with no warnings, and CI runs it ahead of the contrast gate. Prettier is neither a dependency nor configured, so half the requirement has no implementation.
- **298 · All copy in `data.ts`.** Section copy, contact microcopy, terminal and easter-egg strings, and the 404, error-boundary and /uses chrome now all live in `data.ts`. What remains hard-coded is shell microcopy: the command palette's placeholder, empty-state line and key hints; the preloader's "Skip"; "More on GitHub" in the gallery; the "Achievement" badge in the timeline; and the marquee's pause-button labels.

**Context on rows judged in the project's favour**

- **238 · ISR.** On a server deploy `RepoCards` fetches with `next: { revalidate: 86400 }`, exactly as specified. Under the live GitHub Pages target (`output: "export"`) ISR is impossible, so the fetch switches to `cache: "force-cache"` and the repo list is baked at build time. Verified: the served HTML contains six real repositories.
- **267 / 275 · Responsive and overflow audit.** `scripts/overflow-audit.mjs` drives real headless Chrome across four routes × the five specified widths and asserts the document cannot scroll horizontally — it scrolls the viewport and reads `scrollX` rather than trusting `scrollWidth`, which `overflow-x: clip` makes unreliable. Run against the current build it reports 20/20 pass. That is a mechanical overflow check, not a visual review of every breakpoint, so "no layout breaks" is verified only in the sense that nothing overflows.
- **293 · Security headers.** `next.config.ts` sets `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and a minimal CSP. They are skipped when `GITHUB_PAGES=true`, because static Pages hosting cannot emit response headers — a platform limit, not a gap in the code.
- **239 / 182 · Corrected from the previous audit.** Both were marked against a stale build. Re-checked against the current production build: the served `<head>` contains `rel="preconnect"` plus both `dns-prefetch` hints for `api.github.com` and `avatars.githubusercontent.com`, and `<!-- ↑↑↓↓←→←→BA -->` is a real HTML comment in the body, injected through `dangerouslySetInnerHTML` because JSX comments never reach the DOM.

**Not directly readable during this audit**

`.env.example` is blocked by a tooling permission rule, so feature 292 was judged from its consumers (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_FORM_ENDPOINT`, `NEXT_PUBLIC_ANALYTICS_ID`, `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_BASE_PATH`) and the README sections that document them.
