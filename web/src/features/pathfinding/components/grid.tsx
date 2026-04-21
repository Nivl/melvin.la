"use client";

import { useTranslations } from "next-intl";
import {
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { Coords, Grid, PlacementMode } from "#features/pathfinding/utils/types.ts";
import { CELL_COLORS } from "#features/pathfinding/utils/types.ts";

type DragMode = "add-wall" | "remove-wall" | undefined;

type GridProps = {
  grid: Grid;
  isAnimating: boolean;
  onGridChange: (grid: Grid) => void;
  start: Coords;
  end: Coords;
  placementMode: PlacementMode;
  onStartChange: (coords: Coords) => void;
  onEndChange: (coords: Coords) => void;
};

export const PathfindingGrid = ({
  grid,
  isAnimating,
  onGridChange,
  start,
  end,
  placementMode,
  onStartChange,
  onEndChange,
}: GridProps) => {
  const dragModeRef = useRef<DragMode>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const t = useTranslations("pathfinding");

  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  const [rowHover, setRowHover] = useState(-1);
  const [colHover, setColHover] = useState(-1);
  const [focusedCell, setFocusedCell] = useState<Coords | undefined>();

  const getCellFromEvent = useCallback(
    (event: PointerEvent<HTMLDivElement>): Coords | undefined => {
      const container = containerRef.current;
      if (!container) {
        return undefined;
      }
      const rect = container.getBoundingClientRect();
      const col = Math.floor(((event.clientX - rect.left) / rect.width) * cols);
      const row = Math.floor(((event.clientY - rect.top) / rect.height) * rows);
      if (
        Number.isNaN(row) ||
        Number.isNaN(col) ||
        row < 0 ||
        row >= rows ||
        col < 0 ||
        col >= cols
      ) {
        return undefined;
      }
      return [row, col];
    },
    [rows, cols],
  );

  const applyWall = useCallback(
    (row: number, col: number, mode: DragMode) => {
      if (isAnimating || !mode) {
        return;
      }
      const state = grid[row][col];
      if (state === "start" || state === "end") {
        return;
      }
      const newGrid = grid.map((gridRow) => [...gridRow]);
      newGrid[row][col] = mode === "add-wall" ? "wall" : "empty";
      onGridChange(newGrid);
    },
    [grid, isAnimating, onGridChange],
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (isAnimating) {
        return;
      }
      event.preventDefault();
      const coords = getCellFromEvent(event);
      if (!coords) {
        return;
      }
      const [row, col] = coords;

      // Placement mode: move start or end node
      if (placementMode === "place-start" || placementMode === "place-end") {
        if (placementMode === "place-start") {
          if (row === end[0] && col === end[1]) {
            return;
          }
          onStartChange([row, col]);
        } else {
          if (row === start[0] && col === start[1]) {
            return;
          }
          onEndChange([row, col]);
        }
        return;
      }

      const state = grid[row][col];
      if (state === "start" || state === "end") {
        return;
      }
      const mode: DragMode = event.button === 2 || state === "wall" ? "remove-wall" : "add-wall";
      dragModeRef.current = mode;
      applyWall(row, col, mode);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [
      isAnimating,
      placementMode,
      grid,
      start,
      end,
      getCellFromEvent,
      applyWall,
      onStartChange,
      onEndChange,
    ],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!dragModeRef.current) {
        return;
      }
      const coords = getCellFromEvent(event);
      if (!coords) {
        return;
      }
      applyWall(coords[0], coords[1], dragModeRef.current);
    },
    [getCellFromEvent, applyWall],
  );

  const handlePointerUp = useCallback(() => {
    dragModeRef.current = undefined;
  }, []);

  const handleContextMenu = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!focusedCell) {
        return;
      }
      const [fr, fc] = focusedCell;

      switch (event.key) {
        case "ArrowUp": {
          event.preventDefault();
          if (fr > 0) {
            setFocusedCell([fr - 1, fc]);
          }
          break;
        }
        case "ArrowDown": {
          event.preventDefault();
          if (fr < rows - 1) {
            setFocusedCell([fr + 1, fc]);
          }
          break;
        }
        case "ArrowLeft": {
          event.preventDefault();
          if (fc > 0) {
            setFocusedCell([fr, fc - 1]);
          }
          break;
        }
        case "ArrowRight": {
          event.preventDefault();
          if (fc < cols - 1) {
            setFocusedCell([fr, fc + 1]);
          }
          break;
        }
        case " ":
        case "Enter": {
          event.preventDefault();
          if (isAnimating) {
            break;
          }
          if (placementMode === "place-start") {
            if (fr !== end[0] || fc !== end[1]) {
              onStartChange([fr, fc]);
            }
          } else if (placementMode === "place-end") {
            if (fr !== start[0] || fc !== start[1]) {
              onEndChange([fr, fc]);
            }
          } else {
            const state = grid[fr][fc];
            if (state !== "start" && state !== "end") {
              const newGrid = grid.map((gridRow) => [...gridRow]);
              newGrid[fr][fc] = state === "wall" ? "empty" : "wall";
              onGridChange(newGrid);
            }
          }
          break;
        }
        default: {
          break;
        }
      }
    },
    [
      focusedCell,
      rows,
      cols,
      isAnimating,
      placementMode,
      grid,
      start,
      end,
      onStartChange,
      onEndChange,
      onGridChange,
    ],
  );

  useEffect(
    () => () => {
      dragModeRef.current = undefined;
    },
    [],
  );

  return (
    <div
      ref={containerRef}
      className="touch-none overflow-hidden rounded-lg border border-zinc-100/10 select-none dark:border-zinc-800"
      style={{
        aspectRatio: `${cols.toString()} / ${rows.toString()}`,
        cursor: isAnimating
          ? "not-allowed"
          : placementMode === "draw-walls"
            ? "crosshair"
            : "pointer",
        display: "grid",
        gridTemplateColumns: `repeat(${cols.toString()}, 1fr)`,
        width: "100%",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onContextMenu={handleContextMenu}
      onMouseLeave={() => {
        setRowHover(-1);
        setColHover(-1);
      }}
      onFocus={() => {
        if (!focusedCell) {
          setFocusedCell([0, 0]);
        }
      }}
      onBlur={() => {
        setFocusedCell(undefined);
      }}
      onKeyDown={handleKeyDown}
      role="grid"
      aria-label={t("gridLabel")}
    >
      {grid.map((row, ri) =>
        row.map((cellState, ci) => {
          const isStart = start[0] === ri && start[1] === ci;
          const isEnd = end[0] === ri && end[1] === ci;
          const effectiveState = isStart ? "start" : isEnd ? "end" : cellState;
          const isHovered = rowHover === ri && colHover === ci;
          const isFocused =
            focusedCell !== undefined && focusedCell[0] === ri && focusedCell[1] === ci;

          return (
            <div
              // the grid is automatically generated on the spot, so we
              // don't have anything else to use as key than the coordinates.
              // eslint-disable-next-line react/no-array-index-key
              key={`${ri.toString()}-${ci.toString()}`}
              role="gridcell"
              aria-label={effectiveState}
              aria-selected={isFocused}
              className={[
                CELL_COLORS[effectiveState],
                `border border-zinc-200 transition-colors duration-75 dark:border-zinc-800/90`,
                effectiveState === "visited" && "animate-pathfinding-visited",
                effectiveState === "path" && "animate-pathfinding-path border-amber-500/70!",
                effectiveState === "wall" && "border-foreground/30! dark:border-foreground/20!",
                effectiveState === "visited" && "border-blue-500/70!",
                effectiveState === "start" && "border-green-400!",
                effectiveState === "end" && "border-pink-500!",
                isHovered &&
                  effectiveState === "empty" &&
                  "bg-foreground/10! dark:bg-foreground/25! border-zinc-200/80",
                isFocused && "ring-accent relative z-10 ring-2 ring-inset",
              ]
                .filter(Boolean)
                .join(" ")}
              onMouseEnter={() => {
                setRowHover(ri);
                setColHover(ci);
              }}
            />
          );
        }),
      )}
    </div>
  );
};
