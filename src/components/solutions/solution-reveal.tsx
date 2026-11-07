"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Art-directed experiences for /solutions and /solutions/[slug].
 *
 * Content is server-rendered and remains legible with JS disabled. The story
 * rail and sticky process exist in normal document flow before enhancement.
 * All GSAP instances and event listeners are scoped and reverted on unmount,
 * viewport breakpoints and reduced-motion preference changes.
 */
export function SolutionReveal() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("main#main-content");
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          wide: "(min-width: 901px)",
          hover: "(hover: hover) and (pointer: fine)",
          narrow: "(max-width: 900px)",
        },
        (media) => {
          const { motion, wide, hover, narrow } = media.conditions ?? {};
          if (!motion) return;
          const localCleanups: Array<() => void> = [];
          const scope = <T extends Element = HTMLElement>(selector: string) => root.querySelector<T>(selector);
          const all = <T extends Element = HTMLElement>(selector: string) => Array.from(root.querySelectorAll<T>(selector));

          // 01 — HERO: a typographic mask reveal that becomes an editorial
          // zoom into the designed product artifact, rather than fade-up cards.
          const hero = scope<HTMLElement>("[data-motion-hero]");
          if (hero) {
            const kicker = hero.querySelector("[data-motion-kicker]");
            const breadcrumb = hero.querySelector("[aria-label='Breadcrumb']");
            const heading = hero.querySelector("h1");
            const lead = hero.querySelector("p");
            const actions = hero.querySelectorAll("[data-motion-action]");
            const scene = hero.querySelector<HTMLElement>("[data-motion-art] [data-artifact-root]");
            const grid = hero.querySelector<HTMLElement>("[data-motion-depth]");
            const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.12 });
            if (breadcrumb) tl.fromTo(breadcrumb,{ y: 15, opacity: 0 },{ y: 0, opacity: 1, duration: 0.65 });
            if (kicker) tl.fromTo(kicker,{ y: 12, opacity: 0 },{ y: 0, opacity: 1, duration: 0.72 }, 0.12);
            if (heading) tl.fromTo(heading,
              { clipPath:"inset(0 0 100% 0)", y: wide ? 34 : 14, rotateX: wide ? -8 : 0, transformPerspective: 900 },
              { clipPath:"inset(0 0 0% 0)", y:0, rotateX:0, duration:1.3, clearProps:"transform,clipPath" },
              0.18);
            if (lead) tl.fromTo(lead,{ opacity:0, y:16 },{ opacity:1,y:0,duration:.75 },0.77);
            if (actions.length) tl.fromTo(actions,{opacity:0,scale:.93},
              {opacity:1,scale:1,duration:.75,stagger:.12,clearProps:"transform"},.9);
            if (scene) {
              tl.fromTo(scene,
                {clipPath:"inset(24% 18% round 32px)",rotationY:wide?-14:0,rotationX:wide?8:0,scale:.88,transformPerspective:1100},
                {clipPath:"inset(0% 0% round 25px)",rotationY:0,rotationX:0,scale:1,duration:1.5,clearProps:"transform,clipPath"},
                .23);
            }
            if (grid && wide) gsap.to(grid,{yPercent:10,scale:1.08,ease:"none",
              scrollTrigger:{trigger:hero,start:"top top",end:"bottom top",scrub:1.3,invalidateOnRefresh:true}});
          }

          // 02 — SERVICE OBJECTS: each artifact communicates a different
          // interaction model: an art-directed website, a store, a dashboard
          // with growing metrics, and an AI pathway that draws itself.
          all<HTMLElement>("[data-artifact-root]").forEach((artifact) => {
            const inRail = artifact.closest("[data-story-rail]") !== null;
            const inHero = artifact.closest("[data-motion-hero]") !== null;
            const trigger = inRail ? artifact.closest("[data-rail-panel]") : artifact;
            if (!trigger) return;

            const path = artifact.querySelector<SVGPathElement>("[data-artifact-path]");
            if (path) {
              const len = path.getTotalLength();
              gsap.fromTo(path,{strokeDasharray:len,strokeDashoffset:len},
                {strokeDashoffset:0,duration:2.4,ease:"power2.inOut",
                  scrollTrigger:{trigger,start:inHero?"top 84%":"top 88%",once:true},
                  clearProps:"strokeDasharray,strokeDashoffset"});
            }
            const chart = Array.from(artifact.querySelectorAll<HTMLElement>("[data-chart-bar]"));
            if (chart.length) gsap.fromTo(chart,{scaleY:.1,transformOrigin:"bottom"},
              {scaleY:1,duration:1.2,stagger:.07,ease:"elastic.out(1,.65)",
                scrollTrigger:{trigger,start:"top 85%",once:true},clearProps:"transform"});
          });

          // 03 — HORIZONTAL CINEMATIC GALLERY. Its position is controlled
          // by scroll progress, and its visual progress indicator is tied to
          // the exact same ScrollTrigger, not a fake timer or loop.
          const rail = scope<HTMLElement>("[data-story-rail]");
          const viewport = rail?.querySelector<HTMLElement>("[data-rail-viewport]");
          const track = rail?.querySelector<HTMLElement>("[data-rail-track]");
          const progress = rail?.querySelector<HTMLElement>("[data-rail-progress]");
          if (rail && viewport && track && wide) {
            const getDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
            if (getDistance() > 20) {
              rail.dataset.railReady = "true";
              const tween = gsap.to(track,{
                x: () => -getDistance(),
                ease:"none",
                scrollTrigger:{
                  trigger:viewport,start:"top top",
                  end:()=>"+="+Math.max(1,getDistance()),
                  pin:true,pinSpacing:true,anticipatePin:1,
                  scrub:1.05,invalidateOnRefresh:true,
                  onUpdate:(self)=>{if(progress)gsap.set(progress,{scaleX:self.progress});},
                },
              });
              localCleanups.push(()=>{tween.kill();rail.removeAttribute("data-rail-ready");});
            }
          }

          // 04 — SCROLL-DRIVEN DELIVERY JOURNEY. The left visual stays in
          // the viewport while the right-hand decisions become active. The
          // number, label and progress correspond to the visible stage.
          const journey = scope<HTMLElement>("[data-journey]");
          if (journey) {
            const steps = Array.from(journey.querySelectorAll<HTMLElement>("[data-journey-step]"));
            const number = journey.querySelector<HTMLElement>("[data-journey-number]");
            const label = journey.querySelector<HTMLElement>("[data-journey-label]");
            const fill = journey.querySelector<HTMLElement>("[data-journey-progress]");
            const visual = journey.querySelector<HTMLElement>("[data-journey-visual]");
            let current = -1;

            const activate = (i:number) => {
              if (i === current || i < 0 || i >= steps.length) return;
              current = i;
              steps.forEach((step,index)=>step.dataset.active=String(index===i));
              const nextNo = String(i+1).padStart(2,"0");
              const nextTitle = steps[i].querySelector("h3")?.textContent ?? "";
              if (number) {
                gsap.killTweensOf(number);
                gsap.to(number,{y:-16,opacity:0,duration:.2,ease:"power2.in",onComplete:()=>{
                  number.textContent=nextNo;
                  gsap.fromTo(number,{y:22,opacity:0,rotationX:15},
                    {y:0,opacity:1,rotationX:0,duration:.62,ease:"expo.out"});
                }});
              }
              if(label){
                gsap.killTweensOf(label);
                gsap.to(label,{opacity:0,y:-7,duration:.16,onComplete:()=>{
                  label.textContent=nextTitle;
                  gsap.fromTo(label,{opacity:0,y:9},{opacity:1,y:0,duration:.45,ease:"power3.out"});
                }});
              }
              if(visual)gsap.fromTo(visual,{backgroundPosition:"45% 38%"},{backgroundPosition:"55% 52%",duration:1.25,ease:"sine.out"});
            };
            // Clear static first-step styling only when GSAP controls it.
            activate(0);
            steps.forEach((step,i)=>{
              ScrollTrigger.create({
                trigger:step,start:narrow?"top 64%":"top 59%",
                end:narrow?"bottom 64%":"bottom 59%",
                onEnter:()=>activate(i),
                onEnterBack:()=>activate(i),
              });
            });
            if(fill && steps.length){
              gsap.fromTo(fill,{scaleX:0},{scaleX:1,ease:"none",
                scrollTrigger:{trigger:steps[0],start:"top 62%",
                  endTrigger:steps[steps.length-1],end:"bottom 52%",scrub:.65}});
            }
          }

          // 05 — EDITORIAL CONTRAST TRANSITIONS. The panel itself opens
          // from a restrained inset aperture while its content settles.
          all<HTMLElement>("[data-motion-feature]").forEach((section)=>{
            // The end card is naturally full-bleed; avoid clipping its CTA.
            if (section.matches("[class*='editorialBand']")) {
              gsap.fromTo(section,{clipPath:"inset(7% 4% round 42px)",scale:.96},
                {clipPath:"inset(0% 0% round 38px)",scale:1,ease:"none",
                  scrollTrigger:{trigger:section,start:"top 92%",end:"top 20%",scrub:.8},
                  clearProps:"clipPath,transform"});
            } else {
              const head=section.querySelector("h2");
              if(head)gsap.fromTo(head,{clipPath:"inset(0 100% 0 0)"},
                {clipPath:"inset(0 0% 0 0)",duration:1.25,ease:"expo.out",
                  scrollTrigger:{trigger:section,start:"top 78%",once:true},clearProps:"clipPath"});
            }
          });

          // 06 — SCENE POINTER DEPTH. A subtle desktop-only response
          // applied to the interface object, not the layout's text/links.
          if (hover && wide) {
            const art=scope<HTMLElement>("[data-motion-hero] [data-motion-art] [data-artifact-root]");
            const container=art?.parentElement;
            if(art && container){
              const qx=gsap.quickTo(art,"rotationX",{duration:.8,ease:"power3.out"});
              const qy=gsap.quickTo(art,"rotationY",{duration:.8,ease:"power3.out"});
              const move=(event:PointerEvent)=>{
                const box=container.getBoundingClientRect();
                const x=(event.clientX-box.left)/box.width-.5;
                const y=(event.clientY-box.top)/box.height-.5;
                qx(-y*7);qy(x*9);
              };
              const reset=()=>{qx(0);qy(0);};
              container.addEventListener("pointermove",move,{passive:true});
              container.addEventListener("pointerleave",reset);
              localCleanups.push(()=>{
                container.removeEventListener("pointermove",move);
                container.removeEventListener("pointerleave",reset);
                reset();
              });
            }
          }

          // No blanket fade/opacity animations. Pages must work without
          // these effects and remain readable to keyboard/crawler users.
          return ()=>{localCleanups.forEach(fn=>fn());};
        }
      );
    },root);

    // Fonts can alter the gallery width, which affects the pin distance.
    document.fonts?.ready.then(()=>ScrollTrigger.refresh()).catch(()=>{});
    return ()=>ctx.revert();
  },[]);
  return null;
}
