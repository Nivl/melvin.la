"use client";

import { toast } from "@heroui/react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { runAStar, runBFS, runDFS, runDijkstra } from "#features/pathfinding/utils/algorithms";
import { generateMaze } from "#features/pathfinding/utils/maze";
import {
  Algorithm,
  AlgorithmResult,
  CellState,
  Coords,
  DEFAULT_COLS,
  DEFAULT_END,
  DEFAULT_ROWS,
  DEFAULT_START,
  Grid,
  PlacementMode,
  SPEED_VALUES,
} from "#features/pathfinding/utils/types";
import { Section } from "#shared/components/layout/section";
import { useAnimationTimeouts } from "#shared/hooks/use-animation-timeouts";

import { Controls } from "./controls";
import { PathfindingGrid } from "./grid";

const PATH_ANIMATION_SPEED_MULTIPLIER = 3;

const scheduleAnimation = (
  visitedNodes: Coords[],
  path: Coords[],
  start: Coords,
  end: Coords,
  speed: number,
  setGrid: Dispatch<SetStateAction<Grid>>,
  schedule: (cb: () => void, delay: number) => void,
  onFinish: (hasPath: boolean) => void,
) => {
  let delay = 0;

  // Batch visited-node updates: at most one setGrid per ~16 ms frame
  const cellsPerTick = Math.max(1, Math.round(16 / speed));
  const batch: Coords[] = [];

  for (const [row, col] of visitedNodes) {
    if ((row === start[0] && col === start[1]) || (row === end[0] && col === end[1])) {
      continue;
    }
    batch.push([row, col]);
  }

  for (let i = 0; i < batch.length; i += cellsPerTick) {
    const slice = batch.slice(i, i + cellsPerTick);
    delay += speed * cellsPerTick;
    schedule(() => {
      setGrid((prev) => {
        const newGrid = prev.map((gridRow) => [...gridRow]);
        for (const [row, col] of slice) {
          newGrid[row][col] = "visited";
        }
        return newGrid;
      });
    }, delay);
  }

  // Animate path cells
  for (const [row, col] of path) {
    if ((row === start[0] && col === start[1]) || (row === end[0] && col === end[1])) {
      continue;
    }
    delay += speed * PATH_ANIMATION_SPEED_MULTIPLIER;
    schedule(() => {
      setGrid((prev) => {
        const newGrid = prev.map((gridRow) => [...gridRow]);
        newGrid[row][col] = "path";
        return newGrid;
      });
    }, delay);
  }

  schedule(() => {
    onFinish(path.length > 0);
  }, delay + speed);
};

const makeEmptyGrid = (rows: number, cols: number, start: Coords, end: Coords): Grid =>
  Array.from({ length: rows }, (_row, ri) =>
    Array.from({ length: cols }, (_col, ci) => {
      if (ri === start[0] && ci === start[1]) {
        return "start";
      }
      if (ri === end[0] && ci === end[1]) {
        return "end";
      }
      return "empty";
    }),
  );

const clampCoords = (coords: Coords, rows: number, cols: number): Coords => [
  Math.min(coords[0], rows - 1),
  Math.min(coords[1], cols - 1),
];

