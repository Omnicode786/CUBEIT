import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkDetailPage from "@/components/works/WorkDetailPage";
import { getWorkProject, workProjects } from "@/components/works/work-data";

const siteUrl = "https://www.cubeit.solutions";
type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return workProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getWorkProject(slug);
  if (!project) return { title: "Project Not Found", robots: { index: false, follow: false } };

  const path = `/our-work/${project.slug}`;
  return {
    title: `${project.title} — ${project.category}`,
    description: project.description,
    alternates: { canonical: path },
    openGraph: {
      title: `${project.title} | CubeIT Portfolio`,
      description: project.description,
      url: path,
      type: "article",
      images: [{ url: project.cover, width: project.width, height: project.height, alt: `${project.title} project image` }],
    },
    twitter: { card: "summary_large_image", title: `${project.title} | CubeIT`, description: project.description, images: [project.cover] },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const project = getWorkProject(slug);
  if (!project) notFound();
  const url = `${siteUrl}/our-work/${project.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#project`,
        name: project.title,
        description: project.description,
        url,
        image: `${siteUrl}${project.cover}`,
        creator: { "@id": `${siteUrl}/#organization` },
        genre: project.category,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Our Work", item: `${siteUrl}/our-work` },
          { "@type": "ListItem", position: 3, name: project.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <WorkDetailPage project={project} />
    </>
  );
}
