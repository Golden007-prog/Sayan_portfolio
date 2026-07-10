import Link from "next/link";
import { RunnerGame } from "@/components/fx/RunnerGame";
import { notFoundCopy } from "@/content/data";

/** ABEND S0C4 — the mainframe 404 (§285, §129). */
export default function NotFound() {
  return (
    <main id="main" className="container-site flex min-h-svh flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow mb-6">{notFoundCopy.eyebrow}</p>
      <h1
        className="glitch font-mono text-6xl font-bold md:text-8xl"
        data-text={notFoundCopy.code}
      >
        {notFoundCopy.code}
      </h1>
      <p className="mt-6 max-w-md text-muted-fg">{notFoundCopy.body}</p>

      <Link
        href="/"
        className="glass mt-10 inline-flex min-h-11 items-center rounded-full px-7 py-3 font-medium transition-transform hover:-translate-y-0.5"
      >
        {notFoundCopy.home}
      </Link>

      <RunnerGame />

      <style>{`
        .glitch { position: relative; }
        .glitch::before, .glitch::after {
          content: attr(data-text);
          position: absolute; inset: 0;
          opacity: 0.75;
        }
        /* These pseudo-layers restate the heading text on top of it, so they
           must use the surface-aware accents or the glyphs wash out in light mode. */
        .glitch::before {
          color: var(--accent-2-text);
          animation: glitch-a 2.4s infinite steps(2, jump-none);
        }
        .glitch::after {
          color: var(--accent-3-text);
          animation: glitch-b 3.1s infinite steps(2, jump-none);
        }
        @keyframes glitch-a {
          0%, 92% { transform: none; clip-path: inset(0 0 0 0); }
          94% { transform: translate(-3px, 1px); clip-path: inset(10% 0 55% 0); }
          97% { transform: translate(3px, -1px); clip-path: inset(60% 0 8% 0); }
        }
        @keyframes glitch-b {
          0%, 90% { transform: none; clip-path: inset(0 0 0 0); }
          93% { transform: translate(3px, 2px); clip-path: inset(40% 0 30% 0); }
          96% { transform: translate(-3px, -2px); clip-path: inset(5% 0 70% 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .glitch::before, .glitch::after { animation: none; opacity: 0; }
        }
      `}</style>
    </main>
  );
}
