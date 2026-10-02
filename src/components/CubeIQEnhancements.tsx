"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useState, type CSSProperties } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  MessageSquareText,
  Radar,
  Sparkles,
  Target,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagneticLink } from "./MagneticLink";
import { methodSteps } from "./cubeiq.data";
import styles from "./cubeiq-enhancements.module.css";

type PortalHosts = {
  hero: HTMLElement | null;
  method: HTMLElement | null;
};

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
          <h1>
            Turn attention into a
            <span> growth system.</span>
          </h1>
          <p className={styles.heroLead}>
            CubeIQ connects positioning, campaigns, conversion, follow-up and measurement so every click has a clearer path to becoming business.
          </p>
          <div className={styles.heroActions}>
            <MagneticLink href="/contact?source=cubeiq" className={styles.heroPrimary}>
              Build your growth system <ArrowUpRight aria-hidden="true" />
            </MagneticLink>
            <MagneticLink href="#growth-system" className={styles.heroSecondary}>
              See how it works <ArrowDown aria-hidden="true" />
            </MagneticLink>
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
              <Icon aria-hidden="true" />
              <div><strong>{label}</strong><span>{detail}</span></div>
            </div>
          ))}

          <div className={styles.core}>
            <div className={styles.coreMark}>
              <Image src="/brand/cubeit-logo.png" alt="" width={92} height={92} aria-hidden="true" />
            </div>
            <span>CubeIQ Growth OS</span>
            <strong>Signal → Decision → Action</strong>
            <small>Connected by CubeIT infrastructure</small>
          </div>

          <div className={styles.flowRail} aria-hidden="true">
            {stages.map((stage, index) => (
              <span key={stage}><i>{String(index + 1).padStart(2, "0")}</i>{stage}</span>
            ))}
          </div>

          <div className={styles.heroSystemBadge} aria-hidden="true">
            <BrainCircuit /> <span>Live learning loop</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function activateStaticState(root: HTMLElement) {
  root.dataset.motion = "reduced";
  root.style.setProperty("--engine-progress", "1");
  root.querySelectorAll<HTMLElement>("[data-engine-step], [data-engine-word], [data-bridge-step], [data-difference-item], [data-platform-card]")
    .forEach((node) => node.setAttribute("data-active", ""));

  const bridge = root.querySelector<HTMLElement>("[data-bridge]");
  const platform = root.querySelector<HTMLElement>("[data-platform-section]");
  const relationship = root.querySelector<HTMLElement>("[data-relationship]");
  bridge?.style.setProperty("--bridge-progress", "1");
  platform?.style.setProperty("--platform-main", "1");
  platform?.style.setProperty("--platform-branch", "1");
  platform?.style.setProperty("--platform-drop", "1");
  relationship?.style.setProperty("--relationship-progress", "1");

  root.querySelectorAll<SVGPathElement>("[data-engine-path], [data-relationship-path], [data-draw-path]")
    .forEach((path) => {
      path.style.strokeDasharray = "none";
      path.style.strokeDashoffset = "0";
    });
  root.querySelectorAll<HTMLElement>("[data-reveal], .cubeiq-split-part").forEach((node) => {
    node.style.opacity = "1";
    node.style.transform = "none";
  });
}

