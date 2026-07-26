"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleDot,
  MessageCircleMore,
  Network,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatedText } from "./AnimatedText";
import { Footer, Navbar } from "./cubeit-site";
import { MagneticLink } from "./MagneticLink";
import GrowthDiagnostic from "./GrowthDiagnostic";
import { audienceOptions, methodSteps, tools } from "./cubeiq.data";
import styles from "./cubeiq.module.css";

const difference = [
  ["Most agencies stop at attention.", "CubeIQ follows what happens after the click."],
  ["A better ad cannot fix a confusing page.", "We improve the message, page and next step together."],
  ["A lead is not growth until it is handled.", "We connect follow-up so interest has a clear owner."],
  ["Reports should create decisions.", "We show the movement that helps teams choose what to improve."],
] as const;

const capabilityCards = [
  ["Performance advertising", "Reach buyers through search, social and retargeting with a controlled testing plan."],
  ["Social and content", "Keep the brand visible, relevant and worth following."],
  ["Creative and brand design", "Make every campaign and customer touchpoint feel professional and trusted."],
  ["Search visibility", "Help people find the business when they are already looking."],
  ["Website conversion", "Improve pages so more visitors take action."],
  ["Follow-up automation", "Connect forms, CRM, WhatsApp and reminders into one response path."],
] as const;

const engineSteps = [
  ["Audience understanding", "See who the right customer is, what they care about and what is stopping them."],
  ["Strategic positioning", "Turn the business offer into a message people can understand and choose."],
  ["Creative production", "Build campaign ideas, content and visual direction around the decision we want customers to make."],
  ["Campaign launch", "Reach the right people through search, social and retargeting with a controlled testing plan."],
  ["Conversion experience", "Connect attention to a page, offer and next step that make action feel easy."],
  ["Lead capture", "Collect the information the team needs without adding friction or confusing the customer."],
  ["CRM and WhatsApp follow-up", "Route every opportunity to a clear owner and respond while intent is still warm."],
  ["Measurement", "Connect channels to meaningful customer actions so decisions are based on evidence."],
  ["Optimization", "Improve the weakest connection instead of changing everything at once."],
  ["Scalable growth", "Increase investment after the system is stable, measurable and ready."],
] as const;

