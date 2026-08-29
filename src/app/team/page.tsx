import type { Metadata } from "next";
import TeamPage from "@/components/team/TeamPage";

export const metadata: Metadata = {
  title: "Team | CubeIT",
  description: "Meet the people behind CubeIT: product engineering, DevOps and CubeIQ growth working as one connected team.",
};

export default function Page() {
  return <TeamPage />;
}
