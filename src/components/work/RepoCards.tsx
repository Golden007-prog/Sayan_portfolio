import { Suspense } from "react";
import { GitFork, Star } from "lucide-react";
import { owner } from "@/content/data";

/**
 * NOTE: async SERVER components — no "use client" here on purpose.
 * <WorkGallery /> is a client component and cannot render these itself;
 * page.tsx mounts <RepoCardsPanel /> (Suspense + shimmer skeleton + RepoCards)
 * immediately after <WorkGallery /> so the block reads as part of #work.
 */

interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}

async function fetchRepos(): Promise<GitHubRepo[] | null> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${owner.githubUser}/repos?sort=updated&per_page=6`,
      {
        next: { revalidate: 86400 },
        headers: { Accept: "application/vnd.github+json" },
      },
    );
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return null;
    return data as GitHubRepo[];
  } catch {
    // Offline build, rate-limited, DNS failure … the block simply hides (§120).
    return null;
  }
}

/**
 * Live GitHub repo strip under the Selected Work gallery (§119).
 * Server-fetched (revalidates daily); returns null on any failure so the
 * block disappears gracefully instead of erroring (§120).
 */
export async function RepoCards() {
  const repos = await fetchRepos();
  if (!repos || repos.length === 0) return null;

  return (
    <div className="container-site pb-[var(--section-pad)]">
      <p className="eyebrow mb-6">@{owner.githubUser}</p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo) => (
          <li key={repo.id}>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="glass-1 glass-sheen flex h-full min-h-32 flex-col gap-3 p-5 transition-transform duration-300 ease-soft hover:-translate-y-1"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="mono-chip font-medium text-fg">{repo.name}</span>
                <span className="flex shrink-0 items-center gap-3 text-muted-fg">
                  <span className="mono-chip flex items-center gap-1">
                    <Star aria-hidden className="h-3.5 w-3.5" />
                    {repo.stargazers_count}
                    <span className="sr-only">stars</span>
                  </span>
                  <span className="mono-chip flex items-center gap-1">
                    <GitFork aria-hidden className="h-3.5 w-3.5" />
                    {repo.forks_count}
                    <span className="sr-only">forks</span>
                  </span>
                </span>
              </span>
              {repo.description && (
                <span className="line-clamp-2 text-sm text-muted-fg">
                  {repo.description}
                </span>
              )}
              {repo.language && (
                <span className="mono-chip mt-auto flex items-center gap-2 text-muted-fg">
                  <span
                    aria-hidden
                    className="h-2 w-2 rounded-full"
                    style={{ background: "var(--accent-2)" }}
                  />
                  {repo.language}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Shimmer skeleton mirroring the repo grid — transform-only sweep animation. */
export function RepoCardsSkeleton() {
  return (
    <div className="container-site pb-[var(--section-pad)]" aria-hidden>
      <style>{`@keyframes repo-shimmer { to { transform: translateX(200%); } }`}</style>
      <div
        className="mb-6 h-3 w-28 rounded-full"
        style={{ background: "color-mix(in srgb, var(--text) 8%, transparent)" }}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="glass-1 relative flex min-h-32 flex-col gap-3 overflow-hidden p-5"
          >
            {[
              "h-3 w-2/5",
              "h-3 w-full",
              "h-3 w-3/5",
            ].map((size) => (
              <span
                key={size}
                className={`${size} rounded-full`}
                style={{
                  background: "color-mix(in srgb, var(--text) 8%, transparent)",
                }}
              />
            ))}
            <span
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -translate-x-full"
              style={{
                background:
                  "linear-gradient(105deg, transparent, var(--glass-highlight), transparent)",
                animation: `repo-shimmer 1.4s ease-in-out ${i * 0.12}s infinite`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Ready-to-mount composition for page.tsx: streams the repo grid in behind
 * a shimmer skeleton. Place directly after <WorkGallery />.
 */
export function RepoCardsPanel() {
  return (
    <Suspense fallback={<RepoCardsSkeleton />}>
      <RepoCards />
    </Suspense>
  );
}
