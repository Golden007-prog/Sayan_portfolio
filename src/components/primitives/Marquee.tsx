"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { cn } from "@/lib/cn";

interface MarqueeProps {
  children: ReactNode;
  /** px per second */
  speed?: number;
  /** 1 = leftward, -1 = rightward (§78) */
  direction?: 1 | -1;
  pauseOnHover?: boolean;
  className?: string;
  "aria-label"?: string;
}

/**
 * Seamless marquee driven by the GSAP ticker (not CSS), paused when
 * off-screen via IntersectionObserver (§204). Reduced motion renders
 * a static wrapped row instead (§92).
 */
export function Marquee({
  children,
  speed = 60,
  direction = 1,
  pauseOnHover = true,
  className,
  "aria-label": ariaLabel,
}: MarqueeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  // WCAG 2.2.2: auto-moving content >5s needs a pause control reachable by
  // keyboard and touch, not just mouse hover.
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track || reduced) return;

    let hovering = false;
    let visible = true;
    let x = 0;

    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { rootMargin: "100px" },
    );
    io.observe(wrap);

    const onEnter = () => { if (pauseOnHover) hovering = true; };
    const onLeave = () => { hovering = false; };
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);

    const tick = (_t: number, deltaMs: number) => {
      if (hovering || pausedRef.current || !visible) return;
      const half = track.scrollWidth / 2;
      if (half <= 0) return;
      x -= direction * speed * (deltaMs / 1000);
      // Wrap into (-half, 0] so the two identical copies loop seamlessly.
      // JS % keeps the sign of x, so a positive x (direction -1) needs the
      // extra shift to land back inside the window.
      x %= half;
      if (x > 0) x -= half;
      track.style.transform = `translate3d(${x}px,0,0)`;
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, [speed, direction, pauseOnHover, reduced]);

  if (reduced) {
    return (
      <div className={cn("flex flex-wrap gap-4", className)} aria-label={ariaLabel}>
        {children}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={cn("group relative overflow-hidden", className)}>
      <div ref={trackRef} className="flex w-max will-change-transform" aria-label={ariaLabel}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        className="glass-1 absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
      >
        <span aria-hidden className="text-xs">{paused ? "▶" : "❚❚"}</span>
        <span className="sr-only">
          {paused ? "Resume scrolling technology list" : "Pause scrolling technology list"}
        </span>
      </button>
    </div>
  );
}
