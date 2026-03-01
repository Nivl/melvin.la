export type CellState = 'empty' | 'wall' | 'start' | 'end' | 'visited' | 'path';

export type Grid = CellState[][];

export type Coords = [row: number, col: number];

export type AlgorithmResult = {
  visitedNodes: Coords[];
  path: Coords[];
};

export type Algorithm = 'astar' | 'dijkstra' | 'bfs' | 'dfs';

export const DEFAULT_ROWS = 20;
export const DEFAULT_COLS = 40;
export const DEFAULT_START: Coords = [10, 5];
export const DEFAULT_END: Coords = [10, 35];
