"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

const noopSubscribe = () => () => {};

/**
 * Sun ↔ moon morph: the moon crescent is carved by a masking circle that
 * slides in, while the rays collapse — with a 360° rotation on switch
 * (§36, §218). Theme change cross-fades via the View Transitions API
 * where supported (§219).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  // true after hydration, false during SSR — avoids theme-mismatch flicker
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (doc.startViewTransition) {
      doc.startViewTransition(() => setTheme(next));
    } else {
      setTheme(next);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "glass-1 flex h-11 w-11 items-center justify-center rounded-full",
        className,
      )}
      data-cursor="link"
    >
      <motion.svg
        key={String(isDark)}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        initial={{ rotate: -360, scale: 0.6, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      >
        <mask id="moon-mask">
          <rect width="24" height="24" fill="#fff" />
          <motion.circle
            cx={isDark ? 17 : 30}
            cy={isDark ? 7 : 0}
            r="8"
            fill="#000"
            animate={{ cx: isDark ? 17 : 30, cy: isDark ? 7 : 0 }}
            transition={{ duration: 0.4 }}
          />
        </mask>
        <motion.circle
          cx="12"
          cy="12"
          fill="currentColor"
          mask="url(#moon-mask)"
          animate={{ r: isDark ? 8 : 5 }}
          transition={{ duration: 0.4 }}
        />
        <motion.g
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          animate={{ opacity: isDark ? 0 : 1, scale: isDark ? 0.4 : 1 }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: "center" }}
        >
          <line x1="12" y1="1.5" x2="12" y2="3.5" />
          <line x1="12" y1="20.5" x2="12" y2="22.5" />
          <line x1="1.5" y1="12" x2="3.5" y2="12" />
          <line x1="20.5" y1="12" x2="22.5" y2="12" />
          <line x1="4.6" y1="4.6" x2="6" y2="6" />
          <line x1="18" y1="18" x2="19.4" y2="19.4" />
          <line x1="4.6" y1="19.4" x2="6" y2="18" />
          <line x1="18" y1="6" x2="19.4" y2="4.6" />
        </motion.g>
      </motion.svg>
    </button>
  );
}
