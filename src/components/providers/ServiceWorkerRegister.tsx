"use client";

import { useEffect } from "react";
import { bp } from "@/content/data";

/** Registers the minimal offline-fallback service worker (§288). */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register(`${bp}/sw.js`).catch(() => {
      // offline fallback is progressive enhancement — never block the site
    });
  }, []);
  return null;
}
