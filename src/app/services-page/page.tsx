import type { Metadata } from "next";
import ServicesPage from "@/components/services/ServicesPage";

// Backwards-compatible internal route. /services is the public canonical URL.
export const metadata: Metadata = {
  title: "AI Products, Custom Software & SaaS Services",
  description: "CubeIT builds AI products, business platforms and software tools.",
  alternates: { canonical: "/services" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <ServicesPage />;
}
