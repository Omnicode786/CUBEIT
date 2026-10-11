import type { Metadata } from "next";
import ContactQuest from "@/components/contact-quest";

export const metadata: Metadata = {
  title: "Start a Software or AI Project",
  description: "Discuss your next AI product, SaaS platform, workflow automation or custom software project with CubeIT. Share your requirements and start a conversation.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Start a Project | CubeIT", description: "Tell CubeIT about your AI, SaaS or custom software project.", url: "/contact" },
};

export default function ContactPage() {
  return <ContactQuest />;
}
