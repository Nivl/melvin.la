"use client";

import { memo } from "react";

type CellProps = {
  alive: boolean;
  isHovered: boolean;
};

export const Cell = memo(
  ({ alive, isHovered }: CellProps) => (
    <div
      className={[
        alive ? "bg-accent" : "bg-default-foreground/5 dark:bg-default-foreground/10",
        "border-default-foreground/5 border transition-colors duration-75",
        isHovered && !alive && "bg-default-foreground/15 dark:bg-default-foreground/20",
      ]
        .filter(Boolean)
        .join(" ")}
    />
  ),
  (prev, next) => prev.alive === next.alive && prev.isHovered === next.isHovered,
);

Cell.displayName = "ConwayCell";
