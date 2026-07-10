"use client";

/** Glass error boundary — no white screens (§291). */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="glass-3 max-w-md p-10 text-center">
        <p className="eyebrow mb-4">ABEND · UNEXPECTED</p>
        <h2 className="mb-3 text-2xl">Something broke.</h2>
        <p className="mb-8 text-muted-fg">
          The job abended mid-step. A refresh usually clears it.
        </p>
        <button
          type="button"
          onClick={reset}
          className="glass min-h-11 rounded-full px-6 py-3 font-medium"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
