"use client";

import { useEffect, useRef } from "react";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { cn } from "@/lib/cn";

interface ConfettiProps {
  className?: string;
}

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vr: number;
  color: string;
  life: number;
  ttl: number;
  round: boolean;
}

/** Hard cap per §133 — a micro-burst, not a parade. */
const MAX_PIECES = 150;
const PIECES = 130;
const GRAVITY = 880; // px/s²
const DRAG = 0.985;

/**
 * Canvas confetti micro-burst (§133). Fires exactly once, the first time
 * the canvas (covering its host card) enters the viewport — IO with an
 * internal fired latch. Reduced motion renders nothing. Lazy-load this
 * component via next/dynamic so the chunk only ships near the viewport (§142).
 */
export function Confetti({ className }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firedRef = useRef(false);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rootStyles = getComputedStyle(document.documentElement);
    const palette = ["--accent-1", "--accent-2", "--accent-3", "--accent-4"].map(
      (v) => rootStyles.getPropertyValue(v).trim() || "#22d3ee",
    );

    let w = 0;
    let h = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let raf = 0;

    const burst = () => {
      const n = Math.min(PIECES, MAX_PIECES);
      const cx = w / 2;
      const cy = h * 0.4;
      const pieces: Piece[] = Array.from({ length: n }, () => {
        // bias the spray upward so pieces arc and rain back down
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.4;
        const speed = 160 + Math.random() * 340;
        return {
          x: cx + (Math.random() - 0.5) * w * 0.3,
          y: cy + (Math.random() - 0.5) * 24,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 3 + Math.random() * 4,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 12,
          color: palette[Math.floor(Math.random() * palette.length)],
          life: 0,
          ttl: 1.2 + Math.random() * 1.2,
          round: Math.random() < 0.3,
        };
      });

      let last = performance.now();
      const loop = (t: number) => {
        const dt = Math.min((t - last) / 1000, 0.05);
        last = t;
        ctx.clearRect(0, 0, w, h);
        let alive = 0;
        for (const p of pieces) {
          p.life += dt;
          if (p.life >= p.ttl) continue;
          alive += 1;
          p.vy += GRAVITY * dt;
          p.vx *= DRAG;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.rot += p.vr * dt;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.globalAlpha = Math.max(0, 1 - p.life / p.ttl);
          ctx.fillStyle = p.color;
          if (p.round) {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          }
          ctx.restore();
        }
        ctx.globalAlpha = 1;
        if (alive > 0) {
          raf = requestAnimationFrame(loop);
        } else {
          ctx.clearRect(0, 0, w, h);
        }
      };
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || firedRef.current) return;
        firedRef.current = true; // once, ever (§133)
        io.disconnect();
        resize();
        burst();
      },
      { threshold: 0.35 },
    );
    io.observe(canvas);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

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
