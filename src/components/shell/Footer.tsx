"use client";

import Link from "next/link";
import {
  Fragment,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { Marquee } from "@/components/primitives/Marquee";
import { LiveClock } from "@/components/primitives/LiveClock";
import { nav, owner, site } from "@/content/data";

/* Back-to-top progress ring geometry (§174) */
const RING_R = 24;
const RING_C = 2 * Math.PI * RING_R;

/* One hint per page load, even across strict-mode double-mounts (§182) */
let konamiHintLogged = false;

/* ————— Tiny colophon stack icons (§178) ————— */

function IconNext(): ReactElement {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="h-3 w-3" fill="none">
      <circle cx="8" cy="8" r="6.4" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M5.9 5.4v5.2M5.9 5.4l4.6 6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconGsap(): ReactElement {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="h-3 w-3">
      <path d="M9.2 1.6 4 8.8h2.9L6.8 14.4 12 7.2H9.1l.1-5.6Z" fill="currentColor" />
    </svg>
  );
}

function IconTailwind(): ReactElement {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="h-3 w-3" fill="none">
      <path
        d="M2.5 6.6c1.7-1.9 3.5-1.9 5.2 0s3.5 1.9 5.2 0M3.1 10.4c1.7-1.9 3.5-1.9 5.2 0s3.5 1.9 5.2 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconHiggsfield(): ReactElement {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="h-3 w-3">
      <path
        d="M8 1.4 9.7 6.3 14.6 8 9.7 9.7 8 14.6 6.3 9.7 1.4 8l4.9-1.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

const colophonStack: Array<{ name: string; title: string; icon: ReactElement }> = [
  { name: "Next.js", title: "Next.js — React framework (App Router)", icon: <IconNext /> },
  { name: "GSAP", title: "GSAP — ScrollTrigger animation engine", icon: <IconGsap /> },
  { name: "Tailwind", title: "Tailwind CSS — utility-first styling", icon: <IconTailwind /> },
  { name: "Higgsfield", title: "Higgsfield — AI-generated media", icon: <IconHiggsfield /> },
];

/**
 * Site footer with a curtain reveal (§180): the panel is pinned to the
 * viewport bottom and clipped to the footer's flow box via
 * `clip-path: inset(0)` — clip-path clips fixed descendants without
 * becoming their containing block, so the page appears to lift away and
 * reveal a stationary footer. Degrades to a normal static footer under
 * reduced motion, when clip-path is unsupported, or when the panel is
 * taller than the viewport.
 */
export function Footer() {
  const reduced = useReducedMotionSafe();
  const { scrollTo } = useSmoothScroll();
  const gradientId = useId();

  const panelRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  /** null → static flow; number → curtain active with that panel height */
  const [curtainH, setCurtainH] = useState<number | null>(null);
  const curtain = !reduced && curtainH !== null;

  /* Konami hint — the HTML comment already lives in layout; this is the
     console twin, logged exactly once per page load (§182). */
  useEffect(() => {
    if (konamiHintLogged) return;
    konamiHintLogged = true;
    console.log(
      "%c//KONAMI  JOB (SAYAN),CLASS=A,MSGCLASS=X%c\n↑ ↑ ↓ ↓ ← → ← → B A — submit it on your keyboard.",
      "font-family:monospace;font-weight:bold;color:#22d3ee",
      "font-family:monospace;color:#9aa3b5",
    );
  }, []);

  /* Curtain measurement — only engage when it can render correctly (§180) */
  useEffect(() => {
    if (reduced) return; // `curtain` derives false; stale height is ignored
    if (!(typeof CSS !== "undefined" && CSS.supports("clip-path", "inset(0)"))) return;
    const panel = panelRef.current;
    if (!panel) return;

    const measure = () => {
      const h = panel.offsetHeight;
      setCurtainH(h > 0 && h <= window.innerHeight ? h : null);
    };
    const raf = requestAnimationFrame(measure);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      ro.observe(panel);
    }
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduced]);

  /* Static ↔ fixed swap changes nothing in flow (spacer == panel height),
     but let ScrollTrigger re-measure to be safe. */
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [curtainH]);

  /* Progress ring fills with overall page progress, scrubbed (§174) */
  useEffect(() => {
    if (reduced) return;
    const circle = ringRef.current;
    if (!circle) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        circle,
        { attr: { "stroke-dashoffset": RING_C } },
        {
          attr: { "stroke-dashoffset": 0 },
          ease: "none",
          scrollTrigger: {
            start: 0,
            end: () => document.documentElement.scrollHeight - window.innerHeight,
            scrub: 0.3,
          },
        },
      );
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reduced]);

  const onSectionLink = (e: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollTo(href);
  };

  const year = new Date().getFullYear();
  const city = owner.location.split(",")[0];
  const firstName = owner.name.split(" ")[0];

  const socials = [
    { label: "GitHub", href: owner.github, external: true },
    { label: "LinkedIn", href: owner.linkedin, external: true },
    { label: "Resume", href: owner.resumePdf, external: true },
  ];

  return (
    <footer
      aria-labelledby="footer-heading"
      className="relative"
      style={curtain ? { height: curtainH, clipPath: "inset(0 0 0 0)" } : undefined}
    >
      <div
        ref={panelRef}
        className={cn(curtain ? "fixed inset-x-0 bottom-0" : "relative")}
      >
        {/* Glass panel, full-bleed: radius/side borders neutralised inline (§172) */}
        <div
          className="glass relative overflow-hidden"
          style={{
            borderRadius: 0,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            borderBottomWidth: 0,
            borderTopColor: "transparent",
          }}
        >
          {/* Gradient hairline top border (§172) */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: "var(--gradient)" }}
          />

          {/* Oversized auto-scrolling watermark behind the content (§171) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex select-none items-center overflow-hidden opacity-[0.06]"
          >
            <Marquee speed={45} pauseOnHover={false} className="w-full">
              <span className="whitespace-nowrap pr-10 font-display text-[clamp(5rem,14vw,12rem)] font-bold uppercase leading-none tracking-tight">
                {owner.name} ·&nbsp;
              </span>
            </Marquee>
          </div>

          <div className="container-site relative pb-8 pt-16 md:pt-20">
            <h2 id="footer-heading" className="sr-only">
              Footer
            </h2>

            {/* Brand + back-to-top */}
            <div className="flex items-start justify-between gap-8">
              <div className="max-w-sm">
                <p className="font-display text-2xl font-bold tracking-tight">
                  {owner.name}
                </p>
                <p className="mt-2 text-sm text-muted-fg">{owner.tagline}</p>
              </div>

              <button
                type="button"
                onClick={() => scrollTo(0)}
                aria-label="Back to top"
                data-cursor="link"
                className="glass-1 group relative grid h-14 w-14 shrink-0 place-items-center"
                style={{ borderRadius: "var(--radius-chip)" }}
              >
                <svg
                  aria-hidden
                  viewBox="0 0 56 56"
                  className="absolute inset-0 h-full w-full -rotate-90"
                >
                  <circle
                    cx="28"
                    cy="28"
                    r={RING_R}
                    fill="none"
                    stroke="var(--glass-border)"
                    strokeWidth="2"
                  />
                  <circle
                    ref={ringRef}
                    cx="28"
                    cy="28"
                    r={RING_R}
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={RING_C}
                    strokeDashoffset={reduced ? 0 : RING_C}
                  />
                  <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="var(--accent-1)" />
                      <stop offset="100%" stopColor="var(--accent-2)" />
                    </linearGradient>
                  </defs>
                </svg>
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-4 w-4 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:-translate-y-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </button>
            </div>

            {/* Columns: section links · socials · contact shortcut (§173) */}
            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
              <nav aria-label="Footer sections">
                <h3 className="eyebrow">Index</h3>
                <ul className="mt-3">
                  {nav.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={(e) => onSectionLink(e, item.href)}
                        data-cursor="link"
                        className="link-underline inline-flex min-h-11 items-center text-sm text-muted-fg transition-colors hover:text-fg"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div>
                <h3 className="eyebrow">Connect</h3>
                <ul className="mt-3">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        {...(s.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        data-cursor="link"
                        className="link-underline inline-flex min-h-11 items-center gap-1 text-sm text-muted-fg transition-colors hover:text-fg"
                      >
                        {s.label}
                        {s.external && (
                          <>
                            <span aria-hidden className="text-xs">
                              ↗
                            </span>
                            <span className="sr-only">(opens in new tab)</span>
                          </>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <h3 className="eyebrow">Contact</h3>
                <ul className="mt-3">
                  <li>
                    <a
                      href={`mailto:${owner.email}`}
                      data-cursor="link"
                      className="link-underline inline-flex min-h-11 items-center break-all text-sm text-muted-fg transition-colors hover:text-fg"
                    >
                      {owner.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`tel:${owner.phone.replace(/\s/g, "")}`}
                      data-cursor="link"
                      className="link-underline inline-flex min-h-11 items-center text-sm text-muted-fg transition-colors hover:text-fg"
                    >
                      {owner.phone}
                    </a>
                  </li>
                </ul>
                <p className="mt-3 flex items-center gap-2 text-xs text-muted-fg">
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent4"
                  />
                  {owner.availability}
                </p>
              </div>
            </div>

            {/* Bottom bar (§175, §176, §177, §178, §179, §181) */}
            <div
              className="mt-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t pt-6"
              style={{ borderColor: "var(--glass-border)" }}
            >
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-fg">
                <span suppressHydrationWarning>
                  © {year} {owner.name}
                </span>
                <span aria-hidden>·</span>
                <span>Made in {city} 🇮🇳</span>
                <span aria-hidden>·</span>
                <LiveClock className="font-mono" />
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-xs text-muted-fg">
                  Designed &amp; built by {firstName} —{" "}
                  {colophonStack.map((item, i) => (
                    <Fragment key={item.name}>
                      {i > 0 && " · "}
                      <span
                        title={item.title}
                        className="inline-flex items-center gap-1 whitespace-nowrap align-middle"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </span>
                    </Fragment>
                  ))}
                  .
                </p>

                <span
                  className="mono-chip glass-1 inline-flex items-center px-2.5 py-1 text-muted-fg"
                  style={{ borderRadius: "var(--radius-chip)" }}
                >
                  v{site.version}
                </span>

                <Link
                  href="/uses"
                  aria-label="Colophon — uses page"
                  data-cursor="link"
                  className="grid h-11 w-11 place-items-center text-lg text-muted-fg transition-colors hover:text-fg"
                >
                  <span aria-hidden>·</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
