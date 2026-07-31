"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { CursorFill } from "@/components/motion/cursor-fill";
import { Footer, Navbar } from "@/components/cubeit-site";
import { getNextWorkProject, type WorkProject } from "./work-data";
import styles from "./works.module.css";

const ElasticMediaCanvas = dynamic(() => import("./ElasticMediaCanvas"), {
  ssr: false,
});

function canUseWebGL() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

function getRootTheme() {
  if (typeof document === "undefined") return "light";
  const storedTheme = typeof localStorage === "undefined"
    ? null
    : localStorage.getItem("cubeit-theme") ?? localStorage.getItem("theme");
  return document.documentElement.classList.contains("dark") || document.documentElement.dataset.theme === "dark" || storedTheme === "dark"
    ? "dark"
    : "light";
}

function useRootTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const updateTheme = () => setTheme(getRootTheme());
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => observer.disconnect();
  }, []);

  return theme;
}

function WebGLLoader({ label }: { label: string }) {
  return (
    <div className={styles.webglLoader} role="status" aria-live="polite">
      <div className={styles.loaderMark} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p>{label}</p>
    </div>
  );
}

function MediaFrame({ project, id }: { project: WorkProject; id: string }) {
  return (
    <figure
      className={styles.mediaFrame}
      data-elastic-media
      data-media-id={id}
      data-media-src={project.cover}
      data-image-width={project.width}
      data-image-height={project.height}
      style={{ "--media-ratio": `${project.width} / ${project.height}` } as CSSProperties}
    >
      <img className={styles.mediaImage} src={project.cover} alt={`${project.title} visual`} />
    </figure>
  );
}

function OverviewGlyph({ variant }: { variant: number }) {
  return (
    <svg className={styles.overviewGlyph} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <linearGradient id={`overview-glyph-${variant}`} x1="18" y1="16" x2="102" y2="104" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e63f4" stopOpacity="0.95" />
          <stop offset="1" stopColor="#7aa7ff" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      <rect x="18" y="18" width="84" height="84" rx="10" fill="none" stroke={`url(#overview-glyph-${variant})`} strokeWidth="1.6" />
      {variant % 4 === 0 ? (
        <>
          <path d="M34 74L58 38L86 72" fill="none" stroke={`url(#overview-glyph-${variant})`} strokeWidth="2" strokeLinecap="round" />
          <path d="M42 74H86" fill="none" stroke="#1e63f4" strokeOpacity="0.36" strokeWidth="1.4" strokeLinecap="round" />
        </>
      ) : variant % 4 === 1 ? (
        <>
          <path d="M34 42H82L94 60L82 78H34L46 60L34 42Z" fill="none" stroke={`url(#overview-glyph-${variant})`} strokeWidth="2" strokeLinejoin="round" />
          <path d="M47 60H92" fill="none" stroke="#1e63f4" strokeOpacity="0.34" strokeWidth="1.4" strokeLinecap="round" />
        </>
      ) : variant % 4 === 2 ? (
        <>
          <path d="M38 38H82V82H38V38Z" fill="none" stroke={`url(#overview-glyph-${variant})`} strokeWidth="2" />
          <path d="M38 60H82M60 38V82" fill="none" stroke="#1e63f4" strokeOpacity="0.32" strokeWidth="1.4" />
        </>
      ) : (
        <>
          <path d="M60 34L86 48V76L60 90L34 76V48L60 34Z" fill="none" stroke={`url(#overview-glyph-${variant})`} strokeWidth="2" strokeLinejoin="round" />
          <path d="M34 48L60 62L86 48M60 62V90" fill="none" stroke="#1e63f4" strokeOpacity="0.34" strokeWidth="1.4" />
        </>
      )}
    </svg>
  );
}

