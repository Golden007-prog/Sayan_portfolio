"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { beyondCode, sectionCopy } from "@/content/data";
import { GlassCard } from "@/components/primitives/GlassCard";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { Reveal } from "@/components/primitives/Reveal";
import { Parallax } from "@/components/primitives/Parallax";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

const MOTTO_INTERVAL_MS = 5200;

/** Tiny navy (#0b0f1a) SVG so both polaroid photos blur-up rather than pop (§71). */
const PHOTO_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjEwIiBmaWxsPSIjMGIwZjFhIi8+PC9zdmc+";

/** Cover zoom (§195): transform-only, inside the clipped frame, fine-pointer +
 *  hover-capable only. Applied per photo when motion isn't reduced. */
const ZOOM_CLASS =
  "transition-transform duration-[600ms] ease-[var(--ease-out-soft)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.05]";

/**
 * Art direction (§152): two renditions of the same asset toggled per
 * breakpoint — mobile gets a tighter 4:5 crop aimed by object-position,
 * md+ gets the fuller 3:4 crop. display:none keeps the inactive one
 * out of both the network waterfall (lazy images never intersect)
 * and the accessibility tree.
 */
function ArtDirectedImage({
  src,
  alt,
  mobilePosition,
  desktopPosition,
  zoom,
}: {
  src: string;
  alt: string;
  mobilePosition: string;
  desktopPosition: string;
  zoom: boolean;
}) {
  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 480px) 26rem, 92vw"
        placeholder="blur"
        blurDataURL={PHOTO_BLUR}
        className={cn("object-cover md:hidden", mobilePosition, zoom && ZOOM_CLASS)}
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes="26rem"
        placeholder="blur"
        blurDataURL={PHOTO_BLUR}
        className={cn("hidden object-cover md:block", desktopPosition, zoom && ZOOM_CLASS)}
      />
    </>
  );
}

