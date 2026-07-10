"use client";

import { useEffect, useRef, type ReactNode, type ElementType } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

export type RevealVariant = "fade-up" | "mask" | "blur" | "scale";

export interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  /** seconds */
  delay?: number;
  /** stagger direct children instead of the wrapper (seconds, 0.04–0.08 house range) */
  stagger?: number;
  className?: string;
  as?: ElementType;
  /** ScrollTrigger start, default "top 85%" */
  start?: string;
  id?: string;
}

/**
 * `opacity`, never GSAP's `autoAlpha`. autoAlpha also sets
 * `visibility: hidden`, which strips the element from the accessibility tree —
 * that silently hid every section heading from screen readers and broke
 * heading order until the element scrolled into view.
 */
const FROM: Record<RevealVariant, gsap.TweenVars> = {
  "fade-up": { opacity: 0, y: 48 },
  mask: { opacity: 0, y: 32, clipPath: "inset(0 0 100% 0)" },
  blur: { opacity: 0, filter: "blur(12px)" },
  scale: { opacity: 0, scale: 0.94 },
};

const TO: Record<RevealVariant, gsap.TweenVars> = {
  "fade-up": { opacity: 1, y: 0 },
  mask: { opacity: 1, y: 0, clipPath: "inset(0 0 -5% 0)" },
  blur: { opacity: 1, filter: "blur(0px)" },
  scale: { opacity: 1, scale: 1 },
};

/**
 * Declarative scroll reveal used across every section (§186).
 * Reduced motion: collapses to a simple opacity fade (§202).
 */
export function Reveal({
  children,
  variant = "fade-up",
  delay = 0,
  stagger,
  className,
  as: Tag = "div",
  start = "top 85%",
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets: Element[] | Element = stagger
      ? Array.from(el.children)
      : el;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(targets, { opacity: 1, clearProps: "transform,filter,clipPath" });
        return;
      }
      gsap.fromTo(
        targets,
        FROM[variant],
        {
          ...TO[variant],
          duration: 1,
          delay,
          stagger: stagger ?? 0,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start, once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [variant, delay, stagger, start, reduced]);

  // Start hidden only when JS animates; SSR markup stays visible for bots/no-JS.
  return (
    <Tag ref={ref} className={className} id={id} data-reveal>
      {children}
    </Tag>
  );
}
