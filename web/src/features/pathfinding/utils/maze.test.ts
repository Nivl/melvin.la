import { describe, expect, it } from "vitest";

import { runBFS } from "./algorithms";
import { generateMaze } from "./maze";
import type { Coords } from "./types";

const START: Coords = [1, 1];
const END: Coords = [8, 18];

describe("generateMaze", () => {
  it("returns a grid with the correct dimensions", () => {
    const { grid } = generateMaze(10, 20, START, END);
    expect(grid).toHaveLength(10);
    for (const row of grid) {
      expect(row).toHaveLength(20);
    }
  });

  it("marks start and end cells correctly", () => {
    const { grid } = generateMaze(10, 20, START, END);
    const [sr, sc] = START;
    const [er, ec] = END;
    expect(grid[sr][sc]).toBe("start");
    expect(grid[er][ec]).toBe("end");
  });

  it("produces a solvable maze (start is reachable from end via BFS)", () => {
    // Run several times to account for randomness
    for (let i = 0; i < 5; i++) {
      const { grid } = generateMaze(15, 21, START, [13, 19]);
      // Temporarily turn start/end into passable cells for the pathfinder
      const passable = grid.map((row) =>
        row.map((cell) => (cell === "start" || cell === "end" ? "empty" : cell)),
      ) as typeof grid;

      const end: Coords = [13, 19];
      const { path } = runBFS(passable, START, end);
      expect(path.length).toBeGreaterThan(0);
    }
  });

  it("start cell has at least one passable neighbour", () => {
    const { grid } = generateMaze(10, 20, START, END);
    const [sr, sc] = START;
    const adjacent: Coords[] = [
      [sr - 1, sc],
      [sr + 1, sc],
      [sr, sc - 1],
      [sr, sc + 1],
    ];
    const hasPassable = adjacent.some(([r, c]) => {
      if (r < 0 || r >= grid.length || c < 0 || c >= (grid[0]?.length ?? 0)) return false;
      return grid[r]?.[c] !== "wall";
    });
    expect(hasPassable).toBe(true);
  });

  it("end cell has at least one passable neighbour", () => {
    const { grid } = generateMaze(10, 20, START, END);
    const [er, ec] = END;
    const adjacent: Coords[] = [
      [er - 1, ec],
      [er + 1, ec],
      [er, ec - 1],
      [er, ec + 1],
    ];
    const hasPassable = adjacent.some(([r, c]) => {
      if (r < 0 || r >= grid.length || c < 0 || c >= (grid[0]?.length ?? 0)) return false;
      return grid[r]?.[c] !== "wall";
    });
    expect(hasPassable).toBe(true);
  });

  it("does not overflow the call stack on a large grid (40×70)", () => {
    expect(() => generateMaze(40, 70, [1, 1], [38, 68])).not.toThrow();
  });
});
