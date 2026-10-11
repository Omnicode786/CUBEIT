import type { MetadataRoute } from "next";
import { workProjects } from "@/components/works/work-data";

const siteUrl = "https://www.cubeit.solutions";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Array<{ path: string; priority: number; changeFrequency: "weekly" | "monthly" }> = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/our-work", priority: 0.9, changeFrequency: "monthly" },
    { path: "/cubeiq", priority: 0.8, changeFrequency: "monthly" },
    { path: "/team", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  ];

  return [
    ...pages.map(({ path, priority, changeFrequency }) => ({
      url: `${siteUrl}${path}`,
      changeFrequency,
      priority,
    })),
    ...workProjects.map((project) => ({
      url: `${siteUrl}/our-work/${encodeURIComponent(project.slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
