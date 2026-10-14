"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Globe3DConfig, GlobeMarker } from "@/components/ui/3d-globe";
import type { ThreeDMarqueeItem } from "@/components/ui/3d-marquee";

// Keeping these imports behind independent chunks is important: Three.js and
// the React Three Fiber globe must not execute during the first mobile paint.
const ClothReel = dynamic(() => import("@/components/motion/cloth-reel"), { ssr: false });
const Globe3D = dynamic(() => import("@/components/ui/3d-globe"), { ssr: false });
const ThreeDMarquee = dynamic(
  () => import("@/components/ui/3d-marquee").then((mod) => mod.ThreeDMarquee),
  { ssr: false },
);
const DotField = dynamic(() => import("@/components/react-bits/dot-field"), { ssr: false });

function useNearViewport<T extends HTMLElement>(rootMargin = "250px 0px") {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNear(true);
        observer.disconnect();
      }
    }, { rootMargin });
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, near };
}

export function DeferredClothReel(props: {
  originSelector: string;
  targetSelector: string;
  stackSelector: string;
  src: string;
  poster: string;
}) {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const reel = document.querySelector(".reel-section");
    if (!reel) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNear(true);
        observer.disconnect();
      }
    }, { rootMargin: "260px 0px" });
    observer.observe(reel);
    return () => observer.disconnect();
  }, []);

  return near ? <ClothReel {...props} /> : null;
}

export function DeferredGlobe(props: {
  markers: GlobeMarker[];
  config: Globe3DConfig;
}) {
  const { ref, near } = useNearViewport<HTMLDivElement>("250px 0px");

  return (
    <div ref={ref} className="cubeit-globe" aria-label="Interactive CubeIT global product map">
      {near ? (
        <Globe3D {...props} className="cubeit-globe" />
      ) : (
        <div className="cubeit-globe-preview" aria-hidden="true" />
      )}
    </div>
  );
}

export function DeferredMarquee(props: {
  items: ThreeDMarqueeItem[];
  className?: string;
}) {
  const { ref, near } = useNearViewport<HTMLDivElement>("250px 0px");

  return (
    <div ref={ref} className={props.className} style={{ minHeight: 430 }}>
      {near ? <ThreeDMarquee {...props} /> : <div className="technology-marquee-preview" aria-hidden="true" />}
    </div>
  );
}

export function DeferredDotField(props: {
  dotRadius: number;
  dotSpacing: number;
  bulgeStrength: number;
  glowRadius: number;
  cursorRadius: number;
  gradientFrom: string;
  gradientTo: string;
  glowColor: string;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // A decorative fullscreen canvas should never compete with mobile LCP.
    const query = window.matchMedia("(pointer: fine) and (min-width: 901px) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return enabled ? <DotField {...props} /> : null;
}
