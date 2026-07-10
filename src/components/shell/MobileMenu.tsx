"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { nav, owner } from "@/content/data";
import { LiveClock } from "@/components/primitives/LiveClock";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

/* ————— Brand marks —————
   lucide-react v1 dropped its deprecated brand icons (Github/Linkedin no
   longer exist), so the two marks are inlined here (24×24 Simple Icons
   path data) and shared with the navbar + palette. */

export function GithubIcon({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function LinkedinIcon({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

/** Hamburger ⇄ X: two lines translate to meet, then counter-rotate (§25). */
function TwoLineIcon({ open }: { open: boolean }) {
  const shared =
    "origin-center [transform-box:fill-box] transition-transform duration-300 ease-[var(--ease-out-soft)]";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <line
        x1="4"
        y1="9"
        x2="20"
        y2="9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className={cn(shared, open && "translate-y-[3px] rotate-45")}
      />
      <line
        x1="4"
        y1="15"
        x2="20"
        y2="15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className={cn(shared, open && "-translate-y-[3px] -rotate-45")}
      />
    </svg>
  );
}

const FOCUSABLE = "a[href], button:not([disabled])";

/* SSR-safe "is on client" without a setState-in-effect (portal gate) */
const noopSubscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

/**
 * Self-contained mobile menu: morphing trigger (§25), full-screen glass-3
 * overlay (§23) with staggered clip-path link reveals (§24), scroll lock
 * via Lenis stop + overflow hidden (§26), ESC / focus trap / focus restore
 * (§27), and LiveClock + location + socials in the footer (§28).
 * The overlay portals to <body> so the navbar's hide/reveal transform
 * never becomes its containing block.
 */
export function MobileMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const mounted = useIsClient();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const smooth = useSmoothScroll();
  const reduced = useReducedMotionSafe();

  const close = useCallback(() => setOpen(false), []);

  // Scroll lock: Lenis stop AND overflow hidden (§26)
  useEffect(() => {
    if (!open) return;
    smooth.stop();
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
      smooth.start();
    };
  }, [open, smooth]);

  // ESC close + Tab focus trap; focus restored to trigger on close (§27)
  useEffect(() => {
    if (!open) return;
    const overlay = overlayRef.current;
    const trigger = triggerRef.current;
    overlay?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !overlay) return;
      const items = Array.from(overlay.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open, close]);

  // Close automatically if the viewport grows past the desktop breakpoint
  useEffect(() => {
    if (!open) return;
    const mql = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mql.matches) close();
    };
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [open, close]);

  const go = (href: string) => {
    close();
    // Double rAF: waits until the scroll-lock effect cleanup has restored
    // overflow and restarted Lenis, otherwise a stopped Lenis swallows scrollTo.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => smooth.scrollTo(href)),
    );
  };

  const initials = owner.name
    .split(" ")
    .map((w) => w.charAt(0))
    .join("");

  const socials = [
    { label: "GitHub", href: owner.github, icon: <GithubIcon size={16} /> },
    { label: "LinkedIn", href: owner.linkedin, icon: <LinkedinIcon size={16} /> },
  ];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        data-cursor="link"
        className={cn(
          "glass-1 flex h-11 w-11 items-center justify-center rounded-full",
          className,
        )}
      >
        <TwoLineIcon open={open} />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={overlayRef}
                id="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: reduced ? 0.15 : 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="glass-3 fixed inset-0 z-[80] flex flex-col"
                style={{ borderRadius: 0, borderWidth: 0 }}
              >
                {/* Contrast tint under the glass so type stays readable */}
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-bg/60" />

                <div
                  className="container-site relative flex shrink-0 items-center justify-between safe-top"
                  style={{ height: "var(--nav-h)" }}
                >
                  <span className="font-display text-lg font-bold tracking-tight" aria-hidden>
                    {initials}
                  </span>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close menu"
                    data-cursor="link"
                    className="glass-1 flex h-11 w-11 items-center justify-center rounded-full"
                  >
                    <TwoLineIcon open />
                  </button>
                </div>

                <div className="relative flex-1 overflow-y-auto" data-lenis-prevent>
                  <nav
                    aria-label="Menu sections"
                    className="container-site flex min-h-full flex-col gap-1 py-8 [justify-content:safe_center]"
                  >
                    {nav.map((item, i) => (
                      <div key={item.href} className="overflow-hidden py-1">
                        <motion.a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            go(item.href);
                          }}
                          initial={
                            reduced
                              ? { opacity: 0 }
                              : { clipPath: "inset(0 0 100% 0)", y: 24, opacity: 0 }
                          }
                          animate={
                            reduced
                              ? { opacity: 1 }
                              : { clipPath: "inset(0 0 -8% 0)", y: 0, opacity: 1 }
                          }
                          exit={{ opacity: 0 }}
                          transition={{
                            delay: reduced ? 0 : 0.1 + i * 0.06,
                            duration: reduced ? 0.15 : 0.6,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          data-cursor="link"
                          className="group flex items-baseline gap-4 font-display text-4xl font-bold tracking-tight sm:text-5xl"
                        >
                          <span className="mono-chip text-muted-fg" aria-hidden>
                            0{i + 1}
                          </span>
                          <span className="transition-colors duration-300 group-hover:text-transparent group-hover:[-webkit-text-stroke:1.5px_var(--text)]">
                            {item.label}
                          </span>
                        </motion.a>
                      </div>
                    ))}
                  </nav>
                </div>

                {/* Footer: live clock + location + socials (§28) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: reduced ? 0 : 0.35, duration: 0.4 }}
                  className="container-site relative flex shrink-0 flex-wrap items-center justify-between gap-4 pb-8 pt-4 safe-bottom"
                >
                  <div className="flex flex-col gap-1">
                    <LiveClock className="mono-chip text-muted-fg" />
                    <span className="mono-chip text-muted-fg">{owner.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${s.label} — opens in new tab`}
                        data-cursor="link"
                        className="glass-1 flex h-11 w-11 items-center justify-center rounded-full text-muted-fg transition-colors hover:text-fg"
                      >
                        {s.icon}
                        <span className="sr-only">opens in new tab</span>
                      </a>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