function useCubeIQMotion(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      root.dataset.motion = "reduced";
      return;
    }

    const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
    const rangeProgress = (progress: number, start: number, end: number) => clamp01((progress - start) / (end - start));

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 86%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-cubeiq-split]").forEach((element) => {
        const parts = element.querySelectorAll<HTMLElement>(".cubeiq-split-part");
        gsap.fromTo(
          parts,
          { yPercent: 105, rotateX: -10, opacity: 0 },
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.04,
            ease: "power4.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          },
        );
      });

      gsap.utils.toArray<SVGPathElement>("[data-draw-path]").forEach((path) => {
        if (path.closest("[data-engine-section]")) return;
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        if (!path.hasAttribute("data-system-path")) {
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: path.closest("section") ?? path,
              start: "top 78%",
              end: "bottom 42%",
              scrub: 0.8,
            },
          });
        }
      });

      const compactViewport = window.matchMedia("(max-width: 900px)").matches;

      const engine = root.querySelector<HTMLElement>("[data-engine-section]");
      const enginePin = root.querySelector<HTMLElement>("[data-engine-pin]");
      const enginePaths = gsap.utils.toArray<SVGPathElement>("[data-engine-path]");
      const engineWords = gsap.utils.toArray<HTMLElement>("[data-engine-word]");
      const engineStepNodes = gsap.utils.toArray<HTMLElement>("[data-engine-step]");

      enginePaths.forEach((path) => {
        const length = path.getTotalLength();
        path.dataset.pathLength = String(length);
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      if (engine && enginePin && enginePaths.length && !compactViewport) {
        const setEngineState = (progress: number) => {
          root.style.setProperty("--engine-progress", String(progress));
          enginePaths.forEach((path) => {
            const length = Number(path.dataset.pathLength || 0);
            gsap.set(path, { strokeDashoffset: length * (1 - progress) });
          });
          const activeIndex = Math.min(engineStepNodes.length - 1, Math.floor(progress * engineStepNodes.length));
          engineStepNodes.forEach((step, index) => step.toggleAttribute("data-active", index === activeIndex));
          engineWords.forEach((word, index) => word.toggleAttribute("data-active", index === activeIndex));
          root.style.setProperty("--engine-index", String(activeIndex));
        };

        setEngineState(0);
        ScrollTrigger.create({
          trigger: engine,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 6.4, engineStepNodes.length * 500)}`,
          pin: enginePin,
          pinSpacing: true,
          scrub: 0.75,
          invalidateOnRefresh: true,
          refreshPriority: 3,
          onUpdate: (self) => setEngineState(self.progress),
          onLeave: () => setEngineState(1),
          onEnterBack: (self) => setEngineState(self.progress),
        });
      } else if (engine && enginePaths.length) {
        engineStepNodes.forEach((step) => step.setAttribute("data-active", ""));
        enginePaths.forEach((path) => {
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: engine,
              start: "top 78%",
              end: "bottom 45%",
              scrub: 0.7,
            },
          });
        });
      }

      const bridge = root.querySelector<HTMLElement>("[data-bridge]");
      const bridgePin = root.querySelector<HTMLElement>("[data-bridge-pin]");
      const bridgeSteps = gsap.utils.toArray<HTMLElement>("[data-bridge-step]");
      const differenceItems = gsap.utils.toArray<HTMLElement>("[data-difference-item]");
      if (bridge && bridgePin && !compactViewport) {
        const setBridgeState = (progress: number) => {
          bridge.style.setProperty("--bridge-progress", String(progress));
          const visibleIndex = Math.min(bridgeSteps.length - 1, Math.floor(progress * bridgeSteps.length));
          bridgeSteps.forEach((step, index) => step.toggleAttribute("data-active", progress >= index / bridgeSteps.length - 0.02));
          differenceItems.forEach((item, index) => item.toggleAttribute("data-active", index <= visibleIndex));
        };

        setBridgeState(0);
        ScrollTrigger.create({
          trigger: bridgePin,
          start: "top 12%",
          end: () => `+=${Math.max(window.innerHeight * 2.25, 1500)}`,
          pin: bridgePin,
          pinSpacing: true,
          scrub: 0.78,
          invalidateOnRefresh: true,
          refreshPriority: 2,
          onUpdate: (self) => setBridgeState(self.progress),
          onLeave: () => setBridgeState(1),
          onEnterBack: (self) => setBridgeState(self.progress),
        });
      } else if (bridge) {
        bridge.style.setProperty("--bridge-progress", "1");
        bridgeSteps.forEach((step) => step.setAttribute("data-active", ""));
        differenceItems.forEach((item) => item.setAttribute("data-active", ""));
      }

      const systemTrack = root.querySelector<HTMLElement>("[data-system-track]");
      if (systemTrack) {
        gsap.fromTo(
          systemTrack,
          { "--track-progress": 0 },
          {
            "--track-progress": 1,
            ease: "none",
            scrollTrigger: {
              trigger: systemTrack,
              start: "top 82%",
              end: "bottom 38%",
              scrub: 0.8,
            },
          },
        );
      }

      const platform = root.querySelector<HTMLElement>("[data-platform-section]");
      const platformPin = root.querySelector<HTMLElement>("[data-platform-pin]");
      const platformCards = gsap.utils.toArray<HTMLElement>("[data-platform-card]");
      if (platform && platformPin && !compactViewport) {
        const setPlatformState = (progress: number) => {
          platform.style.setProperty("--platform-main", String(rangeProgress(progress, 0.02, 0.18)));
          platform.style.setProperty("--platform-branch", String(rangeProgress(progress, 0.18, 0.58)));
          platform.style.setProperty("--platform-drop", String(rangeProgress(progress, 0.58, 0.9)));
          platformCards.forEach((card, index) => {
            const threshold = index < 8 ? 0.25 + index * 0.028 : 0.66 + (index - 8) * 0.028;
            card.toggleAttribute("data-active", progress >= threshold);
          });
        };

        setPlatformState(0);
        ScrollTrigger.create({
          trigger: platformPin,
          start: "top 12%",
          end: () => `+=${Math.max(window.innerHeight * 3.25, 2600)}`,
          pin: platformPin,
          pinSpacing: true,
          scrub: 0.82,
          invalidateOnRefresh: true,
          refreshPriority: 2,
          onUpdate: (self) => setPlatformState(self.progress),
          onLeave: () => setPlatformState(1),
          onEnterBack: (self) => setPlatformState(self.progress),
        });
      } else if (platform) {
        platform.style.setProperty("--platform-main", "1");
        platform.style.setProperty("--platform-branch", "1");
        platform.style.setProperty("--platform-drop", "1");
        platformCards.forEach((card) => card.setAttribute("data-active", ""));
      }

      const relationship = root.querySelector<HTMLElement>("[data-relationship]");
      const relationshipPin = root.querySelector<HTMLElement>("[data-relationship-pin]");
      const relationshipPaths = gsap.utils.toArray<SVGPathElement>("[data-relationship-path]");
      relationshipPaths.forEach((path) => {
        const length = path.getTotalLength();
        path.dataset.pathLength = String(length);
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      if (relationship && relationshipPin && !compactViewport) {
        const setRelationshipState = (progress: number) => {
          relationship.style.setProperty("--relationship-progress", String(progress));
          relationshipPaths.forEach((path) => {
            const length = Number(path.dataset.pathLength || 0);
            gsap.set(path, { strokeDashoffset: length * (1 - progress) });
          });
        };

        setRelationshipState(0);
        ScrollTrigger.create({
          trigger: relationshipPin,
          start: "top 12%",
          end: () => `+=${Math.max(window.innerHeight * 2.25, 1700)}`,
          pin: relationshipPin,
          pinSpacing: true,
          scrub: 0.85,
          invalidateOnRefresh: true,
          refreshPriority: 2,
          onUpdate: (self) => setRelationshipState(self.progress),
          onLeave: () => setRelationshipState(1),
          onEnterBack: (self) => setRelationshipState(self.progress),
        });
      } else if (relationship) {
        relationship.style.setProperty("--relationship-progress", "1");
        relationshipPaths.forEach((path) => gsap.set(path, { strokeDashoffset: 0 }));
      }

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      ScrollTrigger.refresh();
    }, root);

    return () => context.revert();
  }, [rootRef]);
}

export default function CubeIQPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeAudience, setActiveAudience] = useState(audienceOptions[0].id);
  useCubeIQMotion(rootRef);

  const audience = useMemo(
    () => audienceOptions.find((option) => option.id === activeAudience) ?? audienceOptions[0],
    [activeAudience],
  );

  const firstRowTools = tools.slice(0, 8);
  const secondRowTools = tools.slice(8, 16);

  return (
    <div id="cubeiq-page" ref={rootRef} className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <section id="home" className={styles.hero}>
          <div className={styles.heroGrid} aria-hidden="true" />
          <div className={styles.shell}>
            <div className={styles.heroLayout}>
              <div className={styles.heroCopy}>
                <p className={styles.eyebrow} data-reveal><Sparkles aria-hidden="true" /> CubeIQ by CubeIT</p>
                <AnimatedText as="h1" className={styles.heroTitle} mode="lines">
                  {"Marketing that works\nas one growth system."}
                </AnimatedText>
                <p className={styles.heroLead} data-reveal>
                  CubeIQ connects advertising, content, websites and customer follow-up so more people discover your business, trust it and take action.
                </p>
                <div className={styles.actions} data-reveal>
                  <MagneticLink href="/contact?source=cubeiq" className={styles.primaryButton}>
                    Grow with CubeIQ <ArrowUpRight aria-hidden="true" />
                  </MagneticLink>
                  <MagneticLink href="#growth-system" className={styles.secondaryButton}>
                    See the system <ArrowDown aria-hidden="true" />
                  </MagneticLink>
                </div>
              </div>

              <div className={styles.heroVisual} data-reveal aria-label="Connected growth strategy visual">
                <div className={styles.strategyVisualFrame}>
                  <div className={styles.strategyTopline}>
                    <span>Live Growth Map</span>
                    <strong>CubeIQ</strong>
                  </div>
                  <div className={styles.strategyCommandCenter}>
                    <Image src="/brand/cubeit-logo.png" alt="" width={64} height={64} aria-hidden="true" />
                    <div>
                      <span>Connected by CubeIT</span>
                      <strong>Strategy, creative, data and follow-up in one operating rhythm.</strong>
                    </div>
                  </div>
                  <div className={styles.strategySignals} aria-hidden="true">
                    {["Search intent", "Social demand", "Landing action", "CRM follow-up"].map((item, index) => (
                      <span key={item} style={{ "--strategy-index": index } as CSSProperties}>{item}</span>
                    ))}
                  </div>
                  <div className={styles.strategyMetricGrid} aria-hidden="true">
                    {[
                      ["Notice", "Audience clarity"],
                      ["Trust", "Brand signal"],
                      ["Action", "Conversion path"],
                      ["Return", "Reconnection"],
                    ].map(([label, value]) => (
                      <article key={label}>
                        <span>{label}</span>
                        <strong>{value}</strong>
                      </article>
                    ))}
                  </div>
                  <div className={styles.strategyAutomationRail} aria-hidden="true">
                    {["Ad", "Page", "Lead", "Reply", "Learn"].map((item) => <span key={item}>{item}</span>)}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.heroBar} data-reveal>
              {["Attract", "Engage", "Convert", "Reconnect", "Retain", "Scale"].map((item, index) => (
                <span key={item}><i>{String(index + 1).padStart(2, "0")}</i>{item}</span>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.problem}>
          <div className={styles.shell}>
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>The problem</p>
              <h2>Running ads is easy. Building growth is harder.</h2>
              <p>Many businesses have activity everywhere, but the customer journey between those activities is weak.</p>
            </div>

            <div className={styles.brokenSystem} data-system-track>
              <div className={styles.brokenLabels} aria-hidden="true">
                <span>Click</span><span>Visit</span><span>Enquiry</span><span>Follow-up</span><span>Customer</span>
              </div>
              <svg viewBox="0 0 1200 400" role="img" aria-label="A disconnected customer journey becoming connected">
                <path className={styles.systemGhost} d="M40 210 C180 90 265 330 405 195 S640 95 760 210 S995 320 1160 165" />
                <path data-draw-path className={styles.systemPath} d="M40 210 C180 90 265 330 405 195 S640 95 760 210 S995 320 1160 165" />
                {[40, 285, 520, 760, 980, 1160].map((x, index) => (
                  <g key={x} transform={`translate(${x} ${index % 2 === 0 ? 210 : index === 1 ? 245 : 165})`}>
                    <circle className={styles.systemNodeHalo} r="26" />
                    <circle className={styles.systemNode} r="8" />
                  </g>
                ))}
              </svg>
              <div className={styles.problemSignals}>
                {[
                  ["Ads generate clicks", "but the offer is not clear."],
                  ["Content looks active", "but gives people no next step."],
                  ["Leads arrive", "but the response comes too late."],
                  ["Reports look full", "but nobody knows what created business."],
                ].map(([title, text], index) => (
                  <article key={title} data-reveal>
                    <span>0{index + 1}</span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className={styles.problemResolution} data-reveal>
              <Network aria-hidden="true" />
              <p><strong>CubeIQ connects the journey.</strong> Growth is usually lost between tools, teams and handoffs. We make attention, action, follow-up and learning work as one path.</p>
              <Link href="#services" className={styles.inlineLink}>See connected services <ArrowRight aria-hidden="true" /></Link>
            </div>
          </div>
        </section>

        <section id="growth-system" className={styles.engine} data-engine-section>
          <div className={styles.engineSticky} data-engine-pin>
            <div className={styles.shell}>
              <div className={styles.engineHeader}>
                <p className={styles.eyebrow}>The CubeIQ growth engine</p>
                <h2>Attention enters.<br /><span>A learning system comes out.</span></h2>
              </div>
              <div className={styles.engineVisual} aria-hidden="true">
                <svg viewBox="0 0 700 700">
                  <circle className={styles.engineOrbitGhost} cx="350" cy="350" r="230" />
                  <circle data-engine-path className={styles.engineOrbit} cx="350" cy="350" r="230" />
                  <path data-engine-path className={styles.engineSpiral} d="M350 76 C572 82 635 301 510 444 C397 574 181 522 150 356 C123 211 244 154 351 207 C444 252 459 373 389 422 C333 461 257 428 249 363 C243 311 283 284 326 296" />
                  <rect x="286" y="286" width="128" height="128" rx="18" className={styles.engineCore} />
                  <path d="M305 333 L350 307 L395 333 L350 359 Z M305 333 V382 L350 409 V359 M395 333 V382 L350 409" className={styles.engineCube} />
                </svg>
                <div className={styles.engineWords}>
                  {engineSteps.map(([title], index) => (
                    <span data-engine-word key={title} style={{ "--engine-word-index": index } as CSSProperties}>{title}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.engineSteps}>
              {engineSteps.map(([title, description], index) => (
                <article key={title} data-engine-step>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className={styles.capabilities}>
          <div className={styles.shell}>
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>What CubeIQ does</p>
              <h2>Six services. One connected customer journey.</h2>
              <p>CubeIQ does not treat marketing as isolated tasks. Each service supports the next business outcome.</p>
            </div>

            <div className={styles.capabilityGrid}>
              {capabilityCards.map(([title, copy], index) => (
                <article key={title} data-reveal>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.bridge} data-bridge>
          <div className={styles.shell}>
            <div className={styles.bridgeHeader}>
              <p className={styles.eyebrow}>The CubeIQ difference</p>
              <h2>Most agencies stop at the ad. We look at what happens next.</h2>
            </div>
            <div className={styles.bridgeLayout} data-bridge-pin>
              <div className={styles.bridgeFlow} aria-hidden="true">
                {["Ad", "Page", "Enquiry", "Follow-up", "Customer"].map((item, index) => (
                  <span key={item} data-bridge-step style={{ "--bridge-index": index } as CSSProperties}>{item}</span>
                ))}
              </div>
              <div className={styles.differenceList}>
                {difference.map(([before, after]) => (
                  <article key={before} data-difference-item>
                    <p>{before}</p>
                    <ArrowRight aria-hidden="true" />
                    <strong>{after}</strong>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.relationship} data-relationship>
          <div className={styles.relationshipBackdrop} aria-hidden="true" />
          <div className={styles.shell}>
            <div className={styles.relationshipIntro}>
              <p className={styles.eyebrow}>Why CubeIT created CubeIQ</p>
              <h2 className={styles.relationshipTitle}>The engine and the momentum should know each other.</h2>
            </div>

            <div className={styles.relationshipSystem} data-relationship-pin>
              <div className={styles.relationshipSide} data-reveal>
                <span>CubeIT</span>
                <h3>Builds the digital infrastructure.</h3>
                <p>Websites, applications, CRM, automation, AI, integrations, portals and analytics infrastructure.</p>
                <div>{["System", "Experience", "Data", "Automation"].map((item) => <em key={item}>{item}</em>)}</div>
              </div>

              <div className={styles.relationshipCenter} aria-hidden="true">
                <svg viewBox="0 0 420 650">
                  <path data-relationship-path d="M210 30 V170 C210 220 120 230 120 310 C120 390 210 390 210 470 V620" />
                  <path data-relationship-path d="M210 170 C210 220 300 230 300 310 C300 390 210 390 210 470" />
                  <path d="M149 281 L210 246 L271 281 L210 317 Z M149 281 V350 L210 386 V317 M271 281 V350 L210 386" />
                </svg>
                <span>Idea</span><span>System</span><span>Attention</span><span>Lead</span><span>Customer</span><span>Scale</span>
              </div>

              <div className={styles.relationshipSide} data-reveal>
                <span>CubeIQ</span>
                <h3>Creates demand and commercial movement.</h3>
                <p>Positioning, campaigns, creative, traffic, conversion, customer acquisition, retention and growth optimization.</p>
                <div>{["Attention", "Demand", "Conversion", "Growth"].map((item) => <em key={item}>{item}</em>)}</div>
              </div>
            </div>

            <blockquote data-reveal>
              CubeIQ improves demand while CubeIT can strengthen the system behind it. <strong>That is the advantage.</strong>
            </blockquote>
          </div>
        </section>

        <section className={styles.method}>
          <div className={styles.shell}>
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>How we work</p>
              <h2>Test, learn, improve and scale what proves useful.</h2>
            </div>
            <div className={styles.methodTrack}>
              {methodSteps.slice(0, 5).map((step) => (
                <article key={step.number} data-reveal>
                  <span>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.toolsSection} data-platform-section>
          <div className={styles.shell}>
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>Connected platforms</p>
              <h2>Useful tools, connected with a clear purpose.</h2>
            </div>
            <div className={styles.platformNetwork} data-platform-pin>
              <div className={styles.platformHub}>
                <Image src="/brand/cubeit-logo.png" alt="CubeIT" width={86} height={86} priority={false} />
                <span>Central system</span>
              </div>

              <div className={styles.platformLineLayer} aria-hidden="true">
                <span className={styles.platformStem} />
                <span className={styles.platformRail} />
                {Array.from({ length: 8 }).map((_, index) => (
                  <span
                    key={`branch-${index}`}
                    className={styles.platformBranch}
                    style={{ "--platform-line-left": `${(index + 0.5) * 12.5}%` } as CSSProperties}
                  />
                ))}
                {Array.from({ length: 8 }).map((_, index) => (
                  <span
                    key={`drop-${index}`}
                    className={styles.platformDrop}
                    style={{ "--platform-line-left": `${(index + 0.5) * 12.5}%` } as CSSProperties}
                  />
                ))}
              </div>

              <div className={styles.platformRows}>
                <div className={styles.platformRow}>
                  {firstRowTools.map((tool, index) => (
                    <article key={tool.id} className={styles.platformCard} data-platform-card data-row="1" data-accent={tool.accent} style={{ "--platform-card-index": index } as CSSProperties}>
                      <Image src={tool.icon} alt="" width={34} height={34} aria-hidden="true" />
                      <span>{tool.name}</span>
                    </article>
                  ))}
                </div>
                <div className={styles.platformRow}>
                  {secondRowTools.map((tool, index) => (
                    <article key={tool.id} className={styles.platformCard} data-platform-card data-row="2" data-accent={tool.accent} style={{ "--platform-card-index": index + 8 } as CSSProperties}>
                      <Image src={tool.icon} alt="" width={34} height={34} aria-hidden="true" />
                      <span>{tool.name}</span>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.audience}>
          <div className={styles.shell}>
            <div className={styles.audienceLayout}>
              <div>
                <p className={styles.eyebrow}>Is CubeIQ relevant?</p>
                <h2>Choose the situation that sounds familiar.</h2>
              </div>
              <div className={styles.audiencePanel}>
                <div className={styles.audienceOptions} role="tablist" aria-label="Business growth situations">
                  {audienceOptions.map((option, index) => (
                    <button
                      type="button"
                      key={option.id}
                      role="tab"
                      aria-selected={activeAudience === option.id}
                      onClick={() => setActiveAudience(option.id)}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>{option.label}
                    </button>
                  ))}
                </div>
                <div className={styles.audienceResponse} role="tabpanel" key={audience.id}>
                  <CircleDot aria-hidden="true" />
                  <h3>{audience.title}</h3>
                  <p>{audience.body}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="diagnostic" className={styles.diagnosticSection}>
          <div className={styles.shell}>
            <div className={styles.diagnosticLayout}>
              <div>
                <p className={styles.eyebrow}>Start with clarity</p>
                <h2>Find the first growth gap before buying more activity.</h2>
                <p>Answer four simple questions. The summary gives your team a useful starting direction and carries the context into the CubeIT contact flow.</p>
              </div>
              <GrowthDiagnostic />
            </div>
          </div>
        </section>

        <section className={styles.finalCta}>
          <div className={styles.shell}>
            <div className={styles.finalPanel} data-reveal>
              <div>
                <p className={styles.eyebrow}>Build your growth system</p>
                <h2>You do not need more disconnected marketing.</h2>
                <p>Tell us where your business is today. CubeIQ will help identify what should happen next.</p>
              </div>
              <div className={styles.finalActions}>
                <MagneticLink href="/contact?source=cubeiq-final" className={styles.primaryButton}>
                  Build your growth system <ArrowUpRight aria-hidden="true" />
                </MagneticLink>
                <Link href="/contact?source=cubeiq-conversation" className={styles.textLink}>
                  Talk to CubeIQ <MessageCircleMore aria-hidden="true" />
                </Link>
              </div>
              <div className={styles.finalSeal} aria-hidden="true">
                <Target /><Zap /><Check />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
