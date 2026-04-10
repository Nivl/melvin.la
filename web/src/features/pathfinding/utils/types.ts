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
