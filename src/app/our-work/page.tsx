import type { Metadata } from "next";
import WorksPage from "@/components/works/WorksPage";

export const metadata: Metadata = {
  title: "Software, SaaS & AI Projects — Our Work",
  description: "Explore CubeIT's client-delivery portfolio and CubeIT Labs concepts, from AI document intelligence and legal technology to retail, healthcare and SaaS platforms.",
  alternates: { canonical: "/our-work" },
  openGraph: {
    title: "Software, SaaS & AI Projects | CubeIT",
    description: "Discover CubeIT's work in software engineering, SaaS product design, industry platforms and AI products.",
    url: "/our-work",
  },
};

export default function Page() {
  return <WorksPage />;
}
