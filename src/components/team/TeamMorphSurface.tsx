"use client";

import { motion, useReducedMotion } from "motion/react";
import { Pause, Play, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import type { TeamMember } from "./team-data";
import SkillRing from "./SkillRing";
import styles from "./team.module.css";

type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
  borderRadius: number;
};

type DetailsLayout = {
  left: number;
  top: number;
  width: number;
  mode: "side" | "stack";
};

type Layout = {
  circle: Rect;
  ringPad: number;
  details: DetailsLayout;
};

type Props = {
  member: TeamMember;
  origin: Rect;
  sourceElement: HTMLElement | null;
  onClose: () => void;
};

let scrollLocks = 0;
let previousOverflow = "";

function lockScroll() {
  if (scrollLocks === 0) {
    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
  }
  scrollLocks += 1;
}

function unlockScroll() {
  scrollLocks = Math.max(0, scrollLocks - 1);
  if (scrollLocks === 0) document.documentElement.style.overflow = previousOverflow;
}

function getTargetLayout(memberId: TeamMember["id"]): Layout {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const sideBySide = width >= 1000;
  const shortViewport = height < 760;

  if (sideBySide) {
    const ringPad = shortViewport ? 50 : 60;
    const horizontalSafe = width < 1200 ? 42 : 68;
    const topSafe = shortViewport ? 24 : 42;
    const bottomSafe = shortViewport ? 24 : 42;
    const gap = width < 1200 ? 42 : 70;
    const preferredDetailsWidth = Math.min(580, Math.max(400, width * 0.37));
    const maxCircle = shortViewport ? 430 : 510;

    const byWidth = width - horizontalSafe * 2 - preferredDetailsWidth - gap - ringPad * 2;
    const byHeight = height - topSafe - bottomSafe - ringPad * 2;
    const size = Math.max(270, Math.min(maxCircle, byWidth, byHeight));
    const orbitSize = size + ringPad * 2;
    const detailsWidth = Math.max(340, Math.min(
      preferredDetailsWidth,
      width - horizontalSafe * 2 - orbitSize - gap,
    ));
    const totalWidth = orbitSize + gap + detailsWidth;
    const groupLeft = Math.max(horizontalSafe, (width - totalWidth) / 2);
    const circleTop = topSafe + Math.max(0, (height - topSafe - bottomSafe - size) / 2);
    const mirrorForMuzammil = memberId === "muzammil";
    const circleLeft = mirrorForMuzammil
      ? groupLeft + detailsWidth + gap + ringPad
      : groupLeft + ringPad;
    const detailsLeft = mirrorForMuzammil
      ? groupLeft
      : groupLeft + orbitSize + gap;
    const estimatedDetailsHeight = shortViewport ? 330 : 370;

    return {
      circle: {
        left: circleLeft,
        top: circleTop,
        width: size,
        height: size,
        borderRadius: size / 2,
      },
      ringPad,
      details: {
        left: detailsLeft,
        top: Math.max(62, (height - estimatedDetailsHeight) / 2),
        width: detailsWidth,
        mode: "side",
      },
    };
  }

  const mobile = width < 720;
  const ringPad = mobile ? (shortViewport ? 28 : 36) : (shortViewport ? 38 : 48);
  const topSafe = mobile ? 14 : 24;
  const bottomSafe = mobile ? 14 : 24;
  const detailsGap = mobile ? 14 : 20;
  const detailsHeight = mobile ? (shortViewport ? 205 : 246) : (shortViewport ? 230 : 270);
  const horizontalSafe = mobile ? 18 : 42;
  const maxCircle = mobile ? (shortViewport ? 250 : 330) : (shortViewport ? 330 : 410);
  const byWidth = width - horizontalSafe * 2 - ringPad * 2;
  const byHeight = height - topSafe - bottomSafe - ringPad * 2 - detailsGap - detailsHeight;
  const size = Math.max(142, Math.min(maxCircle, byWidth, byHeight));
  const orbitHeight = size + ringPad * 2;
  const totalHeight = orbitHeight + detailsGap + detailsHeight;
  const orbitTop = topSafe + Math.max(0, (height - topSafe - bottomSafe - totalHeight) / 2);
  const circleTop = orbitTop + ringPad;
  const detailsWidth = Math.min(width - horizontalSafe * 2, 760);

  return {
    circle: {
      left: (width - size) / 2,
      top: circleTop,
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    ringPad,
    details: {
      left: (width - detailsWidth) / 2,
      top: circleTop + size + ringPad + detailsGap,
      width: detailsWidth,
      mode: "stack",
    },
  };
}

export default function TeamMorphSurface({ member, origin, sourceElement, onClose }: Props) {
  const reducedMotion = Boolean(useReducedMotion());
  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [layout, setLayout] = useState<Layout>({
    circle: origin,
    ringPad: 0,
    details: {
      left: origin.left,
      top: origin.top + origin.height,
      width: origin.width,
      mode: "stack",
    },
  });

  const circleTransition = useMemo(
    () => reducedMotion
      ? { duration: 0.12 }
      : { type: "spring" as const, stiffness: 155, damping: 25, mass: 0.9 },
    [reducedMotion],
  );

  const beginClose = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => {
      if (sourceElement) sourceElement.style.visibility = "";
      sourceElement?.focus({ preventScroll: true });
      onClose();
    }, reducedMotion ? 130 : 560);
  }, [onClose, reducedMotion, sourceElement]);

  useEffect(() => {
    setMounted(true);
    lockScroll();

    const update = () => setLayout(getTargetLayout(member.id));
    update();
    window.addEventListener("resize", update, { passive: true });

    const id = window.requestAnimationFrame(() => setOpen(true));
    const focusId = window.setTimeout(() => dialogRef.current?.focus(), reducedMotion ? 0 : 380);

    return () => {
      window.cancelAnimationFrame(id);
      window.clearTimeout(focusId);
      window.removeEventListener("resize", update);
      unlockScroll();
      if (sourceElement) sourceElement.style.visibility = "";
    };
  }, [member.id, reducedMotion, sourceElement]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        beginClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [beginClose]);

  const toggleVideo = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      try {
        await video.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  if (!mounted) return null;

  const circle = open ? layout.circle : origin;
  const orbitSize = layout.circle.width + layout.ringPad * 2;
  const orbitLeft = layout.circle.left - layout.ringPad;
  const orbitTop = layout.circle.top - layout.ringPad;

  return createPortal(
    <div className={styles.morphLayer} role="presentation">
      <motion.button
        type="button"
        className={styles.morphBackdrop}
        aria-label={`Close ${member.name} profile`}
        onClick={beginClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: reducedMotion ? 0.1 : 0.3 }}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`team-profile-${member.id}`}
        tabIndex={-1}
        className={styles.profileDialog}
        style={{
          "--member-accent": member.accent,
          "--member-accent-soft": member.accentSoft,
        } as CSSProperties}
      >
        <motion.div
          className={styles.morphSurface}
          initial={{ ...origin, borderRadius: "50%" }}
          animate={{ ...circle, borderRadius: "50%" }}
          transition={circleTransition}
          style={{ borderRadius: "50%" }}
        >
          <video
            ref={videoRef}
            key={member.video}
            className={styles.profileVideo}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            poster={member.poster}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            <source src={member.video} type="video/mp4" />
          </video>
          <div className={styles.profileMediaShade} aria-hidden="true" />
          <div className={styles.profileVideoRim} aria-hidden="true" />
          <button
            type="button"
            className={styles.profileVideoToggle}
            onClick={toggleVideo}
            aria-label={playing ? `Pause ${member.name} profile video` : `Play ${member.name} profile video`}
          >
            {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          </button>
        </motion.div>

        <motion.div
          className={styles.profileOrbitFrame}
          style={{ left: orbitLeft, top: orbitTop, width: orbitSize, height: orbitSize }}
          initial={{ opacity: 0, scale: 0.88, rotate: -8 }}
          animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.9, rotate: open ? 0 : -6 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.5, delay: open && !reducedMotion ? 0.18 : 0 }}
        >
          <SkillRing member={member} />
          <span className={styles.profileOrbitDot} aria-hidden="true" />
        </motion.div>

        <motion.div
          className={styles.profileDetails}
          data-layout={layout.details.mode}
          style={{ left: layout.details.left, top: layout.details.top, width: layout.details.width }}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 18, filter: reducedMotion ? "none" : "blur(8px)" }}
          animate={{
            opacity: open ? 1 : 0,
            y: open ? 0 : 12,
            filter: open ? "blur(0px)" : "blur(6px)",
          }}
          transition={{ duration: reducedMotion ? 0.1 : 0.42, delay: open && !reducedMotion ? 0.28 : 0 }}
        >
          <div className={styles.profileDetailsMeta}>
            <span>{member.index} / CubeIT</span>
            <strong>{member.leadership}</strong>
          </div>
          <div className={styles.profileDetailsBody}>
            <h2 id={`team-profile-${member.id}`}>{member.name}</h2>
            <p className={styles.profileRole}>{member.role}</p>
            <div className={styles.profileStory}>
              <p>{member.bio}</p>
              <p>{member.approach}</p>
            </div>
          </div>
        </motion.div>

        <motion.button
          type="button"
          className={styles.profileClose}
          onClick={beginClose}
          aria-label={`Close ${member.name} profile`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.8 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.3, delay: open && !reducedMotion ? 0.2 : 0 }}
        >
          <X aria-hidden="true" />
        </motion.button>
      </div>
    </div>,
    document.body,
  );
}
