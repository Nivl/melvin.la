import type { Coords, Grid } from './types';

const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const DIRS: Coords[] = [
  [-2, 0],
  [2, 0],
  [0, -2],
  [0, 2],
];

/**
 * Recursive backtracking maze generation.
 * Returns a new grid filled with walls except for carved passages.
 */
export const generateMaze = (
  rows: number,
  cols: number,
  start: Coords,
  end: Coords,
): Grid => {
  // Fill everything with walls
  const grid: Grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 'wall'),
  );

  const visited = new Set<string>();
  const key = (r: number, c: number) => [r, c].join(',');

  const carve = (r: number, c: number) => {
    visited.add(key(r, c));
    grid[r][c] = 'empty';

    for (const [dr, dc] of shuffle(DIRS)) {
      const nr = r + dr;
      const nc = c + dc;
      const mr = r + dr / 2;
      const mc = c + dc / 2;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        !visited.has(key(nr, nc))
      ) {
        grid[mr][mc] = 'empty';
        carve(nr, nc);
      }
    }
  };

  // Start carving from an odd-index cell near the top-left
  carve(1, 1);

  // Ensure start/end cells are passable
  const [sr, sc] = start;
  const [er, ec] = end;
  grid[sr][sc] = 'start';
  grid[er][ec] = 'end';

  return grid;
};
