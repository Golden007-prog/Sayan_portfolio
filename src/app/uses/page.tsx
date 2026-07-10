import type { Metadata } from "next";
import Link from "next/link";
import { usesPage } from "@/content/data";

export const metadata: Metadata = {
  title: "Uses",
  description: "The hardware, software and mainframe tooling behind the work.",
  alternates: { canonical: "/uses" },
};

/** Hidden gear page — linked only from the footer dot (§282). Near-zero JS (§240). */
export default function UsesPage() {
  return (
    <main id="main" className="container-site py-28">
      <p className="eyebrow mb-4">FOUND IT / USES</p>
      <h1 className="mb-4 text-4xl md:text-6xl">{usesPage.title}</h1>
      <p className="mb-16 text-muted-fg">{usesPage.intro}</p>

      <div className="grid gap-6 md:grid-cols-2">
        {usesPage.groups.map((group, i) => (
          <section key={group.name} className="glass p-8">
            <p className="eyebrow mb-3">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="mb-5 text-xl font-medium">{group.name}</h2>
            <ul className="space-y-2.5">
              {group.items.map((item) => (
                <li key={item} className="flex items-baseline gap-3">
                  <span aria-hidden className="text-accent2">▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <Link
        href="/"
        className="link-underline mt-16 inline-block text-muted-fg hover:text-fg"
      >
        ← Back to the portfolio
      </Link>
    </main>
  );
}
