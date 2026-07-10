"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

/**
 * Three giant blurred radial-gradient blobs drifting on slow loops —
 * the ambient layer every glass surface floats above (§3.5, §209).
 * Transform-only animation; static under reduced motion.
 */
export function AuroraBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    if (reduced || !rootRef.current) return;
    const ctx = gsap.context(() => {
      const drifts: [string, number, number, number][] = [
        // selector, x-range, y-range, duration
        ["[data-blob='1']", 120, 80, 26],
        ["[data-blob='2']", -140, 100, 34],
        ["[data-blob='3']", 90, -120, 40],
      ];
      for (const [sel, x, y, duration] of drifts) {
        gsap.to(sel, {
          x,
          y,
          rotation: 20,
          duration,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-fx-layer
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        data-blob="1"
        className="absolute -top-[20%] -left-[10%] h-[60vmax] w-[60vmax] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--aurora-1) 0%, transparent 65%)",
          filter: "blur(120px)",
        }}
      />
      <div
        data-blob="2"
        className="absolute top-[30%] -right-[15%] h-[55vmax] w-[55vmax] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--aurora-2) 0%, transparent 65%)",
          filter: "blur(120px)",
        }}
      />
      <div
        data-blob="3"
        className="absolute -bottom-[25%] left-[20%] h-[50vmax] w-[50vmax] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--aurora-3) 0%, transparent 65%)",
          filter: "blur(120px)",
        }}
      />
    </div>
  );
}
