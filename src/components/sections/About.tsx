"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Download,
  GitBranch,
  Pause,
  Play,
  Sparkles,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import { gsap } from "@/lib/gsap";
import { aboutCopy, awards, education, media, owner } from "@/content/data";
import { GlassCard } from "@/components/primitives/GlassCard";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { Reveal } from "@/components/primitives/Reveal";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { TiltCard } from "@/components/primitives/TiltCard";
import { Parallax } from "@/components/primitives/Parallax";
import { useToast } from "@/components/providers/ToastProvider";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { cn } from "@/lib/cn";

/* ————— data-driven helpers ————— */

const ICONS: Record<string, LucideIcon> = {
  terminal: Terminal,
  "git-branch": GitBranch,
  sparkles: Sparkles,
};

// Icon glyphs are readable foreground marks, not decoration — the vivid
// accents fail WCAG on the light surface, so use the auto-darkening *t tokens.
const ICON_ACCENTS = ["text-accent1t", "text-accent2t", "text-accent3t"];

/**
 * Demotes a nested glass chip to a flat translucent surface: the tint, border
 * and inner highlight from .glass/.glass-1 stay, but backdrop-filter is dropped.
 * Every chip and card in this section sits inside the already-frosted tier-2
 * panel, and blurred surfaces nested in a blurred parent are the most expensive
 * kind — this keeps the viewport within the ≤3-large-blurred-regions budget
 * while the outer panel keeps its frost.
 */
const FLAT_GLASS: CSSProperties = {
  backdropFilter: "none",
  WebkitBackdropFilter: "none",
};

/** Tiny deep-space gradient placeholder — blur-up without shipping a real thumb (§71). */
const PORTRAIT_BLUR =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='8' height='10'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#1a1533'/><stop offset='.55' stop-color='#14283a'/><stop offset='1' stop-color='#0b0f1a'/></linearGradient></defs><rect width='8' height='10' fill='url(%23g)'/></svg>",
  );

/**
 * Sentence splitter safe for "B.Tech", "8.30" and "watsonx.ai" —
 * only breaks on terminal punctuation followed by space + capital.
 */
