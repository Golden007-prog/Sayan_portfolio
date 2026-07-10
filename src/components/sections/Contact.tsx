"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowUpRight,
  Copy,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { owner, sectionCopy } from "@/content/data";
import { GlassCard } from "@/components/primitives/GlassCard";
import { Reveal } from "@/components/primitives/Reveal";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { useToast } from "@/components/providers/ToastProvider";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { cn } from "@/lib/cn";

/**
 * Component-level UI microcopy (labels, validation, status lines) — specified
 * by the build brief for this section. Site content still comes from
 * `@/content/data` (`owner`, `sectionCopy.contact`).
 */
const COPY = {
  form: {
    name: "Name",
    email: "Email",
    message: "Message",
    submit: "Send message",
    sending: "Sending…",
    sent: "Sent",
    success: "Thanks — I'll reply within 24 hours.",
    failure: "That didn't go through — your message is safe here. Try sending again?",
  },
  errors: {
    name: "Please give me at least 2 characters.",
    email: "That email doesn't look quite right.",
    message: "Tell me a little more — 10 characters minimum.",
  },
  newTab: "(opens in new tab)",
} as const;

/** §158 — name ≥ 2 chars, valid email, message ≥ 10 chars. `company` is the honeypot (§161). */
const contactSchema = z.object({
  name: z.string().min(2, COPY.errors.name),
  email: z.email(COPY.errors.email),
  message: z.string().min(10, COPY.errors.message),
  company: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

type SubmitStatus = "idle" | "sending" | "success" | "error";

/** §161 time-gate, module-scoped so the impure clock read stays out of render */
const submittedTooFast = (firstFocusAt: number | null) =>
  firstFocusAt !== null && Date.now() - firstFocusAt < 3000;

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vr: number;
  color: string;
  life: number;
}

const CONFETTI_COUNT = 72; // §166 — keep the burst micro (≤80 particles)

const FIELD_INPUT_CLASS = cn(
  "peer w-full rounded-xl border bg-transparent px-4 pb-2 pt-6 text-fg",
  "border-[var(--glass-border)] outline-none transition-colors duration-200",
  "focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-accent1/60",
  "aria-[invalid=true]:border-accent3/70",
);

const FIELD_LABEL_CLASS = cn(
  "pointer-events-none absolute left-4 top-6 origin-left text-muted-fg",
  "transition-[transform,color] duration-200 ease-[var(--ease-out-soft)]",
  // §157 — float up on focus OR when the field holds a value
  "peer-focus:-translate-y-[1.15rem] peer-focus:scale-75 peer-focus:text-accent2",
  "peer-[:not(:placeholder-shown)]:-translate-y-[1.15rem] peer-[:not(:placeholder-shown)]:scale-75",
);

/**
 * Contact section (§153–170). Oversized per-word headline, giant magnetic
 * email CTA, validated glass form with floating labels, honeypot + time-gate
 * anti-spam, confetti success, phone/location copy rows and social pills.
 */
export function Contact() {
  const { toast } = useToast();
  const reduced = useReducedMotionSafe();
  const shakeControls = useAnimationControls();

  const [status, setStatus] = useState<SubmitStatus>("idle");
  const mailtoTimer = useRef<number | null>(null);
  const firstFocusAt = useRef<number | null>(null);
  const confettiCanvas = useRef<HTMLCanvasElement | null>(null);
  const confettiRaf = useRef<number>(0);
  const messageEl = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    // shouldFocusError defaults to true → first invalid field gets focus (§168)
  });

  useEffect(
    () => () => {
      if (mailtoTimer.current !== null) window.clearTimeout(mailtoTimer.current);
      cancelAnimationFrame(confettiRaf.current);
    },
    [],
  );

  const copyText = useCallback(
    async (text: string, label: string) => {
      try {
        await navigator.clipboard.writeText(text);
        toast(`${label} copied ✓`, { icon: "check" });
      } catch {
        toast(text, { icon: "info" });
      }
    },
    [toast],
  );

  /** §154/155 — copy the address + toast, then open the mail client after a beat. */
  const onEmailClick = () => {
    void copyText(owner.email, "Email");
    if (mailtoTimer.current !== null) window.clearTimeout(mailtoTimer.current);
    mailtoTimer.current = window.setTimeout(() => {
      window.location.href = `mailto:${owner.email}`;
    }, 750);
  };

  /** §166 — micro-confetti burst on a tiny inline canvas; skipped under reduced motion. */
  const celebrate = useCallback(() => {
    if (reduced) return;
    const canvas = confettiCanvas.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const rootStyle = getComputedStyle(document.documentElement);
    const palette = ["--accent-1", "--accent-2", "--accent-3", "--accent-4"]
      .map((v) => rootStyle.getPropertyValue(v).trim())
      .filter(Boolean);

    const particles: ConfettiParticle[] = Array.from({ length: CONFETTI_COUNT }, () => ({
      x: rect.width / 2 + (Math.random() - 0.5) * 96,
      y: rect.height * 0.75,
      vx: (Math.random() - 0.5) * 7,
      vy: -(3.5 + Math.random() * 5.5),
      size: 3 + Math.random() * 4,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: palette[Math.floor(Math.random() * palette.length)] ?? "#7c5cff",
      life: 1,
    }));

    const step = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.16;
        p.rot += p.vr;
        p.life -= 0.014;
        if (p.life <= 0) continue;
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
      if (alive) {
        confettiRaf.current = requestAnimationFrame(step);
      } else {
        ctx.clearRect(0, 0, rect.width, rect.height);
      }
    };

    cancelAnimationFrame(confettiRaf.current);
    confettiRaf.current = requestAnimationFrame(step);
  }, [reduced]);

  const settleSuccess = useCallback(() => {
    setStatus("success");
    celebrate();
    reset();
    firstFocusAt.current = null;
    if (messageEl.current) messageEl.current.style.height = "auto";
  }, [celebrate, reset]);

  /**
   * Submission wiring (§160):
   * — With NEXT_PUBLIC_FORM_ENDPOINT set (see .env.example: a Formspree form
   *   URL, or your own Resend-backed API route), the form POSTs JSON
   *   { name, email, message } and treats any non-2xx response as failure.
   * — Without it (local dev), we simulate a successful send after 900ms so
   *   the full success choreography can be exercised with no backend.
   */
  const onValid = async (values: ContactFormValues) => {
    // §161 anti-spam: honeypot filled, or submitted <3s after the first focus
    // → silently "succeed" so bots get zero signal that they were caught.
    if (values.company || submittedTooFast(firstFocusAt.current)) {
      settleSuccess();
      return;
    }

    setStatus("sending");
    try {
      const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT;
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            message: values.message,
          }),
        });
        if (!res.ok) throw new Error(`Form endpoint responded ${res.status}`);
      } else {
        await new Promise((resolve) => window.setTimeout(resolve, 900));
      }
      settleSuccess();
    } catch {
      // §167 — friendly retry; form values stay untouched.
      setStatus("error");
    }
  };

  /** §158 — gentle x-shake when validation fails. */
  const onInvalid = () => {
    if (reduced) return;
    void shakeControls.start({
      x: [0, -8, 8, -5, 5, 0],
      transition: { duration: 0.4, ease: "easeInOut" },
    });
  };

  const onFormFocus = () => {
    if (firstFocusAt.current === null) firstFocusAt.current = Date.now();
    if (status === "success" || status === "error") setStatus("idle");
  };

  /** §169 — textarea grows with its content. */
  const autoGrow = (e: FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const { ref: messageRef, ...messageField } = register("message");

  const fieldErrorMessages = [
    errors.name?.message,
    errors.email?.message,
    errors.message?.message,
  ].filter((m): m is string => Boolean(m));

  const headingWords = sectionCopy.contact.heading.split(" ");
  const sending = status === "sending";

  const infoRows = [
    { label: "Phone", value: owner.phone, Icon: Phone },
    { label: "Location", value: owner.location, Icon: MapPin },
  ] as const;

  const socialLinks = [
    { label: "LinkedIn", href: owner.linkedin },
    { label: "GitHub", href: owner.github },
  ] as const;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-[var(--section-pad)]"
    >
      <div className="container-site">
        {/* ——— Heading: per-word rise (§153) ——— */}
        <Reveal as="p" className="eyebrow mb-4">
          {sectionCopy.contact.eyebrow}
        </Reveal>
        <Reveal
          as="h2"
          id="contact-heading"
          stagger={0.06}
          className="headline-flip font-display text-[clamp(2.75rem,8vw,6rem)] font-semibold leading-[1.02] tracking-tight"
        >
          {headingWords.map((word, i) => (
            <span key={`${word}-${i}`} className="inline-block will-change-transform">
              {/* \u00A0 keeps the word gap: a plain trailing space collapses inside inline-block */}
              {i < headingWords.length - 1 ? word + "\u00A0" : word}
            </span>
          ))}
        </Reveal>
        <Reveal as="p" delay={0.12} className="mt-6 max-w-2xl text-lg text-muted-fg">
          {sectionCopy.contact.sub}
        </Reveal>

        {/* ——— Giant magnetic email CTA (§154, §155) ——— */}
        <Reveal variant="scale" delay={0.1} className="mt-14 flex flex-col items-center gap-5 md:mt-20">
          <MagneticButton
            strength={0.5}
            type="button"
            onClick={onEmailClick}
            aria-label={`Email ${owner.name} — copies ${owner.email} and opens your mail app`}
            className="max-w-full"
          >
            <span className="flex max-w-full items-center gap-3 px-1 py-2 md:gap-4 md:px-5 md:py-4">
              <Mail aria-hidden className="h-[1em] w-[1em] shrink-0" />
              <span className="break-all font-display text-[clamp(1.05rem,3.4vw,2.6rem)] font-medium tracking-tight">
                {owner.email}
              </span>
            </span>
          </MagneticButton>

          {/* ——— Availability + pulsing dot (§164) ——— */}
          <p className="flex items-center gap-2.5 text-sm text-muted-fg">
            <span aria-hidden className="relative flex h-2.5 w-2.5">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-70 motion-safe:animate-ping"
                style={{ background: "var(--accent-4)" }}
              />
              <span
                className="relative inline-flex h-2.5 w-2.5 rounded-full"
                style={{ background: "var(--accent-4)" }}
              />
            </span>
            {sectionCopy.contact.availability}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-8 md:mt-24 md:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          {/* ——— Form on glass (§157–161, §166–170) ——— */}
          <Reveal variant="fade-up">
            <GlassCard sheen className="relative overflow-hidden rounded-3xl p-6 md:p-8">
              <canvas
                ref={confettiCanvas}
                aria-hidden
                className="pointer-events-none absolute inset-0 z-10 h-full w-full"
              />
              <motion.form
                animate={shakeControls}
                noValidate
                onSubmit={(e) => void handleSubmit(onValid, onInvalid)(e)}
                onFocusCapture={onFormFocus}
                className="relative flex flex-col gap-5"
              >
                <div className="relative">
                  <input
                    id="contact-name"
                    type="text"
                    autoComplete="name"
                    placeholder=" "
                    data-cursor="text"
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    className={FIELD_INPUT_CLASS}
                    {...register("name")}
                  />
                  <label htmlFor="contact-name" className={FIELD_LABEL_CLASS}>
                    {COPY.form.name}
                  </label>
                  {errors.name && (
                    <p id="contact-name-error" className="mt-1.5 text-xs text-accent3">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    placeholder=" "
                    data-cursor="text"
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                    className={FIELD_INPUT_CLASS}
                    {...register("email")}
                  />
                  <label htmlFor="contact-email" className={FIELD_LABEL_CLASS}>
                    {COPY.form.email}
                  </label>
                  {errors.email && (
                    <p id="contact-email-error" className="mt-1.5 text-xs text-accent3">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder=" "
                    data-cursor="text"
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                    onInput={autoGrow}
                    className={cn(FIELD_INPUT_CLASS, "max-h-72 resize-none overflow-y-auto")}
                    {...messageField}
                    ref={(el) => {
                      messageRef(el);
                      messageEl.current = el;
                    }}
                  />
                  <label htmlFor="contact-message" className={FIELD_LABEL_CLASS}>
                    {COPY.form.message}
                  </label>
                  {errors.message && (
                    <p id="contact-message-error" className="mt-1.5 text-xs text-accent3">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* §161 — honeypot: invisible to humans, irresistible to bots */}
                <div
                  aria-hidden="true"
                  className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
                >
                  <label htmlFor="contact-company">Company</label>
                  <input
                    id="contact-company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("company")}
                  />
                </div>

                {/* §159/§170 — gradient sweep while sending, plane fly-off on success */}
                <button
                  type="submit"
                  disabled={sending}
                  data-cursor="link"
                  className={cn(
                    "glass-1 group relative inline-flex min-h-11 w-full items-center justify-center gap-2 overflow-hidden",
                    "rounded-full px-7 py-3.5 font-medium tracking-tight transition-shadow duration-300",
                    "hover:shadow-[0_12px_48px_rgba(124,92,255,0.35)]",
                    "disabled:cursor-not-allowed disabled:opacity-85",
                  )}
                >
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 origin-left bg-[image:var(--gradient)]"
                    initial={false}
                    animate={{
                      scaleX: status === "sending" || status === "success" ? 1 : 0,
                      opacity: status === "sending" || status === "success" ? 0.9 : 0,
                    }}
                    transition={{
                      duration: reduced ? 0 : sending ? 1.1 : 0.4,
                      ease: "easeInOut",
                    }}
                  />
                  <span className="relative z-10 inline-flex items-center gap-2">
                    {sending ? (
                      <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
                    ) : (
                      <motion.span
                        aria-hidden
                        className="inline-flex"
                        initial={false}
                        animate={
                          status === "success" && !reduced
                            ? { x: 56, y: -56, opacity: 0, rotate: 16 }
                            : { x: 0, y: 0, opacity: 1, rotate: 0 }
                        }
                        transition={{
                          duration: reduced ? 0 : 0.6,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <Send className="h-4 w-4" />
                      </motion.span>
                    )}
                    {sending
                      ? COPY.form.sending
                      : status === "success"
                        ? COPY.form.sent
                        : COPY.form.submit}
                  </span>
                </button>

                {/* §166–168 — polite live region: error summary, success, retry */}
                <div aria-live="polite" className="min-h-6 text-sm">
                  {fieldErrorMessages.length > 0 && (
                    <p className="text-accent3">{fieldErrorMessages.join(" ")}</p>
                  )}
                  {status === "success" && (
                    <p className="text-accent4">{COPY.form.success}</p>
                  )}
                  {status === "error" && (
                    <p className="text-accent3">{COPY.form.failure}</p>
                  )}
                </div>
              </motion.form>
            </GlassCard>
          </Reveal>

          {/* ——— Direct channels ——— */}
          <Reveal variant="fade-up" delay={0.08} className="flex flex-col gap-8">
            {/* §162 — copy-on-click rows */}
            <GlassCard tier={1} className="rounded-3xl p-4 md:p-5">
              <ul className="flex flex-col">
                {infoRows.map(({ label, value, Icon }) => (
                  <li key={label}>
                    <button
                      type="button"
                      data-cursor="link"
                      onClick={() => void copyText(value, label)}
                      aria-label={`Copy ${label.toLowerCase()}: ${value}`}
                      className="group flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-200 hover:bg-white/5 focus-visible:bg-white/5"
                    >
                      <Icon aria-hidden className="h-4 w-4 shrink-0 text-accent2" />
                      <span className="text-sm md:text-base">{value}</span>
                      <Copy
                        aria-hidden
                        className="ml-auto h-3.5 w-3.5 shrink-0 opacity-40 transition-opacity duration-200 group-hover:opacity-90 group-focus-visible:opacity-90"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* §163/§264 — big social pills, arrow slides on hover, new-tab note */}
            <div className="flex flex-col gap-4">
              {socialLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="me noopener"
                  data-cursor="link"
                  className="glass-1 glass-sheen group flex min-h-11 items-center justify-between gap-4 rounded-full px-7 py-5 text-lg font-medium tracking-tight transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_48px_rgba(34,211,238,0.25)]"
                >
                  {label}
                  <span className="sr-only">{COPY.newTab}</span>
                  <ArrowUpRight
                    aria-hidden
                    className="h-5 w-5 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </a>
              ))}
            </div>

            {/* ——— Calendly (§165) — enable when a scheduling link exists ———
                1. Grab your scheduling URL from https://calendly.com (Event → Share → Embed).
                2. Uncomment the block below and drop the URL into `src`.
                3. Optional: `?hide_gdpr_banner=1&background_color=0b0e1a` tunes the embed.
                Docs: https://help.calendly.com/hc/en-us/articles/223147027-Embed-options-overview

            <GlassCard tier={1} className="rounded-3xl p-2">
              <iframe
                src="https://calendly.com/your-handle/intro-call?hide_gdpr_banner=1"
                title="Book a call"
                loading="lazy"
                className="h-[640px] w-full rounded-2xl border-0"
              />
            </GlassCard>
            */}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
