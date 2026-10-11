import CubeITSite from "@/components/cubeit-site";

// Render the actual homepage on the server so search engines, social previews,
// assistive technology and visitors all receive its headings, copy and links
// in the first HTML response. Interactive motion still hydrates on the client.
export default function Home() {
  return <CubeITSite />;
}
