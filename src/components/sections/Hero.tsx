"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
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
  const { resolvedTheme } = useTheme();
  const saveData = useSyncExternalStore(subscribeNever, getSaveData, () => false);
  const [scrolled, setScrolled] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // true after hydration, false on the server AND the first client render.
  // useSyncExternalStore replays the server snapshot during hydration, so
  // gating on it keeps the SSR markup matching the first client paint.
  const mounted = useSyncExternalStore(subscribeNever, () => true, () => false);

  // Light mode plays a bright white-bg loop; dark keeps the deep-space one.
  // Gated on `mounted`: next-themes resolves the theme synchronously on the
  // client, so reading it unguarded would render the light poster on hydration
  // while the server rendered the dark one — a hydration mismatch on the
  // <Image> fallback's src. Defaulting to dark until mounted avoids that; the
  // <video> only mounts post-idle, long after this flips.
  const isLight = mounted && resolvedTheme === "light";
  const heroPoster = isLight ? media.heroPosterLight : media.heroPoster;
  const heroVideoWebm = isLight ? media.heroVideoLightWebm : media.heroVideoWebm;
  const heroVideoMp4 = isLight ? media.heroVideoLightMp4 : media.heroVideoMp4;

  /*
   * The poster is the hero's first paint and the loop mounts once the page is
   * idle, so the 300KB video never competes with the initial render. It is not
   * gated on viewport width: measurement showed a width gate left the simulated
   * mobile LCP unchanged (4.7s either way), so it only cost phones the video
   * background the design calls for. Data-saver and reduced-motion still opt out.
   */
  useEffect(() => {
    if (reduced || saveData) return;

    let idle = 0;
    const arm = () => {
      const ric = window.requestIdleCallback;
      idle = ric
        ? ric(() => setVideoReady(true), { timeout: 2500 })
        : window.setTimeout(() => setVideoReady(true), 1200);
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });

    return () => {
      window.removeEventListener("load", arm);
      if (!idle) return;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [reduced, saveData]);

  const showVideo = !reduced && !saveData && videoReady;

  // Play only while the tab is visible AND the hero is on-screen; pause
  // otherwise so the decoder isn't churning off-screen all session (§50).
  // The effect only runs when a <video> exists (showVideo), so the
  // reduced-motion / saveData poster path never gets resumed here.
  // Also re-assert muted: React can drop the attribute in SSR markup,
  // and autoplay only succeeds while muted.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const section = sectionRef.current;
    video.muted = true;

    let onScreen = true; // assume visible until the observer reports otherwise

    const sync = () => {
      if (!document.hidden && onScreen) video.play().catch(() => {});
      else video.pause();
    };

    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);

    let observer: IntersectionObserver | undefined;
    if (section && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          onScreen = entries[0]?.isIntersecting ?? true;
          sync();
        },
        { threshold: 0 },
      );
      observer.observe(section);
    }

    sync();

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      observer?.disconnect();
    };
    // isLight remounts the <video> (keyed below) with new sources, so this
    // must re-run to re-bind play/pause to the fresh element.
  }, [showVideo, isLight]);

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
          opacity: 1,
          clearProps: "transform,filter,clipPath",
        });
        return;
      }

      // opacity, never autoAlpha: autoAlpha's `visibility: hidden` would drop
      // the h1 out of the accessibility tree for the whole intro.
      // — Initial hidden states (explicit sets so nothing pops in early)
      gsap.set('[data-hero-reveal="eyebrow"]', { opacity: 0, y: 24 });
      gsap.set("[data-hero-letter]", {
        opacity: 0,
        yPercent: 55,
        clipPath: "inset(0 0 100% 0)",
        willChange: "transform",
      });
      gsap.set('[data-hero-reveal="ticker"]', { opacity: 0, y: 20 });
      gsap.set('[data-hero-reveal="intro"]', { opacity: 0, filter: "blur(12px)" });
      gsap.set('[data-hero-reveal="row"]', { opacity: 0, y: 28 });
      gsap.set('[data-hero-reveal="stat"]', { opacity: 0, y: 24 });
      gsap.set('[data-hero-reveal="chips"]', { opacity: 0 });

      // — Intro: per-letter clip-path rise, ~30ms stagger (§40), blur intro (§42)
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power4.out" },
        // Release the per-letter compositor layers once the one-shot intro
        // is done — otherwise will-change pins a layer per letter all session.
        onComplete: () => {
          gsap.set("[data-hero-letter]", { clearProps: "willChange" });
        },
      });
      tl.to('[data-hero-reveal="eyebrow"]', { opacity: 1, y: 0, duration: 0.7 })
        .to(
          "[data-hero-letter]",
          {
            opacity: 1,
            yPercent: 0,
            clipPath: "inset(0 0 -12% 0)",
            duration: 0.9,
            stagger: 0.03,
          },
          "-=0.45",
        )
        .to('[data-hero-reveal="ticker"]', { opacity: 1, y: 0, duration: 0.7 }, "-=0.55")
        .to(
          '[data-hero-reveal="intro"]',
          { opacity: 1, filter: "blur(0px)", duration: 0.9 },
          "-=0.5",
        )
        .to(
          '[data-hero-reveal="row"]',
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
          "-=0.55",
        )
        .to(
          '[data-hero-reveal="stat"]',
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 },
          "-=0.5",
        )
        .to('[data-hero-reveal="chips"]', { opacity: 1, duration: 0.9 }, "-=0.6");

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
      const chipTweens = gsap.utils
        .toArray<HTMLElement>("[data-hero-chip]")
        .map((chip, i) =>
          gsap.to(chip, {
            y: i % 2 === 0 ? 12 : -12,
            x: i % 2 === 0 ? -6 : 6,
            rotation: i % 2 === 0 ? -2.5 : 2.5,
            duration: 5 + i * 1.1,
            delay: i * 0.35,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          }),
        );

      // Stop the infinite drift loops running the compositor once the hero
      // scrolls out of view; resume when it returns.
      if (chipTweens.length > 0) {
        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            for (const tween of chipTweens) {
              if (self.isActive) tween.play();
              else tween.pause();
            }
          },
        });
      }

      // — Scroll-out: scale to 0.94 + fade, scrubbed (§51 — allowed scrub scene)
      gsap.to("[data-hero-content]", {
        scale: 0.94,
        opacity: 0,
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
      aria-label={owner.name}
      data-konami-zone=""
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Background video, oversized so 12px parallax never shows an edge (§38) */}
      <div aria-hidden data-hero-media className="absolute -inset-4">
        {showVideo ? (
          <video
            // Remount on theme change so the browser reloads the new sources.
            key={isLight ? "light" : "dark"}
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={heroPoster}
            tabIndex={-1}
          >
            <source src={heroVideoWebm} type="video/webm" />
            <source src={heroVideoMp4} type="video/mp4" />
          </video>
        ) : (
          /* Reduced motion / data-saver: static poster instead (§50, §56).
             `unoptimized` so this resolves to the exact same URL as the
             <video> poster attr — a video-capable client that first paints
             this fallback (reduced defaults true pre-hydration) then swaps to
             the video reuses the cached poster instead of fetching a second,
             differently-optimized URL. */
          <Image
            src={heroPoster}
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            unoptimized
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
            "radial-gradient(120% 85% at 50% 42%, transparent 52%, var(--hero-vignette) 100%)",
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
                      className="inline-block"
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
