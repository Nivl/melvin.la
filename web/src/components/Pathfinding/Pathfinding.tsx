'use client';

import { useTranslations } from 'next-intl';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Section } from '#components/layout/Section';
import { useAnimationTimeouts } from '#hooks/useAnimationTimeouts';
import {
  runAStar,
  runBFS,
  runDFS,
  runDijkstra,
} from '#utils/pathfinding/algorithms';
import { generateMaze } from '#utils/pathfinding/maze';
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
} from '#utils/pathfinding/types';

import { Controls, SPEED_VALUES } from './Controls';
import { PathfindingGrid } from './Grid';

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

  for (const [r, c] of visitedNodes) {
    if ((r === start[0] && c === start[1]) || (r === end[0] && c === end[1]))
      continue;
    batch.push([r, c]);
  }

  for (let i = 0; i < batch.length; i += cellsPerTick) {
    const slice = batch.slice(i, i + cellsPerTick);
    delay += speed * cellsPerTick;
    schedule(() => {
      setGrid(prev => {
        const g = prev.map(row => [...row]);
        for (const [r, c] of slice) g[r][c] = 'visited';
        return g;
      });
    }, delay);
  }

  // Animate path cells
  for (const [r, c] of path) {
    if ((r === start[0] && c === start[1]) || (r === end[0] && c === end[1]))
      continue;
    delay += speed * PATH_ANIMATION_SPEED_MULTIPLIER;
    schedule(() => {
      setGrid(prev => {
        const g = prev.map(row => [...row]);
        g[r][c] = 'path';
        return g;
      });
    }, delay);
  }

  schedule(() => {
    onFinish(path.length > 0);
  }, delay + speed);
};

const makeEmptyGrid = (
  rows: number,
  cols: number,
  start: Coords,
  end: Coords,
): Grid => {
  return Array.from({ length: rows }, (_, ri) =>
    Array.from({ length: cols }, (_, ci) => {
      if (ri === start[0] && ci === start[1]) return 'start';
      if (ri === end[0] && ci === end[1]) return 'end';
      return 'empty';
    }),
  );
};

const clampCoords = (coords: Coords, rows: number, cols: number): Coords => [
  Math.min(coords[0], rows - 1),
  Math.min(coords[1], cols - 1),
];

export const Pathfinding = () => {
  const t = useTranslations('pathfinding');

  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [start, setStart] = useState<Coords>(DEFAULT_START);
  const [end, setEnd] = useState<Coords>(DEFAULT_END);
  const [grid, setGrid] = useState<Grid>(() =>
    makeEmptyGrid(DEFAULT_ROWS, DEFAULT_COLS, DEFAULT_START, DEFAULT_END),
  );
  const [algorithm, setAlgorithm] = useState<Algorithm>('astar');
  const [speed, setSpeed] = useState<number>(SPEED_VALUES.medium);
  const [isAnimating, setIsAnimating] = useState(false);
  const [noPath, setNoPath] = useState(false);
  const [placementMode, setPlacementMode] =
    useState<PlacementMode>('draw-walls');

  const hasPath = useMemo(
    () => grid.some(row => row.some(c => c === 'visited' || c === 'path')),
    [grid],
  );

  // Track what cell state was under start/end before they were placed.
  // This is needed to restore walls when moving start/end after maze generation.
  const startUnderRef = useRef<CellState>('empty');
  const endUnderRef = useRef<CellState>('empty');

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
    startUnderRef.current = 'empty';
    endUnderRef.current = 'empty';
    setGrid(makeEmptyGrid(rows, cols, newStart, newEnd));
    // We *only* want to reset when rows/cols change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, cols, stopAnimation]);

  const softReset = useCallback((g: Grid): Grid => {
    return g.map(row =>
      row.map(cell => (cell === 'visited' || cell === 'path' ? 'empty' : cell)),
    );
  }, []);

  const handleStartChange = useCallback(
    (coords: Coords) => {
      setNoPath(false);
      setStart(coords);
      setGrid(prev => {
        const g = softReset(prev);
        const [pr, pc] = start;
        g[pr][pc] = startUnderRef.current;
        const newUnder = g[coords[0]][coords[1]];
        startUnderRef.current =
          newUnder === 'start' || newUnder === 'end' ? 'empty' : newUnder;
        g[coords[0]][coords[1]] = 'start';
        return g;
      });
    },
    [start, softReset],
  );

  const handleEndChange = useCallback(
    (coords: Coords) => {
      setNoPath(false);
      setEnd(coords);
      setGrid(prev => {
        const g = softReset(prev);
        const [pr, pc] = end;
        g[pr][pc] = endUnderRef.current;
        const newUnder = g[coords[0]][coords[1]];
        endUnderRef.current =
          newUnder === 'start' || newUnder === 'end' ? 'empty' : newUnder;
        g[coords[0]][coords[1]] = 'end';
        return g;
      });
    },
    [end, softReset],
  );

  const handleVisualize = useCallback(() => {
    setNoPath(false);
    const cleanGrid = softReset(grid);

    const runners = {
      astar: runAStar,
      dijkstra: runDijkstra,
      bfs: runBFS,
      dfs: runDFS,
    } satisfies Record<
      Algorithm,
      (grid: Grid, start: Coords, end: Coords) => AlgorithmResult
    >;

    const { visitedNodes, path } = runners[algorithm](cleanGrid, start, end);

    setIsAnimating(true);
    setGrid(cleanGrid);

    scheduleAnimation(
      visitedNodes,
      path,
      start,
      end,
      speed,
      setGrid,
      schedule,
      hasPath => {
        setIsAnimating(false);
        if (!hasPath) setNoPath(true);
      },
    );
  }, [grid, softReset, algorithm, start, end, speed, schedule]);

  return (
    <>
      <Section className="lg:hidden">
        <div className="text-center">{t('needLargeScreen')}</div>
      </Section>

      <div className="hidden pb-6 lg:flex lg:flex-col lg:gap-3 lg:px-4 xl:px-8">
        <Section>
          <h1 className="font-condensed leading-tight-xs sm:leading-tight-sm xl:leading-tight-xl text-center text-6xl font-bold uppercase sm:text-8xl xl:text-9xl">
            {t('title')}
          </h1>
        </Section>

        <Section fullScreen={true} className="mx-0">
          {noPath && (
            <div className="bg-warning-100 border-warning-300 text-warning-800 dark:bg-warning-900/30 dark:border-warning-700 dark:text-warning-300 rounded-lg border px-4 py-2 text-sm font-medium">
              {t('noPathFound')}
            </div>
          )}
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
                  setNoPath(false);
                  setGrid(prev => softReset(prev));
                }}
                onClearAll={() => {
                  setNoPath(false);
                  startUnderRef.current = 'empty';
                  endUnderRef.current = 'empty';
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
