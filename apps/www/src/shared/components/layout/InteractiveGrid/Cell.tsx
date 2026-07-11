"use client";

import { memo } from "react";

import { CellColors, CellState } from "./models";

const emptyFunc = () => undefined;

type CellProps = {
  state: CellState;
  isHovered: boolean;
  isFocused?: boolean;
  onMouseEnter?: () => void;
};

export const Cell = memo(
  ({ state, isHovered, isFocused = false, onMouseEnter = emptyFunc }: CellProps) => (
    <div
      tabIndex={-1}
      onMouseEnter={onMouseEnter}
      className={[
        CellColors[state],
        `border border-zinc-200 transition-colors duration-75 dark:border-zinc-800/90`,
        isHovered &&
          state === "off" &&
          "bg-foreground/10! dark:bg-foreground/25! border-zinc-200/80",
        isFocused && "ring-accent relative z-10 ring-2 ring-inset",
      ]
        .filter(Boolean)
        .join(" ")}
    />
  ),
  (prev, next) =>
    prev.state === next.state &&
    prev.isHovered === next.isHovered &&
    prev.isFocused === next.isFocused,
);

Cell.displayName = "ConwayCell";
