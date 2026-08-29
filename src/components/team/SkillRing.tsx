"use client";

import type { TeamMember } from "./team-data";
import styles from "./team.module.css";

export default function SkillRing({ member }: { member: TeamMember }) {
  const pathId = `skill-ring-${member.id}`;
  const text = `${member.skills.join("  •  ")}  •  ${member.skills.join("  •  ")}  •  `;

  return (
    <svg className={styles.skillRing} viewBox="0 0 700 700" aria-hidden="true">
      <defs>
        <path id={pathId} d="M 350 350 m -318 0 a 318 318 0 1 1 636 0 a 318 318 0 1 1 -636 0" />
      </defs>
      <circle cx="350" cy="350" r="307" className={styles.skillRingTrack} />
      <g className={styles.skillRingSpin}>
        <text className={styles.skillRingText}>
          <textPath href={`#${pathId}`} startOffset="0%">
            {text}
          </textPath>
        </text>
      </g>
    </svg>
  );
}
