"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { cubeitServices } from "./services-data";

export type ServicesTimelineState = {
  introProgress: number;
  storyProgress: number;
  horizontalProgress: number;
  selectorProgress: number;
  scrollVelocity: number;
  pointerX: number;
  pointerY: number;
};

type TimelineRefs = {
  introRef: RefObject<HTMLElement | null>;
  storyRef: RefObject<HTMLElement | null>;
  horizontalRef: RefObject<HTMLElement | null>;
  horizontalViewportRef: RefObject<HTMLDivElement | null>;
  horizontalTrackRef: RefObject<HTMLDivElement | null>;
  selectorRef: RefObject<HTMLElement | null>;
  reducedMotion: boolean;
};

const initialTimeline: ServicesTimelineState = {
  introProgress: 0,
  storyProgress: 0,
  horizontalProgress: 0,
  selectorProgress: 0,
  scrollVelocity: 0,
  pointerX: 0,
  pointerY: 0,
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function progressThrough(rect: DOMRect, viewportHeight: number) {
  const travel = Math.max(1, rect.height - viewportHeight);
  return clamp(-rect.top / travel);
}

function entryProgress(rect: DOMRect, viewportHeight: number) {
  return clamp((viewportHeight - rect.top) / Math.max(1, viewportHeight + rect.height * 0.35));
}

function horizontalCanvasOpacity(progress: number) {
  if (progress < 0.08) return 1;
  if (progress > 0.88) return 0.02;
  return 1 - clamp((progress - 0.08) / 0.16) * 0.98;
}

export function useServicesScrollTimeline({
  introRef,
  storyRef,
  horizontalRef,
  horizontalViewportRef,
  horizontalTrackRef,
  selectorRef,
  reducedMotion,
}: TimelineRefs) {
  const timelineRef = useRef<ServicesTimelineState>({ ...initialTimeline });
  const [horizontalHeight, setHorizontalHeight] = useState<number>(0);
  const maxTranslateRef = useRef(0);
  const horizontalHeightRef = useRef(0);

  useEffect(() => {
    let frame = 0;
    let previousScroll = window.scrollY;
    let previousTime = performance.now();

    const measure = () => {
      const section = horizontalRef.current;
      const viewport = horizontalViewportRef.current;
      const track = horizontalTrackRef.current;
      if (!section || !viewport || !track) return;

      if (reducedMotion || window.innerWidth < 900) {
        maxTranslateRef.current = 0;
        if (horizontalHeightRef.current !== 0) {
          horizontalHeightRef.current = 0;
          setHorizontalHeight(0);
        }
        section.style.removeProperty("--services-horizontal-x");
        section.style.removeProperty("--services-horizontal-progress");
        section.style.removeProperty("--services-horizontal-header-opacity");
        return;
      }

      const maxTranslate = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const nextHeight = Math.max(window.innerHeight * 1.2, maxTranslate + window.innerHeight);
      maxTranslateRef.current = maxTranslate;
      if (Math.abs(horizontalHeightRef.current - nextHeight) > 2) {
        horizontalHeightRef.current = nextHeight;
        setHorizontalHeight(nextHeight);
      }
    };

    const ro = new ResizeObserver(measure);
    [horizontalRef.current, horizontalViewportRef.current, horizontalTrackRef.current].forEach((node) => {
      if (node) ro.observe(node);
    });

    measure();
    window.addEventListener("resize", measure, { passive: true });
    document.fonts?.ready.then(measure).catch(() => undefined);

    const tick = (time: number) => {
      const viewportHeight = window.innerHeight || 1;
      const currentScroll = window.scrollY;
      const delta = Math.max(16, time - previousTime);
      const velocity = (currentScroll - previousScroll) / delta;
      const introRect = introRef.current?.getBoundingClientRect();
      const storyRect = storyRef.current?.getBoundingClientRect();
      const horizontalRect = horizontalRef.current?.getBoundingClientRect();
      const selectorRect = selectorRef.current?.getBoundingClientRect();

      timelineRef.current.introProgress = introRect ? entryProgress(introRect, viewportHeight) : 0;
      timelineRef.current.storyProgress = storyRect ? progressThrough(storyRect, viewportHeight) : 0;
      timelineRef.current.horizontalProgress = horizontalRect ? progressThrough(horizontalRect, viewportHeight) : 0;
      timelineRef.current.selectorProgress = selectorRect ? entryProgress(selectorRect, viewportHeight) : 0;
      const nextVelocity = clamp(velocity * 0.35, -1, 1);
      timelineRef.current.scrollVelocity += (nextVelocity - timelineRef.current.scrollVelocity) * 0.18;
      const selectorFadeIn = clamp((timelineRef.current.selectorProgress - 0.05) / 0.35);
      const selectorAccentOpacity = selectorFadeIn * 0.12;
      const selectorExit = selectorRect
        ? clamp(((viewportHeight * 0.94) - selectorRect.bottom) / Math.max(1, viewportHeight * 0.5))
        : 0;
      const canvasOpacity = Math.max(horizontalCanvasOpacity(timelineRef.current.horizontalProgress), selectorAccentOpacity) * (1 - selectorExit);
      document.documentElement.style.setProperty("--services-canvas-opacity", `${canvasOpacity}`);

      if (!reducedMotion && window.innerWidth >= 900 && horizontalRef.current && maxTranslateRef.current > 0) {
        const x = -maxTranslateRef.current * timelineRef.current.horizontalProgress;
        horizontalRef.current.style.setProperty("--services-horizontal-x", `${x}px`);
        horizontalRef.current.style.setProperty("--services-horizontal-progress", `${timelineRef.current.horizontalProgress}`);
        horizontalRef.current.style.setProperty("--services-horizontal-header-opacity", `${Math.max(0, 1 - timelineRef.current.horizontalProgress * 20)}`);
      }

      previousScroll = currentScroll;
      previousTime = time;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", measure);
      document.documentElement.style.removeProperty("--services-canvas-opacity");
    };
  }, [horizontalRef, horizontalTrackRef, horizontalViewportRef, introRef, reducedMotion, selectorRef, storyRef]);

  const setPointer = (x: number, y: number) => {
    timelineRef.current.pointerX = clamp(x, -1, 1);
    timelineRef.current.pointerY = clamp(y, -1, 1);
  };

  return {
    timelineRef,
    horizontalHeight,
    setPointer,
    serviceCount: cubeitServices.length,
  };
}
