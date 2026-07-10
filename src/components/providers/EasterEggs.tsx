"use client";

import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { site, terminalCopy } from "@/content/data";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

function festiveGreeting(): string | null {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  if (m === 1 && d === 1) return terminalCopy.festive.newYear;
  // Diwali dates (lookup — lunar calendar)
  const diwali: Record<number, [number, number]> = {
    2025: [10, 20], 2026: [11, 8], 2027: [10, 29], 2028: [10, 17],
  };
  const dd = diwali[now.getFullYear()];
  if (dd && m === dd[0] && d === dd[1]) return terminalCopy.festive.diwali;
  // Site anniversary (§284) — fire whenever the month + day match the launch date
  const [, annM, annD] = site.launchedOn.split("-").map(Number);
  if (m === annM && d === annD) return terminalCopy.festive.anniversary;
  return null;
}

/**
 * Konami terminal mode (§277-278), "cobol" punch-card rain (§280),
 * styled console messages (§279, §182, §284). Mounted once in layout.
 */
export function EasterEggs() {
  const { toast } = useToast();
  const [terminal, setTerminal] = useState(false);
  // Mirror of `terminal` so the keydown listener (registered once) can read the
  // current value without re-subscribing, and decide the next value up front —
  // keeping setState updaters pure.
  const terminalRef = useRef(false);
  const konamiIdx = useRef(0);
  const typeBuf = useRef("");
  const savedHeadings = useRef<Map<HTMLElement, string>>(new Map());

  // Console greetings — once per load (§279, §182, §284)
  useEffect(() => {
    console.log(
      "%c" + terminalCopy.asciiBanner,
      "color:#7C5CFF;font-family:monospace;font-size:10px;",
    );
    console.log(
      `%c${terminalCopy.console.hiring}`,
      "color:#22D3EE;font-size:13px;font-weight:bold;",
    );
    console.log(`%c${terminalCopy.console.konamiHint}`, "color:#9AA3B5;");
    const festive = festiveGreeting();
    if (festive) console.log(`%c${festive}`, "color:#F472B6;font-size:13px;");
  }, []);

  // Terminal mode side effects: reskin + dataset heading swap
  useEffect(() => {
    terminalRef.current = terminal;
    const root = document.documentElement;
    if (terminal) {
      root.setAttribute("data-terminal", "on");
      const map = savedHeadings.current;
      for (const [id, ds] of Object.entries(terminalCopy.datasetNames)) {
        const h = document.querySelector<HTMLElement>(`#${id} h2`);
        if (h) {
          map.set(h, h.textContent ?? "");
          h.textContent = ds;
        }
      }
    } else {
      root.removeAttribute("data-terminal");
      for (const [el, text] of savedHeadings.current) el.textContent = text;
      savedHeadings.current.clear();
    }
  }, [terminal]);

  useEffect(() => {
    const spawnRain = () => {
      const cards = ["🗂️", "📇", "🎞️", "📼"];
      const n = 26;
      for (let i = 0; i < n; i++) {
        const s = document.createElement("span");
        s.textContent = cards[i % cards.length];
        const left = Math.random() * 100;
        const delay = Math.random() * 1.2;
        const dur = 1.6 + Math.random();
        s.style.cssText = `position:fixed;top:-40px;left:${left}vw;z-index:9997;pointer-events:none;font-size:${16 + Math.random() * 16}px;animation:punch-fall ${dur}s ${delay}s ease-in forwards;`;
        document.body.appendChild(s);
        window.setTimeout(() => s.remove(), (dur + delay) * 1000 + 100);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      // F3 exits terminal mode — the ISPF way (§277). Only swallow the key
      // (and its default browser Find bar) while the terminal is actually open.
      if (e.key === "F3") {
        if (terminalRef.current) {
          e.preventDefault();
          terminalRef.current = false;
          setTerminal(false);
          toast(terminalCopy.toasts.exit);
        }
        return;
      }

      // Konami progression
      const expected = KONAMI[konamiIdx.current];
      if (e.key === expected || e.key.toLowerCase() === expected) {
        konamiIdx.current += 1;
        if (konamiIdx.current === KONAMI.length) {
          konamiIdx.current = 0;
          if (!terminalRef.current) {
            terminalRef.current = true;
            setTerminal(true);
            toast(terminalCopy.toasts.enter);
          }
        }
      } else {
        konamiIdx.current = e.key === KONAMI[0] ? 1 : 0;
      }

      // "cobol" typed anywhere (outside inputs) → punch-card rain (§280)
      const target = e.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      if (e.key.length === 1) {
        typeBuf.current = (typeBuf.current + e.key.toLowerCase()).slice(-5);
        if (typeBuf.current === "cobol") {
          typeBuf.current = "";
          spawnRain();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toast]);

  return (
    <>
      {terminal && (
        <>
          <div className="terminal-scanlines" aria-hidden />
          <pre
            aria-hidden
            className="mono-chip pointer-events-none fixed bottom-3 left-3 z-[91] text-[7px] leading-tight opacity-60"
            style={{ color: "var(--accent-1)" }}
          >
            {terminalCopy.asciiBanner}
          </pre>
        </>
      )}
      <style>{`@keyframes punch-fall { to { transform: translateY(110vh) rotate(120deg); opacity: 0.6; } }`}</style>
    </>
  );
}
