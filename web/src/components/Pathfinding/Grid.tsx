'use client';

import {
  MouseEvent,
  PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import type { Coords, Grid } from '#utils/pathfinding/types';

type DragMode = 'add-wall' | 'remove-wall' | undefined;

type GridProps = {
  grid: Grid;
  isAnimating: boolean;
  onGridChange: (grid: Grid) => void;
  start: Coords;
  end: Coords;
};

const CELL_COLORS: Record<string, string> = {
  empty: 'bg-default-100 dark:bg-default-50',
  wall: 'bg-default-600 dark:bg-default-500',
  start: 'bg-success-500',
  end: 'bg-danger-500',
  visited: 'bg-primary-400 dark:bg-primary-500',
  path: 'bg-warning-400',
};

export const PathfindingGrid = ({
  grid,
  isAnimating,
  onGridChange,
  start,
  end,
}: GridProps) => {
  const dragModeRef = useRef<DragMode>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  const [rowHover, setRowHover] = useState(-1);
  const [colHover, setColHover] = useState(-1);

  const getCellFromEvent = useCallback(
    (e: PointerEvent<HTMLDivElement>): Coords | undefined => {
      const container = containerRef.current;
      if (!container) return undefined;
      const rect = container.getBoundingClientRect();
      const col = Math.floor(((e.clientX - rect.left) / rect.width) * cols);
      const row = Math.floor(((e.clientY - rect.top) / rect.height) * rows);
      if (row < 0 || row >= rows || col < 0 || col >= cols) return undefined;
      return [row, col];
    },
    [rows, cols],
  );

  const applyWall = useCallback(
    (row: number, col: number, mode: DragMode) => {
      if (isAnimating || !mode) return;
      const state = grid[row][col];
      if (state === 'start' || state === 'end') return;
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = mode === 'add-wall' ? 'wall' : 'empty';
      onGridChange(newGrid);
    },
    [grid, isAnimating, onGridChange],
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (isAnimating) return;
      e.preventDefault();
      const coords = getCellFromEvent(e);
      if (!coords) return;
      const [row, col] = coords;
      const state = grid[row][col];
      if (state === 'start' || state === 'end') return;
      const mode: DragMode =
        e.button === 2 || state === 'wall' ? 'remove-wall' : 'add-wall';
      dragModeRef.current = mode;
      applyWall(row, col, mode);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [isAnimating, grid, getCellFromEvent, applyWall],
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!dragModeRef.current) return;
      const coords = getCellFromEvent(e);
      if (!coords) return;
      applyWall(coords[0], coords[1], dragModeRef.current);
    },
    [getCellFromEvent, applyWall],
  );

  const handlePointerUp = useCallback(() => {
    dragModeRef.current = undefined;
  }, []);

  const handleContextMenu = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  useEffect(() => {
    return () => {
      dragModeRef.current = undefined;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="border-default-200 touch-none overflow-hidden rounded-lg border select-none"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${String(cols)}, 1fr)`,
        aspectRatio: `${String(cols)} / ${String(rows)}`,
        width: '100%',
        cursor: isAnimating ? 'not-allowed' : 'crosshair',
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
      role="grid"
      aria-label="Pathfinding grid"
    >
      {grid.map((row, ri) =>
        row.map((cellState, ci) => {
          const isStart = start[0] === ri && start[1] === ci;
          const isEnd = end[0] === ri && end[1] === ci;
          const effectiveState = isStart ? 'start' : isEnd ? 'end' : cellState;
          const isHovered = rowHover === ri && colHover === ci;

          return (
            <div
              key={`${String(ri)}-${String(ci)}`}
              role="gridcell"
              aria-label={effectiveState}
              className={[
                CELL_COLORS[effectiveState] ?? CELL_COLORS.empty,
                'border-default-200/30 border transition-colors duration-75',
                effectiveState === 'visited' && 'animate-pathfinding-visited',
                effectiveState === 'path' && 'animate-pathfinding-path',
                isHovered &&
                  effectiveState === 'empty' &&
                  'bg-default-200 dark:bg-default-200',
              ]
                .filter(Boolean)
                .join(' ')}
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
