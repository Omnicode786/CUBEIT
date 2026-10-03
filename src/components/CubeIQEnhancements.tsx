"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowUpRight, BarChart3, BrainCircuit, MessageSquareText, Radar, Sparkles, Target } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagneticLink } from "./MagneticLink";
import { methodSteps } from "./cubeiq.data";
import styles from "./cubeiq-enhancements.module.css";

type PortalHosts = { hero: HTMLElement | null; method: HTMLElement | null };

function CubeIQHeroV2() {
  const stages = ["Attract", "Convert", "Follow up", "Learn"];
  const satellites = [
    { label: "Demand", detail: "Right audience", icon: Radar, className: styles.satelliteDemand },
    { label: "Conversion", detail: "Clear next step", icon: Target, className: styles.satelliteConvert },
    { label: "Follow-up", detail: "Fast ownership", icon: MessageSquareText, className: styles.satelliteFollow },
    { label: "Learning", detail: "Better decisions", icon: BarChart3, className: styles.satelliteLearn },
  ];

  return (
    <div className={styles.heroV2}>
      <div className={styles.heroGlowA} aria-hidden="true" />
      <div className={styles.heroGlowB} aria-hidden="true" />
      <div className={styles.heroShell}>
        <div className={styles.heroCopy}>
          <p className={styles.heroEyebrow}><Sparkles aria-hidden="true" /> CubeIQ by CubeIT</p>
          <h1>Turn attention into a<span> growth system.</span></h1>
          <p className={styles.heroLead}>CubeIQ connects positioning, campaigns, conversion, follow-up and measurement so every click has a clearer path to becoming business.</p>
          <div className={styles.heroActions}>
            <MagneticLink href="/contact?source=cubeiq" className={styles.heroPrimary}>Build your growth system <ArrowUpRight aria-hidden="true" /></MagneticLink>
            <MagneticLink href="#growth-system" className={styles.heroSecondary}>See how it works <ArrowDown aria-hidden="true" /></MagneticLink>
          </div>
          <div className={styles.heroProof} aria-label="CubeIQ system qualities">
            <span><strong>01</strong> One customer journey</span>
            <span><strong>02</strong> One measurement loop</span>
            <span><strong>03</strong> Built with CubeIT</span>
          </div>
        </div>

        <div className={styles.heroSystem} aria-label="CubeIQ connected growth operating system">
          <div className={styles.systemGrid} aria-hidden="true" />
          <div className={styles.orbitOuter} aria-hidden="true" />
          <div className={styles.orbitInner} aria-hidden="true" />
          <div className={styles.signalSweep} aria-hidden="true" />
          {satellites.map(({ label, detail, icon: Icon, className }, index) => (
            <div className={`${styles.satellite} ${className}`} key={label} style={{ "--satellite-index": index } as CSSProperties}>
              <Icon aria-hidden="true" /><div><strong>{label}</strong><span>{detail}</span></div>
            </div>
          ))}
          <div className={styles.core}>
            <div className={styles.coreMark}><Image src="/brand/cubeit-logo.png" alt="" width={92} height={92} aria-hidden="true" /></div>
            <span>CubeIQ Growth OS</span><strong>Signal → Decision → Action</strong><small>Connected by CubeIT infrastructure</small>
          </div>
          <div className={styles.flowRail} aria-hidden="true">{stages.map((stage, index) => <span key={stage}><i>{String(index + 1).padStart(2, "0")}</i>{stage}</span>)}</div>
          <div className={styles.heroSystemBadge} aria-hidden="true"><BrainCircuit /><span>Live learning loop</span></div>
        </div>
      </div>
    </div>
  );
}

function setStaticState(root: HTMLElement) {
  root.dataset.motion = "reduced";
  root.style.setProperty("--engine-progress", "1");
  root.querySelectorAll<HTMLElement>("[data-engine-step], [data-bridge-step], [data-difference-item], [data-platform-card]").forEach((node) => node.setAttribute("data-active", ""));
  root.querySelectorAll<SVGPathElement>("[data-engine-path], [data-relationship-path], [data-draw-path]").forEach((path) => {
    path.style.strokeDasharray = "none";
    path.style.strokeDashoffset = "0";
  });
  root.querySelector<HTMLElement>("[data-system-track]")?.style.setProperty("--track-progress", "1");
  root.querySelector<HTMLElement>("[data-bridge]")?.style.setProperty("--bridge-progress", "1");
  const platform = root.querySelector<HTMLElement>("[data-platform-section]");
  platform?.style.setProperty("--platform-main", "1");
  platform?.style.setProperty("--platform-branch", "1");
  platform?.style.setProperty("--platform-drop", "1");
  root.querySelector<HTMLElement>("[data-relationship]")?.style.setProperty("--relationship-progress", "1");
}

