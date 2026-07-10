"use client";

import { useEffect, useRef } from "react";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { cn } from "@/lib/cn";

interface ParticlesProps {
  /** Dot count — hard-capped at 40 (§140) */
  count?: number;
  className?: string;
}

interface Dot {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  phase: number;
  color: string;
}

const MAX_DOTS = 40;

/**
 * Ambient floating canvas dots for section backdrops (§140).
 * Capped at 40 particles, rAF paused when off-screen via
 * IntersectionObserver, aria-hidden; reduced motion renders nothing.
 */
export function Particles({ count = MAX_DOTS, className }: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rootStyles = getComputedStyle(document.documentElement);
    const palette = ["--accent-1", "--accent-2", "--accent-3"].map(
      (v) => rootStyles.getPropertyValue(v).trim() || "#7c5cff",
    );

    const n = Math.min(Math.max(Math.round(count), 1), MAX_DOTS);
    let dots: Dot[] = [];
    let w = 0;
    let h = 0;

    const seed = () => {
      dots = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.8 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 14,
        vy: -6 - Math.random() * 10,
        alpha: 0.12 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        color: palette[Math.floor(Math.random() * palette.length)],
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (dots.length === 0 && w > 0 && h > 0) seed();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let running = false;
    let last = performance.now();

    const loop = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        // wrap around the edges so the field never empties
        if (d.x < -8) d.x = w + 8;
        if (d.x > w + 8) d.x = -8;
        if (d.y < -8) d.y = h + 8;
        if (d.y > h + 8) d.y = -8;
        const twinkle = 0.6 + 0.4 * Math.sin(t / 1000 + d.phase);
        ctx.globalAlpha = d.alpha * twinkle;
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
        } else {
          stop();
        }
      },
      { rootMargin: "80px" },
    );
    io.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
    };
  }, [reduced, count]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      data-fx-layer
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
    />
  );
}
