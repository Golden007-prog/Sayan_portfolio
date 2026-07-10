"use client";

import {
  useRef,
  useState,
  type ReactNode,
  type MouseEvent,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
} from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/cn";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

type BaseProps = {
  children: ReactNode;
  /** magnetic pull multiplier — 0.3 subtle, 0.6 strong (§192) */
  strength?: number;
  className?: string;
  /** primary = gradient sweep fill; ghost = glass outline */
  variant?: "primary" | "ghost";
};

type MagneticButtonProps = BaseProps &
  (
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">)
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">)
  );

interface Ripple {
  id: number;
  x: number;
  y: number;
}

/**
 * Cursor-following magnetic CTA with spring return, gradient sweep,
 * lift + shadow bloom, and a subtle click ripple (§192, §193, §201).
 * Magnetism disabled on touch and under reduced motion.
 */
export function MagneticButton({
  children,
  strength = 0.35,
  className,
  variant = "primary",
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotionSafe();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.6 });
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const onMove = (e: MouseEvent) => {
    if (reduced || window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const onPointerDown = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const id = performance.now();
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    window.setTimeout(
      () => setRipples((r) => r.filter((rp) => rp.id !== id)),
      450,
    );
  };

  const inner = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full bg-[image:var(--gradient)] opacity-90 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:translate-x-0"
        />
      )}
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden
          className="pointer-events-none absolute h-2 w-2 animate-[ripple_0.4s_ease-out_forwards] rounded-full bg-white/10"
          style={{ left: r.x, top: r.y }}
        />
      ))}
      <style>{`@keyframes ripple { to { transform: scale(24); opacity: 0; } }`}</style>
    </>
  );

  const sharedClass = cn(
    "group relative inline-flex min-h-11 items-center justify-center overflow-hidden rounded-full px-7 py-3",
    "font-medium tracking-tight transition-shadow duration-300",
    "glass-1 hover:-translate-y-0.5 hover:shadow-[0_12px_48px_rgba(124,92,255,0.35)]",
    variant === "primary" && "border-transparent",
    className,
  );

  const style = { x: sx, y: sy };

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as { href: string } & Record<string, unknown>;
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        style={style}
        className={sharedClass}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onMouseDown={onPointerDown}
        data-cursor="link"
        {...anchorRest}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      style={style}
      className={sharedClass}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseDown={onPointerDown}
      data-cursor="link"
      {...(rest as Record<string, unknown>)}
    >
      {inner}
    </motion.button>
  );
}
