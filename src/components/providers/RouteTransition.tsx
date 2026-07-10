"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

const WIPE_S = 0.45;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Route transitions (§14, §196): on pathname change a full-screen glass
 * curtain wipes in over 0.45s, then wipes out over 0.45s while the new
 * route settles beneath it, with a slim glass progress bar tracking the
 * swap up top. Reduced motion collapses both layers to plain fades.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const [transitioning, setTransitioning] = useState(false);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    setTransitioning(true);
    // hold until the wipe-in covers the swap, then AnimatePresence plays the wipe-out
    const t = window.setTimeout(() => setTransitioning(false), WIPE_S * 1000);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return (
    <>
      {children}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            key={`curtain-${pathname}`}
            aria-hidden
            data-print-hide
            className="pointer-events-none fixed inset-0 z-[100]"
            style={{
              background: "var(--glass-bg-3)",
              backdropFilter: "blur(28px) saturate(170%)",
              WebkitBackdropFilter: "blur(28px) saturate(170%)",
              boxShadow: "inset 0 1px 0 var(--glass-highlight)",
            }}
            initial={
              reduced ? { opacity: 0 } : { clipPath: "inset(100% 0% 0% 0%)" }
            }
            animate={
              reduced ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }
            }
            exit={
              reduced
                ? { opacity: 0, transition: { duration: 0.3, ease: "easeOut" } }
                : {
                    clipPath: "inset(0% 0% 100% 0%)",
                    transition: { duration: WIPE_S, ease: EASE },
                  }
            }
            transition={{ duration: reduced ? 0.3 : WIPE_S, ease: EASE }}
          />
        )}
        {transitioning && (
          <motion.div
            key={`bar-${pathname}`}
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
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: WIPE_S, ease: "linear" } }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <motion.span
              className="block h-full w-full origin-left"
              style={{ background: "var(--gradient)" }}
              initial={{ scaleX: reduced ? 1 : 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: reduced ? 0.15 : WIPE_S, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
