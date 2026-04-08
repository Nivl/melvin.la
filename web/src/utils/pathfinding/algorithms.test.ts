import { describe, expect, it } from "vitest";

import { runAStar, runBFS, runDFS, runDijkstra } from "./algorithms";
import type { Coords, Grid } from "./types";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Build a Grid from an ASCII map. '#' = wall, anything else = empty. */
const fromAscii = (rows: string[]): Grid =>
  // row is an controlled string that we know won't contain utf-8 chars,
  // so spreading is safe here.
  // eslint-disable-next-line @typescript-eslint/no-misused-spread
  rows.map((row) => [...row].map((ch) => (ch === "#" ? "wall" : "empty")));

/** Check that every consecutive pair in path is adjacent (distance 1). */
const isConnectedPath = (path: Coords[]): boolean => {
  for (let i = 1; i < path.length; i++) {
    const dr = Math.abs(path[i][0] - path[i - 1][0]);
    const dc = Math.abs(path[i][1] - path[i - 1][1]);
    if (dr + dc !== 1) return false;
  }
  return true;
};

// ─── Fixtures ───────────────────────────────────────────────────────────────

// 5×5 open grid — every cell is passable
const OPEN_5x5: Grid = Array.from({ length: 5 }, () =>
  Array.from({ length: 5 }, () => "empty" as const),
);

// Simple corridor: S . . . E (1 row, 5 cols)
const CORRIDOR: Grid = [["empty", "empty", "empty", "empty", "empty"]];

// Maze with one clear shortest path of length 5
//  0 1 2 3 4
//  . . # . .   row 0
//  # . # . #   row 1
//  . . . . .   row 2
const MAZE: Grid = fromAscii([".#...", "..#..", "....."]);

const START: Coords = [0, 0];
const END_5x5: Coords = [4, 4];

const ALGORITHMS = [
  { name: "BFS", fn: runBFS },
  { name: "DFS", fn: runDFS },
  { name: "A*", fn: runAStar },
  { name: "Dijkstra", fn: runDijkstra },
] as const;

// ─── Shared tests ────────────────────────────────────────────────────────────

describe.each(ALGORITHMS)("$name", ({ fn }) => {
  it("finds a path in an open grid", () => {
    const { path } = fn(OPEN_5x5, START, END_5x5);
    expect(path.length).toBeGreaterThan(0);
    expect(path[0]).toEqual(START);
    expect(path.at(-1)).toEqual(END_5x5);
    expect(isConnectedPath(path)).toBe(true);
  });

  it("returns an empty path when destination is unreachable", () => {
    const grid: Grid = fromAscii(["S##", "###", "##E"]);
    const { path } = fn(grid, [0, 0], [2, 2]);
    expect(path).toHaveLength(0);
  });

  it("returns a single-node path when start equals end", () => {
    const { path } = fn(OPEN_5x5, START, START);
    expect(path).toEqual([START]);
  });

  it("visits at least the start node", () => {
    const { visitedNodes } = fn(OPEN_5x5, START, END_5x5);
    expect(visitedNodes.length).toBeGreaterThan(0);
    expect(visitedNodes[0]).toEqual(START);
  });

  it("finds a path along a single-row corridor", () => {
    const end: Coords = [0, 4];
    const { path } = fn(CORRIDOR, [0, 0], end);
    expect(path[0]).toEqual([0, 0]);
    expect(path.at(-1)).toEqual(end);
  });

  it("does not include wall cells in the path", () => {
    const { path } = fn(MAZE, [0, 0], [2, 4]);
    for (const [r, c] of path) {
      expect(MAZE[r][c]).not.toBe("wall");
    }
  });

  it("path does not include walls even when destination is blocked", () => {
    const grid: Grid = fromAscii(["....", ".##.", ".##.", "...."]);
    const { path } = fn(grid, [0, 0], [2, 3]);
    for (const [r, c] of path) {
      expect(grid[r][c]).not.toBe("wall");
    }
  });
});

// ─── BFS/Dijkstra/A* shortest-path guarantee ────────────────────────────────

describe.each([
  { name: "BFS", fn: runBFS },
  { name: "Dijkstra", fn: runDijkstra },
  { name: "A*", fn: runAStar },
] as const)("$name — shortest path", ({ fn }) => {
  it("returns a shortest path (Manhattan distance lower bound) in an open grid", () => {
    // Manhattan distance from [0,0] to [4,4] is 8 — shortest possible path length
    const { path } = fn(OPEN_5x5, START, END_5x5);
    expect(path.length).toBe(9); // 8 moves = 9 nodes
  });

  it("returns the shortest path in the maze fixture", () => {
    const end: Coords = [2, 4];
    const { path } = fn(MAZE, [0, 0], end);
    // Optimal path has length 7 (6 steps)
    expect(path.length).toBeLessThanOrEqual(7);
    expect(path[0]).toEqual([0, 0]);
    expect(path.at(-1)).toEqual(end);
  });
});
