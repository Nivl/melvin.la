"use client";

import { memo } from "react";

type CellProps = {
  alive: boolean;
  isHovered: boolean;
};

export const Cell = memo(
  ({ alive, isHovered }: CellProps) => (
    <div
      className={
        (alive
          ? "bg-accent "
          : isHovered
            ? "bg-default-foreground/15 dark:bg-default-foreground/20 "
            : "bg-default-foreground/5 dark:bg-default-foreground/10 ") +
        "border border-default-foreground/5 transition-colors duration-75"
      }
    />
  ),
  (prev, next) => prev.alive === next.alive && prev.isHovered === next.isHovered,
);

Cell.displayName = "ConwayCell";
