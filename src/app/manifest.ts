import type { MetadataRoute } from "next";
import { owner, site } from "@/content/data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${owner.name} — Portfolio`,
    short_name: "SAYAN.OS",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#05060a",
    theme_color: "#05060a",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
