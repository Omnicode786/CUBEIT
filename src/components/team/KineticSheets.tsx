"use client";

import { useReducedMotion } from "motion/react";
import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import styles from "./team.module.css";

const sheets = [
  { index: "01", label: "BUILD", copy: "Product engineering", variant: "build" },
  { index: "02", label: "SHIP", copy: "Delivery systems", variant: "ship" },
  { index: "03", label: "GROW", copy: "Connected growth", variant: "grow" },
] as const;

export default function KineticSheets() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = Boolean(useReducedMotion());

  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !rootRef.current || event.pointerType === "touch") return;
    const rect = rootRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    rootRef.current.style.setProperty("--sheet-x-1", `${x * -7}px`);
    rootRef.current.style.setProperty("--sheet-y-1", `${y * -5}px`);
    rootRef.current.style.setProperty("--sheet-x-2", `${x * 11}px`);
    rootRef.current.style.setProperty("--sheet-y-2", `${y * 8}px`);
    rootRef.current.style.setProperty("--sheet-x-3", `${x * 17}px`);
    rootRef.current.style.setProperty("--sheet-y-3", `${y * 12}px`);
    rootRef.current.style.setProperty("--sheet-glow-x", `${50 + x * 20}%`);
    rootRef.current.style.setProperty("--sheet-glow-y", `${44 + y * 16}%`);
  };

  const reset = () => {
    if (!rootRef.current) return;
    rootRef.current.style.setProperty("--sheet-x-1", "0px");
    rootRef.current.style.setProperty("--sheet-y-1", "0px");
    rootRef.current.style.setProperty("--sheet-x-2", "0px");
    rootRef.current.style.setProperty("--sheet-y-2", "0px");
    rootRef.current.style.setProperty("--sheet-x-3", "0px");
    rootRef.current.style.setProperty("--sheet-y-3", "0px");
    rootRef.current.style.setProperty("--sheet-glow-x", "50%");
    rootRef.current.style.setProperty("--sheet-glow-y", "44%");
  };

  return (
    <div
      ref={rootRef}
      className={styles.kineticSheets}
      onPointerMove={move}
      onPointerLeave={reset}
      aria-hidden="true"
    >
      <div className={styles.sheetFieldGrid} />
      <div className={styles.sheetFieldOrbit}><i /><i /><i /></div>
      <div className={styles.sheetMonogram}>C</div>
      {sheets.map((sheet, index) => (
        <div key={sheet.label} className={styles.kineticSheet} data-variant={sheet.variant} data-sheet-index={index + 1}>
          <div className={styles.sheetTopline}>
            <span>{sheet.index}</span>
            <span>CubeIT / Team</span>
          </div>
          <div className={styles.sheetSignal}>
            <i /><i /><i /><i />
          </div>
          <div className={styles.sheetBottomline}>
            <strong>{sheet.label}</strong>
            <span>{sheet.copy}</span>
          </div>
        </div>
      ))}
      <span className={styles.sheetHint}>move / explore</span>
    </div>
  );
}
