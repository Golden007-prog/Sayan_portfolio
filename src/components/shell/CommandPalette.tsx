"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  Copy,
  Download,
  Moon,
  Search,
  Sparkles,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { nav, owner } from "@/content/data";
import { useCursor } from "@/components/providers/CursorProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { GithubIcon, LinkedinIcon } from "@/components/shell/MobileMenu";

/** Dispatch `window.dispatchEvent(new CustomEvent(OPEN_PALETTE_EVENT))` to open. */
export const OPEN_PALETTE_EVENT = "open-command-palette";

/**
 * Tiny fuzzy scorer (§33): subsequence match with consecutive-run and
 * word-start bonuses, mild length penalty. Returns -1 on no match.
 */
function fuzzyScore(query: string, text: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0;
  let streak = 0;
  let score = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t.charAt(ti) === q.charAt(qi)) {
      streak += 1;
      const wordStart = ti === 0 || t.charAt(ti - 1) === " ";
      score += 2 + streak * 2 + (wordStart ? 6 : 0);
      qi += 1;
    } else {
      streak = 0;
    }
  }
  return qi === q.length ? score - t.length * 0.05 : -1;
}

interface PaletteItemDef {
  id: string;
  label: string;
  hint: string;
  keywords: string;
  icon: ReactNode;
  run: () => void;
}

