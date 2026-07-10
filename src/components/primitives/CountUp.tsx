"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

interface CountUpProps {
  value: number;
  /** start value — lets "0 critical defects" count 9→0 (§47) */
  from?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

const fmt = new Intl.NumberFormat("en-IN");

/**
 * Eased, locale-formatted count-up triggered on first view (§199).
 * Reduced motion: renders the final value immediately.
 */
export function CountUp({
  value,
  from = 0,
  suffix = "",
  prefix = "",
  duration = 1.6,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.textContent = `${prefix}${fmt.format(value)}${suffix}`;
      return;
    }
    const state = { n: from };
    const ctx = gsap.context(() => {
      gsap.to(state, {
        n: value,
        duration,
        ease: "power2.out",
        snap: { n: 1 },
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = `${prefix}${fmt.format(Math.round(state.n))}${suffix}`;
        },
      });
    }, el);
    return () => ctx.revert();
  }, [value, from, suffix, prefix, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {fmt.format(reduced ? value : from)}
      {suffix}
    </span>
  );
}
