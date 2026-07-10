"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { cn } from "@/lib/cn";

interface TiltCardProps {
  children: ReactNode;
  /** max tilt in degrees — house rule ≤ 6 (§87, §123) */
  maxDeg?: number;
  className?: string;
}

/**
 * Gentle 3D tilt toward the cursor with spring return.
 * Disabled on coarse pointers and under reduced motion (§272).
 */
export function TiltCard({ children, maxDeg = 6, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 160, damping: 18 });
  const sy = useSpring(py, { stiffness: 160, damping: 18 });
  const rotateX = useTransform(sy, [0, 1], [maxDeg, -maxDeg]);
  const rotateY = useTransform(sx, [0, 1], [-maxDeg, maxDeg]);

  const onMove = (e: MouseEvent) => {
    if (reduced || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("[transform-style:preserve-3d]", className)}
      style={
        reduced
          ? undefined
          : { rotateX, rotateY, perspective: 900 }
      }
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
