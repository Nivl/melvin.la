'use client';

import { useTranslations } from 'next-intl';
import {
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import type {
  CellState,
  Coords,
  Grid,
  PlacementMode,
} from '#utils/pathfinding/types';

type DragMode = 'add-wall' | 'remove-wall' | undefined;

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

export const CELL_COLORS: Record<CellState, string> = {
  empty: 'bg-zinc-200/40 dark:bg-zinc-900',
  wall: 'bg-foreground/50',
  start: 'bg-green-400',
  end: 'bg-pink-500',
  visited: 'bg-blue-400',
  path: 'bg-amber-400',
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

  const t = useTranslations('pathfinding');

  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  const [rowHover, setRowHover] = useState(-1);
  const [colHover, setColHover] = useState(-1);
  const [focusedCell, setFocusedCell] = useState<Coords | undefined>();

  const getCellFromEvent = useCallback(
    (e: PointerEvent<HTMLDivElement>): Coords | undefined => {
      const container = containerRef.current;
      if (!container) return undefined;
      const rect = container.getBoundingClientRect();
      const col = Math.floor(((e.clientX - rect.left) / rect.width) * cols);
      const row = Math.floor(((e.clientY - rect.top) / rect.height) * rows);
      if (
        Number.isNaN(row) ||
        Number.isNaN(col) ||
        row < 0 ||
        row >= rows ||
        col < 0 ||
        col >= cols
      )
        return undefined;
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

      // Placement mode: move start or end node
      if (placementMode === 'place-start' || placementMode === 'place-end') {
        if (placementMode === 'place-start') {
          if (row === end[0] && col === end[1]) return;
          onStartChange([row, col]);
        } else {
          if (row === start[0] && col === start[1]) return;
          onEndChange([row, col]);
        }
        return;
      }

      const state = grid[row][col];
      if (state === 'start' || state === 'end') return;
      const mode: DragMode =
        e.button === 2 || state === 'wall' ? 'remove-wall' : 'add-wall';
      dragModeRef.current = mode;
      applyWall(row, col, mode);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
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

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!focusedCell) return;
      const [fr, fc] = focusedCell;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (fr > 0) setFocusedCell([fr - 1, fc]);
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (fr < rows - 1) setFocusedCell([fr + 1, fc]);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (fc > 0) setFocusedCell([fr, fc - 1]);
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (fc < cols - 1) setFocusedCell([fr, fc + 1]);
          break;
        case ' ':
        case 'Enter': {
          e.preventDefault();
          if (isAnimating) break;
          if (placementMode === 'place-start') {
            if (fr !== end[0] || fc !== end[1]) onStartChange([fr, fc]);
          } else if (placementMode === 'place-end') {
            if (fr !== start[0] || fc !== start[1]) onEndChange([fr, fc]);
          } else {
            const state = grid[fr][fc];
            if (state !== 'start' && state !== 'end') {
              const newGrid = grid.map(r => [...r]);
              newGrid[fr][fc] = state === 'wall' ? 'empty' : 'wall';
              onGridChange(newGrid);
            }
          }
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

  useEffect(() => {
    return () => {
      dragModeRef.current = undefined;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="touch-none overflow-hidden rounded-lg border border-zinc-100/10 select-none dark:border-zinc-800"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols.toString()}, 1fr)`,
        aspectRatio: `${cols.toString()} / ${rows.toString()}`,
        width: '100%',
        cursor: isAnimating
          ? 'not-allowed'
          : placementMode === 'draw-walls'
            ? 'crosshair'
            : 'pointer',
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
        if (!focusedCell) setFocusedCell([0, 0]);
      }}
      onBlur={() => {
        setFocusedCell(undefined);
      }}
      onKeyDown={handleKeyDown}
      role="grid"
      aria-label={t('gridLabel')}
    >
      {grid.map((row, ri) =>
        row.map((cellState, ci) => {
          const isStart = start[0] === ri && start[1] === ci;
          const isEnd = end[0] === ri && end[1] === ci;
          const effectiveState = isStart ? 'start' : isEnd ? 'end' : cellState;
          const isHovered = rowHover === ri && colHover === ci;
          const isFocused =
            focusedCell !== undefined &&
            focusedCell[0] === ri &&
            focusedCell[1] === ci;

          return (
            <div
              key={`${ri.toString()}-${ci.toString()}`}
              role="gridcell"
              aria-label={effectiveState}
              aria-selected={isFocused}
              className={[
                CELL_COLORS[effectiveState] ?? CELL_COLORS.empty,
                `border border-zinc-200 transition-colors duration-75 dark:border-zinc-800/90`,
                effectiveState === 'visited' && 'animate-pathfinding-visited',
                effectiveState === 'path' &&
                  'animate-pathfinding-path border-amber-500/70!',
                effectiveState === 'wall' &&
                  'border-foreground/30! dark:border-foreground/20!',
                effectiveState === 'visited' && 'border-blue-500/70!',
                effectiveState === 'start' && 'border-green-400!',
                effectiveState === 'end' && 'border-pink-500!',
                isHovered &&
                  effectiveState === 'empty' &&
                  'bg-foreground/10! dark:bg-foreground/25! border-zinc-200/80',
                isFocused && 'ring-accent relative z-10 ring-2 ring-inset',
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
