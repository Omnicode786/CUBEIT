"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Motion only enhances already visible, server-rendered content.
 * Scoped to the Solutions main region, with teardown for React StrictMode,
 * route changes and viewport/media-query changes.
 */
export function SolutionReveal() {
  useEffect(() => {
    const main = document.querySelector<HTMLElement>("main#main-content");
    if (!main) return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add(
        {
          animated: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 901px)",
          compact: "(max-width: 900px)",
        },
        ({ conditions }) => {
          if (!conditions?.animated) return;

          const compact = Boolean(conditions.compact);
          const distance = compact ? 22 : 44;
          const duration = compact ? 0.68 : 0.98;
          const ease = "power3.out";

          const hero = main.querySelector<HTMLElement>("[data-motion-hero]");
          if (hero) {
            // Hero arrives as one designed sequence. CSS and DOM remain readable
            // before GSAP initializes, including for crawlers and JS-disabled users.
            const headline = hero.querySelector("h1");
            const intro = hero.querySelector("p");
            const crumb = hero.querySelector("[aria-label='Breadcrumb']");
            const kicker = hero.querySelector("[data-motion-kicker]");
            const buttons = hero.querySelectorAll("[data-motion-action]");
            const index = hero.querySelector("[data-motion-index]");
            const art = hero.querySelector("[data-motion-art]");

            const timeline = gsap.timeline({ defaults: { ease }, delay: 0.08 });
            const prelude = [crumb, kicker].filter(Boolean);
            if (prelude.length)
              timeline.fromTo(prelude, { autoAlpha: 0, y: 17 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.10 });
            if (headline) timeline.fromTo(headline,
              { autoAlpha: 0, y: compact ? 28 : 60, rotateX: compact ? 0 : -5, transformOrigin: "50% 100%" },
              { autoAlpha: 1, y: 0, rotateX: 0, duration: compact ? 0.86 : 1.28 }, prelude.length ? "-=0.26" : 0);
            if (intro) timeline.fromTo(intro, { autoAlpha: 0, y: 20 },
              { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.62");
            if (buttons.length) timeline.fromTo(buttons, { autoAlpha: 0, y: 20 },
              { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.11, clearProps: "transform" }, "-=0.45");
            if (index) timeline.fromTo(index, { autoAlpha: 0, x: 14 },
              { autoAlpha: 1, x: 0, duration: 0.65 }, "-=0.38");
            if (art) timeline.fromTo(art,
              { autoAlpha: 0, scale: compact ? 0.95 : 0.89, y: 26 },
              { autoAlpha: 1, scale: 1, y: 0, duration: 1.3, clearProps: "transform" }, 0.18);

            // Restrict scroll-linked depth to desktop. Transform only decorative
            // elements; no pinning, layout shifts or heavyweight scroll listeners.
            if (conditions.desktop) {
              const artLayer = hero.querySelector<HTMLElement>("[data-motion-depth]");
              if (artLayer) {
                gsap.fromTo(artLayer, { yPercent: -4 }, {
                  yPercent: 9, ease: "none",
                  scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 1.1, invalidateOnRefresh: true },
                });
              }
            }
          }

          // Each section's eyebrow, heading and supporting paragraph reads as a
          // single composition. Individual elements do not fight each other.
          main.querySelectorAll<HTMLElement>("[data-motion-section]").forEach((section) => {
            const heading = section.querySelector<HTMLElement>("h2");
            const eyebrow = section.querySelector<HTMLElement>("[data-motion-kicker]");
            const headingWrap = heading?.parentElement ?? section;
            const description = headingWrap.parentElement?.querySelector<HTMLElement>("p");
            const parts = [eyebrow, heading, description].filter(Boolean);
            if (!parts.length) return;
            gsap.fromTo(parts,
              { autoAlpha: 0, y: distance },
              {
                autoAlpha: 1, y: 0, stagger: compact ? 0.075 : 0.13,
                duration, ease, clearProps: "transform,opacity,visibility",
                scrollTrigger: {
                  trigger: section, start: compact ? "top 92%" : "top 84%",
                  once: true, invalidateOnRefresh: true,
                },
              }
            );
          });

          // Staggers are scoped to their own grid/row. On mobile the travel
          // distance and stagger are deliberately smaller for responsive feel.
          main.querySelectorAll<HTMLElement>("[data-motion-group]").forEach((group) => {
            const items = gsap.utils.toArray<HTMLElement>(group.querySelectorAll("[data-motion-item]"));
            if (!items.length) return;
            gsap.fromTo(items,
              { autoAlpha: 0, y: compact ? 24 : 64, scale: compact ? 0.99 : 0.965 },
              {
                autoAlpha: 1, y: 0, scale: 1, duration: compact ? 0.68 : 1.02,
                stagger: { each: compact ? 0.075 : 0.13, from: "start" },
                ease: "power3.out", clearProps: "all",
                scrollTrigger: {
                  trigger: group, start: compact ? "top 92%" : "top 86%",
                  once: true, invalidateOnRefresh: true,
                },
              }
            );
          });

          // One soft directional reveal for the major contrast sections.
          main.querySelectorAll<HTMLElement>("[data-motion-feature]").forEach((feature) => {
            const elements = [
              feature.querySelector("[data-motion-kicker]"),
              feature.querySelector("h2"),
              feature.querySelector("p"),
              feature.querySelector("[data-motion-action]"),
            ].filter(Boolean);
            gsap.fromTo(elements, { autoAlpha: 0, y: compact ? 18 : 46 },
              {
                autoAlpha: 1, y: 0, duration: compact ? 0.68 : 1.04, stagger: 0.11,
                ease, clearProps: "transform,opacity,visibility",
                scrollTrigger: {
                  trigger: feature, start: compact ? "top 91%" : "top 82%",
                  once: true, invalidateOnRefresh: true,
                },
              });
          });

          return () => {
            // matchMedia automatically reverts this media-specific context.
          };
        }
      );
    }, main);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return null;
}
