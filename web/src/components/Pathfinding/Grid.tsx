'use client';

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

const CELL_COLORS: Record<CellState, string> = {
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
  placementMode,
  onStartChange,
  onEndChange,
}: GridProps) => {
  const dragModeRef = useRef<DragMode>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

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
      className="border-default-200 touch-none overflow-hidden rounded-lg border select-none"
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
      tabIndex={0}
      onFocus={() => {
        if (!focusedCell) setFocusedCell([0, 0]);
      }}
      onBlur={() => {
        setFocusedCell(undefined);
      }}
      onKeyDown={handleKeyDown}
      role="grid"
      aria-label="Pathfinding grid"
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
                'border-default-200/30 border transition-colors duration-75',
                effectiveState === 'visited' && 'animate-pathfinding-visited',
                effectiveState === 'path' && 'animate-pathfinding-path',
                isHovered &&
                  effectiveState === 'empty' &&
                  'bg-default-200 dark:bg-default-200',
                isFocused && 'ring-primary-500 relative z-10 ring-2 ring-inset',
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
