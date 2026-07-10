"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "@/lib/gsap";
import { media, preloader } from "@/content/data";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";

/** Fired on window as the exit wipe begins — the hero chains its entrance off this (§6). */
export const PRELOADER_DONE_EVENT = "preloader:done";

const SESSION_KEY = "preloaded";
const MIN_DISPLAY_MS = 1200;
const SKIP_AFTER_MS = 4000;
/** Not a progress driver — only a rescue hatch if a source stalls on a dead CDN. */
const FAILSAFE_MS = 10000;

/** Real loading sources and their share of the 0–100 readout (§2). */
const WEIGHTS = { fonts: 30, poster: 35, video: 35 } as const;

const CLIP_OPEN = "inset(0% 0% 0% 0%)";
const CLIP_UP = "inset(0% 0% 100% 0%)";

/** SSR renders the overlay (no content flash); the session check must run pre-paint. */
const useClientLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function dispatchDone() {
  window.dispatchEvent(new CustomEvent(PRELOADER_DONE_EVENT));
}

/**
 * Full-screen glass boot screen: SC monogram stroke-draw, mono word ticker,
 * real weighted loading progress, dual curtain-wipe exit (§1–§13).
 * Plays once per session; never on internal nav.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelBackRef = useRef<HTMLDivElement>(null);
  const panelFrontRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const skipWrapRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const shimmerRef = useRef<HTMLSpanElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  const [active, setActive] = useState(true);
  const [showSkip, setShowSkip] = useState(false);

  const reduced = useReducedMotionSafe();
  const reducedRef = useRef(reduced);
  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  const finishedRef = useRef(false);
  const exitCtxRef = useRef<gsap.Context | null>(null);
  const { stop, start } = useSmoothScroll();

  /* (7) once per session — bail pre-paint on repeat visits and internal-nav reloads */
  useClientLayoutEffect(() => {
    let stored = false;
    try {
      stored = window.sessionStorage.getItem(SESSION_KEY) !== null;
    } catch {
      /* storage unavailable (private mode) — just play the loader */
    }
    if (!stored) return;
    finishedRef.current = true;
    setActive(false);
    // rAF so listeners mounted in the same commit (hero) still get their cue
    const raf = window.requestAnimationFrame(dispatchDone);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  /* (5)(6)(8) exit choreography — dual clip-path curtain, or a 300ms fade under reduced motion */
  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* non-fatal */
    }

    const root = rootRef.current;
    if (!root) {
      dispatchDone();
      setActive(false);
      return;
    }

    exitCtxRef.current = gsap.context(() => {
      if (reducedRef.current) {
        dispatchDone();
        gsap.to(root, {
          autoAlpha: 0,
          duration: 0.3,
          ease: "power1.out",
          onComplete: () => setActive(false),
        });
        return;
      }
      const fadeTargets = [contentRef.current, skipWrapRef.current].filter(
        (el): el is HTMLDivElement => el !== null,
      );
      gsap
        .timeline({ onComplete: () => setActive(false) })
        .to(fadeTargets, { autoAlpha: 0, y: -32, duration: 0.4, ease: "power2.in" })
        .call(dispatchDone)
        .to(
          panelFrontRef.current,
          { clipPath: CLIP_UP, duration: 0.85, ease: "power4.inOut" },
          "<",
        )
        .to(
          panelBackRef.current,
          { clipPath: CLIP_UP, duration: 0.85, ease: "power4.inOut" },
          "<0.14",
        );
    }, root);
  }, []);

  /* revert the exit context if the whole component unmounts */
  useEffect(
    () => () => {
      exitCtxRef.current?.revert();
      exitCtxRef.current = null;
    },
    [],
  );

  /* scroll lock while the overlay is up (Lenis stop + native fallback for reduced motion) */
  useEffect(() => {
    if (!active) return;
    stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      start();
    };
  }, [active, stop, start]);

  /* (9) skip control appears after 4s */
  useEffect(() => {
    if (!active) return;
    const t = window.setTimeout(() => setShowSkip(true), SKIP_AFTER_MS);
    return () => window.clearTimeout(t);
  }, [active]);

  /* (2)(4)(10) real weighted loading — fonts + hero poster + hero-loop metadata, no fake timers */
  useEffect(() => {
    if (!active) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {}, root);
    let cancelled = false;
    let loadedWeight = 0;
    const startedAt = performance.now();
    const timers: number[] = [];
    const progress = { value: 0 };

    const render = () => {
      if (percentRef.current) {
        percentRef.current.textContent = String(Math.round(progress.value));
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress.value / 100})`;
      }
    };

    const tweenTo = (target: number) => {
      ctx.add(() => {
        gsap.to(progress, {
          value: target,
          duration: reducedRef.current ? 0.15 : 0.7,
          ease: "power2.out",
          overwrite: true,
          onUpdate: render,
        });
      });
    };

    const markLoaded = (weight: number) => {
      if (cancelled || finishedRef.current) return;
      loadedWeight = Math.min(100, loadedWeight + weight);
      tweenTo(loadedWeight);
      if (loadedWeight >= 100) {
        const wait = Math.max(0, MIN_DISPLAY_MS - (performance.now() - startedAt));
        timers.push(window.setTimeout(finish, wait));
      }
    };

    document.fonts.ready
      .then(() => {
        if (!cancelled) markLoaded(WEIGHTS.fonts);
      })
      .catch(() => {
        if (!cancelled) markLoaded(WEIGHTS.fonts);
      });

    const img = new window.Image();
    const onImgSettled = () => markLoaded(WEIGHTS.poster);
    img.addEventListener("load", onImgSettled);
    img.addEventListener("error", onImgSettled);
    img.src = media.heroPoster;
    if (img.complete && img.naturalWidth > 0) {
      // cache hits can settle synchronously — count once, drop the listeners
      img.removeEventListener("load", onImgSettled);
      img.removeEventListener("error", onImgSettled);
      markLoaded(WEIGHTS.poster);
    }

    const video = document.createElement("video");
    video.muted = true;
    video.preload = "metadata";
    const onVideoSettled = () => markLoaded(WEIGHTS.video);
    video.addEventListener("loadedmetadata", onVideoSettled);
    video.addEventListener("error", onVideoSettled);
    video.src = video.canPlayType("video/webm")
      ? media.heroVideoWebm
      : media.heroVideoMp4;

    // rescue hatch: a stalled network must never trap the visitor behind glass
    timers.push(
      window.setTimeout(() => {
        if (!cancelled && !finishedRef.current) {
          tweenTo(100);
          finish();
        }
      }, FAILSAFE_MS),
    );

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
      img.removeEventListener("load", onImgSettled);
      img.removeEventListener("error", onImgSettled);
      video.removeEventListener("loadedmetadata", onVideoSettled);
      video.removeEventListener("error", onVideoSettled);
      video.removeAttribute("src");
      ctx.revert();
    };
  }, [active, finish]);

  /* (1)(3)(12)(13) monogram stroke-draw, word ticker, microcopy cycle, bar shimmer */
  useEffect(() => {
    if (!active) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray<SVGPathElement>(
        root.querySelectorAll("[data-monogram-path]"),
      );
      const words = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-ticker-word]"),
      );
      const notes = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-microcopy]"),
      );

      if (reduced) {
        gsap.set(letters, { strokeDashoffset: 0 });
        gsap.set(words, { autoAlpha: 0 });
        gsap.set(notes, { autoAlpha: 0 });
        if (words[0]) gsap.set(words[0], { autoAlpha: 1 });
        if (notes[0]) gsap.set(notes[0], { autoAlpha: 1 });
        if (shimmerRef.current) gsap.set(shimmerRef.current, { autoAlpha: 0 });
        return;
      }

      // paths carry pathLength=1 + dasharray=1, so offset 1→0 draws the stroke
      gsap.fromTo(
        letters,
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1.5, stagger: 0.3, ease: "power2.inOut" },
      );

      const SWAP = 0.35;
      const HOLD = 0.5;
      const ticker = gsap.timeline({ repeat: -1 });
      words.forEach((word, i) => {
        const at = i * (SWAP + HOLD);
        ticker
          .fromTo(
            word,
            { yPercent: 110, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: SWAP, ease: "power3.out" },
            at,
          )
          .to(
            word,
            { yPercent: -110, autoAlpha: 0, duration: SWAP, ease: "power3.in" },
            at + SWAP + HOLD,
          );
      });

      const NOTE_EVERY = 1.8;
      const micro = gsap.timeline({ repeat: -1 });
      notes.forEach((note, i) => {
        const at = i * NOTE_EVERY;
        micro
          .fromTo(
            note,
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
            at,
          )
          .to(
            note,
            { autoAlpha: 0, y: -8, duration: 0.35, ease: "power2.in" },
            at + NOTE_EVERY - 0.45,
          );
      });

      if (shimmerRef.current) {
        gsap.fromTo(
          shimmerRef.current,
          { xPercent: -120 },
          {
            xPercent: 320,
            duration: 1.3,
            ease: "power1.inOut",
            repeat: -1,
            repeatDelay: 0.4,
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, [active, reduced]);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-busy="true"
      aria-label="Loading portfolio"
      data-print-hide
      className="fixed inset-0 z-[130] overflow-hidden"
    >
      {/* (11) token-var colors only, so both themes read correctly pre-hydration */}
      <div
        ref={panelBackRef}
        aria-hidden
        className="absolute inset-0"
        style={{ background: "var(--bg)", clipPath: CLIP_OPEN }}
      />
      <div
        ref={panelFrontRef}
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          boxShadow: "inset 0 1px 0 var(--glass-highlight)",
          clipPath: CLIP_OPEN,
        }}
      />

      <div
        ref={contentRef}
        aria-hidden
        className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-6"
      >
        {/* (1) SC monogram, stroke-drawn */}
        <svg viewBox="0 0 132 80" className="h-20 w-auto" fill="none">
          <defs>
            <linearGradient id="sc-monogram-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" style={{ stopColor: "var(--accent-1)" }} />
              <stop offset="100%" style={{ stopColor: "var(--accent-2)" }} />
            </linearGradient>
          </defs>
          <path
            data-monogram-path
            d="M56 20 C50 12 34 11 28 19 C22 27 28 35 40 38 C52 41 58 49 52 57 C45 66 28 64 23 55"
            pathLength={1}
            strokeDasharray="1"
            stroke="url(#sc-monogram-grad)"
            strokeWidth={3.5}
            strokeLinecap="round"
          />
          <path
            data-monogram-path
            d="M112 22 C104 12 88 12 80 22 C72 32 72 48 80 58 C88 68 104 68 112 58"
            pathLength={1}
            strokeDasharray="1"
            stroke="url(#sc-monogram-grad)"
            strokeWidth={3.5}
            strokeLinecap="round"
          />
        </svg>

        {/* (3) rotating mono word ticker */}
        <div className="relative h-6 w-72 overflow-hidden">
          {preloader.words.map((word, i) => (
            <span
              key={word}
              data-ticker-word
              className="absolute inset-0 flex items-center justify-center font-mono text-xs uppercase tracking-[0.3em] text-fg"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              {word}
            </span>
          ))}
        </div>

        {/* (4) slim gradient progress bar with shimmer */}
        <div className="w-72 max-w-[72vw]">
          <div
            className="relative h-0.5 w-full overflow-hidden rounded-full"
            style={{ background: "var(--glass-border)" }}
          >
            <span
              ref={barRef}
              className="absolute inset-0 origin-left rounded-full"
              style={{ background: "var(--gradient)", transform: "scaleX(0)" }}
            />
            <span
              ref={shimmerRef}
              className="absolute inset-y-0 left-0 w-2/5"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--glass-highlight), transparent)",
              }}
            />
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-4">
            {/* (12) rotating microcopy */}
            <span className="relative block h-5 flex-1 overflow-hidden">
              {preloader.microcopy.map((line, i) => (
                <span
                  key={line}
                  data-microcopy
                  className="absolute inset-0 truncate font-mono text-[11px] text-muted-fg"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  {line}
                </span>
              ))}
            </span>
            <span className="font-mono text-xs tabular-nums text-muted-fg">
              <span ref={percentRef}>0</span>%
            </span>
          </div>
        </div>
      </div>

      {/* (9) skip — fades in after 4s */}
      <div
        ref={skipWrapRef}
        className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center"
      >
        <button
          type="button"
          onClick={finish}
          data-cursor="link"
          aria-hidden={!showSkip}
          tabIndex={showSkip ? 0 : -1}
          className={`glass-1 inline-flex min-h-11 items-center px-6 font-mono text-xs uppercase tracking-[0.2em] text-muted-fg transition-opacity duration-300 hover:text-fg ${
            showSkip ? "pointer-events-auto opacity-100" : "opacity-0"
          }`}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
