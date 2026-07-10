"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Check,
  Copy,
  ExternalLink,
  FileText,
  Link2,
  X,
} from "lucide-react";
import { bp, skillContext } from "@/content/data";
import { skillDetails, skillSlug, type SkillDetail } from "@/content/skillDetails";
import { SkillIcon } from "@/components/sections/SkillIcon";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { useToast } from "@/components/providers/ToastProvider";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { cn } from "@/lib/cn";

/** Metadata line under a citation title: "authors · year · venue" */
function meta(...parts: Array<string | number | undefined>): string {
  return parts.filter(Boolean).join(" · ");
}

/**
 * Skill deep-dive overlay (§73–92 companion). Clicking a skill chip opens
 * this modal: summary, verified research papers + books, official resources
 * and a Higgsfield banner. Mirrors the CommandPalette shell — portal +
 * backdrop, scroll lock, Escape, focus trap, restore-focus-on-close.
 */
export function SkillDetailOverlay({
  tech,
  onClose,
}: {
  tech: string | null;
  onClose: () => void;
}) {
  if (!tech) return null;
  // key remounts (resetting scroll/focus) when switching between skills
  return <OverlayBody key={tech} tech={tech} onClose={onClose} />;
}

function OverlayBody({ tech, onClose }: { tech: string; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const smooth = useSmoothScroll();
  const { toast } = useToast();
  const reduced = useReducedMotionSafe();
  const [imgOk, setImgOk] = useState(true);
  const [copied, setCopied] = useState(false);

  const detail: SkillDetail | undefined = skillDetails[tech];
  const category = detail?.category ?? "";
  const tagline = detail?.tagline ?? skillContext[tech] ?? category;
  const summary =
    detail?.summary ??
    `${tech} is part of the ${category || "toolkit"} on this site. A fuller write-up is on the way.`;
  const papers = detail?.papers ?? [];
  const books = detail?.books ?? [];
  const resources = detail?.resources ?? [];

  const imgSrc = `${bp}/media/skills/${skillSlug(tech)}.webp`;
  const headingId = `skill-detail-${skillSlug(tech)}`;

  // Focus into the dialog on open, restore to the opener (the chip) on close
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => prev?.focus();
  }, []);

  // Scroll-lock the page (pause Lenis + hide overflow) while the modal is up
  useEffect(() => {
    smooth.stop();
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevOverflow;
      smooth.start();
    };
  }, [smooth]);

  const copyName = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(tech);
      setCopied(true);
      toast(`${tech} copied ✓`, { icon: "check" });
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast("Clipboard unavailable", { icon: "info" });
    }
  }, [tech, toast]);

  // Escape closes; Tab is trapped inside the dialog's focusables
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key !== "Tab") return;
    const root = dialogRef.current;
    if (!root) return;
    const focusables = root.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const activeEl = document.activeElement;
    if (e.shiftKey && activeEl === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && activeEl === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const spring = { duration: reduced ? 0.15 : 0.34, ease: [0.22, 1, 0.36, 1] as const };

  return createPortal(
    <div
      className="fixed inset-0 z-[95] flex items-start justify-center px-4 pb-8 pt-[8vh] md:pt-[10vh]"
      onKeyDown={onKeyDown}
    >
      <motion.div
        aria-hidden
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.985 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        transition={spring}
        className="glass-3 relative flex max-h-[86vh] w-full max-w-2xl flex-col overflow-hidden"
      >
        {/* Close — floats over the banner, always reachable */}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          data-cursor="link"
          className="glass-1 absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full text-fg transition-transform hover:scale-105"
        >
          <X size={16} aria-hidden />
        </button>

        {/* Banner — Higgsfield illustration, or a gradient fallback */}
        {imgOk ? (
          <div className="relative h-40 w-full shrink-0 overflow-hidden md:h-52">
            <Image
              src={imgSrc}
              alt={`${tech} — abstract concept illustration`}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
              onError={() => setImgOk(false)}
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 40%, color-mix(in srgb, var(--bg-2) 78%, transparent) 100%)",
              }}
            />
          </div>
        ) : (
          <div
            aria-hidden
            className="relative flex h-28 w-full shrink-0 items-center justify-center overflow-hidden"
            style={{ background: "var(--gradient)" }}
          >
            <SkillIcon name={tech} size={40} className="text-white/90" />
          </div>
        )}

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8">
          <div className="mb-5 flex items-start gap-4">
            <span className="glass-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
              <SkillIcon name={tech} size={22} />
            </span>
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h2
                  id={headingId}
                  className="font-display text-2xl font-semibold leading-tight md:text-3xl"
                >
                  {tech}
                </h2>
                {category && (
                  <span className="glass-1 mono-chip rounded-full px-2.5 py-1 text-muted-fg">
                    {category}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-fg">{tagline}</p>
            </div>
          </div>

          <p className="text-[15px] leading-relaxed text-fg/90">{summary}</p>

          {papers.length > 0 && (
            <Section icon={<FileText size={15} aria-hidden />} title="Research papers">
              {papers.map((p) => (
                <CitationLink
                  key={p.url + p.title}
                  href={p.url}
                  title={p.title}
                  meta={meta(p.authors, p.year, p.venue)}
                  note={p.note}
                />
              ))}
            </Section>
          )}

          {books.length > 0 && (
            <Section icon={<BookOpen size={15} aria-hidden />} title="Books to read">
              {books.map((b) => (
                <CitationLink
                  key={b.url + b.title}
                  href={b.url}
                  title={b.title}
                  meta={meta(b.authors, b.year, b.publisher)}
                  note={b.note}
                />
              ))}
            </Section>
          )}

          {resources.length > 0 && (
            <Section icon={<Link2 size={15} aria-hidden />} title="Official resources">
              <ul className="flex flex-wrap gap-2">
                {resources.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="link"
                      className="mono-chip inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg-1)] px-3.5 text-muted-fg transition-colors hover:text-fg"
                    >
                      {r.label}
                      <ExternalLink size={12} aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Footer actions */}
          <div className="mt-8 flex items-center gap-3 border-t border-[var(--glass-border)] pt-5">
            <button
              type="button"
              onClick={copyName}
              data-cursor="link"
              className="mono-chip inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg-1)] px-4 text-muted-fg transition-colors hover:text-fg"
            >
              {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
              {copied ? "Copied" : "Copy name"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7">
      <h3 className="eyebrow mb-3 flex items-center gap-2 text-fg">
        <span className="text-[color:var(--accent-2-text)]">{icon}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function CitationLink({
  href,
  title,
  meta: metaLine,
  note,
}: {
  href: string;
  title: string;
  meta: string;
  note?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="link"
      className={cn(
        "group mb-2 flex items-start gap-3 rounded-2xl border p-3.5 transition-all duration-300",
        "border-[var(--glass-border)] bg-[var(--glass-bg-1)]",
        "hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent-2)_45%,var(--glass-border))]",
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-fg">{title}</p>
        {metaLine && <p className="mono-chip mt-0.5 text-muted-fg">{metaLine}</p>}
        {note && <p className="mt-1 text-[13px] leading-snug text-muted-fg">{note}</p>}
      </div>
      <ExternalLink
        size={15}
        aria-hidden
        className="mt-0.5 shrink-0 text-muted-fg transition-colors group-hover:text-[color:var(--accent-2-text)]"
      />
    </a>
  );
}
