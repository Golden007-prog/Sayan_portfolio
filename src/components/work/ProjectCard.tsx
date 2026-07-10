"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/data";
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
  const accentVars = { "--pc-accent": project.accent } as CSSProperties;

  return (
    <TiltCard maxDeg={4} className={cn("h-full", className)}>
      <Link
        href={`/projects/${project.slug}`}
        data-cursor="view"
        aria-label={`${project.title} — open case study`}
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
          <div className="relative aspect-[16/10] overflow-hidden rounded-[calc(var(--radius-glass)_-_0.5rem)]">
            <Image
              src={project.cover}
              alt={`${project.title} — ${project.subtitle}`}
              fill
              sizes="(min-width: 1024px) 44vw, (min-width: 640px) 70vw, 85vw"
              placeholder="blur"
              blurDataURL={accentBlurDataURL(project.accent)}
              className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.06]"
            />
            {/* Caption bar slides up on hover (§112) */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between gap-3 px-4 py-3 transition-transform duration-500 ease-soft group-hover:translate-y-0"
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
                style={{ color: "var(--pc-accent)" }}
              >
                {project.metrics[0]?.value}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              {/* Mono index 01–04 (§111) */}
              <span className="mono-chip" style={{ color: "var(--pc-accent)" }}>
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
        </GlassCard>
      </Link>
    </TiltCard>
  );
}
