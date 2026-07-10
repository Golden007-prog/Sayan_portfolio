import Link from "next/link";
import { RunnerGame } from "@/components/fx/RunnerGame";

/** ABEND S0C4 — the mainframe 404 (§285, §129). */
export default function NotFound() {
  return (
    <main id="main" className="container-site flex min-h-svh flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow mb-6">SYSTEM COMPLETION CODE</p>
      <h1
        className="glitch font-mono text-6xl font-bold md:text-8xl"
        data-text="ABEND S0C4"
      >
        ABEND S0C4
      </h1>
      <p className="mt-6 max-w-md text-muted-fg">
        Protection exception: this address does not exist in the
        portfolio&apos;s address space. The dataset you requested was never
        cataloged.
      </p>

      <Link
        href="/"
        className="glass mt-10 inline-flex min-h-11 items-center rounded-full px-7 py-3 font-medium transition-transform hover:-translate-y-0.5"
      >
        Take me home
      </Link>

      <RunnerGame />

      <style>{`
        .glitch { position: relative; }
        .glitch::before, .glitch::after {
          content: attr(data-text);
          position: absolute; inset: 0;
          opacity: 0.75;
        }
        .glitch::before {
          color: var(--accent-2);
          animation: glitch-a 2.4s infinite steps(2, jump-none);
        }
        .glitch::after {
          color: var(--accent-3);
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