export default function WorkDetailPage({ project }: { project: WorkProject }) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const rootTheme = useRootTheme();
  const [webglChecked, setWebglChecked] = useState(false);
  const [webglReady, setWebglReady] = useState(false);
  const [canvasHealthy, setCanvasHealthy] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const [transitionProject, setTransitionProject] = useState<WorkProject | null>(null);
  const canvasMounted = webglReady && !reducedMotion && !webglFailed;
  const canvasActive = canvasMounted && canvasHealthy;
  const canvasLoading = !webglFailed && (!webglChecked || (canvasMounted && !canvasHealthy));
  const nextProject = getNextWorkProject(project.slug);

  const overviewItems = [
    {
      label: "Challenge",
      value: project.challenge,
      reveal: "The first step was understanding where the work was slowing down or becoming unclear.",
    },
    {
      label: "Role",
      value: project.role,
      reveal: "CubeIT shaped the product direction, interface rhythm and technical delivery path.",
    },
    {
      label: "Services",
      value: project.services.join(", "),
      reveal: "The engagement focused on the capabilities that mattered most for this product stage.",
    },
    {
      label: "Technology",
      value: project.technologies.join(", "),
      reveal: "Tools were selected for clarity, maintainability and room to scale.",
    },
    ...(project.outcome
      ? [{
          label: "Outcome",
          value: project.outcome,
          reveal: "The result is a clearer digital system with a stronger path from idea to operation.",
        }]
      : []),
  ];

  useEffect(() => {
    const capable = canUseWebGL();
    setWebglReady(capable);
    setWebglFailed(!capable || Boolean(reducedMotion));
    setWebglChecked(true);
    window.dispatchEvent(new CustomEvent("works-media-active", { detail: null }));
    const onCanvasHealth = (event: Event) => {
      const healthy = Boolean((event as CustomEvent<boolean>).detail);
      setCanvasHealthy(healthy);
      if (healthy) setWebglFailed(false);
    };

    window.addEventListener("works-media-canvas-health", onCanvasHealth);

    return () => {
      window.dispatchEvent(new CustomEvent("works-media-hover", { detail: null }));
      window.dispatchEvent(new CustomEvent("works-media-active", { detail: null }));
      window.removeEventListener("works-media-canvas-health", onCanvasHealth);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!canvasLoading || !canvasMounted) return;
    const timeout = window.setTimeout(() => {
      setWebglFailed(true);
      setCanvasHealthy(false);
    }, 6500);

    return () => window.clearTimeout(timeout);
  }, [canvasLoading, canvasMounted]);

  useEffect(() => {
    if (!transitionProject) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [transitionProject]);

  const openProject = (event: MouseEvent<HTMLAnchorElement>, targetProject: WorkProject) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setTransitionProject(targetProject);
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("works-media-active", { detail: `${targetProject.slug}-transition` }));
    }, 0);
    window.setTimeout(() => {
      router.push(`/our-work/${targetProject.slug}`);
    }, canvasActive ? 720 : 520);
  };

  return (
    <div
      className={styles.page}
      data-works-theme={rootTheme}
      data-webgl-active={canvasActive ? "true" : "false"}
      data-webgl-failed={webglFailed ? "true" : "false"}
      data-webgl-loading={canvasLoading ? "true" : "false"}
    >
      <CursorFill defaultColor="#1e63f4" />
      {canvasMounted ? (
        <div className={styles.canvasLayer} aria-hidden="true">
          <ElasticMediaCanvas />
        </div>
      ) : null}

      <Navbar />

      <main className={styles.main}>
        <section className={styles.detailHero} id="home" aria-labelledby="case-title">
          <a className={styles.backLink} href="/our-work"><ArrowLeft aria-hidden="true" /> All works</a>
          <div className={styles.detailKicker}>
            <span>{project.group}</span>
            <span>{project.year}</span>
          </div>
          <div className={styles.detailTitle}>
            <div>
              <span className={styles.eyebrow}>{project.category}</span>
              <h1 id="case-title">{project.title}</h1>
            </div>
            <p>{project.description}</p>
          </div>
          <div className={styles.detailHeroMedia}>
            <MediaFrame project={project} id={`${project.slug}-hero`} />
          </div>
          {canvasLoading ? <WebGLLoader label={`Rendering ${project.title} in WebGL`} /> : null}
        </section>

        <section className={styles.detailOverview} id="services" aria-labelledby="case-overview-title">
          <div className={styles.sectionCopy}>
            <span className={styles.eyebrow}>Case structure</span>
            <h2 id="case-overview-title">What CubeIT shaped.</h2>
            <p>{project.solution}</p>
          </div>
          <dl className={styles.overviewGrid}>
            {overviewItems.map((item, index) => (
              <div className={styles.overviewCard} tabIndex={0} key={item.label}>
                <OverviewGlyph variant={index} />
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
                <p className={styles.overviewReveal}>{item.reveal}</p>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.mediaSequence} aria-label={`${project.title} media`}>
          <div className={styles.wideMedia}>
            <MediaFrame project={project} id={`${project.slug}-wide`} />
          </div>
          <div className={styles.splitMedia}>
            <MediaFrame project={project} id={`${project.slug}-detail-a`} />
            <MediaFrame project={project} id={`${project.slug}-detail-b`} />
          </div>
        </section>

        <section className={styles.nextProject} aria-labelledby="next-project-title">
          <div className={styles.nextCopy}>
            <span className={styles.eyebrow}>Next project</span>
            <h2 id="next-project-title">{nextProject.title}</h2>
            <p>{nextProject.description}</p>
            <a className="btn btn-primary" href={`/our-work/${nextProject.slug}`}>
              Continue the wall <ArrowRight aria-hidden="true" />
            </a>
          </div>
          <a
            href={`/our-work/${nextProject.slug}`}
            onClick={(event) => openProject(event, nextProject)}
            onPointerEnter={() => window.dispatchEvent(new CustomEvent("works-media-hover", { detail: `${nextProject.slug}-next` }))}
            onPointerLeave={() => window.dispatchEvent(new CustomEvent("works-media-hover", { detail: null }))}
            onFocus={() => window.dispatchEvent(new CustomEvent("works-media-hover", { detail: `${nextProject.slug}-next` }))}
            onBlur={() => window.dispatchEvent(new CustomEvent("works-media-hover", { detail: null }))}
          >
            <MediaFrame project={nextProject} id={`${nextProject.slug}-next`} />
          </a>
        </section>
      </main>

      <Footer />

      {transitionProject ? (
        <div className={styles.transitionOverlay} aria-hidden="true">
          <div className={styles.transitionCard}>
            <div
              className={styles.transitionMedia}
              data-elastic-media
              data-media-id={`${transitionProject.slug}-transition`}
              data-media-src={transitionProject.cover}
              data-image-width={transitionProject.width}
              data-image-height={transitionProject.height}
              style={{ "--media-ratio": `${transitionProject.width} / ${transitionProject.height}` } as CSSProperties}
            >
              <img src={transitionProject.cover} alt="" />
            </div>
            <span>Loading {transitionProject.title}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
