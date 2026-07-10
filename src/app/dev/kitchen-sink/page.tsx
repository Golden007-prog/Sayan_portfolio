"use client";

/**
 * Hidden primitive gallery for eyeballing every shared component (§Phase 2).
 * Not linked anywhere; dev-only route.
 */
import { GlassCard } from "@/components/primitives/GlassCard";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { Reveal } from "@/components/primitives/Reveal";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { TiltCard } from "@/components/primitives/TiltCard";
import { Marquee } from "@/components/primitives/Marquee";
import { CountUp } from "@/components/primitives/CountUp";
import { ThemeToggle } from "@/components/primitives/ThemeToggle";
import { LiveClock } from "@/components/primitives/LiveClock";
import { Parallax } from "@/components/primitives/Parallax";
import { useToast } from "@/components/providers/ToastProvider";

export default function KitchenSink() {
  const { toast } = useToast();

  return (
    <main className="container-site space-y-24 py-24">
      <SectionHeading eyebrow="00 / KITCHEN SINK" heading="Every primitive." underline />

      <section className="grid gap-6 md:grid-cols-3">
        <GlassCard tier={1} className="p-6">glass-1 chip tier</GlassCard>
        <GlassCard tier={2} sheen className="p-6">glass-2 card + sheen</GlassCard>
        <GlassCard tier={3} conic className="p-6">glass-3 modal + conic</GlassCard>
      </section>

      <section className="flex flex-wrap items-center gap-6">
        <MagneticButton onClick={() => toast("Copied ✓", { icon: "check" })}>
          Magnetic primary
        </MagneticButton>
        <MagneticButton variant="ghost" href="#top">
          Ghost anchor
        </MagneticButton>
        <ThemeToggle />
        <LiveClock className="mono-chip text-muted-fg" />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <TiltCard>
          <GlassCard spotlight className="relative h-48 p-6">
            Tilt + spotlight
          </GlassCard>
        </TiltCard>
        <GlassCard className="flex h-48 items-center justify-center p-6">
          <span className="font-display text-5xl font-bold">
            <CountUp value={100} suffix="%" />
          </span>
        </GlassCard>
      </section>

      <Marquee speed={70} className="border-y border-[var(--glass-border)] py-4">
        {["COBOL", "JCL", "DB2", "PYTHON", "WATSONX.AI"].map((t) => (
          <span key={t} className="mono-chip mx-8 text-muted-fg">
            {t} ✦
          </span>
        ))}
      </Marquee>

      <Reveal variant="mask" stagger={0.08} className="grid gap-4 md:grid-cols-4">
        {["fade", "mask", "blur", "scale"].map((v) => (
          <GlassCard key={v} className="p-6 text-center">
            {v}
          </GlassCard>
        ))}
      </Reveal>

      <Parallax speed={0.25}>
        <GlassCard className="p-10 text-center">Parallax layer</GlassCard>
      </Parallax>
    </main>
  );
}
