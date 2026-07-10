"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Command } from "lucide-react";
import { cn } from "@/lib/cn";
import { nav, owner } from "@/content/data";
import { ThemeToggle } from "@/components/primitives/ThemeToggle";
import { useToast } from "@/components/providers/ToastProvider";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import {
  MobileMenu,
  GithubIcon,
  LinkedinIcon,
} from "@/components/shell/MobileMenu";
import {
  CommandPalette,
  OPEN_PALETTE_EVENT,
} from "@/components/shell/CommandPalette";

const SECTION_IDS = ["home", ...nav.map((n) => n.href.slice(1))];

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/**
 * Fixed glass navbar (§15): auto-hide on scroll down / reveal on scroll up
 * (§16), compresses past 80px with stronger blur/alpha (§17), scroll-spy
 * links (§18) with magnetic micro-translate (§19) and a sliding layoutId
 * underline (§20). Also hosts the flip monogram (§21, §281), the conic
 * "Let's Talk" CTA (§22), availability badge (§29), social buttons
 * (§30, §251), ThemeToggle (§36), MobileMenu and CommandPalette.
 */
export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [compressed, setCompressed] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [spins, setSpins] = useState(0);
  const clicksRef = useRef<number[]>([]);
  const { toast } = useToast();
  const smooth = useSmoothScroll();
  const reduced = useReducedMotionSafe();

  // Auto-hide + compression, throttled to one update per frame (§16, §17)
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setCompressed(y > 80);
      const delta = y - lastY;
      if (y < 80) setHidden(false);
      else if (delta > 6) setHidden(true);
      else if (delta < -6) setHidden(false);
      lastY = y;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy over the section anchors from nav data (§18)
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const goTo = (href: string) => smooth.scrollTo(href);

  // 5 quick clicks spin the monogram and confess nothing (§281)
  const onLogoClick = () => {
    goTo("#home");
    const now = performance.now();
    const clicks = clicksRef.current.filter((t) => now - t < 1600);
    clicks.push(now);
    clicksRef.current = clicks;
    if (clicks.length >= 5) {
      clicksRef.current = [];
      setSpins((s) => s + 1);
      toast("You found nothing. Or did you?");
    }
  };

  const initials = owner.name
    .split(" ")
    .map((w) => w.charAt(0))
    .join("");

  const indicatorHref =
    hoveredHref ?? (activeId && activeId !== "home" ? `#${activeId}` : null);

  const socials = [
    { label: "GitHub", href: owner.github, icon: <GithubIcon size={16} /> },
    { label: "LinkedIn", href: owner.linkedin, icon: <LinkedinIcon size={16} /> },
  ];

  return (
    <>
      <header
        data-print-hide
        className={cn(
          "fixed inset-x-0 top-0 z-[60] transition-transform duration-500 ease-[var(--ease-out-soft)]",
          hidden && "-translate-y-full",
        )}
      >
        {/* hover-flip stays behind a fine-pointer gate (§21, rule 7) */}
        <style>{`@media (hover: hover) and (pointer: fine) { .nav-logo:hover .nav-logo-flip { transform: rotateY(180deg); } }`}</style>
        <nav
          aria-label="Primary"
          className="border-b border-[var(--glass-border)] shadow-[inset_0_1px_0_var(--glass-highlight)]"
          style={{
            height: compressed ? "var(--nav-h-compressed)" : "var(--nav-h)",
            background: compressed ? "var(--glass-bg-3)" : "var(--glass-bg-1)",
            backdropFilter: compressed
              ? "blur(26px) saturate(170%)"
              : "blur(14px) saturate(150%)",
            WebkitBackdropFilter: compressed
              ? "blur(26px) saturate(170%)"
              : "blur(14px) saturate(150%)",
            transition:
              "height 0.4s var(--ease-out-soft), background-color 0.4s var(--ease-out-soft), backdrop-filter 0.4s var(--ease-out-soft)",
          }}
        >
          <div className="container-site flex h-full items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-4">
              <button
                type="button"
                onClick={onLogoClick}
                aria-label="Back to top"
                data-cursor="link"
                className="nav-logo relative flex h-11 w-11 shrink-0 items-center justify-center [perspective:600px]"
              >
                <motion.span
                  className="block h-full w-full"
                  animate={{ rotate: spins * 720 }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
                  }
                >
                  <span className="nav-logo-flip relative block h-full w-full transition-transform duration-500 ease-[var(--ease-out-soft)] [transform-style:preserve-3d]">
                    <span className="absolute inset-0 flex items-center justify-center font-display text-lg font-bold tracking-tight [backface-visibility:hidden]">
                      {initials}
                    </span>
                    <span
                      aria-hidden
                      className="absolute inset-0 flex items-center justify-center font-display text-lg font-bold text-accent2 [backface-visibility:hidden] [transform:rotateY(180deg)]"
                    >
                      サ
                    </span>
                  </span>
                </motion.span>
              </button>

              {/* Availability badge with pulsing dot (§29) */}
              <span className="glass-1 hidden items-center gap-2 rounded-full px-3 py-1.5 xl:inline-flex">
                <span aria-hidden className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent4 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent4" />
                </span>
                <span className="mono-chip whitespace-nowrap text-muted-fg">
                  {owner.availability}
                </span>
              </span>
            </div>

            <ul
              className="hidden items-center gap-1 md:flex"
              onMouseLeave={() => setHoveredHref(null)}
            >
              {nav.map((item) => (
                <li key={item.href}>
                  <NavLink
                    item={item}
                    isActive={activeId === item.href.slice(1)}
                    showIndicator={indicatorHref === item.href}
                    onHoverStart={() => setHoveredHref(item.href)}
                    onHoverEnd={() =>
                      setHoveredHref((h) => (h === item.href ? null : h))
                    }
                    onNavigate={goTo}
                    reduced={reduced}
                  />
                </li>
              ))}
            </ul>

            <div className="flex shrink-0 items-center gap-2">
              {/* Socials with lift + glow (§30) and new-tab hint (§251) */}
              <div className="hidden items-center gap-2 sm:flex">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label} — opens in new tab`}
                    data-cursor="link"
                    className="glass-1 flex h-11 w-11 items-center justify-center rounded-full text-muted-fg transition-[transform,box-shadow,color] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:text-fg hover:shadow-[0_8px_28px_rgba(34,211,238,0.28)]"
                  >
                    {s.icon}
                    <span className="sr-only">opens in new tab</span>
                  </a>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent(OPEN_PALETTE_EVENT))
                }
                aria-label="Open command palette (Ctrl+K)"
                data-cursor="link"
                className="glass-1 hidden h-11 items-center gap-1 rounded-full px-3 text-muted-fg transition-colors hover:text-fg md:flex"
              >
                <Command size={13} aria-hidden />
                <span className="mono-chip">K</span>
              </button>

              <ThemeToggle />

              {/* Conic-border CTA pill → contact (§22) */}
              <button
                type="button"
                onClick={() => goTo("#contact")}
                data-cursor="link"
                className="glass-conic glass-1 hidden min-h-11 items-center px-5 text-sm font-medium sm:inline-flex"
                style={{ borderRadius: "var(--radius-chip)" }}
              >
                Let&apos;s Talk
              </button>

              <MobileMenu className="md:hidden" />
            </div>
          </div>
        </nav>
      </header>
      <CommandPalette />
    </>
  );
}

/** Nav link with magnetic micro-translate (§19) and shared underline (§20). */
function NavLink({
  item,
  isActive,
  showIndicator,
  onHoverStart,
  onHoverEnd,
  onNavigate,
  reduced,
}: {
  item: (typeof nav)[number];
  isActive: boolean;
  showIndicator: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onNavigate: (href: string) => void;
  reduced: boolean;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 320, damping: 22, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 320, damping: 22, mass: 0.5 });

  const onMouseMove = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (reduced || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(clamp((e.clientX - rect.left - rect.width / 2) * 0.18, -4, 4));
    y.set(clamp((e.clientY - rect.top - rect.height / 2) * 0.3, -3, 3));
  };

  const resetPull = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={item.href}
      style={{ x: sx, y: sy }}
      onMouseMove={onMouseMove}
      onMouseEnter={onHoverStart}
      onMouseLeave={resetPull}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(item.href);
      }}
      aria-current={isActive ? "true" : undefined}
      data-cursor="link"
      className={cn(
        "relative inline-flex min-h-11 items-center px-3 text-sm font-medium transition-colors duration-300",
        isActive ? "text-fg" : "text-muted-fg hover:text-fg",
      )}
    >
      {item.label}
      {showIndicator && (
        <motion.span
          layoutId="nav-underline"
          aria-hidden
          className="absolute inset-x-3 bottom-1.5 h-px bg-[image:var(--gradient)]"
          transition={
            reduced
              ? { duration: 0 }
              : { type: "spring", stiffness: 420, damping: 34 }
          }
        />
      )}
    </motion.a>
  );
}
