import type { AlgorithmResult, Coords, Grid } from './types';

const DIRS: Coords[] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const isInBounds = (grid: Grid, row: number, col: number): boolean =>
  row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;

const isPassable = (grid: Grid, row: number, col: number): boolean =>
  isInBounds(grid, row, col) && grid[row][col] !== 'wall';

const reconstructPath = (
  cameFrom: Map<string, string>,
  endKey: string,
): Coords[] => {
  const path: Coords[] = [];
  let current: string | undefined = endKey;
  while (current !== undefined) {
    const [r, c] = current.split(',').map(Number) as [number, number];
    path.unshift([r, c]);
    current = cameFrom.get(current);
  }
  return path;
};

const key = (row: number, col: number) => [row, col].join(',');

// ─── A* ─────────────────────────────────────────────────────────────────────

const manhattan = (r1: number, c1: number, r2: number, c2: number) =>
  Math.abs(r1 - r2) + Math.abs(c1 - c2);

export const runAStar = (
  grid: Grid,
  start: Coords,
  end: Coords,
): AlgorithmResult => {
  const [sr, sc] = start;
  const [er, ec] = end;
  const startKey = key(sr, sc);
  const endKey = key(er, ec);

  const gScore = new Map<string, number>([[startKey, 0]]);
  const fScore = new Map<string, number>([
    [startKey, manhattan(sr, sc, er, ec)],
  ]);
  const openSet = new Set<string>([startKey]);
  const cameFrom = new Map<string, string>();
  const visited: Coords[] = [];

  while (openSet.size > 0) {
    // Pick node with lowest fScore
    let currentKey = '';
    let bestF = Infinity;
    for (const k of openSet) {
      const f = fScore.get(k) ?? Infinity;
      if (f < bestF) {
        bestF = f;
        currentKey = k;
      }
    }

    if (currentKey === endKey) {
      return { visitedNodes: visited, path: reconstructPath(cameFrom, endKey) };
    }

    openSet.delete(currentKey);
    const [cr, cc] = currentKey.split(',').map(Number) as [number, number];
    visited.push([cr, cc]);

    for (const [dr, dc] of DIRS) {
      const nr = cr + dr;
      const nc = cc + dc;
      if (!isPassable(grid, nr, nc)) continue;
      const neighborKey = key(nr, nc);
      const tentativeG = (gScore.get(currentKey) ?? Infinity) + 1;
      if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
        cameFrom.set(neighborKey, currentKey);
        gScore.set(neighborKey, tentativeG);
        fScore.set(neighborKey, tentativeG + manhattan(nr, nc, er, ec));
        openSet.add(neighborKey);
      }
    }
  }

  return { visitedNodes: visited, path: [] };
};

// ─── Dijkstra ────────────────────────────────────────────────────────────────

export const runDijkstra = (
  grid: Grid,
  start: Coords,
  end: Coords,
): AlgorithmResult => {
  const [sr, sc] = start;
  const endKey = key(...end);
  const dist = new Map<string, number>([[key(sr, sc), 0]]);
  // Simple min-heap simulation with a sorted array
  const queue: [number, string][] = [[0, key(sr, sc)]];
  const cameFrom = new Map<string, string>();
  const visited: Coords[] = [];
  const settled = new Set<string>();

  while (queue.length > 0) {
    queue.sort((a, b) => a[0] - b[0]);
    const entry = queue.shift();
    if (!entry) break;
    const [d, currentKey] = entry;
    if (settled.has(currentKey)) continue;
    settled.add(currentKey);

    const [cr, cc] = currentKey.split(',').map(Number) as [number, number];
    visited.push([cr, cc]);

    if (currentKey === endKey) {
      return { visitedNodes: visited, path: reconstructPath(cameFrom, endKey) };
    }

    for (const [dr, dc] of DIRS) {
      const nr = cr + dr;
      const nc = cc + dc;
      if (!isPassable(grid, nr, nc)) continue;
      const neighborKey = key(nr, nc);
      if (settled.has(neighborKey)) continue;
      const newDist = d + 1;
      if (newDist < (dist.get(neighborKey) ?? Infinity)) {
        dist.set(neighborKey, newDist);
        cameFrom.set(neighborKey, currentKey);
        queue.push([newDist, neighborKey]);
      }
    }
  }

  return { visitedNodes: visited, path: [] };
};

// ─── BFS ─────────────────────────────────────────────────────────────────────

export const runBFS = (
  grid: Grid,
  start: Coords,
  end: Coords,
): AlgorithmResult => {
  const [sr, sc] = start;
  const endKey = key(...end);
  const visited = new Set<string>([key(sr, sc)]);
  const queue: string[] = [key(sr, sc)];
  const cameFrom = new Map<string, string>();
  const visitedNodes: Coords[] = [];

  while (queue.length > 0) {
    const currentKey = queue.shift();
    if (currentKey === undefined) break;
    const [cr, cc] = currentKey.split(',').map(Number) as [number, number];
    visitedNodes.push([cr, cc]);

    if (currentKey === endKey) {
      return {
        visitedNodes,
        path: reconstructPath(cameFrom, endKey),
      };
    }

    for (const [dr, dc] of DIRS) {
      const nr = cr + dr;
      const nc = cc + dc;
      if (!isPassable(grid, nr, nc)) continue;
      const neighborKey = key(nr, nc);
      if (!visited.has(neighborKey)) {
        visited.add(neighborKey);
        cameFrom.set(neighborKey, currentKey);
        queue.push(neighborKey);
      }
    }
  }

  return { visitedNodes: visitedNodes, path: [] };
};

// ─── DFS ─────────────────────────────────────────────────────────────────────

export const runDFS = (
  grid: Grid,
  start: Coords,
  end: Coords,
): AlgorithmResult => {
  const [sr, sc] = start;
  const endKey = key(...end);
  const visited = new Set<string>([key(sr, sc)]);
  const stack: string[] = [key(sr, sc)];
  const cameFrom = new Map<string, string>();
  const visitedNodes: Coords[] = [];

  while (stack.length > 0) {
    const currentKey = stack.pop();
    if (currentKey === undefined) break;

    const [cr, cc] = currentKey.split(',').map(Number) as [number, number];
    visitedNodes.push([cr, cc]);

    if (currentKey === endKey) {
      return {
        visitedNodes,
        path: reconstructPath(cameFrom, endKey),
      };
    }

    for (const [dr, dc] of DIRS) {
      const nr = cr + dr;
      const nc = cc + dc;
      if (!isPassable(grid, nr, nc)) continue;
      const neighborKey = key(nr, nc);
      if (!visited.has(neighborKey)) {
        visited.add(neighborKey);
        cameFrom.set(neighborKey, currentKey);
        stack.push(neighborKey);
      }
    }
  }

  return { visitedNodes: visitedNodes, path: [] };
};