export const Pathfinding = () => {
  const t = useTranslations("pathfinding");

  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [start, setStart] = useState(DEFAULT_START);
  const [end, setEnd] = useState(DEFAULT_END);
  const [grid, setGrid] = useState<Grid>(() =>
    makeEmptyGrid(DEFAULT_ROWS, DEFAULT_COLS, DEFAULT_START, DEFAULT_END),
  );
  const [algorithm, setAlgorithm] = useState<Algorithm>("astar");
  const [speed, setSpeed] = useState(SPEED_VALUES.medium as number);
  const [isAnimating, setIsAnimating] = useState(false);
  const [placementMode, setPlacementMode] = useState<PlacementMode>("draw-walls");

  const hasPath = useMemo(
    () => grid.some((row) => row.some((cell) => cell === "visited" || cell === "path")),
    [grid],
  );

  // Track what cell state was under start/end before they were placed.
  // This is needed to restore walls when moving start/end after maze generation.
  const startUnderRef = useRef<CellState>("empty");
  const endUnderRef = useRef<CellState>("empty");

  const { schedule, cancelAll } = useAnimationTimeouts();

  const stopAnimation = useCallback(() => {
    cancelAll();
    setIsAnimating(false);
  }, [cancelAll]);

  // Reset grid size when rows/cols change
  useEffect(() => {
    stopAnimation();
    const newStart = clampCoords(start, rows, cols);
    const newEnd = clampCoords(end, rows, cols);
    setStart(newStart);
    setEnd(newEnd);
    startUnderRef.current = "empty";
    endUnderRef.current = "empty";
    setGrid(makeEmptyGrid(rows, cols, newStart, newEnd));
    // We *only* want to reset when rows/cols change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, cols, stopAnimation]);

  const softReset = useCallback(
    (inputGrid: Grid): Grid =>
      inputGrid.map((row) =>
        row.map((cell) => (cell === "visited" || cell === "path" ? "empty" : cell)),
      ),
    [],
  );

  const handleStartChange = useCallback(
    (coords: Coords) => {
      setStart(coords);
      setGrid((prev) => {
        const newGrid = softReset(prev);
        const [prevRow, prevCol] = start;
        newGrid[prevRow][prevCol] = startUnderRef.current;
        const newUnder = newGrid[coords[0]][coords[1]];
        startUnderRef.current = newUnder === "start" || newUnder === "end" ? "empty" : newUnder;
        newGrid[coords[0]][coords[1]] = "start";
        return newGrid;
      });
    },
    [start, softReset],
  );

  const handleEndChange = useCallback(
    (coords: Coords) => {
      setEnd(coords);
      setGrid((prev) => {
        const newGrid = softReset(prev);
        const [prevRow, prevCol] = end;
        newGrid[prevRow][prevCol] = endUnderRef.current;
        const newUnder = newGrid[coords[0]][coords[1]];
        endUnderRef.current = newUnder === "start" || newUnder === "end" ? "empty" : newUnder;
        newGrid[coords[0]][coords[1]] = "end";
        return newGrid;
      });
    },
    [end, softReset],
  );

  const handleVisualize = useCallback(() => {
    const cleanGrid = softReset(grid);

    const runners = {
      astar: runAStar,
      bfs: runBFS,
      dfs: runDFS,
      dijkstra: runDijkstra,
    } satisfies Record<Algorithm, (grid: Grid, start: Coords, end: Coords) => AlgorithmResult>;

    const { visitedNodes, path } = runners[algorithm](cleanGrid, start, end);

    setIsAnimating(true);
    setGrid(cleanGrid);

    scheduleAnimation(visitedNodes, path, start, end, speed, setGrid, schedule, (pathFound) => {
      setIsAnimating(false);
      if (!pathFound) {
        toast.warning(t("noPathFound"));
      }
    });
  }, [grid, softReset, algorithm, start, end, speed, schedule, t]);

  return (
    <>
      <Section className="lg:hidden">
        <div className="text-center">{t("needLargeScreen")}</div>
      </Section>

      <div className="hidden pb-6 lg:flex lg:flex-col lg:gap-3 lg:px-4 xl:px-8">
        <Section>
          <h1 className="text-center font-condensed text-6xl leading-tight-xs font-bold uppercase sm:text-8xl sm:leading-tight-sm xl:text-9xl xl:leading-tight-xl">
            {t("title")}
          </h1>
        </Section>

        <Section fullScreen className="mx-0">
          <div className="flex gap-6">
            {/* Sidebar */}
            <aside className="w-52 shrink-0 xl:w-60">
              <Controls
                algorithm={algorithm}
                onAlgorithmChange={setAlgorithm}
                speed={speed}
                onSpeedChange={setSpeed}
                rows={rows}
                onRowsChange={setRows}
                cols={cols}
                onColsChange={setCols}
                isAnimating={isAnimating}
                onStop={stopAnimation}
                onVisualize={handleVisualize}
                placementMode={placementMode}
                onPlacementModeChange={setPlacementMode}
                hasPath={hasPath}
                onReset={() => {
                  setGrid((prev) => softReset(prev));
                }}
                onClearAll={() => {
                  startUnderRef.current = "empty";
                  endUnderRef.current = "empty";
                  setGrid(makeEmptyGrid(rows, cols, start, end));
                }}
                onGenerateMaze={() => {
                  stopAnimation();
                  const {
                    grid: newGrid,
                    startUnder,
                    endUnder,
                  } = generateMaze(rows, cols, start, end);
                  startUnderRef.current = startUnder;
                  endUnderRef.current = endUnder;
                  setGrid(newGrid);
                }}
              />
            </aside>

            {/* Grid */}
            <div className="min-w-0 flex-1">
              <PathfindingGrid
                grid={grid}
                isAnimating={isAnimating}
                onGridChange={setGrid}
                start={start}
                end={end}
                placementMode={placementMode}
                onStartChange={handleStartChange}
                onEndChange={handleEndChange}
              />
            </div>
          </div>
        </Section>
      </div>
    </>
  );
};
