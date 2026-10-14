import type { Metadata } from "next";
import "./globals.css";
import "./home-overrides.css";
import { Nunito_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import LoadingScreen from "@/components/loading-screen";

const siteUrl = "https://www.cubeit.solutions";
const siteDescription =
  "CubeIT designs and engineers AI products, custom software, SaaS platforms and intelligent business workflows. Explore our solutions, portfolio and team.";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-rounded",
  display: "swap",
  axes: ["wdth"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "CubeIT",
  title: {
    default: "CubeIT | AI Products, Custom Software & SaaS Engineering",
    template: "%s | CubeIT",
  },
  description: siteDescription,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: {
    title: "CubeIT | AI Products, Custom Software & SaaS Engineering",
    description: siteDescription,
    url: siteUrl,
    siteName: "CubeIT",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CubeIT | AI Products, Custom Software & SaaS Engineering",
    description: siteDescription,
  },
  icons: {
    icon: [{ url: "/brand/cubeit-logo.png", type: "image/png" }],
    shortcut: ["/brand/cubeit-logo.png"],
    apple: ["/brand/cubeit-logo.png"],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "CubeIT",
      url: siteUrl,
      logo: `${siteUrl}/brand/cubeit-logo.png`,
      description: siteDescription,
      knowsAbout: [
        "Custom software development",
        "Artificial intelligence applications",
        "SaaS product engineering",
        "Workflow automation",
        "Enterprise software",
        "Digital product design",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "CubeIT",
      description: siteDescription,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("antialiased", nunitoSans.variable)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
