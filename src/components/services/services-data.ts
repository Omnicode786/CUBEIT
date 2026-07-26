export type CubeITService = {
  slug: string;
  title: string;
  shortTitle: string;
  label: string;
  index: string;
  summary: string;
  thesis: string;
  outcome: string;
  images: string[];
  tags: string[];
  capabilities: string[];
  technologies: string[];
  proof: string;
  pose: [number, number, number];
  accent: "blue" | "navy" | "orange";
};

export const cubeitServices: CubeITService[] = [
  {
    slug: "ai-products",
    title: "AI Products",
    shortTitle: "AI",
    label: "AI systems",
    index: "01",
    summary: "AI tools that help teams find answers, automate work and make better decisions.",
    thesis: "We turn AI into useful products with clear interfaces, secure data flow and human review.",
    outcome: "Teams move faster without adding more disconnected tools.",
    images: ["/services/photos/ai-code.png", "/services/photos/ai-team.png", "/services/photos/ai-data.png"],
    tags: ["Agents", "Document AI", "Analytics"],
    capabilities: ["AI agents", "Document intelligence", "Predictive analytics", "Workflow copilots", "Knowledge search"],
    technologies: ["Python", "Next.js", "PostgreSQL", "FastAPI", "Docker"],
    proof: "Useful AI needs product thinking, secure data and practical guardrails.",
    pose: [-0.16, 0.74, 0.02],
    accent: "blue",
  },
  {
    slug: "industry-solutions",
    title: "Industry Solutions",
    shortTitle: "Industry",
    label: "Business platforms",
    index: "02",
    summary: "Secure platforms for industries with real workflows, records, approvals and teams.",
    thesis: "We study the operation first, then build software around how the business actually works.",
    outcome: "Complex work becomes easier to see, control and improve.",
    images: ["/services/photos/industry-clinic.png", "/services/photos/industry-construction.png", "/services/photos/industry-logistics.png"],
    tags: ["Healthcare", "Construction", "Logistics"],
    capabilities: ["Operational platforms", "Role-based portals", "Dashboards", "Secure records", "Industry workflows"],
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Cloudflare"],
    proof: "Strong systems fit the industry instead of forcing a generic template.",
    pose: [0.2, 1.58, -0.1],
    accent: "navy",
  },
  {
    slug: "innovative-tools",
    title: "Innovative Tools",
    shortTitle: "Tools",
    label: "Product engineering",
    index: "03",
    summary: "SaaS products, dashboards, workflow tools and digital platforms built to scale.",
    thesis: "We build tools that are simple to use and strong enough to become long-term product foundations.",
    outcome: "Your software can launch, learn and evolve with the business.",
    images: ["/services/photos/tools-design.png", "/services/photos/tools-workflow.png", "/services/photos/tools-software.png"],
    tags: ["SaaS", "Workflows", "Product UX"],
    capabilities: ["SaaS products", "Internal tools", "Workflow systems", "Customer portals", "Product interfaces"],
    technologies: ["Next.js", "React", "Node.js", "Prisma", "Vercel"],
    proof: "Good tools remove friction and make the right action obvious.",
    pose: [0.42, 2.34, -0.18],
    accent: "orange",
  },
];

export const servicePrinciples = [
  {
    label: "Model the work",
    title: "Understand the operation first.",
    copy: "We map the people, records and decisions that shape the real work.",
  },
  {
    label: "Engineer the system",
    title: "Build one connected system.",
    copy: "Design, code, AI and automation move together from the start.",
  },
  {
    label: "Prepare for scale",
    title: "Prepare for what comes next.",
    copy: "Architecture and data are shaped so the product can keep improving.",
  },
];

export const deliveryMatrix = [
  {
    heading: "Discovery",
    items: ["Workflow mapping", "Technical scope", "Role and permission planning", "Risk clarity"],
  },
  {
    heading: "Product",
    items: ["UX systems", "Interface design", "Prototype flows", "Content structure"],
  },
  {
    heading: "Engineering",
    items: ["Full-stack build", "AI and automation", "Integrations", "Data architecture"],
  },
  {
    heading: "Launch",
    items: ["Deployment", "Quality review", "Performance pass", "Handover support"],
  },
];
