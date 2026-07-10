"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow: string;
  heading: string;
  className?: string;
  /** Draw an underline gradient wipe after the rise (§88, §185) */
  underline?: boolean;
}

/**
 * Shared section header: mono index eyebrow + display heading with
 * rise reveal and gradient wipe (§185).
 */
export function SectionHeading({
  eyebrow,
  heading,
  className,
  underline,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set("[data-sh]", { autoAlpha: 1, y: 0 });
        gsap.set("[data-sh-line]", { scaleX: 1 });
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
      tl.fromTo(
        "[data-sh='eyebrow']",
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.6 },
      )
        .fromTo(
          "[data-sh='heading']",
          { autoAlpha: 0, y: 40, clipPath: "inset(0 0 100% 0)" },
          { autoAlpha: 1, y: 0, clipPath: "inset(0 0 -10% 0)", duration: 0.9 },
          "-=0.35",
        )
        .fromTo(
          "[data-sh-line]",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: "power3.inOut" },
          "-=0.5",
        );
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={ref} className={cn("mb-14 md:mb-20", className)}>
      <p data-sh="eyebrow" className="eyebrow mb-4">
        {eyebrow}
      </p>
      <h2 data-sh="heading" className="headline-flip">
        {heading}
      </h2>
      {underline && (
        <span
          data-sh-line
          aria-hidden
          className="mt-6 block h-px w-32 origin-left"
          style={{ background: "var(--gradient)" }}
        />
      )}
    </div>
  );
}