function installAudienceTabs(root: HTMLElement): () => void {
  const tablist = root.querySelector<HTMLElement>('[role="tablist"]');
  const panel = root.querySelector<HTMLElement>('[role="tabpanel"]');
  if (!tablist || !panel) return () => {};
  const tabs = Array.from(tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  panel.id = "cubeiq-audience-panel";
  panel.tabIndex = 0;

  const sync = () => {
    tabs.forEach((tab, index) => {
      tab.id = `cubeiq-audience-tab-${index}`;
      tab.setAttribute("aria-controls", panel.id);
      tab.tabIndex = tab.getAttribute("aria-selected") === "true" ? 0 : -1;
    });
    const selected = tabs.find((tab) => tab.getAttribute("aria-selected") === "true");
    if (selected) panel.setAttribute("aria-labelledby", selected.id);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (current < 0) return;
    event.preventDefault();
    let next = current;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (current + 1) % tabs.length;
    else next = (current - 1 + tabs.length) % tabs.length;
    tabs[next].focus();
    tabs[next].click();
    requestAnimationFrame(sync);
  };

  sync();
  tablist.addEventListener("keydown", onKeyDown);
  const observer = new MutationObserver(sync);
  tabs.forEach((tab) => observer.observe(tab, { attributes: true, attributeFilter: ["aria-selected"] }));
  return () => {
    observer.disconnect();
    tablist.removeEventListener("keydown", onKeyDown);
  };
}

function installMotion(root: HTMLElement): () => void {
  gsap.registerPlugin(ScrollTrigger);

  // The base page mounts its own triggers first. Remove those once, then own a
  // single optimized motion lifecycle for CubeIQ.
  ScrollTrigger.getAll().forEach((trigger) => {
    const target = trigger.trigger;
    if (target instanceof Element && root.contains(target)) trigger.kill(true);
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setStaticState(root);
    return () => {};
  }
  delete root.dataset.motion;

  const mm = gsap.matchMedia();
  mm.add(
    {
      desktop: "(min-width: 901px)",
      compact: "(max-width: 900px)",
    },
    (context) => {
      const desktop = Boolean(context.conditions?.desktop);
      const animations: gsap.core.Animation[] = [];

      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
        animations.push(gsap.fromTo(element, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.68, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 90%", once: true } }));
      });

      root.querySelectorAll<HTMLElement>("[data-cubeiq-split]").forEach((element) => {
        const parts = element.querySelectorAll<HTMLElement>(".cubeiq-split-part");
        animations.push(gsap.fromTo(parts, { yPercent: 102, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.76, stagger: 0.03, ease: "power4.out", scrollTrigger: { trigger: element, start: "top 90%", once: true } }));
      });

      root.querySelectorAll<SVGPathElement>("[data-draw-path]").forEach((path) => {
        if (path.closest("[data-engine-section]")) return;
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        animations.push(gsap.to(path, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: path.closest("section") ?? path, start: "top 82%", end: "bottom 48%", scrub: 0.5 } }));
      });

      const systemTrack = root.querySelector<HTMLElement>("[data-system-track]");
      if (systemTrack) {
        animations.push(gsap.fromTo(systemTrack, { "--track-progress": 0 }, {
          "--track-progress": 1,
          ease: "none",
          scrollTrigger: { trigger: systemTrack, start: "top 82%", end: "bottom 44%", scrub: 0.5 },
        }));
      }

      const engine = root.querySelector<HTMLElement>("[data-engine-section]");
      const enginePin = root.querySelector<HTMLElement>("[data-engine-pin]");
      const enginePaths = Array.from(root.querySelectorAll<SVGPathElement>("[data-engine-path]"));
      const engineWords = Array.from(root.querySelectorAll<HTMLElement>("[data-engine-word]"));
      const engineSteps = Array.from(root.querySelectorAll<HTMLElement>("[data-engine-step]"));
      let engineActive = -1;

      enginePaths.forEach((path) => {
        const length = path.getTotalLength();
        path.dataset.pathLength = String(length);
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      const setEngine = (progress: number) => {
        root.style.setProperty("--engine-progress", String(progress));
        enginePaths.forEach((path) => gsap.set(path, { strokeDashoffset: Number(path.dataset.pathLength || 0) * (1 - progress) }));
        const active = Math.min(engineSteps.length - 1, Math.max(0, Math.floor(progress * engineSteps.length)));
        if (active !== engineActive) {
          engineActive = active;
          root.style.setProperty("--engine-index", String(active));
          engineSteps.forEach((node, index) => node.toggleAttribute("data-active", index === active));
          engineWords.forEach((node, index) => node.toggleAttribute("data-active", index === active));
        }
      };

      if (engine && enginePin && engineSteps.length && desktop) {
        setEngine(0);
        ScrollTrigger.create({
          trigger: engine,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 5.2, engineSteps.length * 390)}`,
          pin: enginePin,
          pinSpacing: true,
          scrub: 0.52,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 4,
          onUpdate: ({ progress }) => setEngine(progress),
          onLeave: () => setEngine(1),
          onEnterBack: ({ progress }) => setEngine(progress),
        });
      } else if (engine) {
        root.style.setProperty("--engine-progress", "1");
        engineSteps.forEach((node) => node.setAttribute("data-active", ""));
        engineWords.forEach((node) => node.removeAttribute("data-active"));
        enginePaths.forEach((path) => gsap.set(path, { strokeDashoffset: 0 }));
      }

      const bridge = root.querySelector<HTMLElement>("[data-bridge]");
      const bridgePin = root.querySelector<HTMLElement>("[data-bridge-pin]");
      const bridgeSteps = Array.from(root.querySelectorAll<HTMLElement>("[data-bridge-step]"));
      const differenceItems = Array.from(root.querySelectorAll<HTMLElement>("[data-difference-item]"));
      let bridgeActive = -1;

      const setBridge = (progress: number) => {
        bridge?.style.setProperty("--bridge-progress", String(progress));
        const active = Math.min(differenceItems.length - 1, Math.max(0, Math.floor(progress * differenceItems.length)));
        if (active !== bridgeActive) {
          bridgeActive = active;
          bridgeSteps.forEach((node, index) => node.toggleAttribute("data-active", index <= active + 1));
          differenceItems.forEach((node, index) => node.toggleAttribute("data-active", index <= active));
        }
      };

      if (bridge && bridgePin && desktop) {
        setBridge(0);
        ScrollTrigger.create({
          trigger: bridgePin,
          start: "top 11%",
          end: () => `+=${Math.max(window.innerHeight * 1.9, 1450)}`,
          pin: bridgePin,
          pinSpacing: true,
          scrub: 0.54,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 3,
          onUpdate: ({ progress }) => setBridge(progress),
          onLeave: () => setBridge(1),
          onEnterBack: ({ progress }) => setBridge(progress),
        });
      } else if (bridge) {
        setBridge(1);
        bridgeSteps.forEach((node) => node.setAttribute("data-active", ""));
        differenceItems.forEach((node) => node.setAttribute("data-active", ""));
      }

      const platform = root.querySelector<HTMLElement>("[data-platform-section]");
      const platformPin = root.querySelector<HTMLElement>("[data-platform-pin]");
      const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-platform-card]"));
      let platformCount = -1;

      const setPlatform = (progress: number) => {
        if (!platform) return;
        const clamp = (value: number) => Math.min(1, Math.max(0, value));
        platform.style.setProperty("--platform-main", String(clamp(progress / 0.2)));
        platform.style.setProperty("--platform-branch", String(clamp((progress - 0.16) / 0.42)));
        platform.style.setProperty("--platform-drop", String(clamp((progress - 0.52) / 0.38)));
        const count = Math.min(cards.length, Math.max(0, Math.round(progress * cards.length)));
        if (count !== platformCount) {
          platformCount = count;
          cards.forEach((card, index) => card.toggleAttribute("data-active", index < count));
        }
      };

      if (platform && platformPin && desktop) {
        setPlatform(0);
        ScrollTrigger.create({
          trigger: platformPin,
          start: "top 11%",
          end: () => `+=${Math.max(window.innerHeight * 2.7, 2150)}`,
          pin: platformPin,
          pinSpacing: true,
          scrub: 0.58,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 3,
          onUpdate: ({ progress }) => setPlatform(progress),
          onLeave: () => setPlatform(1),
          onEnterBack: ({ progress }) => setPlatform(progress),
        });
      } else if (platform) {
        setPlatform(1);
        cards.forEach((card) => card.setAttribute("data-active", ""));
      }

      const relationship = root.querySelector<HTMLElement>("[data-relationship]");
      const relationshipPin = root.querySelector<HTMLElement>("[data-relationship-pin]");
      const relationshipPaths = Array.from(root.querySelectorAll<SVGPathElement>("[data-relationship-path]"));
      relationshipPaths.forEach((path) => {
        const length = path.getTotalLength();
        path.dataset.pathLength = String(length);
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      const setRelationship = (progress: number) => {
        relationship?.style.setProperty("--relationship-progress", String(progress));
        relationshipPaths.forEach((path) => gsap.set(path, { strokeDashoffset: Number(path.dataset.pathLength || 0) * (1 - progress) }));
      };

      if (relationship && relationshipPin && desktop) {
        setRelationship(0);
        ScrollTrigger.create({
          trigger: relationshipPin,
          start: "top 11%",
          end: () => `+=${Math.max(window.innerHeight * 1.8, 1400)}`,
          pin: relationshipPin,
          pinSpacing: true,
          scrub: 0.58,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 2,
          onUpdate: ({ progress }) => setRelationship(progress),
          onLeave: () => setRelationship(1),
          onEnterBack: ({ progress }) => setRelationship(progress),
        });
      } else if (relationship) {
        setRelationship(1);
      }

      return () => animations.forEach((animation) => animation.kill());
    },
  );

  const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());
  if (document.fonts) void document.fonts.ready.then(() => ScrollTrigger.refresh());

  return () => {
    cancelAnimationFrame(refreshId);
    mm.revert();
    ScrollTrigger.getAll().forEach((trigger) => {
      const target = trigger.trigger;
      if (target instanceof Element && root.contains(target)) trigger.kill(true);
    });
  };
}

export default function CubeIQEnhancements() {
  const [hosts, setHosts] = useState<PortalHosts>({ hero: null, method: null });

  useEffect(() => {
    const root = document.getElementById("cubeiq-page");
    if (!root) return;

    const heroSection = root.querySelector<HTMLElement>("#home");
    let heroHost = document.getElementById("cubeiq-hero-v2-root");
    if (heroSection && !heroHost) {
      heroHost = document.createElement("div");
      heroHost.id = "cubeiq-hero-v2-root";
      heroHost.className = styles.heroHost;
      heroSection.dataset.heroV2 = "true";
      heroSection.appendChild(heroHost);
    }

    const methodSection = Array.from(root.querySelectorAll<HTMLElement>("section")).find((section) =>
      Array.from(section.querySelectorAll("p")).some((p) => p.textContent?.trim() === "How we work"),
    );
    const methodTrack = methodSection?.querySelector<HTMLElement>("article")?.parentElement ?? null;
    let methodHost = document.getElementById("cubeiq-method-extra");
    if (methodTrack) {
      methodTrack.setAttribute("data-method-track-enhanced", "");
      if (!methodHost && methodSteps.length > methodTrack.querySelectorAll(":scope > article").length) {
        methodHost = document.createElement("div");
        methodHost.id = "cubeiq-method-extra";
        methodHost.style.display = "contents";
        methodTrack.appendChild(methodHost);
      }
    }

    setHosts({ hero: heroHost, method: methodHost });
    const cleanupTabs = installAudienceTabs(root);
    let cleanupMotion: () => void = () => {};
    const frame = requestAnimationFrame(() => {
      cleanupMotion = installMotion(root);
    });

    return () => {
      cancelAnimationFrame(frame);
      cleanupTabs();
      cleanupMotion();
      heroSection?.removeAttribute("data-hero-v2");
      heroHost?.remove();
      methodHost?.remove();
      methodTrack?.removeAttribute("data-method-track-enhanced");
    };
  }, []);

  return <>
    {hosts.hero ? createPortal(<CubeIQHeroV2 />, hosts.hero) : null}
    {hosts.method ? createPortal(<>{methodSteps.slice(5).map((step) => <article key={step.number} data-reveal><span>{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}</>, hosts.method) : null}
  </>;
}
