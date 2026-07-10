"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type GlassTier = 1 | 2 | 3;

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Depth tier: 1 background chips · 2 cards (default) · 3 modals (§206) */
  tier?: GlassTier;
  /** Slow rotating conic-gradient border (§208) */
  conic?: boolean;
  /** Diagonal light-sheen sweep on hover (§212) */
  sheen?: boolean;
  /** Radial spotlight that follows the cursor — pair with SpotlightHandler (§82) */
  spotlight?: boolean;
}

const tierClass: Record<GlassTier, string> = {
  1: "glass-1",
  2: "glass",
  3: "glass-3",
};

/**
 * The one glass surface. Every panel, card, modal and toast on the site
 * renders through this component or the shared .glass utilities (§205).
 */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  function GlassCard(
    { tier = 2, conic, sheen, spotlight, className, children, onMouseMove, ...rest },
    ref,
  ) {
    const handleMouseMove = spotlight
      ? (e: React.MouseEvent<HTMLDivElement>) => {
          const el = e.currentTarget;
          const rect = el.getBoundingClientRect();
          el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
          el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
          onMouseMove?.(e);
        }
      : onMouseMove;

    return (
      <div
        ref={ref}
        className={cn(
          tierClass[tier],
          conic && "glass-conic",
          sheen && "glass-sheen",
          spotlight && "glass-spotlight",
          className,
        )}
        onMouseMove={handleMouseMove}
        {...rest}
      >
        {spotlight && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 [.glass-spotlight:hover_&]:opacity-100"
            style={{
              background:
                "radial-gradient(320px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in srgb, var(--accent-1) 14%, transparent), transparent 70%)",
            }}
          />
        )}
        {children}
      </div>
    );
  },
);
