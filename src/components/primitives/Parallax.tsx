"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

interface ParallaxProps {
  children: ReactNode;
  /**
   * Fraction of scroll distance the layer travels: positive lags
   * (moves up slower), negative leads. 0.15–0.3 is the house range (§188).
   */
  speed?: number;
  className?: string;
}

/** Scrubbed parallax wrapper for media layers. No-op under reduced motion. */
export function Parallax({ children, speed = 0.2, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: () => speed * 120 },
        {
          y: () => speed * -120,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [speed, reduced]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
