"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { cn } from "@/lib/cn";
import { GlassCard } from "@/components/primitives/GlassCard";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { Reveal } from "@/components/primitives/Reveal";
import { education, experience, internships, sectionCopy } from "@/content/data";

/** Bullets containing this phrase earn the shimmering achievement badge (§103). */
const ACHIEVEMENT_RE = /zero critical defects/i;

const EASE_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Scoped styles: node pulses (§94/§99), badge shimmer (§103) and the
   hover-only gate over GlassCard's conic layer (§102). Prefixed `xp-`
   so nothing leaks into other sections. */
const styles = `
.xp-node{position:absolute;left:0;width:19px;height:19px;border-radius:999px;border:1px solid var(--glass-border);background:var(--bg-2);z-index:1;pointer-events:none}
.xp-node::before{content:"";position:absolute;inset:4px;border-radius:999px;background:var(--gradient);opacity:.3;transform:scale(.55);transition:opacity .5s var(--ease-out-soft),transform .5s var(--ease-out-soft)}
.xp-node.xp-lit::before{opacity:1;transform:scale(1)}
.xp-node::after{content:"";position:absolute;inset:-3px;border-radius:999px;border:1px solid var(--accent-2);opacity:0;pointer-events:none}
.xp-node.xp-lit::after{animation:xp-pulse .9s var(--ease-out-soft) 1}
.xp-node.xp-node--live::after{animation:xp-pulse 2.4s var(--ease-out-soft) infinite}
@keyframes xp-pulse{0%{opacity:.85;transform:scale(.5)}100%{opacity:0;transform:scale(2.1)}}
.xp-badge{position:relative;background:var(--accent-solid);color:#fff;white-space:nowrap}
.xp-badge::before{content:"";position:absolute;inset:0;border-radius:inherit;padding:1px;background:linear-gradient(110deg,var(--accent-2) 0%,var(--accent-3) 30%,var(--accent-1) 55%,var(--accent-2) 85%);background-size:250% 100%;-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask-composite:exclude;animation:xp-shimmer 3.2s linear infinite;pointer-events:none}
@keyframes xp-shimmer{from{background-position:0% 0}to{background-position:-250% 0}}
.xp-conic-hover.glass-conic::before{opacity:0;animation-play-state:paused;transition:opacity .5s var(--ease-out-soft)}
@media (hover:hover) and (pointer:fine){.xp-conic-hover.glass-conic:hover::before{opacity:1;animation-play-state:running}}
`;

/** Company initial inside a circular glass coin (§101). */
function Monogram({ name }: { name: string }) {
  return (
    <span
      aria-hidden
      className="glass-1 flex h-11 w-11 shrink-0 items-center justify-center font-display text-base font-bold"
      style={{ borderRadius: "var(--radius-chip)" }}
    >
      <span className="text-gradient">{name.trim().charAt(0).toUpperCase()}</span>
    </span>
  );
}

/** Mono pill for periods and small facts (§97). */
function PeriodChip({ children }: { children: ReactNode }) {
  return (
    <span
      className="mono-chip glass-1 inline-flex items-center px-3 py-1.5 uppercase text-muted-fg"
      style={{ borderRadius: "var(--radius-chip)" }}
    >
      {children}
    </span>
  );
}

/** Bullet copy; appends the shimmering achievement badge when the phrase matches (§103). */
function BulletText({ text }: { text: string }) {
  return (
    <>
      {text}
      {ACHIEVEMENT_RE.test(text) && (
        <span
          className="xp-badge mono-chip ml-2 inline-flex translate-y-[-1px] items-center gap-1 px-2 py-0.5 align-middle text-[0.7rem] font-semibold uppercase"
          style={{ borderRadius: "var(--radius-chip)" }}
        >
          <span aria-hidden>✦</span> Achievement
        </span>
      )}
    </>
  );
}

const dotStyle = { background: "var(--gradient)" } as const;

