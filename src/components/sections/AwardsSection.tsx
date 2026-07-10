"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { awards, sectionCopy, type Award } from "@/content/data";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { Marquee } from "@/components/primitives/Marquee";
import { Reveal } from "@/components/primitives/Reveal";
import { GlassCard } from "@/components/primitives/GlassCard";
import { Particles } from "@/components/fx/Particles";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { cn } from "@/lib/cn";

/** Confetti ships in its own chunk and only loads near the viewport (§142). */
const Confetti = dynamic(
  () => import("@/components/fx/Confetti").then((m) => m.Confetti),
  { ssr: false },
);

/** Compact ticker forms of the `awards` entries (§138). */
const ACHIEVEMENT_TICKER = ["SIH 2022", "WORLD RECORD", "IBM TECHXCHANGE 2026"];

const PLACEHOLDER_LINK = "[ADD LINK]";

/** Scoped styles: flip mechanics, holo sheen, trophy idle keyframes. */
const awardsCss = `
.award-scene { perspective: 1200px; }
.award-inner {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.7s var(--ease-out-soft);
}
.award-inner[data-flipped="true"] { transform: rotateY(180deg); }
.award-face {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.award-back { transform: rotateY(180deg); }

/* Sheen surfaces clip the global outer focus ring — draw an inset one (§a11y) */
.award-scene:focus-visible {
  outline: none;
  box-shadow:
    inset 0 0 0 2px var(--accent-2),
    inset 0 0 0 4px var(--bg);
}

/* Reduced motion: crossfade instead of 3D rotation (§202) */
.award-inner.award-flat,
.award-flat .award-face { transform: none; transition: opacity 0.2s linear; }
.award-flat .award-back { opacity: 0; }
.award-flat[data-flipped="true"] .award-back { opacity: 1; }
.award-flat[data-flipped="true"] .award-front { opacity: 0; }

/* World Record iridescent holo sheen, cursor-driven via --holo-x/y (§132) */
.holo-overlay { opacity: 0; transition: opacity 0.5s var(--ease-out-soft); }
@media (hover: hover) and (pointer: fine) {
  [data-holo]:hover .holo-overlay { opacity: 0.9; }
}

/* Trophy/medal idle micro-animations (§137) */
.award-ribbon, .award-sparkle { transform-box: fill-box; }
.award-ribbon {
  transform-origin: 50% 0%;
  animation: awards-ribbon-sway 4s ease-in-out infinite;
}
.award-sparkle {
  transform-origin: 50% 50%;
  animation: awards-sparkle 2.6s ease-in-out infinite;
}
@keyframes awards-ribbon-sway {
  0%, 100% { transform: rotate(-4deg); }
  50% { transform: rotate(4deg); }
}
@keyframes awards-sparkle {
  0%, 100% { opacity: 0.35; transform: scale(0.75); }
  50% { opacity: 1; transform: scale(1.1); }
}
@media (prefers-reduced-motion: reduce) {
  .award-ribbon, .award-sparkle { animation: none; }
}
`;

function monogram(org: string): string {
  return org.trim().charAt(0).toUpperCase();
}

function TrophyIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      width="40"
      height="40"
      fill="none"
      aria-hidden
      className="shrink-0 text-accent1"
    >
      <path
        d="M16 8h16v10a8 8 0 0 1-16 0V8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M16 11h-4.5A1.5 1.5 0 0 0 10 12.5c0 4.6 2.6 7.4 6 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M32 11h4.5a1.5 1.5 0 0 1 1.5 1.5c0 4.6-2.6 7.4-6 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M24 26v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M17.5 37 19 31h10l1.5 6h-13Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M15 40h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        className="award-sparkle"
        d="m39 4 1.2 2.8L43 8l-2.8 1.2L39 12l-1.2-2.8L35 8l2.8-1.2L39 4Z"
        fill="var(--accent-2)"
      />
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      width="40"
      height="40"
      fill="none"
      aria-hidden
      className="shrink-0 text-accent3"
    >
      <path
        className="award-ribbon"
        d="M17 4h6l-2 13-6-4 2-9Z"
        fill="color-mix(in srgb, var(--accent-1) 85%, transparent)"
      />
      <path
        className="award-ribbon"
        d="M25 4h6l2 9-6 4-2-13Z"
        fill="color-mix(in srgb, var(--accent-2) 85%, transparent)"
      />
      <circle cx="24" cy="29" r="9.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M24 24.5l1.6 3.2 3.5.5-2.5 2.5.6 3.5-3.2-1.7-3.2 1.7.6-3.5-2.5-2.5 3.5-.5L24 24.5Z"
        fill="var(--accent-2)"
      />
      <path
        className="award-sparkle"
        d="m40 9 1 2.3 2.3 1-2.3 1-1 2.3-1-2.3-2.3-1 2.3-1 1-2.3Z"
        fill="var(--accent-4)"
      />
    </svg>
  );
}

interface AwardCardProps {
  award: Award;
  isWorldRecord: boolean;
  /** Mount the (lazy) confetti canvas — only true near the viewport (§142) */
  showFx: boolean;
}

