import type { CellState, Coords, Grid } from "./types";
import { coordsToKey } from "./types";

type MazeResult = {
  grid: Grid;
  startUnder: CellState;
  endUnder: CellState;
};

const shuffle = <T>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const DIRS: Coords[] = [
  [-2, 0],
  [2, 0],
  [0, -2],
  [0, 2],
];

const MAZE_CARVE_START_ROW = 1;
const MAZE_CARVE_START_COL = 1;

/**
 * Recursive backtracking maze generation.
 * Returns a new grid filled with walls except for carved passages.
 */
export const generateMaze = (
  rows: number,
  cols: number,
  start: Coords,
  end: Coords,
): MazeResult => {
  // Fill everything with walls
  const grid: Grid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => "wall"));

  const visited = new Set<string>();

  // Iterative backtracking — avoids call-stack overflow on large grids.
  const carveIterative = (startR: number, startC: number) => {
    const stack: Coords[] = [[startR, startC]];
    visited.add(coordsToKey(startR, startC));
    grid[startR][startC] = "empty";

    while (stack.length > 0) {
      const top = stack.at(-1);
      if (!top) {
        break;
      }
      const [row, col] = top;

      const dirs = shuffle(DIRS);
      let moved = false;

      for (const [dr, dc] of dirs) {
        const nr = row + dr;
        const nc = col + dc;
        const mr = row + dr / 2;
        const mc = col + dc / 2;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(coordsToKey(nr, nc))) {
          visited.add(coordsToKey(nr, nc));
          grid[mr][mc] = "empty";
          grid[nr][nc] = "empty";
          stack.push([nr, nc]);
          moved = true;
          break;
        }
      }

      if (!moved) {
        stack.pop();
      }
    }
  };

  // Start carving from an odd-index cell near the top-left
  carveIterative(MAZE_CARVE_START_ROW, MAZE_CARVE_START_COL);

  // Ensure start/end cells are passable and have at least one open neighbour.
  // Cells on odd rows/cols may not have been reached by the carving traversal,
  // which would leave them walled-in and unreachable by any algorithm.
  const [sr, sc] = start;
  const [er, ec] = end;

  const ADJACENT: Coords[] = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  const ensureAccessible = (row: number, col: number) => {
    const hasEmpty = ADJACENT.some(([dr, dc]) => {
      const nr = row + dr;
      const nc = col + dc;
      return nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === "empty";
    });
    if (!hasEmpty) {
      for (const [dr, dc] of ADJACENT) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          grid[nr][nc] = "empty";
          return;
        }
      }
    }
  };

  ensureAccessible(sr, sc);
  ensureAccessible(er, ec);

  const startUnder: CellState = grid[sr][sc];
  const endUnder: CellState = grid[er][ec];
  grid[sr][sc] = "start";
  grid[er][ec] = "end";

  return { endUnder, grid, startUnder };
};
