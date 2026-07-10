"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

/** 2px gradient scroll-progress bar fixed to the viewport top (§184). */
export function ScrollProgressBar() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: () => document.documentElement.scrollHeight - window.innerHeight,
          // Scroll-linked progress isn't "motion" in the WCAG sense, so the bar
          // stays live; but reduced motion drops the smoothing lag (scrub: true
          // tracks scroll position directly instead of easing toward it).
          scrub: reduced ? true : 0.3,
        },
      });
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      ref={ref}
      aria-hidden
      data-print-hide
      className="fixed inset-x-0 top-0 z-[110] h-0.5 origin-left scale-x-0"
      style={{ background: "var(--gradient)" }}
    />
  );
}
