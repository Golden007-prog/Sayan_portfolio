"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, type CSSProperties, type MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/data";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { GlassCard } from "@/components/primitives/GlassCard";
import { TiltCard } from "@/components/primitives/TiltCard";
import { cn } from "@/lib/cn";

interface ProjectCardProps {
  project: Project;
  /** 0-based position in the gallery — rendered as the mono index 01…04 (§111) */
  index: number;
  /** Sizing/snap classes injected by the gallery layout */
  className?: string;
}

/**
 * The vivid project accents drop below WCAG on the light surface (cyan 1.69:1,
 * green 1.80:1, pink 2.47:1), so readable accent text maps to the theme-aware
 * text-safe token; decoration (glow, borders) keeps the vivid value.
 */
const ACCENT_TEXT_VAR: Record<string, string> = {
  "#7C5CFF": "var(--accent-1-text)",
  "#22D3EE": "var(--accent-2-text)",
  "#F472B6": "var(--accent-3-text)",
  "#34D399": "var(--accent-4-text)",
};
const accentTextVar = (accent: string) =>
  ACCENT_TEXT_VAR[accent.toUpperCase()] ?? accent;

/** Tiny accent-tinted SVG so the cover blur-up matches the project color (§122). */
function accentBlurDataURL(accent: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="10"><rect width="16" height="10" fill="#0b0f1a"/><rect width="16" height="10" fill="${accent}" fill-opacity="0.3"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Large glass case card for the Selected Work gallery (§111–§114, §122, §123).
 * Whole card is one link to the case page; hover zooms the cover inside its
 * clipped frame, slides the caption bar up and rotates the arrow -45°.
 * The project accent tints glow + chips via a scoped CSS variable.
 */
export function ProjectCard({ project, index, className }: ProjectCardProps) {
  const router = useRouter();
  const reduced = useReducedMotionSafe();
  const coverRef = useRef<HTMLDivElement>(null);
  const href = `/projects/${project.slug}`;
  const accentVars = {
    "--pc-accent": project.accent,
    "--pc-accent-text": accentTextVar(project.accent),
  } as CSSProperties;

  /**
   * Shared-element morph into the case page (§114): stamp `proj-<slug>` on the
   * activated cover only — never on all cards at once — so a single element
   * carries the name at capture time (the case-page hero owns the twin). Falls
   * back to a normal navigation when the API is unsupported or motion is reduced.
   */
  const handleActivate = (e: MouseEvent<HTMLAnchorElement>) => {
    // Preserve new-tab / modified / middle clicks — let the browser handle them.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { finished: Promise<void> };
    };
    const cover = coverRef.current;
    if (reduced || typeof doc.startViewTransition !== "function" || !cover) return;
    e.preventDefault();
    cover.style.viewTransitionName = `proj-${project.slug}`;
    const clear = () => {
      if (coverRef.current) coverRef.current.style.viewTransitionName = "";
    };
    doc.startViewTransition(() => router.push(href)).finished.then(clear, clear);
  };

  return (
    <TiltCard maxDeg={4} className={cn("h-full", className)}>
      <Link
        href={href}
        onClick={handleActivate}
        data-cursor="view"
        // No aria-label: it would override the visible title and trip WCAG 2.5.3
        // (label in name). The card's own text names the link; the sr-only
        // suffix below states the action.
        className="group block h-full rounded-[var(--radius-glass)]"
        style={accentVars}
      >
        <GlassCard
          tier={2}
          sheen
          className="relative flex h-full flex-col overflow-hidden p-3 sm:p-4"
        >
          {/* Accent glow — opacity-only transition, tinted per project (§122) */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-500 ease-soft group-hover:opacity-100"
            style={{
              boxShadow:
                "inset 0 0 120px -70px var(--pc-accent), 0 0 80px -36px var(--pc-accent)",
            }}
          />

          {/* Cover: 16:9 source cropped to 16:10, zoom stays inside the frame (§112) */}
          <div
            ref={coverRef}
            className="relative aspect-[16/10] overflow-hidden rounded-[calc(var(--radius-glass)_-_0.5rem)]"
          >
            <Image
              src={project.cover}
              /* Decorative: the adjacent title and subtitle already name the
                 card, and a duplicate alt would bloat the link's a11y name. */
              alt=""
              fill
              sizes="(min-width: 1024px) 44vw, (min-width: 640px) 70vw, 85vw"
              placeholder="blur"
              blurDataURL={accentBlurDataURL(project.accent)}
              className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.06]"
            />
            {/* Caption bar: shown by default on coarse/touch pointers (no hover
                to reveal it), slides up on hover only where a fine pointer can
                trigger it — desktop choreography unchanged (§112, §269). */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-4 py-3 transition-transform duration-500 ease-soft [@media(hover:hover)_and_(pointer:fine)]:translate-y-full [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-y-0"
              style={{
                background: "color-mix(in srgb, var(--bg) 78%, transparent)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <span className="mono-chip text-fg">
                {project.year} · {project.role}
              </span>
              <span
                className="mono-chip"
                style={{ color: "var(--pc-accent-text)" }}
              >
                {project.metrics[0]?.value}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              {/* Mono index 01–04 (§111) */}
              <span
                className="mono-chip"
                style={{ color: "var(--pc-accent-text)" }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <ArrowUpRight
                aria-hidden
                className="h-5 w-5 shrink-0 text-muted-fg transition-transform duration-500 ease-soft group-hover:-rotate-45 group-hover:text-fg"
              />
            </div>
            <h3 className="font-display leading-tight">{project.title}</h3>
            <p className="text-sm text-muted-fg">{project.subtitle}</p>
            {/* Stack chips tinted by the project accent (§111, §122) */}
            <ul className="mt-auto flex flex-wrap gap-2 pt-2" aria-label="Tech stack">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="mono-chip rounded-full border px-2.5 py-1 text-muted-fg"
                  style={{
                    borderColor:
                      "color-mix(in srgb, var(--pc-accent) 35%, transparent)",
                    background:
                      "color-mix(in srgb, var(--pc-accent) 8%, transparent)",
                  }}
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
          <span className="sr-only">— open case study</span>
        </GlassCard>
      </Link>
    </TiltCard>
  );
}
