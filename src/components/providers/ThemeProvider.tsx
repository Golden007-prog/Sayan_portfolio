"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useEffect, type ReactNode } from "react";

/** Keeps <meta name="theme-color"> in sync with the resolved theme (§222) */
function ThemeColorSync() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    // Hold the SSR default (the media-scoped pair below) until next-themes
    // has actually resolved a theme, so we never flash the wrong chrome color.
    if (!resolvedTheme) return;
    const color = resolvedTheme === "light" ? "#f6f7fb" : "#05060a";
    // layout.tsx's viewport export renders a media-scoped PAIR of theme-color
    // metas (one (prefers-color-scheme: dark), one light). The browser applies
    // whichever matches the OS — not the in-site toggle — so mutating only the
    // first tag leaves a light-OS device stuck on the untouched light tag and
    // the chrome never follows the toggle. Set every theme-color meta to the
    // resolved color so whichever tag the browser picks reflects the toggle.
    // The media attributes stay intact, so with JS off the pair still falls
    // back to the OS preference as the SSR default.
    const metas = document.querySelectorAll<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    if (metas.length === 0) {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = color;
      document.head.appendChild(meta);
      return;
    }
    metas.forEach((meta) => {
      meta.content = color;
    });
  }, [resolvedTheme]);
  return null;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <ThemeColorSync />
      {children}
    </NextThemesProvider>
  );
}
