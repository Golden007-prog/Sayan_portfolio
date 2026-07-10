"use client";

import { useEffect, useRef, type ReactNode } from "react";
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

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track || reduced) return;

    let paused = false;
    let visible = true;
    let x = 0;

    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { rootMargin: "100px" },
    );
    io.observe(wrap);

    const onEnter = () => { if (pauseOnHover) paused = true; };
    const onLeave = () => { paused = false; };
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);

    const tick = (_t: number, deltaMs: number) => {
      if (paused || !visible) return;
      const half = track.scrollWidth / 2;
      if (half <= 0) return;
      x -= direction * speed * (deltaMs / 1000);
      // wrap into [-half, 0) so the two copies loop seamlessly
      x = ((x % half) + half) % half * -1;
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
    <div
      ref={wrapRef}
      className={cn("overflow-hidden", className)}
      aria-label={ariaLabel}
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
