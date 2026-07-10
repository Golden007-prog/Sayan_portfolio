"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

export type CursorState = "default" | "link" | "view" | "drag" | "text";

interface CursorApi {
  sparkle: boolean;
  setSparkle: (on: boolean) => void;
}

const CursorContext = createContext<CursorApi>({
  sparkle: false,
  setSparkle: () => {},
});

export const useCursor = () => useContext(CursorContext);

/**
 * Custom cursor: 8px dot + 36px trailing ring with mix-blend-difference,
 * contextual states via [data-cursor] delegation (§189, §190).
 * Fully disabled on coarse pointers — native cursor untouched (§191).
 * Sparkle trail runs inside [data-sparkle-zone] or when toggled on (§150, §283).
 */
export function CursorProvider({ children }: { children: ReactNode }) {
  const [sparkle, setSparkle] = useState(false);
  const [active, setActive] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotionSafe();
  const sparkleRef = useRef(sparkle);
  useEffect(() => {
    sparkleRef.current = sparkle;
  }, [sparkle]);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setActive(fine.matches);
    update();
    fine.addEventListener("change", update);
    return () => fine.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!active) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    document.documentElement.classList.add("custom-cursor");

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    let lastSparkle = 0;
    const spawnSparkle = (x: number, y: number) => {
      const now = performance.now();
      if (now - lastSparkle < 60) return; // cap emission rate
      lastSparkle = now;
      const s = document.createElement("span");
      s.textContent = "✦";
      s.style.cssText = `position:fixed;left:${x}px;top:${y}px;z-index:9998;pointer-events:none;font-size:${8 + Math.random() * 8}px;color:var(--accent-2);animation:sparkle-fall 0.9s ease-out forwards;`;
      document.body.appendChild(s);
      window.setTimeout(() => s.remove(), 900);
    };

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      const inZone = (e.target as Element | null)?.closest?.("[data-sparkle-zone]");
      if (!reduced && (sparkleRef.current || inZone)) {
        spawnSparkle(e.clientX, e.clientY);
      }
    };

    const applyState = (state: CursorState) => {
      const scale = state === "link" ? 1.6 : state === "view" ? 2.6 : 1;
      gsap.to(ring, {
        scale,
        duration: 0.3,
        ease: "power3.out",
      });
      ring.dataset.state = state;
      label.textContent =
        state === "view" ? "VIEW →" : state === "drag" ? "⟷" : "";
      gsap.to(label, {
        autoAlpha: state === "view" || state === "drag" ? 1 : 0,
        duration: 0.2,
      });
      gsap.to(dot, {
        scaleY: state === "text" ? 2.4 : 1,
        scaleX: state === "text" ? 0.4 : 1,
        duration: 0.2,
      });
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const stateEl = target?.closest?.("[data-cursor]");
      const state = (stateEl?.getAttribute("data-cursor") as CursorState) ?? null;
      if (state) {
        applyState(state);
      } else if (target?.closest?.("a, button, [role='button']")) {
        applyState("link");
      } else if (target?.closest?.("input, textarea, p, h1, h2, h3, li")) {
        applyState("text");
      } else {
        applyState("default");
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [active, reduced]);

  return (
    <CursorContext.Provider value={{ sparkle, setSparkle }}>
      {children}
      {active && (
        <>
          <div
            ref={ringRef}
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-[18px] -mt-[18px] flex h-9 w-9 items-center justify-center rounded-full border border-white mix-blend-difference [&[data-state='view']]:border-transparent [&[data-state='view']]:bg-white"
          >
            <span
              ref={labelRef}
              className="mono-chip whitespace-nowrap text-[8px] font-bold text-black opacity-0"
            />
          </div>
          <div
            ref={dotRef}
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-1 -mt-1 h-2 w-2 rounded-full bg-white mix-blend-difference"
          />
          <style>{`@keyframes sparkle-fall { to { transform: translateY(24px) scale(0.2) rotate(90deg); opacity: 0; } }`}</style>
        </>
      )}
    </CursorContext.Provider>
  );
}
