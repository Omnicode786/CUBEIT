"use client";

import { useEffect } from "react";

export default function CubeIQMethodLayoutFix() {
  useEffect(() => {
    const root = document.getElementById("cubeiq-page");
    if (!root) return;

    const methodSection = Array.from(root.querySelectorAll<HTMLElement>("section")).find((section) =>
      Array.from(section.querySelectorAll("p")).some((paragraph) => paragraph.textContent?.trim() === "How we work"),
    );
    const methodTrack = methodSection?.querySelector<HTMLElement>("article")?.parentElement ?? null;
    if (!methodTrack) return;

    methodTrack.setAttribute("data-method-track-enhanced", "");
    return () => methodTrack.removeAttribute("data-method-track-enhanced");
  }, []);

  return null;
}
