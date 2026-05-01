export type CellState = "empty" | "wall" | "start" | "end" | "visited" | "path";

export type Grid = CellState[][];

export type Coords = [row: number, col: number];

export type AlgorithmResult = {
  visitedNodes: Coords[];
  path: Coords[];
};

export type Algorithm = "astar" | "dijkstra" | "bfs" | "dfs";

/** Serialises a grid coordinate pair to a string key for Maps/Sets. */
export const coordsToKey = (row: number, col: number): string => [row, col].join(",");

/** Parses a string key produced by `coordsToKey` back into grid coordinates. */
export const keyToCoords = (key: string): Coords => {
  const [row = "", col = ""] = key.split(",");
  return [Number(row), Number(col)];
};

export type PlacementMode = "draw-walls" | "place-start" | "place-end";

export const DEFAULT_ROWS = 20;
export const DEFAULT_COLS = 40;
export const DEFAULT_START: Coords = [10, 5];
export const DEFAULT_END: Coords = [10, 35];

export const CELL_COLORS: Record<CellState, string> = {
  empty: "bg-zinc-200/40 dark:bg-zinc-900",
  end: "bg-pink-500",
  path: "bg-amber-400",
  start: "bg-green-400",
  visited: "bg-blue-400",
  wall: "bg-foreground/50",
};

export const SPEED_VALUES = {
  fast: 5,
  medium: 30,
  slow: 80,
} as const;
