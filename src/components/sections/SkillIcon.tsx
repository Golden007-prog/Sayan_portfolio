import {
  siClaude,
  siCplusplus,
  siCss,
  siCursor,
  siDocker,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siJupyter,
  siModelcontextprotocol,
  siMysql,
  siNumpy,
  siOpenjdk,
  siPandas,
  siPython,
  type SimpleIcon,
} from "simple-icons";
import { cn } from "@/lib/cn";

/**
 * Tech name → simple-icons mapping (§75). Only exports verified to exist in
 * the installed simple-icons v16 are listed — IBM, Adobe and Microsoft marks
 * were removed upstream, so those techs fall through to the monogram chip.
 */
const ICONS: Record<string, SimpleIcon> = {
  Python: siPython,
  Java: siOpenjdk,
  "C++": siCplusplus,
  JavaScript: siJavascript,
  HTML: siHtml5,
  CSS: siCss,
  MySQL: siMysql,
  Docker: siDocker,
  Git: siGit,
  GitHub: siGithub,
  Pandas: siPandas,
  NumPy: siNumpy,
  Jupyter: siJupyter,
  MCP: siModelcontextprotocol,
  "Cursor (AI)": siCursor,
  "Claude Code": siClaude,
};

/** "IMS DB" → "ID", "Z/OS" → "ZO", "COBOL" → "CO" */
function monogram(name: string): string {
  const words = name.split(/[^A-Za-z0-9+]+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export interface SkillIconProps {
  name: string;
  /** square edge in px */
  size?: number;
  className?: string;
}

/**
 * The single icon component for every tech mark on the site (§85).
 * Known brands render the simple-icons path in currentColor; anything the
 * icon set can't cover degrades to a monogram chip (§90) — no broken glyphs.
 * Always decorative: the tech name is rendered as text next to it.
 */
export function SkillIcon({ name, size = 16, className }: SkillIconProps) {
  const icon = ICONS[name];

  if (icon) {
    return (
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        className={cn("shrink-0", className)}
      >
        <path d={icon.path} />
      </svg>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-md border font-mono leading-none",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(7, Math.round(size * 0.42)),
        letterSpacing: "0.02em",
        borderColor: "var(--glass-border)",
        background: "var(--glass-bg-1)",
      }}
    >
      {monogram(name)}
    </span>
  );
}
