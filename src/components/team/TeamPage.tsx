"use client";

import { ArrowDown, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Footer, Navbar } from "@/components/cubeit-site";
import KineticSheets from "./KineticSheets";
import TeamMorphSurface from "./TeamMorphSurface";
import { teamMembers, teamPrinciples, type TeamMember, type TeamMemberId } from "./team-data";
import styles from "./team.module.css";

type MorphState = {
  member: TeamMember;
  origin: { left: number; top: number; width: number; height: number; borderRadius: number };
  source: HTMLElement | null;
};

function useTeamMotion(rootRef: RefObject<HTMLDivElement | null>, reducedMotion: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) {
      if (root) root.dataset.motion = "reduced";
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-word]",
        { yPercent: 105, opacity: 0, rotateX: -12, filter: "blur(12px)" },
        { yPercent: 0, opacity: 1, rotateX: 0, filter: "blur(0px)", duration: 1.05, stagger: 0.055, ease: "expo.out", delay: 0.12 },
      );

      gsap.fromTo(
        "[data-hero-reveal]",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "power3.out", delay: 0.36 },
      );

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((node) => {
        gsap.fromTo(
          node,
          { y: 44, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.95,
            ease: "expo.out",
            scrollTrigger: { trigger: node, start: "top 88%", once: true },
          },
        );
      });

      gsap.fromTo(
        "[data-booth]",
        { y: 64, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.09,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-booth-stage]", start: "top 80%", once: true },
        },
      );

      const connectionPath = root.querySelector<SVGPathElement>("[data-connection-path]");
      if (connectionPath) {
        const length = connectionPath.getTotalLength();
        gsap.set(connectionPath, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(connectionPath, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: "[data-connection]", start: "top 72%", end: "bottom 42%", scrub: 0.8 },
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-principle]").forEach((item, index) => {
        gsap.fromTo(
          item,
          { y: 60 + index * 8, opacity: 0, rotateX: -5 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: item, start: "top 86%", once: true },
          },
        );
      });

      gsap.fromTo(
        "[data-cta-orbit]",
        { rotate: -10, scale: 0.9, opacity: 0 },
        {
          rotate: 0,
          scale: 1,
          opacity: 1,
          duration: 1.15,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-team-cta]", start: "top 80%", once: true },
        },
      );

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [reducedMotion, rootRef]);
}

function Booth({
  member,
  active,
  onOpen,
  onActive,
}: {
  member: TeamMember;
  active: boolean;
  onOpen: (event: MouseEvent<HTMLButtonElement>, member: TeamMember) => void;
  onActive: (id: TeamMemberId | null) => void;
}) {
  return (
    <article
      className={styles.boothItem}
      style={{ "--member-accent": member.accent, "--member-accent-soft": member.accentSoft } as CSSProperties}
      data-booth
      data-active={active ? "true" : "false"}
    >
      <button
        type="button"
        className={styles.boothButton}
        onClick={(event) => onOpen(event, member)}
        onPointerEnter={() => onActive(member.id)}
        onPointerLeave={() => onActive(null)}
        onFocus={() => onActive(member.id)}
        onBlur={() => onActive(null)}
        aria-label={`Play ${member.name} profile video`}
      >
        <span className={styles.boothHalo} aria-hidden="true" />
        <span
          className={styles.boothMedia}
          style={{ backgroundImage: `url(${member.photo})` }}
          aria-hidden="true"
        >
          <span className={styles.boothMediaShade} />
        </span>
        <span className={styles.boothPrompt}>Play profile <ArrowUpRight aria-hidden="true" /></span>
      </button>

      <div className={styles.boothMeta}>
        <div className={styles.boothMetaTop}>
          <span className={styles.boothIndex}>{member.index}</span>
          <span className={styles.boothLeadership}>{member.leadership}</span>
        </div>
        <h3>{member.name}</h3>
        <p className={styles.boothRoleLine}>{member.role}</p>
        <p className={styles.boothBlurb}>{member.blurb}</p>
        <div className={styles.boothSkillPreview} aria-label={`${member.name} key disciplines`}>
          {member.skills.slice(0, 3).map((skill) => <span key={skill}>{skill}</span>)}
        </div>
      </div>
    </article>
  );
}

