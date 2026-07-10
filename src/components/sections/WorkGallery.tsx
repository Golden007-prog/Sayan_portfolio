"use client";

/**
 * TODO(page assembly): <RepoCards /> is an async SERVER component and cannot
 * be rendered from this client component. In page.tsx mount it immediately
 * AFTER <WorkGallery /> so it reads as the tail of the #work section:
 *
 *   <WorkGallery />
 *   <RepoCardsPanel />   // = <Suspense fallback={<RepoCardsSkeleton />}><RepoCards /></Suspense>
 *
 * All three are exported from "@/components/work/RepoCards".
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { owner, projects, sectionCopy } from "@/content/data";
import { GlassCard } from "@/components/primitives/GlassCard";
import { Parallax } from "@/components/primitives/Parallax";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { ProjectCard } from "@/components/work/ProjectCard";
import { cn } from "@/lib/cn";

/** Desktop pinned scene requires width + a fine hover pointer (§109). */
const PINNED_QUERY =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

/** "More on GitHub" end card with gently floating star/fork icons (§118). */
function MoreOnGitHubCard({ className }: { className?: string }) {
  const reduced = useReducedMotionSafe();

  const float = (delay: number) =>
    reduced
      ? undefined
      : {
          y: [0, -6, 0],
          transition: {
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay,
          },
        };

  return (
    <a
      href={owner.github}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="link"
      aria-label={`More on GitHub — @${owner.githubUser}`}
      className={cn("group block rounded-[var(--radius-glass)]", className)}
    >
      <GlassCard
        tier={2}
        conic
        sheen
        className="relative flex h-full min-h-80 flex-col justify-between gap-8 overflow-hidden p-7 sm:p-8"
      >
        <span aria-hidden className="flex items-center gap-3">
          <motion.span
            animate={float(0)}
            className="glass-1 flex h-12 w-12 items-center justify-center rounded-full text-accent2"
          >
            <Star className="h-5 w-5" />
          </motion.span>
          <motion.span
            animate={float(0.7)}
            className="glass-1 flex h-12 w-12 items-center justify-center rounded-full text-accent1"
          >
            <GitFork className="h-5 w-5" />
          </motion.span>
        </span>
        <div>
          <h3 className="font-display leading-tight">More on GitHub</h3>
          <p className="mono-chip mt-2 text-muted-fg">@{owner.githubUser}</p>
        </div>
        <span className="mono-chip flex items-center gap-2 text-muted-fg transition-colors duration-300 group-hover:text-fg">
          {owner.github.replace("https://", "")}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-soft group-hover:-rotate-45" />
        </span>
      </GlassCard>
    </a>
  );
}

/**
 * Selected Work — §work anchor. Desktop + fine pointer: horizontally-pinned
 * GSAP gallery, the second of the site's two pinned scenes (§109), with a
 * progress bar scrubbed to the same trigger (§125). Touch/mobile/reduced:
 * CSS snap carousel with synced progress dots (§124). Giant outlined
 * "SELECTED WORK" display text parallaxes slower than scroll (§126).
 */
