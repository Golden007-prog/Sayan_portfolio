/**
 * Sentry wiring — stubbed and inert by design (§294).
 *
 * The portfolio ships no error-reporting SDK: it would add ~30KB to every
 * page for a static site with one error boundary. Uncomment the block below
 * and install `@sentry/nextjs` if you want real reporting.
 *
 *   npm i @sentry/nextjs
 *   NEXT_PUBLIC_SENTRY_DSN=https://…@…ingest.sentry.io/…
 *
 * Then call `initSentry()` once from src/app/layout.tsx (client boundary) and
 * `captureError(err)` from src/app/error.tsx.
 */

// import * as Sentry from "@sentry/nextjs";

export function initSentry(): void {
  // const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  // if (!dsn) return;
  // Sentry.init({
  //   dsn,
  //   tracesSampleRate: 0.1,
  //   replaysSessionSampleRate: 0,
  //   environment: process.env.NODE_ENV,
  // });
}

export function captureError(error: unknown): void {
  // Sentry.captureException(error);
  if (process.env.NODE_ENV !== "production") {
    console.error("[captureError]", error);
  }
}
