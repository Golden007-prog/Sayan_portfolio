"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  exploringNow,
  heroStats,
  sectionCopy,
  skillContext,
  skills,
} from "@/content/data";
import { GlassCard } from "@/components/primitives/GlassCard";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { Reveal } from "@/components/primitives/Reveal";
import { TiltCard } from "@/components/primitives/TiltCard";
import { Marquee } from "@/components/primitives/Marquee";
import { CountUp } from "@/components/primitives/CountUp";
import { SkillIcon } from "@/components/sections/SkillIcon";
import { useToast } from "@/components/providers/ToastProvider";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { cn } from "@/lib/cn";

type ViewMode = "chips" | "bars";

interface SkillGroup {
  name: string;
  /** Short filter-tab label derived from the group name (§79) */
  label: string;
  techs: string[];
}

const GROUPS: SkillGroup[] = Object.entries(skills).map(([name, techs]) => ({
  name,
  label: name.replace(/\s+(Core|Stack)$/i, "").replace(/\s*&\s*Practice$/i, ""),
  techs,
}));

const FILTERS: { key: string | null; label: string }[] = [
  { key: null, label: "All" },
  ...GROUPS.map((g) => ({ key: g.name, label: g.label })),
];

const ALL_TECHS: string[] = GROUPS.flatMap((g) => g.techs);

/** Deterministic pseudo-proficiency for the bars view, 70–97 (§81) */
function level(tech: string): number {
  return 70 + ((ALL_TECHS.indexOf(tech) * 7) % 30);
}

/** Asymmetric bento spans per group index (§73) */
const SPANS = [
  "md:col-span-4 md:row-span-2",
  "md:col-span-2 md:row-span-2",
  "md:col-span-3",
  "md:col-span-3",
];

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

const techStat = heroStats.find((s) => /technolog/i.test(s.label));
const TECH_COUNT = techStat?.value ?? ALL_TECHS.length;
const TECH_SUFFIX = techStat?.suffix ?? "+";

/**
 * §73–92 — Skills arsenal: filterable bento of glass tiles, chips↔bars view
 * toggle, dual counter-rotating marquees and the "currently exploring" callout.
 */
