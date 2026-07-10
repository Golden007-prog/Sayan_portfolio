# TODO — content the owner needs to drop in

Everything below is intentionally shipped with a visible `[ADD LINK]`
placeholder or a generated stand-in. Update `src/content/data.ts` (single
source of truth) — nothing else needs touching.

## Links to add (`src/content/data.ts`)

| Where | Field | Currently |
| --- | --- | --- |
| Awards → World Record card | `awards[1].link` | `[ADD LINK]` |
| Awards → Helios card | `awards[2].link` | `[ADD LINK]` |
| Project → Helios | `projects[0].github` | `[ADD LINK]` |
| Project → Report Engine | `projects[1].github` | `[ADD LINK]` |
| Project → Fintech App | `projects[2].github` | `[ADD LINK]` |
| Project → Endevor Pipeline | `projects[3].github` | `[ADD LINK]` |

## Photo

`public/media/about-portrait.png` is currently the generated frosted-glass
"SC" monogram (spec §A2 Path B fallback). To use a real photo:
1. Replace the file with a 4:5 portrait (~1080×1350), or
2. Regenerate via Higgsfield MCP: `media_upload` your photo →
   `remove_background` → export → save over the file.

## After deploying to Vercel

1. Set `site.url` in `src/content/data.ts` to the live domain
   (drives metadataBase, sitemap, canonical URLs, JSON-LD).
2. Optionally set env vars (see `.env.example`):
   `NEXT_PUBLIC_FORM_ENDPOINT` (Formspree/Resend) and
   `NEXT_PUBLIC_ANALYTICS_ID` (Plausible domain).
