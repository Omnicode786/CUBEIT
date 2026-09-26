import dynamic from "next/dynamic";

const LazyClothReel = dynamic(() => import("@/components/motion/cloth-reel"), {
  ssr: false,
  loading: () => null,
});

export default LazyClothReel;
