"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

interface RoleTickerProps {
  roles: string[];
  className?: string;
}

const TYPE_MS = 70;
const DELETE_MS = 38;
const HOLD_MS = 1800;
const GAP_MS = 320;
const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#$%&0123456789";

/**
 * Typewriter cycling through roles with a blinking mono cursor (§41),
 * plus a GSAP text-scramble pass on hover (§198, pointer:fine only).
 * Reduced motion: static first role, no cycling, no scramble.
 */
export function RoleTicker({ roles, className }: RoleTickerProps) {
  const rootRef = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotionSafe();
  const [display, setDisplay] = useState(() => roles[0] ?? "");
  /** What the typewriter last wrote — the scramble resolves back to this. */
  const currentRef = useRef(roles[0] ?? "");
  /** Typewriter holds while a hover-scramble runs. */
  const pausedRef = useRef(false);
  const ctxRef = useRef<gsap.Context | null>(null);
  const scrambleTweenRef = useRef<gsap.core.Tween | null>(null);

  // One context for the life of the component; hover tweens register into it.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {}, el);
    ctxRef.current = ctx;
    return () => {
      ctxRef.current = null;
      scrambleTweenRef.current = null;
      ctx.revert();
    };
  }, []);

  // Typewriter loop (§41)
  useEffect(() => {
    const first = roles[0] ?? "";
    currentRef.current = first;
    if (reduced || roles.length === 0) return;

    let index = 0;
    let pos = first.length; // SSR paints the first role fully typed
    let deleting = false;
    let timer = 0;

    const write = (text: string) => {
      currentRef.current = text;
      setDisplay(text);
    };

    const tick = () => {
      if (pausedRef.current) {
        timer = window.setTimeout(tick, 120);
        return;
      }
      const word = roles[index] ?? "";
      if (!deleting) {
        if (pos < word.length) {
          pos += 1;
          write(word.slice(0, pos));
          timer = window.setTimeout(tick, TYPE_MS);
        } else {
          deleting = true;
          timer = window.setTimeout(tick, HOLD_MS);
        }
      } else if (pos > 0) {
        pos -= 1;
        write(word.slice(0, pos));
        timer = window.setTimeout(tick, DELETE_MS);
      } else {
        deleting = false;
        index = (index + 1) % roles.length;
        timer = window.setTimeout(tick, GAP_MS);
      }
    };

    timer = window.setTimeout(tick, HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [roles, reduced]);

  // Hover text-scramble (§198) — resolves left-to-right back to the real text.
  const scramble = () => {
    if (
      reduced ||
      scrambleTweenRef.current ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }
    const target = currentRef.current;
    if (!target) return;
    pausedRef.current = true;
    ctxRef.current?.add(() => {
      const proxy = { p: 0 };
      scrambleTweenRef.current = gsap.to(proxy, {
        p: 1,
        duration: 0.7,
        ease: "power2.out",
        onUpdate: () => {
          const settled = Math.floor(proxy.p * target.length);
          let out = target.slice(0, settled);
          for (let i = settled; i < target.length; i += 1) {
            const ch = target[i];
            out +=
              ch === " "
                ? " "
                : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }
          setDisplay(out);
        },
        onComplete: () => {
          setDisplay(target);
          scrambleTweenRef.current = null;
          pausedRef.current = false;
        },
      });
    });
  };

  return (
    <p
      ref={rootRef}
      className={cn(
        "min-h-[1.75em] font-mono text-sm tracking-wide text-accent2t md:text-base",
        className,
      )}
      onMouseEnter={scramble}
      data-cursor="text"
    >
      {/* Screen readers get the full stable list, not a churning live region */}
      <span className="sr-only">{roles.join(" · ")}</span>
      {/* Reduced motion: static first role, no cycling (§202) */}
      <span aria-hidden>{reduced ? (roles[0] ?? "") : display}</span>
      <span
        aria-hidden
        className="ml-1 inline-block animate-[ticker-blink_1.1s_steps(1,end)_infinite]"
      >
        ▌
      </span>
      <style>{`@keyframes ticker-blink { 0%, 54% { opacity: 1; } 55%, 100% { opacity: 0; } }`}</style>
    </p>
  );
}