/**
 * Command palette shell (§32): global Cmd/Ctrl+K listener + custom event.
 * The body (and all of its provider hooks) only mounts while open — a 4th
 * file would be needed for true next/dynamic code-splitting, and the shell
 * must stay in the initial bundle for the shortcut anyway, so conditional
 * mounting is the lazy strategy here.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  if (!open) return null;
  return <PaletteBody onClose={() => setOpen(false)} />;
}

function PaletteBody({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const { resolvedTheme, setTheme } = useTheme();
  const { sparkle, setSparkle } = useCursor();
  const { toast } = useToast();
  const smooth = useSmoothScroll();
  const reduced = useReducedMotionSafe();

  const items = useMemo<PaletteItemDef[]>(
    () => [
      ...nav.map((n) => ({
        id: `nav-${n.href.slice(1)}`,
        label: n.label,
        hint: "Jump to section",
        keywords: `go to section ${n.href}`,
        icon: <ArrowRight size={15} aria-hidden />,
        run: () => smooth.scrollTo(n.href),
      })),
      {
        id: "github",
        label: "GitHub",
        hint: "Opens in new tab",
        keywords: `github ${owner.githubUser} code repositories`,
        icon: <GithubIcon size={15} />,
        run: () => window.open(owner.github, "_blank", "noopener,noreferrer"),
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        hint: "Opens in new tab",
        keywords: "linkedin profile connect network",
        icon: <LinkedinIcon size={15} />,
        run: () => window.open(owner.linkedin, "_blank", "noopener,noreferrer"),
      },
      {
        id: "theme",
        label: "Toggle theme",
        hint: resolvedTheme === "dark" ? "Switch to light" : "Switch to dark",
        keywords: "theme dark light mode appearance toggle",
        icon:
          resolvedTheme === "dark" ? (
            <Sun size={15} aria-hidden />
          ) : (
            <Moon size={15} aria-hidden />
          ),
        run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      },
      {
        id: "resume",
        label: "Download resume",
        hint: "PDF",
        keywords: "resume cv pdf download",
        icon: <Download size={15} aria-hidden />,
        run: () => {
          const a = document.createElement("a");
          a.href = owner.resumePdf;
          a.download = "";
          document.body.appendChild(a);
          a.click();
          a.remove();
        },
      },
      {
        id: "sparkle",
        label: sparkle ? "Sparkle cursor: turn off" : "Sparkle cursor: turn on",
        hint: "Cursor trail",
        keywords: "sparkle cursor trail fun easter",
        icon: <Sparkles size={15} aria-hidden />,
        run: () => {
          setSparkle(!sparkle);
          toast(sparkle ? "Sparkle trail off" : "Sparkle trail on", {
            icon: "check",
          });
        },
      },
      {
        id: "email",
        label: "Copy email",
        hint: owner.email,
        keywords: "copy email contact mail address",
        icon: <Copy size={15} aria-hidden />,
        run: () => {
          void navigator.clipboard
            .writeText(owner.email)
            .then(() => toast("Email copied", { icon: "check" }));
        },
      },
    ],
    [resolvedTheme, setTheme, smooth, sparkle, setSparkle, toast],
  );

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return items;
    return items
      .map((item) => ({
        item,
        score: fuzzyScore(q, `${item.label} ${item.keywords}`),
      }))
      .filter((r) => r.score >= 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.item);
  }, [items, query]);

  const active = results.length
    ? Math.min(activeIndex, results.length - 1)
    : -1;
  const activeItem = active >= 0 ? results[active] : undefined;

  // Focus: move into the input on open, restore to the opener on close
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => prev?.focus();
  }, []);

  // Scroll lock while the modal is up
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

  // Keep the active option visible while arrowing through the list
  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const execute = useCallback(
    (item: PaletteItemDef) => {
      // Unlock before running so in-page scroll commands aren't swallowed
      document.documentElement.style.overflow = "";
      smooth.start();
      onClose();
      item.run();
    },
    [onClose, smooth],
  );

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === "Tab") {
      // Single focusable inside the dialog — trap focus on the input
      e.preventDefault();
      inputRef.current?.focus();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(results.length ? (active + 1) % results.length : 0);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        results.length ? (active - 1 + results.length) % results.length : 0,
      );
      return;
    }
    // Home/End belong to the textbox caret (APG editable combobox pattern);
    // Ctrl/Cmd+Home/End optionally jump to the first/last option instead.
    if (e.key === "Home" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setActiveIndex(0);
      return;
    }
    if (e.key === "End" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setActiveIndex(Math.max(results.length - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeItem) execute(activeItem);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[95] flex items-start justify-center px-4 pb-8 pt-[14vh]"
      onKeyDown={onKeyDown}
    >
      <motion.div
        aria-hidden
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduced ? 0.15 : 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="glass-3 relative w-full max-w-xl overflow-hidden"
      >
        <div className="flex items-center gap-3 border-b border-[var(--glass-border)] px-4">
          <Search size={16} className="shrink-0 text-muted-fg" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-listbox"
            aria-activedescendant={
              activeItem ? `palette-option-${activeItem.id}` : undefined
            }
            aria-autocomplete="list"
            aria-label="Search commands"
            placeholder="Type a command or section…"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="h-14 w-full min-w-0 bg-transparent text-sm text-fg placeholder:text-muted-fg"
            data-cursor="text"
          />
          <kbd className="mono-chip hidden shrink-0 rounded-md border border-[var(--glass-border)] px-1.5 py-0.5 text-muted-fg sm:block">
            ESC
          </kbd>
        </div>

        <ul
          ref={listRef}
          id="palette-listbox"
          role="listbox"
          aria-label="Commands"
          data-lenis-prevent
          className="max-h-[min(50vh,20rem)] overflow-y-auto p-2"
        >
          {results.length === 0 && (
            <li role="presentation" className="px-3 py-8 text-center text-sm text-muted-fg">
              Nothing found — clean compile, though.
            </li>
          )}
          {results.map((item, i) => (
            <li
              key={item.id}
              id={`palette-option-${item.id}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => execute(item)}
              data-cursor="link"
              className={cn(
                "flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-150",
                i === active ? "bg-[var(--glass-bg)] text-fg" : "text-muted-fg",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[var(--glass-border)]",
                  i === active && "text-accent2t",
                )}
              >
                {item.icon}
              </span>
              <span className="flex-1 truncate">{item.label}</span>
              <span className="mono-chip max-w-[40%] truncate text-muted-fg">
                {item.hint}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-[var(--glass-border)] px-4 py-2">
          <span className="mono-chip text-muted-fg" aria-hidden>
            ↑↓ navigate · ↵ run · esc close
          </span>
          <span className="mono-chip text-muted-fg" aria-live="polite">
            {results.length} result{results.length === 1 ? "" : "s"}
          </span>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