function AwardCard({ award, isWorldRecord, showFx }: AwardCardProps) {
  const [flipped, setFlipped] = useState(false);
  const reduced = useReducedMotionSafe();

  // Sets --holo-x/y (in %) on the card wrapper; the overlay inherits them (§132).
  const handleHoloMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty(
      "--holo-x",
      `${((e.clientX - rect.left) / rect.width) * 100}%`,
    );
    el.style.setProperty(
      "--holo-y",
      `${((e.clientY - rect.top) / rect.height) * 100}%`,
    );
  };

  return (
    <article
      className="relative h-full"
      data-holo={isWorldRecord || undefined}
      onMouseMove={isWorldRecord ? handleHoloMove : undefined}
    >
      <h3 className="sr-only">{award.title}</h3>
      <GlassCard tier={2} sheen className="flex h-full flex-col">
        {isWorldRecord && (
          <span
            aria-hidden
            className="holo-overlay pointer-events-none absolute inset-0 z-10 rounded-[inherit] mix-blend-overlay"
            style={{
              background: `conic-gradient(from 210deg at var(--holo-x, 50%) var(--holo-y, 50%),
                color-mix(in srgb, var(--accent-1) 55%, transparent),
                color-mix(in srgb, var(--accent-2) 45%, transparent),
                color-mix(in srgb, var(--accent-3) 50%, transparent),
                color-mix(in srgb, var(--accent-4) 40%, transparent),
                color-mix(in srgb, var(--accent-1) 55%, transparent)),
                linear-gradient(115deg, transparent 30%, rgba(255, 255, 255, 0.28) 50%, transparent 70%)`,
            }}
          />
        )}
        {isWorldRecord && showFx && <Confetti className="z-10" />}

        <button
          type="button"
          data-cursor="link"
          aria-expanded={flipped}
          aria-pressed={flipped}
          onClick={() => setFlipped((f) => !f)}
          className="award-scene relative min-h-[18rem] w-full flex-1 rounded-[inherit] text-left"
        >
          <span
            className={cn("award-inner block h-full w-full", reduced && "award-flat")}
            data-flipped={flipped}
          >
            {/* Front face */}
            <span
              aria-hidden={flipped}
              className="award-face award-front relative flex h-full flex-col p-6"
            >
              <span className="mb-5 flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2.5">
                  <span
                    aria-hidden
                    className="glass-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold text-accent2"
                  >
                    {monogram(award.org)}
                  </span>
                  <span className="mono-chip truncate text-muted-fg">{award.org}</span>
                </span>
                <span className="mono-chip glass-1 shrink-0 rounded-full px-3 py-1 text-accent2">
                  {award.year}
                </span>
              </span>

              <span className="mb-3 flex items-start gap-3">
                {isWorldRecord ? <MedalIcon /> : <TrophyIcon />}
                <span className="font-display text-lg font-semibold leading-snug">
                  {award.title}
                </span>
              </span>

              <span className="block text-sm leading-relaxed text-muted-fg">
                {award.detail}
              </span>

              <span
                aria-hidden
                className="mt-auto self-end pt-4 font-mono text-sm text-muted-fg"
              >
                ↻
              </span>
            </span>

            {/* Back face — stays in DOM, revealed on flip (§134, §141) */}
            <span
              aria-hidden={!flipped}
              className="award-face award-back absolute inset-0 flex flex-col overflow-hidden p-6"
            >
              <span className="eyebrow mb-4 block">
                {award.year} · {award.org}
              </span>
              <span role="list" className="block space-y-2.5">
                {award.back.map((fact) => (
                  <span
                    role="listitem"
                    key={fact}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-fg"
                  >
                    <span aria-hidden className="mt-0.5 shrink-0 text-accent2">
                      ✦
                    </span>
                    {fact}
                  </span>
                ))}
              </span>
              <span
                aria-hidden
                className="mt-auto self-end pt-4 font-mono text-sm text-muted-fg"
              >
                ↻
              </span>
            </span>
          </span>
        </button>

        {/* External link chip — placeholder rendered visibly, empty omitted (§135) */}
        {award.link !== "" && (
          <div className="relative px-6 pb-6">
            {award.link === PLACEHOLDER_LINK ? (
              <span className="mono-chip inline-flex min-h-11 items-center rounded-full border border-dashed border-[var(--glass-border)] px-4 text-muted-fg">
                {PLACEHOLDER_LINK}
              </span>
            ) : (
              <a
                href={award.link}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                aria-label={`${award.title} — ${award.org} (external link)`}
                className="mono-chip glass-1 inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-accent2"
              >
                {award.org}
                <span aria-hidden>↗</span>
              </a>
            )}
          </div>
        )}
      </GlassCard>
    </article>
  );
}

/**
 * Awards & Hackathons — achievements marquee, trophy flip-card grid,
 * holo World Record card with a one-shot confetti micro-burst, and an
 * ambient particle field behind it all (§131–§142).
 */
export function AwardsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [nearView, setNearView] = useState(false);
  const reduced = useReducedMotionSafe();

  // Flip the lazy-fx latch once the section approaches the viewport (§142).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearView(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="awards"
      ref={sectionRef}
      aria-labelledby="awards-heading"
      className="relative py-[var(--section-pad)]"
    >
      <style>{awardsCss}</style>
      <Particles count={40} />

      <div className="container-site relative">
        <div id="awards-heading">
          <SectionHeading
            eyebrow={sectionCopy.awards.eyebrow}
            heading={sectionCopy.awards.heading}
            underline
          />
        </div>

        <Marquee
          speed={55}
          className="mb-12 border-y border-[var(--glass-border)] py-3 md:mb-16"
          aria-label="Achievement highlights"
        >
          {ACHIEVEMENT_TICKER.map((item) => (
            <span
              key={item}
              className="mono-chip mx-6 flex items-center gap-12 whitespace-nowrap text-muted-fg"
            >
              {item}
              <span aria-hidden className="text-accent2">
                ✦
              </span>
            </span>
          ))}
        </Marquee>

        <Reveal
          variant="fade-up"
          stagger={0.08}
          className="grid items-stretch gap-6 md:grid-cols-3"
        >
          {awards.map((award) => {
            const isWorldRecord = award.title
              .toLowerCase()
              .includes("world record");
            return (
              <AwardCard
                key={award.title}
                award={award}
                isWorldRecord={isWorldRecord}
                showFx={nearView && !reduced}
              />
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
