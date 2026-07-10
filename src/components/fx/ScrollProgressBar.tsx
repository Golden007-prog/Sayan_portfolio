"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** 2px gradient scroll-progress bar fixed to the viewport top (§184). */
export function ScrollProgressBar() {
  const ref = useRef<HTMLDivElement>(null);

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
          scrub: 0.3,
        },
      });
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

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
