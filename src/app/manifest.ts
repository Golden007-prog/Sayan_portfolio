export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { owner, site, bp } from "@/content/data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${owner.name} — Portfolio`,
    short_name: "SAYAN.OS",
    description: site.description,
    start_url: `${bp}/`,
    display: "standalone",
    background_color: "#05060a",
    theme_color: "#05060a",
    icons: [
      { src: `${bp}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${bp}/icon-512.png`, sizes: "512x512", type: "image/png" },
      {
        src: `${bp}/icon-maskable-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
