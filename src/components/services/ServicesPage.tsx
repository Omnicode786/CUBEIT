"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { ArrowRight, ArrowUpRight, CheckCircle2, MoveRight, Sparkles } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { CursorFill } from "@/components/motion/cursor-fill";
import { Footer, Navbar } from "@/components/cubeit-site";
import { cubeitServices, deliveryMatrix, servicePrinciples, type CubeITService } from "./services-data";
import { useServicesScrollTimeline } from "./useServicesScrollTimeline";
import styles from "./services.module.css";

const ServicesCanvas = dynamic(() => import("./ServicesCanvas"), {
  ssr: false,
});

type HorizontalPanel =
  | { type: "visual"; service: CubeITService; image: string }
  | { type: "major"; service: CubeITService }
  | { type: "narrow"; service: CubeITService };

const ctaLogos = [
  { name: "Next.js", src: "/logos/nextdotjs.svg", type: "Product" },
  { name: "React", src: "/logos/react.svg", type: "Interface" },
  { name: "Node.js", src: "/logos/nodedotjs.svg", type: "Backend" },
  { name: "Postgres", src: "/logos/postgresql.svg", type: "Data" },
  { name: "Python", src: "/logos/python.svg", type: "AI" },
  { name: "Docker", src: "/logos/docker.svg", type: "Deploy" },
  { name: "Google Ads", src: "/cubeiq-assets/logos/googleads.svg", type: "Growth" },
  { name: "HubSpot", src: "/cubeiq-assets/logos/hubspot.svg", type: "CRM" },
  { name: "WhatsApp", src: "/cubeiq-assets/logos/whatsapp.svg", type: "Connect" },
];

function ServiceMedia({ service, image, priority = false }: { service: CubeITService; image: string; priority?: boolean }) {
  return (
    <figure className={styles.mediaPanel}>
      <Image
        src={image}
        alt={`${service.title} capability visual`}
        fill
        sizes="(max-width: 900px) 100vw, 42vw"
        priority={priority}
      />
    </figure>
  );
}

function HorizontalPanelView({ panel, index }: { panel: HorizontalPanel; index: number }) {
  const service = panel.service;

  if (panel.type === "visual") {
    return (
      <article className={`${styles.railPanel} ${styles.visualRailPanel}`} data-accent={service.accent}>
        <ServiceMedia service={service} image={panel.image} priority={index < 2} />
        <div className={styles.railCaption}>
          <span>{service.index}</span>
          <h3>{service.title}</h3>
        </div>
      </article>
    );
  }

  if (panel.type === "narrow") {
    return (
      <article className={`${styles.railPanel} ${styles.narrowRailPanel}`} data-accent={service.accent}>
        <span className={styles.panelNumber}>{service.index}</span>
        <p>{service.proof}</p>
        <MoveRight aria-hidden="true" />
      </article>
    );
  }

  return (
    <article className={`${styles.railPanel} ${styles.majorRailPanel}`} data-accent={service.accent}>
      <span className={styles.kicker}>{service.label}</span>
      <h3>{service.thesis}</h3>
      <ul>
        {service.capabilities.slice(0, 4).map((capability) => (
          <li key={capability}>{capability}</li>
        ))}
      </ul>
    </article>
  );
}

