import dynamic from "next/dynamic";

const LazyParticles = dynamic(() => import("@/components/react-bits/dot-field"), {
  ssr: false,
  loading: () => null,
});

export default LazyParticles;
