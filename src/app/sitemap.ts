export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { projects, site } from "@/content/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({
      url: `${site.url}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${site.url}/uses`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