function splitIntoSentences(text: string): string[] {
  const out: string[] = [];
  let buf = "";
  for (let i = 0; i < text.length; i++) {
    buf += text[i];
    const ch = text[i];
    const next = text[i + 1];
    const after = text[i + 2];
    if (
      (ch === "." || ch === "!" || ch === "?") &&
      next === " " &&
      after !== undefined &&
      after >= "A" &&
      after <= "Z"
    ) {
      out.push(buf.trim());
      buf = "";
      i += 1; // swallow the sentence-break space
    }
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const HIGHLIGHT_RE =
  aboutCopy.highlights.length > 0
    ? new RegExp(
        `(${[...aboutCopy.highlights]
          .sort((a, b) => b.length - a.length)
          .map(escapeRegExp)
          .join("|")})`,
        "g",
      )
    : null;

/** Wraps every `aboutCopy.highlights` phrase found in `text` in a gradient span (§62). */
function highlightPhrases(text: string): ReactNode {
  if (!HIGHLIGHT_RE) return text;
  return text.split(HIGHLIGHT_RE).map((part, i) =>
    aboutCopy.highlights.includes(part) ? (
      <span key={i} className="text-gradient font-medium">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/** vCard text-value escaping per RFC 2426 §2.4.2. */
function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function buildVCard(): string {
  const parts = owner.name.split(" ");
  const family = parts.length > 1 ? parts[parts.length - 1] : "";
  const given = parts.slice(0, Math.max(parts.length - 1, 1)).join(" ");
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCard(family)};${escapeVCard(given)};;;`,
    `FN:${escapeVCard(owner.name)}`,
    `TITLE:${escapeVCard(owner.role)}`,
    `TEL;TYPE=CELL:${escapeVCard(owner.phone)}`,
    `EMAIL;TYPE=INTERNET:${escapeVCard(owner.email)}`,
    `URL:${escapeVCard(owner.linkedin)}`,
    `URL:${escapeVCard(owner.github)}`,
    "END:VCARD",
    "",
  ].join("\r\n");
}

const NARRATIVE_LINES = splitIntoSentences(aboutCopy.narrative);

const SIH_AWARD = awards.find((a) => a.title.includes("SIH"));
const SIH_CHIP = SIH_AWARD
  ? `${/\(([^)]+)\)/.exec(SIH_AWARD.title)?.[1] ?? SIH_AWARD.title} ${SIH_AWARD.year}`
  : null;

/* ————— fun-fact rotator (§67) ————— */

function FunFactRotator({ reduced }: { reduced: boolean }) {
  const facts = aboutCopy.funFacts;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Pause while the region is hovered or holds keyboard focus (WCAG 2.2.2).
  const [interacting, setInteracting] = useState(false);

  const canRotate = !reduced && facts.length >= 2;
  const running = canRotate && !paused && !interacting;

  // Only tick when actually running; under reduced motion the interval never
  // starts and the first fact renders statically.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % facts.length),
      3800,
    );
    return () => window.clearInterval(id);
  }, [running, facts.length]);

  return (
    <GlassCard
      tier={1}
      style={FLAT_GLASS}
      className="px-5 py-4"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setInteracting(false);
        }
      }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="eyebrow">Fun fact</p>
        {canRotate && (
          <button
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused((p) => !p)}
            className="-my-2 -mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-fg transition-colors duration-200 hover:text-fg"
          >
            {paused ? <Play size={15} aria-hidden /> : <Pause size={15} aria-hidden />}
            <span className="sr-only">
              {paused ? "Resume fun-fact rotation" : "Pause fun-fact rotation"}
            </span>
          </button>
        )}
      </div>
      <div className="relative min-h-[1.75rem] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={index}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -14 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm text-fg"
          >
            {facts[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}

/* ————— section ————— */

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotionSafe();
  const { toast } = useToast();

  /* Ambient video decodes only while visible: pause off-screen (§68) and on
     hidden tabs. Never runs under reduced motion (the element isn't rendered). */
  useEffect(() => {
    if (reduced) return;
    const video = videoRef.current;
    if (!video) return;

    let onScreen = false;
    const sync = () => {
      if (onScreen && document.visibilityState === "visible") {
        // Attach the source on first reveal, not at mount: an eager `src` on a
        // below-the-fold autoplaying video pulls ~180KB during the LCP window.
        if (!video.src) video.src = media.aboutAmbient;
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? false;
        sync();
      },
      { threshold: 0.01 },
    );
    io.observe(video);
    document.addEventListener("visibilitychange", sync);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [reduced]);

  /* Hand-drawn underline draw-on (§64) + language proficiency bars (§65). */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const path = el.querySelector<SVGPathElement>("[data-about-underline]");
      const bars = Array.from(
        el.querySelectorAll<HTMLElement>("[data-lang-bar]"),
      );

      if (reduced) {
        if (path) gsap.set(path, { strokeDashoffset: 0 });
        bars.forEach((bar) =>
          gsap.set(bar, { scaleX: Number(bar.dataset.pct ?? "100") / 100 }),
        );
        return;
      }

      if (path) {
        gsap.fromTo(
          path,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: "power2.inOut",
            scrollTrigger: { trigger: path, start: "top 85%", once: true },
          },
        );
      }

      bars.forEach((bar, i) => {
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: Number(bar.dataset.pct ?? "100") / 100,
            duration: 1,
            delay: i * 0.08,
            scrollTrigger: {
              trigger: bar.parentElement ?? bar,
              start: "top 92%",
              once: true,
            },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  /* "Save contact" → vCard blob download (§66). */
  const saveContact = useCallback(() => {
    const blob = new Blob([buildVCard()], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${owner.name.toLowerCase().replace(/\s+/g, "-")}.vcf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast("Contact card saved", { icon: "check" });
  }, [toast]);

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-label={aboutCopy.heading}
      className="relative py-[var(--section-pad)]"
    >
      <div className="container-site">
        <div id="about-heading">
          <SectionHeading eyebrow={aboutCopy.eyebrow} heading={aboutCopy.heading} />
        </div>

        {/* Hand-drawn underline, draws itself into the heading's breathing room (§64) */}
        <svg
          aria-hidden
          viewBox="0 0 260 20"
          fill="none"
          preserveAspectRatio="none"
          className="-mt-10 mb-12 block h-4 w-44 md:-mt-16 md:mb-16 md:h-5 md:w-64"
        >
          <defs>
            <linearGradient id="about-underline-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="var(--accent-1)" />
              <stop offset="1" stopColor="var(--accent-2)" />
            </linearGradient>
          </defs>
          <path
            data-about-underline
            d="M4 13 C 42 5, 78 17, 118 10 C 152 4, 186 15, 224 9 C 238 7, 248 8, 256 11"
            pathLength={1}
            stroke="url(#about-underline-grad)"
            strokeWidth={3.5}
            strokeLinecap="round"
            style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
          />
        </svg>

        <div className="relative isolate">
          {/* Whisper-subtle ambient video, frosted by the panel's glass (§68) */}
          {!reduced && (
            <Parallax
              speed={0.15}
              className="absolute -inset-x-[8%] -inset-y-[16%] -z-10 overflow-hidden"
            >
              <video
                ref={videoRef}
                aria-hidden
                muted
                loop
                playsInline
                preload="none"
                tabIndex={-1}
                className="pointer-events-none h-full w-full object-cover opacity-25"
              />
            </Parallax>
          )}

          {/* Two-column glass panel (§60) */}
          <GlassCard tier={2} className="p-6 md:p-10 lg:p-12">
            <div className="grid items-start gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
              {/* — Portrait column — */}
              <div className="flex flex-col gap-6">
                <Reveal variant="scale">
                  <TiltCard maxDeg={6} className="mx-auto w-full max-w-sm">
                    {/* Animated gradient ring frame (§60) */}
                    <div className="glass glass-conic p-2" style={FLAT_GLASS}>
                      <div className="group relative aspect-[4/5] overflow-hidden rounded-[calc(var(--radius-glass)-0.5rem)]">
                        <Image
                          src={media.aboutPortrait}
                          alt={`${owner.name} — ${owner.headline}`}
                          fill
                          sizes="(min-width: 768px) 24rem, 90vw"
                          placeholder="blur"
                          blurDataURL={PORTRAIT_BLUR}
                          // Zoom stays inside the clipped frame, transform-only,
                          // fine-pointer + hover-capable only, off under reduced motion (§195).
                          className={cn(
                            "object-cover",
                            !reduced &&
                              "transition-transform duration-[600ms] ease-[var(--ease-out-soft)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.05]",
                          )}
                        />
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>

                <Reveal variant="fade-up" delay={0.1}>
                  <FunFactRotator reduced={reduced} />
                </Reveal>

                <Reveal variant="fade-up" delay={0.16} className="flex">
                  <MagneticButton
                    variant="ghost"
                    type="button"
                    onClick={saveContact}
                    className="w-full"
                    aria-label={`Save ${owner.name}'s contact card`}
                  >
                    <Download size={16} aria-hidden />
                    Save contact
                  </MagneticButton>
                </Reveal>
              </div>

              {/* — Narrative column — */}
              <div className="flex flex-col gap-8">
                {/* Line-by-line mask reveal with gradient highlights (§61, §62) */}
                <div data-cursor="text">
                  <Reveal variant="mask" stagger={0.08} className="space-y-3">
                    {NARRATIVE_LINES.map((line, i) => (
                      <p key={i} className="text-base leading-relaxed text-fg/90 md:text-lg">
                        {highlightPhrases(line)}
                      </p>
                    ))}
                  </Reveal>
                </div>

                {/* Badge row: CGPA + SIH mono chips (§69) */}
                <Reveal variant="fade-up" delay={0.08} className="flex flex-wrap gap-2">
                  <span
                    className="mono-chip glass-1 rounded-full px-3.5 py-1.5"
                    style={FLAT_GLASS}
                  >
                    {education.cgpa}
                  </span>
                  {SIH_CHIP && (
                    <span
                      className="mono-chip glass-1 rounded-full px-3.5 py-1.5"
                      style={FLAT_GLASS}
                    >
                      {SIH_CHIP}
                    </span>
                  )}
                </Reveal>

                {/* "What I do" minis with hover lift + icon nudge (§63) */}
                <Reveal
                  variant="fade-up"
                  stagger={0.07}
                  className="grid gap-4 sm:grid-cols-3"
                >
                  {aboutCopy.whatIDo.map((item, i) => {
                    const Icon = ICONS[item.icon] ?? Sparkles;
                    return (
                      <div key={item.title}>
                        <GlassCard
                          tier={1}
                          sheen
                          style={FLAT_GLASS}
                          className="group h-full p-5 transition-transform duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1.5"
                        >
                          <span
                            aria-hidden
                            style={FLAT_GLASS}
                            className={cn(
                              "glass-1 inline-flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:-translate-y-1 group-hover:rotate-6",
                              ICON_ACCENTS[i % ICON_ACCENTS.length],
                            )}
                          >
                            <Icon size={18} />
                          </span>
                          <h3 className="mt-3 text-base font-medium">{item.title}</h3>
                          <p className="mt-1.5 text-sm text-muted-fg">{item.detail}</p>
                        </GlassCard>
                      </div>
                    );
                  })}
                </Reveal>

                {/* Language chips with animated proficiency bars (§65) */}
                <Reveal
                  variant="fade-up"
                  stagger={0.06}
                  className="grid gap-3 sm:grid-cols-3"
                >
                  {owner.languagesSpoken.map((lang) => (
                    <div
                      key={lang.name}
                      className="glass-1 rounded-2xl px-4 py-3"
                      style={FLAT_GLASS}
                    >
                      <div className="mono-chip flex items-baseline justify-between gap-2">
                        <span>{lang.name}</span>
                        <span className="text-muted-fg">{lang.level}</span>
                      </div>
                      <div
                        aria-hidden
                        className="mt-2 h-1 overflow-hidden rounded-full bg-fg/10"
                      >
                        <div
                          data-lang-bar
                          data-pct={lang.pct}
                          className="h-full w-full origin-left rounded-full"
                          style={{
                            background: "var(--gradient)",
                            transform: "scaleX(0)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </Reveal>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