export default function TeamPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = Boolean(useReducedMotion());
  const [hovered, setHovered] = useState<TeamMemberId | null>(null);
  const [morph, setMorph] = useState<MorphState | null>(null);

  useTeamMotion(rootRef, reducedMotion);

  const openMember = (event: MouseEvent<HTMLButtonElement>, member: TeamMember) => {
    const source = event.currentTarget;
    const rect = source.getBoundingClientRect();
    // The booth is circular. Keep the captured geometry circular rather than
    // parsing CSS `50%` as `50px`, which causes a squarish frame mid-morph.
    const radius = Math.min(rect.width, rect.height) / 2;
    source.style.visibility = "hidden";
    setHovered(member.id);
    setMorph({
      member,
      source,
      origin: {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        borderRadius: radius,
      },
    });
  };

  return (
<div
  ref={rootRef}
  className={`${styles.page} ${morph ? styles.pageProfileOpen : ""}`}
>      <Navbar />

      <main className={styles.main}>
        <section className={styles.hero} id="home" aria-labelledby="team-title">
          <div className={styles.heroGrid} aria-hidden="true" />
          <div className={styles.heroGlow} aria-hidden="true" />

          <div className={styles.heroLayout}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow} data-hero-reveal><Sparkles aria-hidden="true" /> CubeIT / Team</p>
              <h1 id="team-title" className={styles.heroTitle} aria-label="Three people. One system.">
                <span data-hero-word>Three</span>
                <span data-hero-word>people.</span>
                <span data-hero-word>One</span>
                <span className={styles.heroAccent} data-hero-word>system.</span>
              </h1>
              <div className={styles.heroBottom} data-hero-reveal>
                <p>
                  Product engineering, dependable delivery and connected growth — close enough to think together and move as one team.
                </p>
                <a className={styles.heroScroll} href="#team-booth">Meet the team <ArrowDown aria-hidden="true" /></a>
              </div>
            </div>

            <div className={styles.heroKinetic} data-hero-reveal>
              <KineticSheets />
            </div>
          </div>

          <div className={styles.heroIndex} data-hero-reveal aria-label="CubeIT team disciplines">
            <span>01 / Build</span>
            <span>02 / Ship</span>
            <span>03 / Grow</span>
          </div>
        </section>

        <section className={styles.boothSection} id="team-booth" aria-labelledby="booth-title">
          <div className={styles.sectionHead} data-reveal>
            <span className={styles.eyebrow}>People behind the systems</span>
            <h2 id="booth-title">Small team. Clear ownership.</h2>
            <p>Everything important stays visible. Tap a portrait to let the circle become the person&apos;s video story.</p>
          </div>

          <div className={styles.boothStage} data-booth-stage>
            {teamMembers.map((member) => (
              <Booth
                key={member.id}
                member={member}
                active={hovered === member.id || morph?.member.id === member.id}
                onOpen={openMember}
                onActive={(id) => setHovered(morph ? morph.member.id : id)}
              />
            ))}
          </div>
        </section>

        <section className={styles.connectionSection} data-connection aria-labelledby="connection-title">
          <div className={styles.connectionCopy} data-reveal>
            <span className={styles.eyebrow}>One operating rhythm</span>
            <h2 id="connection-title">Different disciplines. No handoff wall.</h2>
            <p>
              Engineering understands how the product is positioned, growth understands what the product can really do, and delivery is part of the build from the beginning.
            </p>
          </div>

          <div className={styles.connectionVisual} aria-hidden="true">
            <svg viewBox="0 0 1200 420" preserveAspectRatio="none">
              <defs>
                <linearGradient id="team-path-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#1E63F4" />
                  <stop offset="0.5" stopColor="#6B9EFF" />
                  <stop offset="1" stopColor="#F27D42" />
                </linearGradient>
              </defs>
              <path className={styles.connectionGhost} d="M80 285 C245 80 365 82 520 208 C680 338 805 330 1120 112" />
              <path data-connection-path className={styles.connectionPath} d="M80 285 C245 80 365 82 520 208 C680 338 805 330 1120 112" />
            </svg>
            <span className={styles.connectionNode} style={{ "--x": "7%", "--y": "68%" } as CSSProperties}>Build</span>
            <span className={styles.connectionNode} style={{ "--x": "43%", "--y": "47%" } as CSSProperties}>Ship</span>
            <span className={styles.connectionNode} style={{ "--x": "91%", "--y": "22%" } as CSSProperties}>Grow</span>
          </div>
        </section>

        <section className={styles.principlesSection} aria-labelledby="principles-title">
          <div className={styles.principlesLead} data-reveal>
            <div>
              <span className={styles.eyebrow}>Three forces</span>
              <h2 id="principles-title">What each perspective changes.</h2>
            </div>
            <p>
              Build, ship and grow are not departments at CubeIT. They are three perspectives kept in the same room, from the first product decision to the first customer response.
            </p>
          </div>
          <div className={styles.principlesGrid}>
            {teamPrinciples.map((principle, index) => (
              <article
                key={principle.index}
                className={styles.principleCard}
                style={{ "--principle-accent": principle.accent } as CSSProperties}
                data-principle
              >
                <div className={styles.principleTopline}>
                  <span className={styles.principleIndex}>{principle.index}</span>
                  <div>
                    <strong>{principle.owner}</strong>
                    <span>{principle.role}</span>
                  </div>
                </div>

                <div className={styles.principleStage} data-variant={index} aria-hidden="true">
                  <span className={styles.principleStageGrid} />
                  <span className={styles.principleStageWord}>{principle.label}</span>
                  <span className={styles.principleStageOrbit}><i /><i /><i /></span>
                  <span className={styles.principleStageBeam} />
                </div>

                <div className={styles.principleCopy}>
                  <span className={styles.principleLabel}>{principle.label}</span>
                  <h3>{principle.title}</h3>
                  <p>{principle.copy}</p>
                  <div className={styles.principleSkills}>
                    {principle.skills.map((skill) => <span key={skill}>{skill}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.teamCta} data-team-cta aria-labelledby="team-cta-title">
          <div className={styles.ctaOrbit} data-cta-orbit aria-hidden="true">
            <span /><span /><span />
            <strong>CubeIT</strong>
          </div>
          <div className={styles.ctaCopy} data-reveal>
            <span className={styles.eyebrow}>Work with the team</span>
            <h2 id="team-cta-title">Bring us the messy version.</h2>
            <p>We will help turn it into a clearer product, a stronger system and a path that can actually move.</p>
            <div className={styles.ctaActions}>
              <a className="btn btn-primary" href="/contact">Start a project <ArrowUpRight aria-hidden="true" /></a>
              <a className="btn btn-secondary" href="/our-work">See our work <ArrowRight aria-hidden="true" /></a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {morph ? (
        <TeamMorphSurface
          member={morph.member}
          origin={morph.origin}
          sourceElement={morph.source}
          onClose={() => {
            if (morph.source) morph.source.style.visibility = "";
            setMorph(null);
            setHovered(null);
          }}
        />
      ) : null}
    </div>
  );
}
