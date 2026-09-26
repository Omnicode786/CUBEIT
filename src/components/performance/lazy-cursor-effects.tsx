"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const CursorFill = dynamic(
  () => import("@/components/motion/cursor-fill").then((mod) => mod.CursorFill),
  { ssr: false }
);

const KineticCursorTrail = dynamic(
  () => import("@/components/kinetic-cursor-trail"),
  { ssr: false }
);

export default function LazyCursorEffects() {
  const [enabled, setEnabled] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setEnabled(finePointer && !reducedMotion);
  }, []);

  if (!enabled) return null;

  return (
    <div ref={containerRef} className="contents">
      <CursorFill />
      <KineticCursorTrail containerRef={containerRef} />
    </div>
  );
}
