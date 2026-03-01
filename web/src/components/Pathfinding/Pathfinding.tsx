'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  runAStar,
  runBFS,
  runDFS,
  runDijkstra,
} from '#utils/pathfinding/algorithms';
import { generateMaze } from '#utils/pathfinding/maze';
import {
  Algorithm,
  Coords,
  DEFAULT_COLS,
  DEFAULT_END,
  DEFAULT_ROWS,
  DEFAULT_START,
  Grid,
  PlacementMode,
} from '#utils/pathfinding/types';

import { Section } from '../layout/Section';
import { Controls, SPEED_VALUES } from './Controls';
import { PathfindingGrid } from './Grid';

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
  const [placementMode, setPlacementMode] = useState<PlacementMode>('draw-walls');

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const cancelAnimation = useCallback(() => {
    for (const id of timeoutsRef.current) clearTimeout(id);
    timeoutsRef.current = [];
    setIsAnimating(false);
  }, []);

  // Reset grid size when rows/cols change
  useEffect(() => {
    const newStart = clampCoords(start, rows, cols);
    const newEnd = clampCoords(end, rows, cols);
    setStart(newStart);
    setEnd(newEnd);
    setGrid(makeEmptyGrid(rows, cols, newStart, newEnd));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, cols]);

  const handleReset = useCallback(() => {
    setNoPath(false);
    setGrid(prev =>
      prev.map(row =>
        row.map(cell =>
          cell === 'visited' || cell === 'path' ? 'empty' : cell,
        ),
      ),
    );
  }, []);

  const handleClearAll = useCallback(() => {
    setNoPath(false);
    setGrid(makeEmptyGrid(rows, cols, start, end));
  }, [rows, cols, start, end]);

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
        g[pr][pc] = 'empty';
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
        g[pr][pc] = 'empty';
        g[coords[0]][coords[1]] = 'end';
        return g;
      });
    },
    [end, softReset],
  );

  const handleGenerateMaze = useCallback(() => {    cancelAnimation();
    setGrid(generateMaze(rows, cols, start, end));
  }, [rows, cols, start, end, cancelAnimation]);

  const handleVisualize = useCallback(() => {
    setNoPath(false);
    // First clear any previous visited/path
    const cleanGrid = grid.map(row =>
      row.map(cell => (cell === 'visited' || cell === 'path' ? 'empty' : cell)),
    );

    const runners = {
      astar: runAStar,
      dijkstra: runDijkstra,
      bfs: runBFS,
      dfs: runDFS,
    };

    const { visitedNodes, path } = runners[algorithm](cleanGrid, start, end);

    setIsAnimating(true);

    const newGrid = cleanGrid.map(r => [...r]);

    let delay = 0;
    const ts: ReturnType<typeof setTimeout>[] = [];

    // Animate visited nodes
    for (const [r, c] of visitedNodes) {
      // Skip start/end cells visual state
      if ((r === start[0] && c === start[1]) || (r === end[0] && c === end[1]))
        continue;

      delay += speed;
      ts.push(
        setTimeout(() => {
          setGrid(prev => {
            const g = prev.map(row => [...row]);
            g[r][c] = 'visited';
            return g;
          });
        }, delay),
      );
    }

    // After visited, animate path
    if (path.length > 0) {
      for (const [r, c] of path) {
        if (
          (r === start[0] && c === start[1]) ||
          (r === end[0] && c === end[1])
        )
          continue;

        delay += speed * 3;
        ts.push(
          setTimeout(() => {
            setGrid(prev => {
              const g = prev.map(row => [...row]);
              g[r][c] = 'path';
              return g;
            });
          }, delay),
        );
      }
    }

    // Finish
    ts.push(
      setTimeout(() => {
        setIsAnimating(false);
        if (path.length === 0) {
          setNoPath(true);
        }
      }, delay + speed),
    );

    timeoutsRef.current = ts;
    // Apply clean grid immediately
    setGrid(newGrid);
  }, [grid, algorithm, start, end, speed]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      for (const id of timeoutsRef.current) {
        clearTimeout(id);
      }
    };
  }, []);

  return (
    <>
      <Section className="lg:hidden">
        <div className="text-center">{t('needLargeScreen')}</div>
      </Section>

      <div className="hidden pb-6 lg:flex lg:flex-col lg:gap-3 lg:px-4 xl:px-8">
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
              cols={cols}
              onRowsChange={setRows}
              onColsChange={setCols}
              isAnimating={isAnimating}
              placementMode={placementMode}
              onPlacementModeChange={setPlacementMode}
              onVisualize={handleVisualize}
              onStop={cancelAnimation}
              onReset={handleReset}
              onClearAll={handleClearAll}
              onGenerateMaze={handleGenerateMaze}
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
      </div>
    </>
  );
};
