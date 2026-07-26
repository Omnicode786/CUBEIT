"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";

type SplitTagProps = {
  className?: string;
  "aria-label": string;
  "data-cubeiq-split": "words" | "lines";
  style: CSSProperties;
  children: ReactNode;
};

type AnimatedTextProps = {
  as?: ElementType;
  children: string;
  className?: string;
  mode?: "words" | "lines";
  delay?: number;
};

export function AnimatedText({
  as: Tag = "span",
  children,
  className,
  mode = "words",
  delay = 0,
}: AnimatedTextProps) {
  const parts = mode === "lines" ? children.split("\n") : children.split(/\s+/);
  const SplitTag = Tag as ElementType<SplitTagProps>;

  return (
    <SplitTag
      className={className}
      aria-label={children.replace(/\n/g, " ")}
      data-cubeiq-split={mode}
      style={{ "--cubeiq-split-delay": `${delay}s` } as CSSProperties}
    >
      {parts.map((part, index) => (
        <span
          aria-hidden="true"
          className="cubeiq-split-mask"
          key={`${part}-${index}`}
        >
          <span
            className="cubeiq-split-part"
            style={{ "--cubeiq-split-index": index } as CSSProperties}
          >
            {part}
            {mode === "words" && index < parts.length - 1 ? "\u00a0" : null}
          </span>
        </span>
      ))}
    </SplitTag>
  );
}

type VisuallyReadableProps = {
  children: ReactNode;
};

export function VisuallyReadable({ children }: VisuallyReadableProps) {
  return <span className="sr-only">{children}</span>;
}
