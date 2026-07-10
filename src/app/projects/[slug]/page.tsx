import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, site, stripBp } from "@/content/data";
import { CaseStudy } from "@/components/work/CaseStudy";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

/** Per-project title + OG image (§127, §266). */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.subtitle,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.subtitle,
      url: `${site.url}/projects/${project.slug}`,
      // bp-free: these resolve against metadataBase, which already has the basePath
      images: [{ url: stripBp(project.cover), width: 1920, height: 1080, alt: project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.subtitle,
      images: [stripBp(project.cover)],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound(); // unknown slug → styled 404, never a crash (§129)

  const project = projects[index];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return <CaseStudy project={project} prev={prev} next={next} />;
}