function installAudienceTabs(root: HTMLElement) {
  const tablist = root.querySelector<HTMLElement>('[role="tablist"]');
  if (!tablist) return () => undefined;
  const tabs = Array.from(tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const panel = root.querySelector<HTMLElement>('[role="tabpanel"]');
  if (!tabs.length || !panel) return () => undefined;

  const panelId = "cubeiq-audience-panel";
  panel.id = panelId;
  panel.tabIndex = 0;

  const sync = () => {
    tabs.forEach((tab, index) => {
      tab.id = `cubeiq-audience-tab-${index}`;
      tab.setAttribute("aria-controls", panelId);
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

function rebuildCubeIQMotion(root: HTMLElement) {
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.getAll().forEach((trigger) => {
    const element = trigger.trigger;
    if (element instanceof Element && root.contains(element)) trigger.kill(true);
  });

  root.querySelectorAll<HTMLElement>("[data-reveal], .cubeiq-split-part").forEach((node) => {
    gsap.set(node, { clearProps: "transform,opacity" });
  });

  const mm = gsap.matchMedia();
  mm.add(
    {
      desktop: "(min-width: 901px)",
      reduce: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      const { desktop, reduce } = context.conditions as { desktop: boolean; reduce: boolean };
      if (reduce) {
        activateStaticState(root);
        return;
      }

      delete root.dataset.motion;
      const cleanupTweens: gsap.core.Animation[] = [];
      const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
      const range = (value: number, start: number, end: number) => clamp01((value - start) / (end - start));

      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
        cleanupTweens.push(gsap.fromTo(element, { y: 24, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.72,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        }));
      });

      root.querySelectorAll<HTMLElement>("[data-cubeiq-split]").forEach((element) => {
        const parts = element.querySelectorAll<HTMLElement>(".cubeiq-split-part");
        cleanupTweens.push(gsap.fromTo(parts, { yPercent: 104, opacity: 0 }, {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.035,
          ease: "power4.out",
          scrollTrigger: { trigger: element, start: "top 90%", once: true },
        }));
      });

      const genericPaths = Array.from(root.querySelectorAll<SVGPathElement>("[data-draw-path]")).filter((path) => !path.closest("[data-engine-section]"));
      genericPaths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        cleanupTweens.push(gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: path.closest("section") ?? path, start: "top 80%", end: "bottom 44%", scrub: 0.65 },
        }));
      });

      const systemTrack = root.querySelector<HTMLElement>("[data-system-track]");
      if (systemTrack) {
        cleanupTweens.push(gsap.fromTo(systemTrack, { "--track-progress": 0 }, {
          "--track-progress": 1,
          ease: "none",
          scrollTrigger: { trigger: systemTrack, start: "top 82%", end: "bottom 40%", scrub: 0.7 },
        }));
      }

      const engine = root.querySelector<HTMLElement>("[data-engine-section]");
      const enginePin = root.querySelector<HTMLElement>("[data-engine-pin]");
      const enginePaths = Array.from(root.querySelectorAll<SVGPathElement>("[data-engine-path]"));
      const engineWords = Array.from(root.querySelectorAll<HTMLElement>("[data-engine-word]"));
      const engineSteps = Array.from(root.querySelectorAll<HTMLElement>("[data-engine-step]"));
      enginePaths.forEach((path) => {
        const length = path.getTotalLength();
        path.dataset.pathLength = String(length);
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      const setEngine = (progress: number) => {
        root.style.setProperty("--engine-progress", String(progress));
        enginePaths.forEach((path) => {
          const length = Number(path.dataset.pathLength || 0);
          gsap.set(path, { strokeDashoffset: length * (1 - progress) });
        });
        const active = Math.max(0, Math.min(engineSteps.length - 1, Math.floor(progress * engineSteps.length)));
        engineSteps.forEach((node, index) => node.toggleAttribute("data-active", index === active));
        engineWords.forEach((node, index) => node.toggleAttribute("data-active", index === active));
      };

      if (desktop && engine && enginePin && engineSteps.length) {
        setEngine(0);
        ScrollTrigger.create({
          trigger: engine,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 5.4, engineSteps.length * 430)}`,
          pin: enginePin,
          pinSpacing: true,
          scrub: 0.65,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => setEngine(self.progress),
          onLeave: () => setEngine(1),
          onEnterBack: (self) => setEngine(self.progress),
        });
      } else {
        setEngine(1);
        engineSteps.forEach((node) => node.setAttribute("data-active", ""));
        engineWords.forEach((node) => node.removeAttribute("data-active"));
      }

      const bridge = root.querySelector<HTMLElement>("[data-bridge]");
      const bridgePin = root.querySelector<HTMLElement>("[data-bridge-pin]");
      const bridgeSteps = Array.from(root.querySelectorAll<HTMLElement>("[data-bridge-step]"));
      const differenceItems = Array.from(root.querySelectorAll<HTMLElement>("[data-difference-item]"));
      const setBridge = (progress: number) => {
        bridge?.style.setProperty("--bridge-progress", String(progress));
        const active = Math.max(0, Math.min(bridgeSteps.length - 1, Math.floor(progress * bridgeSteps.length)));
        bridgeSteps.forEach((node, index) => node.toggleAttribute("data-active", progress >= index / Math.max(1, bridgeSteps.length) - 0.02));
        differenceItems.forEach((node, index) => node.toggleAttribute("data-active", index <= active));
      };
      if (desktop && bridge && bridgePin) {
        setBridge(0);
        ScrollTrigger.create({ trigger: bridgePin, start: "top 12%", end: "+=1700", pin: bridgePin, pinSpacing: true, scrub: 0.68, invalidateOnRefresh: true, onUpdate: (self) => setBridge(self.progress), onLeave: () => setBridge(1) });
      } else setBridge(1);

      const platform = root.querySelector<HTMLElement>("[data-platform-section]");
      const platformPin = root.querySelector<HTMLElement>("[data-platform-pin]");
      const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-platform-card]"));
      const setPlatform = (progress: number) => {
        platform?.style.setProperty("--platform-main", String(range(progress, 0.02, 0.18)));
        platform?.style.setProperty("--platform-branch", String(range(progress, 0.18, 0.58)));
        platform?.style.setProperty("--platform-drop", String(range(progress, 0.58, 0.9)));
        cards.forEach((card, index) => {
          const threshold = index < 8 ? 0.25 + index * 0.028 : 0.66 + (index - 8) * 0.028;
          card.toggleAttribute("data-active", progress >= threshold);
        });
      };
      if (desktop && platform && platformPin) {
        setPlatform(0);
        ScrollTrigger.create({ trigger: platformPin, start: "top 12%", end: "+=2400", pin: platformPin, pinSpacing: true, scrub: 0.72, invalidateOnRefresh: true, onUpdate: (self) => setPlatform(self.progress), onLeave: () => setPlatform(1) });
      } else setPlatform(1);

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
        relationshipPaths.forEach((path) => {
          const length = Number(path.dataset.pathLength || 0);
          gsap.set(path, { strokeDashoffset: length * (1 - progress) });
        });
      };
      if (desktop && relationship && relationshipPin) {
        setRelationship(0);
        ScrollTrigger.create({ trigger: relationshipPin, start: "top 12%", end: "+=1600", pin: relationshipPin, pinSpacing: true, scrub: 0.72, invalidateOnRefresh: true, onUpdate: (self) => setRelationship(self.progress), onLeave: () => setRelationship(1) });
      } else setRelationship(1);

      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => cleanupTweens.forEach((animation) => animation.kill());
    },
  );

  return () => mm.revert();
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
    if (methodTrack && !methodHost && methodSteps.length > methodTrack.querySelectorAll(":scope > article").length) {
      methodHost = document.createElement("div");
      methodHost.id = "cubeiq-method-extra";
      methodHost.style.display = "contents";
      methodTrack.appendChild(methodHost);
    }

    setHosts({ hero: heroHost, method: methodHost });
    const cleanupTabs = installAudienceTabs(root);

    let cleanupMotion: () => void = () => {};
    const frame = requestAnimationFrame(() => {
      cleanupMotion = rebuildCubeIQMotion(root);
    });

    return () => {
      cancelAnimationFrame(frame);
      cleanupTabs();
      cleanupMotion();
      heroSection?.removeAttribute("data-hero-v2");
      heroHost?.remove();
      methodHost?.remove();
    };
  }, []);

  return (
    <>
      {hosts.hero ? createPortal(<CubeIQHeroV2 />, hosts.hero) : null}
      {hosts.method ? createPortal(
        <>
          {methodSteps.slice(5).map((step) => (
            <article key={step.number} data-reveal>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </>,
        hosts.method,
      ) : null}
    </>
  );
}