export function Skills() {
  const [active, setActive] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("chips");
  const { toast } = useToast();
  const reduced = useReducedMotionSafe();

  const visible = useMemo(
    () => (active ? GROUPS.filter((g) => g.name === active) : GROUPS),
    [active],
  );

  const copyTech = useCallback(
    async (tech: string) => {
      try {
        await navigator.clipboard.writeText(tech);
        toast(`${tech} copied ✓`, { icon: "check" });
      } catch {
        toast("Clipboard unavailable", { icon: "info" });
      }
    },
    [toast],
  );

  const pillSpring = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 400, damping: 34 };
  const flipSpring = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 240, damping: 28 };

  return (
    <section
      id="skills"
      aria-label={sectionCopy.skills.heading}
      className="py-[var(--section-pad)]"
    >
      <div className="container-site">
        <SectionHeading
          eyebrow={sectionCopy.skills.eyebrow}
          heading={sectionCopy.skills.heading}
          underline
        />

        {/* Filter tabs with sliding glass pill (§79) + view toggle (§81) */}
        <Reveal className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div
            role="group"
            aria-label="Filter skills by discipline"
            className="glass-1 inline-flex flex-wrap items-center gap-1 rounded-full p-1"
          >
            {FILTERS.map((f) => {
              const isActive = active === f.key;
              return (
                <button
                  key={f.label}
                  type="button"
                  onClick={() => setActive(f.key)}
                  aria-pressed={isActive}
                  data-cursor="link"
                  className={cn(
                    "relative min-h-11 rounded-full px-4 mono-chip transition-colors duration-300",
                    isActive ? "text-fg" : "text-muted-fg hover:text-fg",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="skills-filter-pill"
                      transition={pillSpring}
                      aria-hidden
                      className="glass absolute inset-0 rounded-full"
                    />
                  )}
                  <span className="relative z-10">{f.label}</span>
                </button>
              );
            })}
          </div>

          <div
            role="group"
            aria-label="Toggle skills view"
            className="glass-1 inline-flex items-center gap-1 rounded-full p-1"
          >
            {(["chips", "bars"] as const).map((mode) => {
              const isActive = view === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setView(mode)}
                  aria-pressed={isActive}
                  data-cursor="link"
                  className={cn(
                    "relative min-h-11 rounded-full px-4 mono-chip capitalize transition-colors duration-300",
                    isActive ? "text-fg" : "text-muted-fg hover:text-fg",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="skills-view-pill"
                      transition={pillSpring}
                      aria-hidden
                      className="glass absolute inset-0 rounded-full"
                    />
                  )}
                  <span className="relative z-10">{mode}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Bento grid — Reveal staggers tiles 60ms (§89); FLIP on filter (§80) */}
        <Reveal
          stagger={0.06}
          start="top 80%"
          className="relative grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((group) => {
              const gi = GROUPS.findIndex((g) => g.name === group.name);
              return (
                <motion.div
                  key={group.name}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{
                    layout: flipSpring,
                    opacity: { duration: reduced ? 0 : 0.28 },
                    scale: flipSpring,
                  }}
                  className={cn("min-w-0", active ? "md:col-span-6" : SPANS[gi])}
                >
                  <TiltCard maxDeg={4} className="h-full">
                    <GlassCard
                      spotlight
                      className="relative flex h-full flex-col p-6 md:p-7"
                    >
                      {/* Mono index, group name, count badge (§74) */}
                      <div className="mb-5 flex items-start justify-between gap-3">
                        <div>
                          <p className="eyebrow mb-1.5">
                            {String(gi + 1).padStart(2, "0")}
                          </p>
                          <h3 className="font-display text-xl font-medium md:text-2xl">
                            {group.name}
                          </h3>
                        </div>
                        <span
                          className="glass-1 mono-chip rounded-full px-2.5 py-1 text-muted-fg"
                          aria-label={`${group.techs.length} technologies`}
                        >
                          {group.techs.length}
                        </span>
                      </div>

                      {view === "chips" ? (
                        <motion.ul
                          key="chips"
                          initial={reduced ? false : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-wrap gap-2"
                        >
                          {group.techs.map((tech) => (
                            <li key={tech}>
                              <button
                                type="button"
                                onClick={() => copyTech(tech)}
                                aria-describedby={`skills-tip-${slug(tech)}`}
                                data-cursor="link"
                                className={cn(
                                  "group relative inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5",
                                  "mono-chip text-muted-fg transition-all duration-300",
                                  "border-[var(--glass-border)] bg-[var(--glass-bg-1)]",
                                  "hover:-translate-y-0.5 hover:text-fg",
                                  "hover:border-[color-mix(in_srgb,var(--accent-2)_45%,var(--glass-border))]",
                                  "hover:[box-shadow:0_0_18px_color-mix(in_srgb,var(--accent-2)_28%,transparent)]",
                                  "focus-visible:-translate-y-0.5 focus-visible:text-fg",
                                )}
                              >
                                <SkillIcon name={tech} size={14} />
                                {tech}
                                {/* Tooltip on hover AND focus-visible (§76, §84) */}
                                <span
                                  id={`skills-tip-${slug(tech)}`}
                                  role="tooltip"
                                  className={cn(
                                    "glass-3 pointer-events-none absolute bottom-full left-1/2 z-20 mb-2",
                                    "w-max max-w-52 -translate-x-1/2 rounded-md px-3 py-1.5",
                                    "text-[11px] tracking-normal text-fg opacity-0 transition-opacity duration-200",
                                    "group-hover:opacity-100 group-focus-visible:opacity-100",
                                  )}
                                >
                                  {skillContext[tech] ?? group.name}
                                </span>
                              </button>
                            </li>
                          ))}
                        </motion.ul>
                      ) : (
                        <ul key="bars" className="flex flex-col gap-3">
                          {group.techs.map((tech, i) => (
                            <li key={tech} className="flex items-center gap-3">
                              <SkillIcon
                                name={tech}
                                size={14}
                                className="text-muted-fg"
                              />
                              <span className="mono-chip w-28 shrink-0 truncate text-muted-fg md:w-36">
                                {tech}
                              </span>
                              <span
                                aria-hidden
                                className="relative h-1.5 flex-1 overflow-hidden rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg-1)]"
                              >
                                <motion.span
                                  className="absolute inset-y-0 left-0 w-full origin-left rounded-full"
                                  style={{ background: "var(--gradient)" }}
                                  initial={reduced ? false : { scaleX: 0 }}
                                  animate={{ scaleX: level(tech) / 100 }}
                                  transition={
                                    reduced
                                      ? { duration: 0 }
                                      : {
                                          duration: 0.7,
                                          delay: 0.05 * i,
                                          ease: [0.22, 1, 0.36, 1],
                                        }
                                  }
                                />
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </GlassCard>
                  </TiltCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Reveal>

        {/* Count-up stat (§83) + "currently exploring" conic callout (§86) */}
        <Reveal delay={0.1} className="mt-4 grid gap-4 md:mt-5 md:grid-cols-5 md:gap-5">
          <GlassCard sheen className="relative flex flex-col justify-center gap-1.5 p-6 md:col-span-2 md:p-7">
            <p className="font-display text-2xl font-bold md:text-3xl">
              <CountUp value={TECH_COUNT} suffix={TECH_SUFFIX} className="text-gradient" />{" "}
              technologies
              <span aria-hidden className="text-muted-fg">
                {" "}
                ·{" "}
              </span>
              <CountUp value={GROUPS.length} className="text-gradient" /> disciplines
            </p>
            <p className="mono-chip text-muted-fg">
              {GROUPS.map((g) => g.label).join(" · ")}
            </p>
          </GlassCard>

          <GlassCard conic className="relative p-6 md:col-span-3 md:p-7">
            {/* Pulsing border glow — opacity only (§86) */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[inherit] border"
              style={{
                borderColor:
                  "color-mix(in srgb, var(--accent-2) 55%, transparent)",
                boxShadow:
                  "inset 0 0 24px color-mix(in srgb, var(--accent-2) 18%, transparent)",
              }}
              animate={reduced ? { opacity: 0.35 } : { opacity: [0.2, 0.75, 0.2] }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
              }
            />
            <p className="eyebrow mb-3">Currently exploring</p>
            <ul className="flex flex-wrap gap-2">
              {exploringNow.map((tech) => (
                <li
                  key={tech}
                  className="mono-chip inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg-1)] px-3.5 text-muted-fg"
                >
                  <SkillIcon name={tech} size={14} />
                  {tech}
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>
      </div>

      {/* Full-bleed marquees: opposite directions, different speeds (§77–78);
          reduced motion collapses to static wrapped rows (§92) */}
      <div className="mt-16 md:mt-20">
        <Marquee
          speed={64}
          direction={1}
          pauseOnHover
          aria-label="All technologies"
          className={cn(
            "border-y border-[var(--glass-border)] py-4",
            reduced && "container-site",
          )}
        >
          {ALL_TECHS.map((tech) => (
            <span
              key={tech}
              className="mono-chip mx-4 inline-flex items-center gap-2 whitespace-nowrap text-muted-fg"
            >
              <SkillIcon name={tech} size={13} />
              {tech}
              <span aria-hidden className="ml-4 opacity-40">
                ✦
              </span>
            </span>
          ))}
        </Marquee>
        {!reduced && (
          <div aria-hidden>
            <Marquee
              speed={40}
              direction={-1}
              pauseOnHover
              className="border-b border-[var(--glass-border)] py-4"
            >
              {[...ALL_TECHS].reverse().map((tech) => (
                <span
                  key={tech}
                  className="mono-chip mx-4 inline-flex items-center gap-2 whitespace-nowrap text-muted-fg"
                >
                  <SkillIcon name={tech} size={13} />
                  {tech}
                  <span aria-hidden className="ml-4 opacity-40">
                    ✦
                  </span>
                </span>
              ))}
            </Marquee>
          </div>
        )}
      </div>
    </section>
  );
}
