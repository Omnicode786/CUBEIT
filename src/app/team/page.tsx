import type { Metadata } from "next";
import TeamPage from "@/components/team/TeamPage";

export const metadata: Metadata = {
  title: "Our Team — Product, Engineering & Growth",
  description: "Meet the people behind CubeIT, bringing together product engineering, DevOps, creative technology and CubeIQ digital growth.",
  alternates: { canonical: "/team" },
  openGraph: { title: "Meet the CubeIT Team", description: "The people behind CubeIT's digital products and services.", url: "/team" },
};

export default function Page() {
  return <TeamPage />;
}
