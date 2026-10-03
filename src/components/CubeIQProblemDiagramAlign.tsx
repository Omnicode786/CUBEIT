"use client";

import { useEffect } from "react";

export default function CubeIQProblemDiagramAlign() {
  useEffect(() => {
    const root = document.getElementById("cubeiq-page");
    if (!root) return;

    const groups = Array.from(root.querySelectorAll<SVGGElement>("[data-system-track] svg g"));
    if (groups.length < 6) return;

    const original = groups.map((group) => ({
      display: group.style.display,
      transform: group.getAttribute("transform"),
    }));

    const visibleNodes = [
      { source: 0, x: 40, y: 210 },
      { source: 1, x: 285, y: 234 },
      { source: 2, x: 520, y: 117 },
      { source: 3, x: 760, y: 210 },
      { source: 5, x: 1160, y: 165 },
    ];

    groups.forEach((group) => {
      group.style.display = "none";
    });

    visibleNodes.forEach(({ source, x, y }) => {
      const group = groups[source];
      group.style.removeProperty("display");
      group.setAttribute("transform", `translate(${x} ${y})`);
    });

    return () => {
      groups.forEach((group, index) => {
        group.style.display = original[index].display;
        const transform = original[index].transform;
        if (transform === null) group.removeAttribute("transform");
        else group.setAttribute("transform", transform);
      });
    };
  }, []);

  return null;
}