/** Polaroid shell with playful ±2° spring wobble on hover (§144). */
function Polaroid({
  tilt,
  hoverTilt,
  wobble,
  children,
}: {
  tilt: number;
  hoverTilt: number;
  wobble: boolean;
  children: ReactNode;
}) {
  return (
    <motion.div
      style={{ rotate: tilt }}
      whileHover={wobble ? { rotate: hoverTilt, y: -6 } : undefined}
      transition={{ type: "spring", stiffness: 220, damping: 9, mass: 0.9 }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

/** Filmstrip edge: sprocket holes from a repeating gradient (§146). */
function SprocketStrip({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-y-0 z-10 w-4",
        side === "left" ? "left-0" : "right-0",
      )}
      style={{ background: "rgba(5, 6, 10, 0.82)" }}
    >
      <span
        className="absolute inset-y-2 left-1 right-1 rounded-sm"
        style={{
          background:
            "repeating-linear-gradient(to bottom, var(--glass-highlight) 0 8px, transparent 8px 22px)",
        }}
      />
    </span>
  );
}

/**
 * Beyond the Terminal — the human side (§143–§152).
 * Sparkle-trail zone for the custom cursor (§150), mountain-ridge
 * divider that draws itself on scroll (§149), and a rotating motto (§148).
 */
export function Beyond() {
  const sectionRef = useRef<HTMLElement>(null);
  const ridgeRef = useRef<SVGPathElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotionSafe();

  const [finePointer, setFinePointer] = useState(false);
  const [mottoIndex, setMottoIndex] = useState(0);

  // Hover wobble only on fine pointers (§144 gated per house rule 7).
  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFinePointer(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // Motto carousel (§148) — static under reduced motion.
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(
      () => setMottoIndex((i) => (i + 1) % beyondCode.mottos.length),
      MOTTO_INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, [reduced]);

  // Ridge line-draw (§149) + timeline playhead loop (§146).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const ridge = ridgeRef.current;
      if (ridge && !reduced) {
        const len = ridge.getTotalLength();
        gsap.set(ridge, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(ridge, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 92%", end: "top 40%", scrub: 1 },
        });
      }
      const playhead = playheadRef.current;
      const track = trackRef.current;
      if (playhead && track && !reduced) {
        gsap.fromTo(
          playhead,
          { x: 0 },
          {
            x: () => Math.max(0, track.clientWidth - 2),
            duration: 7,
            ease: "none",
            repeat: -1,
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              toggleActions: "play pause resume pause",
              invalidateOnRefresh: true,
            },
          },
        );
      }
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  const wobble = finePointer && !reduced;
  const { videoEditing, trekking, mottos } = beyondCode;

  return (
    <section
      ref={sectionRef}
      id="beyond"
      aria-label={sectionCopy.beyond.heading}
      data-sparkle-zone=""
      className="relative py-[var(--section-pad)]"
    >
      {/* Mountain-ridge divider — draws itself on scroll (§149) */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          fill="none"
          className="h-12 w-full md:h-20"
        >
          <defs>
            <linearGradient id="beyond-ridge-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="var(--accent-1)" />
              <stop offset="1" stopColor="var(--accent-2)" />
            </linearGradient>
          </defs>
          <path
            d="M0 104 L180 84 L340 100 L500 56 L660 90 L820 48 L980 96 L1140 70 L1300 94 L1440 76"
            stroke="var(--glass-border)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <path
            ref={ridgeRef}
            d="M0 96 L140 64 L260 88 L400 30 L520 76 L640 18 L760 68 L900 40 L1040 86 L1180 52 L1300 78 L1440 58"
            stroke="url(#beyond-ridge-grad)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="container-site">
        <div id="beyond-heading">
          <SectionHeading
            eyebrow={sectionCopy.beyond.eyebrow}
            heading={sectionCopy.beyond.heading}
            underline
          />
        </div>

        {/* Split layout: two polaroid glass cards (§143, §144) */}
        <Reveal
          variant="fade-up"
          stagger={0.08}
          className="grid gap-10 md:grid-cols-2 md:gap-8 lg:gap-14"
        >
          {/* Editing card — filmstrip styling + timeline playhead (§146, §147) */}
          <div className="mx-auto w-full max-w-[26rem]">
            <Polaroid tilt={-1.4} hoverTilt={2} wobble={wobble}>
              <GlassCard tier={2} sheen className="h-full p-4 pb-6 md:p-5">
                <figure>
                  <div className="group relative aspect-[4/5] overflow-hidden rounded-[0.6rem] md:aspect-[3/4]">
                    <SprocketStrip side="left" />
                    <SprocketStrip side="right" />
                    <ArtDirectedImage
                      src={videoEditing.image}
                      alt={videoEditing.title}
                      mobilePosition="object-[50%_35%]"
                      desktopPosition="object-center"
                      zoom={!reduced}
                    />
                  </div>

                  {/* Animated timeline playhead motif (§146) */}
                  <div
                    ref={trackRef}
                    aria-hidden
                    className="relative mt-4 h-1.5 overflow-hidden rounded-full"
                    style={{
                      background: "color-mix(in srgb, var(--glass-border) 70%, transparent)",
                    }}
                  >
                    <span
                      className="absolute inset-y-0 left-[6%] w-[34%] rounded-full opacity-50"
                      style={{ background: "var(--gradient)" }}
                    />
                    <span
                      className="absolute inset-y-0 left-[52%] w-[22%] rounded-full opacity-30"
                      style={{ background: "var(--gradient)" }}
                    />
                    <span
                      ref={playheadRef}
                      className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-accent2 will-change-transform"
                      style={{ boxShadow: "0 0 8px var(--accent-2)" }}
                    />
                  </div>

                  <figcaption className="pt-4">
                    <h3 className="font-display text-xl">{videoEditing.title}</h3>
                    <p className="mt-1 text-sm text-muted-fg">{videoEditing.detail}</p>
                  </figcaption>
                </figure>

                {/* Tool badges (§147) */}
                <ul className="mt-4 flex flex-wrap gap-2">
                  {videoEditing.tools.map((tool) => (
                    <li
                      key={tool}
                      className="mono-chip glass-1 rounded-full px-3 py-1.5 text-muted-fg"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </Polaroid>
          </div>

          {/* Trekking card — slow parallax pan inside the frame (§145) */}
          <div className="mx-auto w-full max-w-[26rem]">
            <Polaroid tilt={1.4} hoverTilt={-2} wobble={wobble}>
              <GlassCard tier={2} sheen className="h-full p-4 pb-6 md:p-5">
                <figure>
                  <div className="group relative aspect-[4/5] overflow-hidden rounded-[0.6rem] md:aspect-[3/4]">
                    {/* Bleed wrapper gives the parallax room to travel without exposing edges */}
                    <Parallax speed={0.16} className="absolute -inset-y-10 inset-x-0">
                      <ArtDirectedImage
                        src={trekking.image}
                        alt={trekking.title}
                        mobilePosition="object-[50%_25%]"
                        desktopPosition="object-center"
                        zoom={!reduced}
                      />
                    </Parallax>
                  </div>
                  <figcaption className="pt-4">
                    <h3 className="font-display text-xl">{trekking.title}</h3>
                    <p className="mt-1 text-sm text-muted-fg">{trekking.detail}</p>
                  </figcaption>
                </figure>
              </GlassCard>
            </Polaroid>
          </div>
        </Reveal>

        {/* Rotating motto with crossfade (§148) */}
        <Reveal variant="fade-up" className="mt-16 md:mt-24">
          <div className="mx-auto max-w-2xl text-center">
            <span
              aria-hidden
              className="text-gradient font-display text-4xl leading-none"
            >
              &ldquo;
            </span>
            <div aria-live="off" className="relative mt-2 min-h-[6rem] md:min-h-[4.75rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={mottoIndex}
                  initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduced ? 0 : -8 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto text-balance text-lg text-muted-fg md:text-xl"
                >
                  {mottos[mottoIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
