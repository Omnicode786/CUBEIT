import type { Metadata } from "next";
import CubeIQPage from "@/components/cubeiq-page";
import CubeIQEnhancements from "@/components/CubeIQEnhancements";
import CubeIQMethodLayoutFix from "@/components/CubeIQMethodLayoutFix";

export const metadata: Metadata = {
  title: "CubeIQ — Intelligent Digital Growth & Marketing",
  description: "CubeIQ connects advertising, content, analytics, websites and customer journeys into an intelligent digital growth system by CubeIT.",
  alternates: { canonical: "/cubeiq" },
  openGraph: {
    title: "CubeIQ | Intelligent Digital Growth & Marketing",
    description: "A connected approach to advertising, content, analytics and customer journeys.",
    url: "/cubeiq",
  },
};

export default function Page() {
  return (
    <>
      <CubeIQPage />
      <CubeIQEnhancements />
      <CubeIQMethodLayoutFix />
    </>
  );
}
