"use client";

import type { ReactNode } from "react";

/**
 * TeamScene compatibility component.
 *
 * The original component was referenced by src/components/team/TeamScene.tsx,
 * but the implementation file was missing. This lightweight wrapper keeps
 * the import contract intact while allowing the Next.js build to complete.
 */
export default function TeamScene({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
