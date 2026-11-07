"use client";
import { useEffect } from "react";
export function SolutionReveal() {
 useEffect(() => {
  const root = document.querySelector("[data-cubeit-solution]");
  if (!root || !("IntersectionObserver" in window)) return;
  const elements = root.querySelectorAll("[data-solution-reveal]");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const observer = new IntersectionObserver((entries) => {
   for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
  }, { threshold: 0.08, rootMargin: "0px 0px 60px 0px" });
  elements.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
 },[]);
 return null;
}
