'use client';

import { MouseEvent, useCallback, useState } from 'react';

import type { Coords, Grid } from '#utils/pathfinding/types';

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
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  const [rowHover, setRowHover] = useState(-1);
  const [colHover, setColHover] = useState(-1);

  const handleCellClick = useCallback(
    (row: number, col: number, effectiveState: string) => {
      if (isAnimating) return;
      if (effectiveState === 'start' || effectiveState === 'end') return;
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = grid[row][col] === 'wall' ? 'empty' : 'wall';
      onGridChange(newGrid);
    },
    [grid, isAnimating, onGridChange],
  );

  const handleCellContextMenu = useCallback(
    (
      e: MouseEvent<HTMLDivElement>,
      row: number,
      col: number,
      effectiveState: string,
    ) => {
      e.preventDefault();
      if (isAnimating) return;
      if (effectiveState === 'start' || effectiveState === 'end') return;
      if (grid[row][col] !== 'wall') return;
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = 'empty';
      onGridChange(newGrid);
    },
    [grid, isAnimating, onGridChange],
  );

  return (
    <div
      className="border-default-200 overflow-hidden rounded-lg border select-none"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${String(cols)}, 1fr)`,
        aspectRatio: `${String(cols)} / ${String(rows)}`,
        width: '100%',
        cursor: isAnimating ? 'not-allowed' : 'crosshair',
      }}
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
                !isAnimating &&
                  effectiveState !== 'start' &&
                  effectiveState !== 'end' &&
                  'cursor-pointer',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => {
                handleCellClick(ri, ci, effectiveState);
              }}
              onContextMenu={e => {
                handleCellContextMenu(e, ri, ci, effectiveState);
              }}
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
