import dynamic from "next/dynamic";

const LazyGlobe = dynamic(() => import("@/components/ui/3d-globe"), {
  ssr: false,
  loading: () => <div aria-hidden="true" className="h-full w-full" />,
});

export default LazyGlobe;
