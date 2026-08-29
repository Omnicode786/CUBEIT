export type TeamMemberId = "muzammil" | "soman" | "shaharyar";

export type TeamMember = {
  id: TeamMemberId;
  name: string;
  leadership: string;
  role: string;
  index: string;
  blurb: string;
  bio: string;
  approach: string;
  skills: string[];
  photo: string;
  poster: string;
  video: string;
  accent: string;
  accentSoft: string;
};

export const teamMembers: TeamMember[] = [
  {
    id: "muzammil",
    name: "Muzammil Alam",
    leadership: "CEO",
    role: "Lead Developer · Product Engineering",
    index: "01",
    blurb: "Leads CubeIT's product and engineering direction, turning early ideas into clear architecture, polished interfaces and systems that are ready to become real products.",
    bio: "Muzammil leads CubeIT from the product and engineering side. He works closest to the idea itself: deciding what should be built, how the system should behave, and how the experience should feel before those decisions become code.",
    approach: "His focus is keeping product thinking, architecture and interaction design connected. That means fewer handoff gaps, faster decisions and software where the technical foundation and the visual experience are designed as one thing.",
    skills: [
      "Next.js",
      "React",
      "TypeScript",
      "Product Architecture",
      "AI Systems",
      "Interaction Engineering",
      "GSAP",
      "APIs",
      "WebGL",
      "UX Engineering",
    ],
    photo: "https://images.pexels.com/videos/5495890/pexels-photo-5495890.jpeg?auto=compress&fit=crop&w=1200&h=1200",
    poster: "https://images.pexels.com/videos/5495890/pexels-photo-5495890.jpeg?auto=compress&fit=crop&w=1400&h=1400",
    video: "https://videos.pexels.com/video-files/5495890/5495890-hd_1080_1920_30fps.mp4",
    accent: "#1E63F4",
    accentSoft: "#8BB0FF",
  },
  {
    id: "soman",
    name: "Muhammad Soman",
    leadership: "Co-founder",
    role: "Developer · DevOps & Infrastructure",
    index: "02",
    blurb: "Works across development and the delivery layer behind CubeIT, making sure what we build can be deployed, observed, maintained and trusted after it leaves a local machine.",
    bio: "Soman sits where application development meets infrastructure. He helps turn working product code into dependable software by thinking about environments, deployment, automation, observability and the operational details that keep systems healthy.",
    approach: "His role keeps delivery inside the product conversation from the beginning instead of treating DevOps as a final step. The result is a cleaner path from development to production and a stronger foundation as products grow.",
    skills: [
      "DevOps",
      "Docker",
      "CI/CD",
      "Vercel",
      "Cloudflare",
      "Linux",
      "Observability",
      "Node.js",
      "Infrastructure",
      "Reliability",
    ],
    photo: "https://images.pexels.com/videos/18382358/black-screen-computer-laptop-dell-hacker-18382358.jpeg?auto=compress&fit=crop&w=1200&h=1200",
    poster: "https://images.pexels.com/videos/18382358/black-screen-computer-laptop-dell-hacker-18382358.jpeg?auto=compress&fit=crop&w=1400&h=1400",
    video: "https://videos.pexels.com/video-files/18382358/18382358-uhd_3840_2160_25fps.mp4",
    accent: "#5F89FF",
    accentSoft: "#A9C0FF",
  },
  {
    id: "shaharyar",
    name: "Shaharyar",
    leadership: "Co-founder",
    role: "Growth · Marketing & CubeIQ",
    index: "03",
    blurb: "Leads the growth and marketing perspective behind CubeIT and CubeIQ, connecting how products are positioned, discovered, converted and followed up after launch.",
    bio: "Shaharyar leads the growth side of CubeIT and is the driving perspective behind CubeIQ. He works on how a product is understood in the market, how the right audience reaches it, and how that attention turns into a measurable customer journey.",
    approach: "His focus is not isolated campaigns. It is the complete growth system: positioning, ads, content, funnels, conversion, CRM and follow-up working together so the product story continues after the first click.",
    skills: [
      "CubeIQ",
      "Growth Strategy",
      "Meta Ads",
      "Google Ads",
      "Content Systems",
      "Funnels",
      "CRM",
      "Analytics",
      "Brand Positioning",
      "Conversion",
    ],
    photo: "https://images.pexels.com/videos/6561559/business-office-people-teamwork-6561559.jpeg?auto=compress&fit=crop&w=1200&h=1200",
    poster: "https://images.pexels.com/videos/6561559/business-office-people-teamwork-6561559.jpeg?auto=compress&fit=crop&w=1400&h=1400",
    video: "https://videos.pexels.com/video-files/6561559/6561559-uhd_3840_2160_25fps.mp4",
    accent: "#F27D42",
    accentSoft: "#FFB78F",
  },
];

export const teamPrinciples = [
  {
    index: "01",
    label: "Build",
    owner: "Muzammil / CEO",
    role: "Product Engineering",
    title: "Product thinking stays close to the code.",
    copy: "Architecture, interaction and implementation are shaped together, so the experience does not get diluted between idea and execution.",
    skills: ["Architecture", "Interaction", "AI systems"],
    accent: "#1E63F4",
  },
  {
    index: "02",
    label: "Ship",
    owner: "Soman / Co-founder",
    role: "Development + DevOps",
    title: "Delivery is designed, not improvised.",
    copy: "Infrastructure, environments and automation are part of the product from the start, which keeps releases dependable as the system grows.",
    skills: ["Automation", "Infrastructure", "Reliability"],
    accent: "#6B9EFF",
  },
  {
    index: "03",
    label: "Grow",
    owner: "Shaharyar / Co-founder",
    role: "Growth + CubeIQ",
    title: "The product story continues after launch.",
    copy: "Positioning, acquisition, conversion and follow-up are treated as one connected growth system instead of disconnected marketing tasks.",
    skills: ["Positioning", "Acquisition", "Conversion"],
    accent: "#F27D42",
  },
] as const;