export function Experience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeTab, setActiveTab] = useState(0);
  const reduced = useReducedMotionSafe();

  const cognizant = experience[0];
  const domainTags = [...cognizant.tags, "Fintech"];
  const activeTrack = cognizant.tracks[activeTab] ?? cognizant.tracks[0];

  /* §93 gradient line draws with scroll · §94 nodes light up as it reaches them */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const line = root.querySelector<HTMLElement>("[data-xp-line]");
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-xp-node]"));

    const ctx = gsap.context(() => {
      if (reduced) {
        if (line) gsap.set(line, { scaleY: 1 });
        nodes.forEach((n) => n.classList.add("xp-lit"));
        return;
      }
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top 72%",
              end: "bottom 58%",
              scrub: true,
            },
          },
        );
      }
      nodes.forEach((node) => {
        ScrollTrigger.create({
          trigger: node,
          start: "top 66%",
          once: true,
          onEnter: () => node.classList.add("xp-lit"),
        });
      });
    }, root);

    return () => {
      ctx.revert();
      nodes.forEach((n) => n.classList.remove("xp-lit"));
    };
  }, [reduced]);

  /* Roving tabindex + arrow-key navigation for the domain tabs (§95) */
  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = cognizant.tracks.length;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (index + 1) % count;
    else if (e.key === "ArrowLeft") next = (index - 1 + count) % count;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    if (next === null) return;
    e.preventDefault();
    setActiveTab(next);
    tabRefs.current[next]?.focus();
  };

  const panelVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: reduced
        ? { duration: 0.2 }
        : { duration: 0.35, ease: EASE_SOFT, staggerChildren: 0.08, delayChildren: 0.08 },
    },
    exit: {
      opacity: 0,
      y: reduced ? 0 : -10,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  const bulletVariants: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_SOFT } },
  };

  return (
    <section
      id="experience"
      aria-label={sectionCopy.experience.heading}
      className="relative py-[var(--section-pad)]"
    >
      <style>{styles}</style>
      <div className="container-site">
        <div id="experience-heading">
          <SectionHeading
            eyebrow={sectionCopy.experience.eyebrow}
            heading={sectionCopy.experience.heading}
            underline
          />
        </div>

        <div ref={rootRef} className="relative">
          {/* Timeline rail: hairline base + gradient line drawn by scroll (§93, §105) */}
          <div
            aria-hidden
            data-print-hide
            className="absolute bottom-12 left-[9px] top-1 w-px bg-[var(--glass-border)]"
          >
            <span
              data-xp-line
              className="absolute inset-0 block origin-top"
              style={{ background: "var(--gradient)", transform: "scaleY(0)" }}
            />
          </div>

          <ol className="relative m-0 list-none space-y-10 p-0 md:space-y-14">
            {/* ——— Cognizant (experience[0]) ——— */}
            <li className="relative pl-10 sm:pl-14 md:pl-20">
              <span
                data-xp-node
                data-print-hide
                aria-hidden
                className={cn("xp-node top-8", cognizant.current && "xp-node--live")}
              />
              <Reveal variant="fade-up">
                <GlassCard tier={2} conic className="xp-conic-hover p-6 md:p-8">
                  <div className="md:grid md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-10 lg:gap-14">
                    {/* Sticky identity column on desktop (§96) */}
                    <div className="md:sticky md:top-[calc(var(--nav-h)+2rem)] md:self-start">
                      <div className="flex items-center gap-4">
                        <Monogram name={cognizant.company} />
                        <div className="min-w-0">
                          <h3 className="font-display text-xl font-semibold leading-tight">
                            {cognizant.company}
                          </h3>
                          <p className="mt-0.5 text-sm text-muted-fg">{cognizant.role}</p>
                        </div>
                      </div>
                      <p className="mt-5">
                        <PeriodChip>{cognizant.period}</PeriodChip>
                      </p>
                      {/* Domain tags (§104) */}
                      <ul className="mt-6 flex list-none flex-wrap gap-2 p-0">
                        {domainTags.map((tag) => (
                          <li
                            key={tag}
                            className="mono-chip glass-1 px-3 py-1 text-muted-fg"
                            style={{ borderRadius: "var(--radius-chip)" }}
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Domain tracks as accessible tabs (§95) */}
                    <div className="mt-8 md:mt-0">
                      <div
                        role="tablist"
                        aria-label={`${cognizant.company} domain tracks`}
                        className="flex flex-wrap gap-1 border-b border-[var(--glass-border)]"
                      >
                        {cognizant.tracks.map((track, i) => {
                          const selected = i === activeTab;
                          return (
                            <button
                              key={track.domain}
                              ref={(el) => {
                                tabRefs.current[i] = el;
                              }}
                              type="button"
                              role="tab"
                              id={`experience-tab-${i}`}
                              aria-selected={selected}
                              aria-controls={selected ? `experience-panel-${i}` : undefined}
                              tabIndex={selected ? 0 : -1}
                              data-cursor="link"
                              onClick={() => setActiveTab(i)}
                              onKeyDown={(e) => onTabKeyDown(e, i)}
                              className={cn(
                                "mono-chip relative min-h-11 px-4 uppercase transition-colors duration-300",
                                selected ? "text-fg" : "text-muted-fg hover:text-fg",
                              )}
                            >
                              {track.domain}
                              {selected && (
                                <motion.span
                                  layoutId="experience-tab-underline"
                                  aria-hidden
                                  className="absolute inset-x-2 -bottom-px block h-[2px]"
                                  style={dotStyle}
                                  transition={
                                    reduced
                                      ? { duration: 0 }
                                      : { duration: 0.4, ease: EASE_SOFT }
                                  }
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTrack.domain}
                          role="tabpanel"
                          id={`experience-panel-${activeTab}`}
                          aria-labelledby={`experience-tab-${activeTab}`}
                          tabIndex={0}
                          variants={panelVariants}
                          initial="hidden"
                          whileInView="show"
                          exit="exit"
                          viewport={{ once: true, amount: 0.2 }}
                          className="pt-6"
                        >
                          {/* Bullets reveal one-by-one, 80ms stagger (§98) */}
                          <ul className="m-0 list-none space-y-4 p-0">
                            {activeTrack.bullets.map((bullet) => (
                              <motion.li
                                key={bullet}
                                variants={bulletVariants}
                                className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-muted-fg"
                              >
                                <span
                                  aria-hidden
                                  className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full"
                                  style={dotStyle}
                                />
                                <span>
                                  <BulletText text={bullet} />
                                </span>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </GlassCard>
              </Reveal>
            </li>

            {/* ——— Internships: lighter tier-1 glass on the same rail (§100) ——— */}
            {internships.map((job) => (
              <li key={`${job.company}-${job.period}`} className="relative pl-10 sm:pl-14 md:pl-20">
                <span data-xp-node data-print-hide aria-hidden className="xp-node top-8" />
                <Reveal variant="fade-up">
                  <GlassCard tier={1} className="p-5 md:p-6">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                      <Monogram name={job.company} />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-lg font-medium leading-tight">
                          {job.company}
                        </h3>
                        <p className="mt-0.5 text-sm text-muted-fg">{job.role}</p>
                      </div>
                      <PeriodChip>{job.period}</PeriodChip>
                    </div>
                    <ul className="m-0 mt-4 list-none space-y-2 p-0">
                      {job.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-3 text-sm leading-relaxed text-muted-fg"
                        >
                          <span
                            aria-hidden
                            className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full"
                            style={dotStyle}
                          />
                          <span>
                            <BulletText text={bullet} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </Reveal>
              </li>
            ))}

            {/* ——— Education closes the timeline (§106) ——— */}
            <li className="relative pl-10 sm:pl-14 md:pl-20">
              <span data-xp-node data-print-hide aria-hidden className="xp-node top-8" />
              <Reveal variant="fade-up">
                <GlassCard tier={1} className="p-5 md:p-6">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                    <Monogram name={education.school} />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg font-medium leading-tight">
                        {education.school}
                      </h3>
                      <p className="mt-0.5 text-sm text-muted-fg">{education.degree}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <PeriodChip>{education.period}</PeriodChip>
                      <PeriodChip>{education.cgpa}</PeriodChip>
                    </div>
                  </div>
                </GlassCard>
              </Reveal>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
