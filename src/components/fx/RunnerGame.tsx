"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

/**
 * 404 endless runner: press space (or tap) to jump the cursor block over
 * incoming mainframe obstacles (§285). Pure canvas, zero deps.
 */
export function RunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const W = 600;
    const H = 160;
    const GROUND = H - 24;
    let y = GROUND - 20;
    let vy = 0;
    let running = true;
    let frame: number;
    let dist = 0;
    let speed = 4;
    const obstacles: { x: number; w: number; h: number }[] = [];
    const glyphs = ["▮", "▯", "◧"];

    const jump = () => {
      if (y >= GROUND - 21) vy = -9.5;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    };
    const onTap = () => jump();
    window.addEventListener("keydown", onKey);
    canvas.addEventListener("pointerdown", onTap);

    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--accent-2").trim() || "#22D3EE";
    const muted = styles.getPropertyValue("--text-muted").trim() || "#9AA3B5";

    const loop = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);

      // ground
      ctx.strokeStyle = muted;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(0, GROUND + 20);
      ctx.lineTo(W, GROUND + 20);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // player physics
      vy += 0.55;
      y = Math.min(y + vy, GROUND - 20);
      ctx.fillStyle = accent;
      ctx.fillRect(60, y, 20, 20);

      // obstacles
      dist += speed;
      speed = 4 + Math.floor(dist / 1200) * 0.5;
      if (
        obstacles.length === 0 ||
        obstacles[obstacles.length - 1].x < W - 220 - Math.random() * 160
      ) {
        const h = 18 + Math.random() * 16;
        obstacles.push({ x: W + 20, w: 16, h });
      }
      ctx.font = "20px monospace";
      ctx.fillStyle = muted;
      for (const ob of obstacles) {
        ob.x -= speed;
        ctx.fillText(glyphs[Math.floor(ob.x) % 3], ob.x, GROUND + 16);
        // collision
        if (60 < ob.x + ob.w && 80 > ob.x && y + 20 > GROUND + 16 - ob.h) {
          dist = 0;
          speed = 4;
          obstacles.length = 0;
          setScore((s) => {
            setBest((b) => Math.max(b, s));
            return 0;
          });
          break;
        }
      }
      while (obstacles[0] && obstacles[0].x < -30) obstacles.shift();

      setScore(Math.floor(dist / 10));
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("pointerdown", onTap);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div className="glass mt-10 inline-block p-4">
      <p className="mono-chip mb-2 text-muted-fg">
        PRESS SPACE TO JUMP · SCORE {score} · BEST {best}
      </p>
      <canvas
        ref={canvasRef}
        width={600}
        height={160}
        className="max-w-full touch-manipulation"
        aria-label="Endless runner mini-game: jump over mainframe obstacles"
      />
    </div>
  );
}
