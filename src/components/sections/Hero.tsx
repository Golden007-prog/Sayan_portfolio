"use client";

import Image from "next/image";
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { CountUp } from "@/components/primitives/CountUp";
import { RoleTicker } from "@/components/sections/RoleTicker";
import { heroCopy, heroStats, media, owner } from "@/content/data";

const NAME = owner.name.toUpperCase();
const NAME_WORDS = NAME.split(" ");

// "Bengaluru, India (IST)" → "Bengaluru · IST" (§52) — derived from data, not hard-coded
const LOCATION_CITY = owner.location.split(",")[0].trim();
const LOCATION_TZ = /\(([^)]+)\)/.exec(owner.location)?.[1];
const LOCATION_CHIP = LOCATION_TZ
  ? `${LOCATION_CITY} · ${LOCATION_TZ}`
  : owner.location;

/* Data-saver detection (§56) — connection API is not in the TS DOM lib yet.
   The value is effectively constant per session, so subscribe is a no-op. */
const subscribeNever = () => () => {};
const getSaveData = () =>
  Boolean(
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData,
  );

/** Anchor points for the 4 floating glass chips (§45) */
const CHIP_POSITIONS: readonly CSSProperties[] = [
  { top: "24%", left: "6%" },
  { top: "16%", right: "9%" },
  { bottom: "36%", right: "5%" },
  { bottom: "26%", left: "11%" },
];

