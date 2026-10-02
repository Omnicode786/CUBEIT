"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CubeITSite = dynamic(() => import("@/components/cubeit-site"), {
  ssr: false,
  loading: () => <FastCubeLoader />,
});

function FastCubeLoader() {
  return (
    <div
      className="fixed inset-0 flex min-h-screen items-center justify-center bg-black"
      aria-label="Loading CubeIT experience"
    >
      <div className="text-2xl font-semibold tracking-[0.35em] text-white animate-pulse">
        CUBEIT
      </div>
    </div>
  );
}

export default function CubeITSiteLoader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => {
      import("@/components/cubeit-site").finally(() => {
        setReady(true);
      });
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(load);
    } else {
      setTimeout(load, 1);
    }
  }, []);

  return ready ? <CubeITSite /> : <FastCubeLoader />;
}
