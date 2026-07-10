"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/shell/MobileMenu";
import type { Project } from "@/content/data";
import { GlassCard } from "@/components/primitives/GlassCard";
import { Reveal } from "@/components/primitives/Reveal";
import { CountUp } from "@/components/primitives/CountUp";
import { Parallax } from "@/components/primitives/Parallax";

const BLUR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjEwIiBmaWxsPSIjMGIwZjFhIi8+PC9zdmc+";

/**
 * Vivid project accents fail WCAG on the light surface, so readable accent
 * text (eyebrows, metric numbers) maps to the theme-aware text-safe token;
 * decorative glow/borders keep the vivid value.
 */
const ACCENT_TEXT_VAR: Record<string, string> = {
  "#7C5CFF": "var(--accent-1-text)",
  "#22D3EE": "var(--accent-2-text)",
  "#F472B6": "var(--accent-3-text)",
  "#34D399": "var(--accent-4-text)",
};
const accentTextVar = (accent: string) =>
  ACCENT_TEXT_VAR[accent.toUpperCase()] ?? accent;

function GithubAction({ url }: { url: string }) {
  if (!url || url === "[ADD LINK]") {
    // Visible placeholder until the real repo link is provided (§117, ground rule 2)
    return (
      <span className="mono-chip glass-1 inline-flex items-center gap-2 rounded-full px-4 py-2 text-muted-fg">
        <GithubIcon size={14} /> [ADD LINK]
      </span>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-1 inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 transition-transform hover:-translate-y-0.5"
    >
      <GithubIcon size={16} />
      View source
      <span className="sr-only">(opens in new tab)</span>
    </a>
  );
}

/** Case page: hero media → Problem → Approach → Impact → stack → links (§115). */
export function CaseStudy({
  project,
  prev,
  next,
}: {
  project: Project;
  prev: Project;
  next: Project;
}) {
  const metric = (m: Project["metrics"][number]) =>
    m.count !== undefined ? (
      <CountUp value={m.count} from={m.count === 0 ? 9 : 0} suffix={m.countSuffix ?? ""} />
    ) : (
      m.value
    );

  return (
    <main
      id="main"
      className="pb-24 pt-28"
      style={
        {
          "--case-accent": project.accent,
          "--case-accent-text": accentTextVar(project.accent),
        } as React.CSSProperties
      }
    >
      <div className="container-site">
        <Link
          href="/#work"
          className="link-underline mono-chip inline-flex items-center gap-2 text-muted-fg hover:text-fg"
        >
          <ArrowLeft size={14} aria-hidden /> ALL WORK
        </Link>

        <Reveal variant="fade-up" className="mt-10 max-w-4xl">
          <p
            className="eyebrow mb-4"
            style={{ color: "var(--case-accent-text)" }}
          >
            CASE / {project.year}
          </p>
          <h1 className="text-4xl md:text-6xl">{project.title}</h1>
          <p className="mt-4 text-lg text-muted-fg">{project.subtitle}</p>
        </Reveal>
      </div>

      {/* Full-bleed hero media with parallax (§115, §130) */}
      <div className="relative mt-12 overflow-hidden">
        <Parallax speed={0.15}>
          <div className="relative mx-auto aspect-[16/9] max-h-[70vh] w-full max-w-6xl overflow-hidden rounded-[var(--radius-glass)]">
            <Image
              src={project.cover}
              alt={`${project.title} — concept artwork`}
              fill
              preload
              sizes="(max-width: 1200px) 100vw, 1152px"
              placeholder="blur"
              blurDataURL={BLUR}
              className="object-cover"
              style={{ viewTransitionName: `proj-${project.slug}` }}
            />
          </div>
        </Parallax>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mx-auto max-w-6xl opacity-30"
          style={{ boxShadow: `inset 0 0 120px ${project.accent}33` }}
        />
      </div>

      <div className="container-site mt-16 grid gap-12 lg:grid-cols-[280px_1fr]">
        {/* Sticky meta rail (§115) */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <GlassCard tier={1} className="space-y-6 p-6">
            <div>
              <p className="eyebrow mb-1.5">ROLE</p>
              <p className="text-sm">{project.role}</p>
            </div>
            <div>
              <p className="eyebrow mb-1.5">YEAR</p>
              <p className="mono-chip">{project.year}</p>
            </div>
            <div>
              <p className="eyebrow mb-2">STACK</p>
              <ul className="flex flex-wrap gap-2">
                {project.stack.map((t) => (
                  <li
                    key={t}
                    className="mono-chip glass-1 rounded-full px-3 py-1.5"
                    style={{ borderColor: `${project.accent}44` }}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-2">LINKS</p>
              <GithubAction url={project.github} />
            </div>
          </GlassCard>
        </aside>

        {/* Problem → Approach → Impact (§115) */}
        <article className="space-y-14">
          {(
            [
              ["The problem", project.problem],
              ["The approach", project.approach],
              ["The impact", project.impact],
            ] as const
          ).map(([label, text], i) => (
            <Reveal key={label} variant="fade-up" delay={i * 0.05}>
              <p
                className="eyebrow mb-3"
                style={{ color: "var(--case-accent-text)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="mb-4 text-2xl md:text-3xl">{label}</h2>
              <p className="text-muted-fg">{text}</p>
            </Reveal>
          ))}

          {/* Metric count-ups (§121) */}
          <Reveal variant="scale" className="grid gap-4 sm:grid-cols-2">
            {project.metrics.map((m) => (
              <GlassCard key={m.label} sheen className="p-7">
                <p
                  className="font-display text-4xl font-bold"
                  style={{ color: "var(--case-accent-text)" }}
                >
                  {metric(m)}
                </p>
                <p className="mt-1.5 text-sm text-muted-fg">{m.label}</p>
              </GlassCard>
            ))}
          </Reveal>

          <Reveal variant="fade-up">
            <p className="text-muted-fg">{project.description}</p>
          </Reveal>
        </article>
      </div>

      {/* Prev / Next with edge-hover cover preview (§116) */}
      <nav
        aria-label="More projects"
        className="container-site mt-24 grid gap-4 sm:grid-cols-2"
      >
        {(
          [
            [prev, "Previous", ArrowLeft],
            [next, "Next", ArrowRight],
          ] as const
        ).map(([proj, label, Icon], i) => (
          <Link
            key={proj.slug}
            href={`/projects/${proj.slug}`}
            className={`group glass glass-sheen relative flex items-center gap-4 overflow-hidden p-6 ${i === 1 ? "sm:flex-row-reverse sm:text-right" : ""}`}
            data-cursor="view"
          >
            <div
              aria-hidden
              className="relative hidden h-16 w-24 shrink-0 overflow-hidden rounded-lg opacity-0 transition-all duration-500 group-hover:opacity-100 sm:block"
            >
              <Image
                src={proj.cover}
                alt=""
                fill
                sizes="96px"
                placeholder="blur"
                blurDataURL={BLUR}
                className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              />
            </div>
            <div className="min-w-0">
              <p className="eyebrow mb-1 flex items-center gap-1.5">
                {i === 0 && <Icon size={12} aria-hidden />}
                {label}
                {i === 1 && <Icon size={12} aria-hidden />}
              </p>
              <p className="truncate font-medium">{proj.title}</p>
            </div>
          </Link>
        ))}
      </nav>
    </main>
  );
}