/**
 * Hero — 100svh video stage (§37, §271). Headline letters rise behind
 * clip-path masks once the preloader hands off (§40, §6); mouse parallax
 * layers, drifting glass chips, and a scrubbed scale-out on exit (§51 —
 * one of the two allowed pinned/scrub scenes).
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotionSafe();
  const { scrollTo } = useSmoothScroll();
  const saveData = useSyncExternalStore(subscribeNever, getSaveData, () => false);
  const [scrolled, setScrolled] = useState(false);

  const showVideo = !reduced && !saveData;

  // Pause the loop when the tab is hidden, resume when visible (§50).
  // Also re-assert muted: React can drop the attribute in SSR markup,
  // and autoplay only succeeds while muted.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    if (!document.hidden) video.play().catch(() => {});
    const onVisibility = () => {
      if (document.hidden) video.pause();
      else video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [showVideo]);

  // Scroll indicator fades out permanently after the first scroll (§46)
  useEffect(() => {
    if (scrolled) return;
    const onScroll = () => {
      if (window.scrollY > 32) setScrolled(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrolled]);

  // Intro timeline + parallax + chip drift + scroll-out scrub
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const removers: Array<() => void> = [];

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set("[data-hero-reveal], [data-hero-letter]", {
          autoAlpha: 1,
          clearProps: "transform,filter,clipPath",
        });
        return;
      }

      // — Initial hidden states (explicit sets so nothing pops in early)
      gsap.set('[data-hero-reveal="eyebrow"]', { autoAlpha: 0, y: 24 });
      gsap.set("[data-hero-letter]", {
        autoAlpha: 0,
        yPercent: 55,
        clipPath: "inset(0 0 100% 0)",
      });
      gsap.set('[data-hero-reveal="ticker"]', { autoAlpha: 0, y: 20 });
      gsap.set('[data-hero-reveal="intro"]', { autoAlpha: 0, filter: "blur(12px)" });
      gsap.set('[data-hero-reveal="row"]', { autoAlpha: 0, y: 28 });
      gsap.set('[data-hero-reveal="stat"]', { autoAlpha: 0, y: 24 });
      gsap.set('[data-hero-reveal="chips"]', { autoAlpha: 0 });

      // — Intro: per-letter clip-path rise, ~30ms stagger (§40), blur intro (§42)
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
      tl.to('[data-hero-reveal="eyebrow"]', { autoAlpha: 1, y: 0, duration: 0.7 })
        .to(
          "[data-hero-letter]",
          {
            autoAlpha: 1,
            yPercent: 0,
            clipPath: "inset(0 0 -12% 0)",
            duration: 0.9,
            stagger: 0.03,
          },
          "-=0.45",
        )
        .to('[data-hero-reveal="ticker"]', { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.55")
        .to(
          '[data-hero-reveal="intro"]',
          { autoAlpha: 1, filter: "blur(0px)", duration: 0.9 },
          "-=0.5",
        )
        .to(
          '[data-hero-reveal="row"]',
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 },
          "-=0.55",
        )
        .to(
          '[data-hero-reveal="stat"]',
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06 },
          "-=0.5",
        )
        .to('[data-hero-reveal="chips"]', { autoAlpha: 1, duration: 0.9 }, "-=0.6");

      // — Chain to the preloader (§6): event, or immediately if already done
      let started = false;
      const start = () => {
        if (started) return;
        started = true;
        tl.play();
      };
      let preloaded = false;
      try {
        preloaded = window.sessionStorage.getItem("preloaded") !== null;
      } catch {
        // storage blocked — fall through to the event / fallback timer
      }
      if (preloaded) {
        start();
      } else {
        window.addEventListener("preloader:done", start);
        const fallback = window.setTimeout(start, 6000); // never strand the hero
        removers.push(() => {
          window.removeEventListener("preloader:done", start);
          window.clearTimeout(fallback);
        });
      }

      // — Mouse parallax, lerped via quickTo, max 12px, pointer:fine only (§44)
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const layers: Array<{ el: Element | null; depth: number }> = [
          { el: section.querySelector("[data-hero-media]"), depth: 12 },
          { el: section.querySelector("[data-hero-headline]"), depth: 6 },
          { el: section.querySelector('[data-hero-reveal="chips"]'), depth: 10 },
        ];
        const setters = layers
          .filter((l): l is { el: Element; depth: number } => l.el !== null)
          .map((l) => ({
            x: gsap.quickTo(l.el, "x", { duration: 0.8, ease: "power3.out" }),
            y: gsap.quickTo(l.el, "y", { duration: 0.8, ease: "power3.out" }),
            depth: l.depth,
          }));
        const onMove = (e: MouseEvent) => {
          const nx = (e.clientX / window.innerWidth) * 2 - 1;
          const ny = (e.clientY / window.innerHeight) * 2 - 1;
          for (const s of setters) {
            s.x(nx * s.depth);
            s.y(ny * s.depth);
          }
        };
        section.addEventListener("mousemove", onMove);
        removers.push(() => section.removeEventListener("mousemove", onMove));
      }

      // — Each chip gets its own slow drift loop (§45)
      gsap.utils.toArray<HTMLElement>("[data-hero-chip]").forEach((chip, i) => {
        gsap.to(chip, {
          y: i % 2 === 0 ? 12 : -12,
          x: i % 2 === 0 ? -6 : 6,
          rotation: i % 2 === 0 ? -2.5 : 2.5,
          duration: 5 + i * 1.1,
          delay: i * 0.35,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      // — Scroll-out: scale to 0.94 + fade, scrubbed (§51 — allowed scrub scene)
      gsap.to("[data-hero-content]", {
        scale: 0.94,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, section);

    return () => {
      removers.forEach((remove) => remove());
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-labelledby="hero-heading"
      data-konami-zone=""
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Background video, oversized so 12px parallax never shows an edge (§38) */}
      <div aria-hidden data-hero-media className="absolute -inset-4">
        {showVideo ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={media.heroPoster}
            tabIndex={-1}
          >
            <source src={media.heroVideoWebm} type="video/webm" />
            <source src={media.heroVideoMp4} type="video/mp4" />
          </video>
        ) : (
          /* Reduced motion / data-saver: static poster instead (§50, §56) */
          <Image
            src={media.heroPoster}
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            className="object-cover"
          />
        )}
      </div>

      {/* Scrim + vignette keep the type readable over motion (§39) */}
      <div aria-hidden className="absolute inset-0" style={{ background: "var(--scrim)" }} />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 85% at 50% 42%, transparent 52%, rgba(5, 6, 10, 0.55) 100%)",
        }}
      />

      {/* Floating glass chips, decorative (§45) */}
      <div
        aria-hidden
        data-hero-reveal="chips"
        className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
      >
        {heroCopy.chips.map((chip, i) => (
          <span
            key={chip}
            data-hero-chip
            className="glass-1 mono-chip absolute rounded-full px-4 py-2 text-muted-fg"
            style={CHIP_POSITIONS[i % CHIP_POSITIONS.length]}
          >
            {chip}
          </span>
        ))}
      </div>

      <div
        data-hero-content
        className="container-site relative z-10 flex w-full flex-1 flex-col justify-center pb-24 pt-[calc(var(--nav-h)+3rem)]"
      >
        <p data-hero-reveal="eyebrow" className="eyebrow mb-6">
          {heroCopy.eyebrow}
        </p>

        {/* Fluid clamp size + text-wrap balance come from the h1 defaults (§58) */}
        <h1
          id="hero-heading"
          data-hero-headline
          aria-label={NAME}
          className="headline-flip max-w-5xl dark:[text-shadow:0_0_48px_rgba(124,92,255,0.4)]"
        >
          <span aria-hidden>
            {NAME_WORDS.map((word, wi) => (
              <Fragment key={`${word}-${wi}`}>
                {wi > 0 && " "}
                <span className="inline-block whitespace-nowrap">
                  {Array.from(word).map((letter, li) => (
                    <span
                      key={`${letter}-${li}`}
                      data-hero-letter
                      className="inline-block will-change-transform"
                    >
                      {letter}
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </span>
        </h1>

        <div data-hero-reveal="ticker" className="mt-6">
          <RoleTicker roles={heroCopy.roles} />
        </div>

        <p
          data-hero-reveal="intro"
          className="mt-6 max-w-xl text-base text-muted-fg md:text-lg"
        >
          {heroCopy.intro}
        </p>

        <div data-hero-reveal="row" className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton type="button" onClick={() => scrollTo("#work")}>
            {heroCopy.ctaWork} <span aria-hidden>↓</span>
          </MagneticButton>
          <MagneticButton variant="ghost" href={owner.resumePdf} download>
            {heroCopy.ctaResume}
          </MagneticButton>
        </div>

        <div
          data-hero-reveal="row"
          className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3"
        >
          <span className="glass-1 mono-chip inline-flex min-h-8 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-muted-fg">
            <span aria-hidden>📍</span> {LOCATION_CHIP}
          </span>
          <p className="eyebrow">{heroCopy.trustLine}</p>
        </div>

        {/* Stats strip (§47) — from={countFrom} lets "0 defects" count 9→0 */}
        <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-[color:var(--glass-border)] pt-8 md:grid-cols-4">
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              data-hero-reveal="stat"
              className="flex flex-col-reverse gap-1"
            >
              <dt className="text-xs leading-relaxed text-muted-fg">{stat.label}</dt>
              <dd className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                <CountUp
                  value={stat.value}
                  from={"countFrom" in stat ? stat.countFrom : 0}
                  suffix={stat.suffix}
                />
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Scroll indicator — gone for good after the first scroll (§46) */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2",
          "transition-opacity duration-700 ease-[var(--ease-out-soft)]",
          scrolled ? "opacity-0" : "opacity-100",
        )}
      >
        <span className="flex h-12 w-7 items-start justify-center rounded-full border border-[color:var(--glass-border)] p-1.5">
          <span className="h-2.5 w-1 animate-[hero-scroll-dot_1.9s_var(--ease-out-soft)_infinite] rounded-full bg-[color:var(--text-muted)]" />
        </span>
        <style>{`@keyframes hero-scroll-dot { 0% { transform: translateY(0); opacity: 1; } 70% { transform: translateY(18px); opacity: 0; } 100% { transform: translateY(0); opacity: 0; } }`}</style>
      </div>
    </section>
  );
}