export default function ServicesPage() {
  const reducedMotion = Boolean(useReducedMotion());
  const [widePointer, setWidePointer] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const introRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const horizontalRef = useRef<HTMLElement>(null);
  const horizontalViewportRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLElement>(null);
  const immersiveRef = useRef<HTMLElement>(null);

  const { timelineRef, horizontalHeight, setPointer } = useServicesScrollTimeline({
    introRef,
    storyRef,
    horizontalRef,
    horizontalViewportRef,
    horizontalTrackRef,
    selectorRef,
    reducedMotion,
  });

  useEffect(() => {
    const update = () => setWidePointer(window.innerWidth >= 900);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const horizontalPanels = useMemo<HorizontalPanel[]>(() => (
    cubeitServices.flatMap((service) => [
      { type: "visual", service, image: service.images[0] },
      { type: "major", service },
      { type: "narrow", service },
      { type: "visual", service, image: service.images[1] },
    ] as HorizontalPanel[])
  ), []);

  const selectedService = cubeitServices[selectedIndex] ?? cubeitServices[0];

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reducedMotion || !widePointer) return;
    const rect = immersiveRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPointer(
      ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      -((event.clientY - rect.top) / rect.height - 0.5) * 2,
    );
  };

  return (
    <div className={styles.page}>
      <CursorFill defaultColor="#1e63f4" />
      <Navbar />

      <main>
        <section className={styles.hero} id="home" aria-labelledby="services-title">
          <div className={styles.heroGrid} aria-hidden="true" />
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}><Sparkles aria-hidden="true" /> CubeIT Services</span>
            <h1 id="services-title">Software services built as one system.</h1>
            <p>
              We combine AI, product design, automation and engineering so your business runs on cleaner, smarter software.
            </p>
            <div className="section-actions">
              <a className="btn btn-primary" href="/contact">Start a project <ArrowUpRight aria-hidden="true" /></a>
              <a className="btn btn-secondary" href="#service-story">Explore services</a>
            </div>
          </div>
          <div className={styles.heroIndex} aria-label="Service categories">
            {cubeitServices.map((service) => (
              <a href={`#${service.slug}`} key={service.slug}>
                <span>{service.index}</span>
                {service.title}
              </a>
            ))}
          </div>
        </section>

        <section className={styles.introGrid} id="services" aria-labelledby="service-principles-title">
          <div className={styles.sectionLead}>
            <span className={styles.eyebrow}>Our approach</span>
            <h2 id="service-principles-title">Every service is shaped around the work it needs to improve.</h2>
          </div>
          <div className={styles.principleGrid}>
            {servicePrinciples.map((principle, index) => (
              <article key={principle.label}>
                <span>{String(index + 1).padStart(2, "0")} / {principle.label}</span>
                <h3>{principle.title}</h3>
                <p>{principle.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          ref={immersiveRef}
          className={styles.immersiveRegion}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setPointer(0, 0)}
        >
          {!reducedMotion ? (
            <div className={styles.canvasStage} aria-hidden="true">
              <ServicesCanvas timelineRef={timelineRef} selectedIndex={selectedIndex} reducedMotion={reducedMotion} />
            </div>
          ) : null}

          <section ref={introRef} className={styles.immersiveIntro} aria-labelledby="immersive-title">
            <div className={styles.immersiveLeft}>
              <span className={styles.eyebrow}>Connected delivery</span>
              <h2 id="immersive-title">Strategy, product and engineering move together.</h2>
            </div>
            <div className={styles.immersiveRight}>
              <p>
                The cube represents how CubeIT works: every capability connects back to one delivery system.
              </p>
            </div>
          </section>

          <section ref={storyRef} className={styles.storySection} id="service-story" aria-labelledby="story-title">
            <div className={styles.storyHeading}>
              <span className={styles.eyebrow}>Core capabilities</span>
              <h2 id="story-title">Choose the capability your business needs first.</h2>
            </div>
            <div className={styles.storyRows}>
              {cubeitServices.map((service, index) => (
                <article className={styles.storyRow} id={service.slug} key={service.slug}>
                  <div>
                    <span>{service.index} / {service.label}</span>
                    <h3>{service.title}</h3>
                  </div>
                  <p>{service.summary}</p>
                  <ServiceMedia service={service} image={service.images[index % service.images.length]} priority={index === 0} />
                </article>
              ))}
            </div>
          </section>

          <section
            ref={horizontalRef}
            className={styles.horizontalSection}
            style={horizontalHeight ? { "--services-horizontal-height": `${horizontalHeight}px` } as CSSProperties : undefined}
            aria-labelledby="horizontal-title"
          >
            <div ref={horizontalViewportRef} className={styles.horizontalViewport}>
              <div className={styles.horizontalHeader}>
                <span className={styles.eyebrow}>Service gallery</span>
                <h2 id="horizontal-title">A clearer view of what CubeIT can build.</h2>
              </div>
              <div ref={horizontalTrackRef} className={styles.horizontalTrack}>
                {horizontalPanels.map((panel, index) => (
                  <HorizontalPanelView panel={panel} index={index} key={`${panel.service.slug}-${panel.type}-${index}`} />
                ))}
              </div>
            </div>
          </section>

          <section ref={selectorRef} className={styles.selectorSection} aria-labelledby="selector-title">
            <span className={styles.eyebrow}>Capability focus</span>
            <h2 id="selector-title">Start with one need. We connect the rest.</h2>
            <div className={styles.selectorButtons} role="tablist" aria-label="CubeIT service selector">
              {cubeitServices.map((service, index) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedIndex === index}
                  key={service.slug}
                  onClick={() => setSelectedIndex(index)}
                >
                  <span>{service.index}</span>
                  {service.title}
                </button>
              ))}
            </div>
            <article className={styles.selectedService} data-accent={selectedService.accent}>
              <div>
                <span className={styles.kicker}>{selectedService.label}</span>
                <h3>{selectedService.thesis}</h3>
                <p>{selectedService.outcome}</p>
              </div>
              <ul>
                {selectedService.capabilities.map((item) => (
                  <li key={item}><CheckCircle2 aria-hidden="true" /> {item}</li>
                ))}
              </ul>
            </article>
          </section>
        </section>

        <section className={styles.matrixSection} aria-labelledby="matrix-title">
          <div className={styles.sectionLead}>
            <span className={styles.eyebrow}>How delivery works</span>
            <h2 id="matrix-title">A simple structure from idea to launch.</h2>
            {!reducedMotion ? (
              <div className={styles.deliveryCubeDock} aria-hidden="true">
                <ServicesCanvas
                  timelineRef={timelineRef}
                  selectedIndex={selectedIndex}
                  reducedMotion={reducedMotion}
                  presentation="dock"
                />
              </div>
            ) : null}
          </div>
          <div className={styles.matrixGrid}>
            {deliveryMatrix.map((column, index) => (
              <article key={column.heading}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{column.heading}</h3>
                <ul>
                  {column.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.deepDiveSection} aria-labelledby="deep-dive-title">
          <div className={styles.deepDiveHead}>
            <span className={styles.eyebrow}>Service detail</span>
            <h2 id="deep-dive-title">What each service includes.</h2>
          </div>
          {cubeitServices.map((service) => (
            <article className={styles.deepDiveRow} key={service.slug}>
              <div>
                <span>{service.index}</span>
                <h3>{service.title}</h3>
              </div>
              <p>{service.summary}</p>
              <div className={styles.deepDiveMeta}>
                {service.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <ul>
                {service.technologies.map((technology) => <li key={technology}>{technology}</li>)}
              </ul>
            </article>
          ))}
        </section>

        <section className={styles.ctaSection} aria-labelledby="services-cta-title">
          <div className={styles.ctaCopy}>
            <span className={styles.eyebrow}>Build with CubeIT</span>
            <h2 id="services-cta-title">Turn scattered work into one intelligent system.</h2>
            <p>Tell us what feels slow or difficult to scale. We will help shape the next step.</p>
            <a className="btn btn-primary" href="/contact">Start a project <ArrowRight aria-hidden="true" /></a>
          </div>
          <div className={styles.ctaLogoWall} aria-hidden="true">
            <div className={styles.ctaLogoCore}>
              <span>CubeIT</span>
              <strong>Connected system</strong>
            </div>
            {ctaLogos.map((logo, index) => (
              <span
                className={styles.ctaLogoTile}
                key={logo.name}
                style={{ "--delay": `${index * 35}ms` } as CSSProperties}
              >
                <Image src={logo.src} alt="" width={30} height={30} />
                <small>{logo.type}</small>
              </span>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
