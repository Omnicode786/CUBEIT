import dynamic from "next/dynamic";

const CubeITSite = dynamic(() => import("@/components/cubeit-site"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black" aria-label="Loading CubeIT experience" />
  ),
});

export default function CubeITSiteLoader() {
  return <CubeITSite />;
}
