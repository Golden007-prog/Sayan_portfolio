"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

// A single downward sweep per navigation: cover fast, hold, then reveal slow.
const COVER_S = 0.2;
const HOLD_S = 0.06;
const REVEAL_S = 0.45;
const TOTAL_S = COVER_S + HOLD_S + REVEAL_S;
const EASE_COVER: [number, number, number, number] = [0.4, 0, 0.2, 1];
const EASE_REVEAL: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Route transitions (§14, §196). usePathname only changes AFTER the new route
 * has committed and painted, so we cannot cover the swap before it happens
 * without hijacking every link. The next-best, robust behaviour is a single
 * fast "cover" (~0.2s) that hides the freshly-swapped content behind an opaque
 * glass panel, a brief hold, then a slower reveal (0.45s) — reading as a proper
 * cover→reveal wipe rather than the old wipe-over-already-visible-content.
 * Reduced motion collapses to a plain fade. Children pass straight through so
 * RSC streaming is untouched; only the overlay is keyed on the pathname.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotionSafe();
  const firstRender = useRef(true);
  const [sweepKey, setSweepKey] = useState<string | null>(null);

  useEffect(() => {
    // Skip the initial mount — no curtain on first page load.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSweepKey(pathname);
  }, [pathname]);

  return (
    <>
      {children}
      {sweepKey !== null && (
        <RouteCurtain
          key={sweepKey}
          reduced={reduced}
          onDone={() => setSweepKey(null)}
        />
      )}
    </>
  );
}

/**
 * Self-contained one-shot: mounts, plays cover→hold→reveal, then asks the parent
 * to unmount it via onDone. Keyed on pathname, so a navigation mid-sweep remounts
 * a fresh curtain instead of leaving the old one stranded.
 */
function RouteCurtain({
  reduced,
  onDone,
}: {
  reduced: boolean;
  onDone: () => void;
}) {
  if (reduced) {
    return (
      <motion.div
        aria-hidden
        data-print-hide
        className="pointer-events-none fixed inset-0 z-[100]"
        style={{
          background: "var(--glass-bg-3)",
          backdropFilter: "blur(28px) saturate(170%)",
          WebkitBackdropFilter: "blur(28px) saturate(170%)",
          boxShadow: "inset 0 1px 0 var(--glass-highlight)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 0.6,
          times: [0, 0.25, 0.4, 1],
          ease: "easeInOut",
        }}
        onAnimationComplete={onDone}
      />
    );
  }

  return (
    <>
      <motion.div
        aria-hidden
        data-print-hide
        className="pointer-events-none fixed inset-0 z-[100]"
        style={{
          background: "var(--glass-bg-3)",
          backdropFilter: "blur(28px) saturate(170%)",
          WebkitBackdropFilter: "blur(28px) saturate(170%)",
          boxShadow: "inset 0 1px 0 var(--glass-highlight)",
        }}
        // Single downward sweep: grow from the top edge to cover, hold, then
        // let the top edge chase down to reveal the settled new route beneath.
        initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
        animate={{
          clipPath: [
            "inset(0% 0% 100% 0%)",
            "inset(0% 0% 0% 0%)",
            "inset(0% 0% 0% 0%)",
            "inset(100% 0% 0% 0%)",
          ],
        }}
        transition={{
          duration: TOTAL_S,
          times: [0, COVER_S / TOTAL_S, (COVER_S + HOLD_S) / TOTAL_S, 1],
          ease: [EASE_COVER, "linear", EASE_REVEAL],
        }}
        onAnimationComplete={onDone}
      />
      <motion.div
        aria-hidden
        data-print-hide
        className="pointer-events-none fixed inset-x-0 top-0 z-[110] h-[3px] overflow-hidden"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(12px) saturate(150%)",
          WebkitBackdropFilter: "blur(12px) saturate(150%)",
          borderBottom: "1px solid var(--glass-border)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: TOTAL_S, times: [0, 0.12, 0.72, 1], ease: "linear" }}
      >
        <motion.span
          className="block h-full w-full origin-left"
          style={{ background: "var(--gradient)" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: TOTAL_S * 0.9, ease: "easeInOut" }}
        />
      </motion.div>
    </>
  );
}