export function WorkGallery() {
  const reduced = useReducedMotionSafe();
  const [pinnedMode, setPinnedMode] = useState(false);
  const [activeDot, setActiveDot] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dotRafRef = useRef(0);

  // Derived from data, not hard-coded: "03 / SELECTED WORK" → "SELECTED WORK"
  const outlineText =
    sectionCopy.work.eyebrow.split("/").pop()?.trim() ??
    sectionCopy.work.heading;

  const itemCount = projects.length + 1; // + GitHub end card

  /* Layout mode: pinned scene only on desktop fine-pointer, motion allowed */
  useEffect(() => {
    const mql = window.matchMedia(PINNED_QUERY);
    const update = () => setPinnedMode(mql.matches && !reduced);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [reduced]);

  /* Pinned scene: vertical scroll drives horizontal travel (§109, §125) */
  useEffect(() => {
    if (!pinnedMode) return;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;

    const ctx = gsap.context(() => {
      const distance = () =>
        Math.max(track.scrollWidth - window.innerWidth, 0);
      gsap.to(track, {
        xPercent: () => (-100 * distance()) / track.scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) {
              gsap.set(barRef.current, { scaleX: self.progress });
            }
          },
        },
      });
    }, stage);

    // Mode flips after hydration change page height — re-measure everything.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [pinnedMode]);

  /* Carousel: sync progress dots to the nearest-centered card (§124) */
  const syncDots = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Number.POSITIVE_INFINITY;
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActiveDot(best);
  }, []);

  const onCarouselScroll = () => {
    cancelAnimationFrame(dotRafRef.current);
    dotRafRef.current = requestAnimationFrame(syncDots);
  };

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({
      left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="relative py-[var(--section-pad)]"
    >
      <div className="container-site">
        {/* Giant outlined display text, lagging behind scroll (§126) */}
        <Parallax
          speed={0.3}
          className="pointer-events-none relative z-0 -mb-[0.35em] select-none"
        >
          <span
            aria-hidden
            className="block whitespace-nowrap font-display text-[clamp(3rem,11vw,10rem)] font-bold uppercase leading-none tracking-tight text-transparent"
            style={{
              WebkitTextStroke:
                "1.5px color-mix(in srgb, var(--text) 24%, transparent)",
            }}
          >
            {outlineText}
          </span>
        </Parallax>
        <div id="work-heading" className="relative z-10">
          <SectionHeading
            eyebrow={sectionCopy.work.eyebrow}
            heading={sectionCopy.work.heading}
            underline
          />
        </div>
      </div>

      {pinnedMode ? (
        /* ——— Desktop: horizontally-pinned gallery (§109) ——— */
        <div
          ref={stageRef}
          className="flex h-svh flex-col justify-center overflow-hidden"
        >
          <div
            ref={trackRef}
            className="flex w-max items-stretch gap-8 px-[var(--gutter)] will-change-transform"
          >
            {projects.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={i}
                className="w-[clamp(26rem,42vw,36rem)] shrink-0"
              />
            ))}
            <MoreOnGitHubCard className="w-[clamp(18rem,26vw,24rem)] shrink-0" />
          </div>
          {/* Horizontal progress bar scrubbed to the pin (§125) */}
          <div
            aria-hidden
            data-print-hide
            className="mx-auto mt-12 h-0.5 w-[min(50vw,26rem)] overflow-hidden rounded-full"
            style={{
              background: "color-mix(in srgb, var(--text) 12%, transparent)",
            }}
          >
            <div
              ref={barRef}
              className="h-full w-full origin-left scale-x-0"
              style={{ background: "var(--gradient)" }}
            />
          </div>
        </div>
      ) : (
        /* ——— Mobile / touch / reduced motion: snap carousel (§124) ——— */
        <div>
          <div
            ref={scrollerRef}
            onScroll={onCarouselScroll}
            className="flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto px-[var(--gutter)] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {projects.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={i}
                className="w-[min(85vw,24rem)] shrink-0 snap-center"
              />
            ))}
            <MoreOnGitHubCard className="w-[min(80vw,22rem)] shrink-0 snap-center" />
          </div>
          {/* Progress dots — 44px touch targets around small markers */}
          <div
            data-print-hide
            className="mt-2 flex items-center justify-center"
          >
            {Array.from({ length: itemCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                data-cursor="link"
                aria-label={
                  i < projects.length
                    ? `Go to ${projects[i].title}`
                    : "Go to the GitHub card"
                }
                aria-current={activeDot === i ? "true" : undefined}
                onClick={() => goTo(i)}
                className="flex h-11 w-11 items-center justify-center"
              >
                <span
                  aria-hidden
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 ease-soft",
                    activeDot === i ? "w-6" : "w-1.5",
                  )}
                  style={{
                    background:
                      activeDot === i
                        ? "var(--gradient)"
                        : "color-mix(in srgb, var(--text) 25%, transparent)",
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
