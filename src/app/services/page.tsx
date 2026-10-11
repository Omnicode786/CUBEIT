import type { Metadata } from "next";
import ServicesPage from "@/components/services/ServicesPage";

export const metadata: Metadata = {
  title: "AI Products, Custom Software & SaaS Services",
  description: "Explore CubeIT services: AI agents, document intelligence, industry-specific platforms, SaaS development, dashboards, workflow systems and automation.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "AI Products, Custom Software & SaaS Services | CubeIT",
    description: "AI products, enterprise platforms and digital product engineering — designed and developed by CubeIT.",
    url: "/services",
  },
};

export default function Page() {
  return <ServicesPage />;
}
