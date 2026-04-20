import type { AlgorithmResult, Coords, Grid } from "./types";
import { coordsToKey, keyToCoords } from "./types";

const DIRS: Coords[] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const isInBounds = (grid: Grid, row: number, col: number): boolean =>
  grid.length > 0 && row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;

const isPassable = (grid: Grid, row: number, col: number): boolean =>
  isInBounds(grid, row, col) && grid[row][col] !== "wall";

const reconstructPath = (cameFrom: Map<string, string>, endKey: string): Coords[] => {
  const path: Coords[] = [];
  let current: string | undefined = endKey;
  while (current !== undefined) {
    const [r, c] = keyToCoords(current);
    path.push([r, c]);
    current = cameFrom.get(current);
  }
  path.reverse();
  return path;
};

// ─── Binary Min-Heap ─────────────────────────────────────────────────────────

/** Lightweight binary min-heap of (priority, value) pairs. */
class MinHeap {
  private readonly heap: [number, string][] = [];

  push(priority: number, value: string): void {
    this.heap.push([priority, value]);
    this.siftUp(this.heap.length - 1);
  }

  pop(): [number, string] | undefined {
    const { heap } = this;
    if (heap.length === 0) return undefined;
    const top = heap[0];
    const last = heap.pop();
    if (heap.length > 0 && last !== undefined) {
      heap[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  get size(): number {
    return this.heap.length;
  }

  private siftUp(i: number): void {
    const { heap } = this;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      const p = heap[parent];
      const c = heap[i];
      if (p[0] <= c[0]) break;
      heap[parent] = c;
      heap[i] = p;
      i = parent;
    }
  }

  private siftDown(i: number): void {
    const { heap } = this;
    const n = heap.length;
    for (;;) {
      let min = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && (heap[l]?.[0] ?? Infinity) < (heap[min]?.[0] ?? Infinity)) min = l;
      if (r < n && (heap[r]?.[0] ?? Infinity) < (heap[min]?.[0] ?? Infinity)) min = r;
      if (min === i) break;
      const a = heap[i];
      const b = heap[min];
      heap[i] = b;
      heap[min] = a;
      i = min;
    }
  }
}

// ─── A* ─────────────────────────────────────────────────────────────────────

const manhattan = (r1: number, c1: number, r2: number, c2: number) =>
  Math.abs(r1 - r2) + Math.abs(c1 - c2);

export const runAStar = (grid: Grid, start: Coords, end: Coords): AlgorithmResult => {
  const [sr, sc] = start;
  const [er, ec] = end;
  const startKey = coordsToKey(sr, sc);
  const endKey = coordsToKey(er, ec);

  const gScore = new Map<string, number>([[startKey, 0]]);
  const cameFrom = new Map<string, string>();
  const visitedNodes: Coords[] = [];
  const settled = new Set<string>();
  const open = new MinHeap();
  open.push(manhattan(sr, sc, er, ec), startKey);

  while (open.size > 0) {
    const entry = open.pop();
    if (!entry) break;
    const [, currentKey] = entry;

    if (settled.has(currentKey)) continue;
    settled.add(currentKey);

    const [cr, cc] = keyToCoords(currentKey);
    visitedNodes.push([cr, cc]);

    if (currentKey === endKey) {
      return { visitedNodes, path: reconstructPath(cameFrom, endKey) };
    }

    const g = gScore.get(currentKey) ?? Infinity;
    for (const [dr, dc] of DIRS) {
      const nr = cr + dr;
      const nc = cc + dc;
      if (!isPassable(grid, nr, nc)) continue;
      const neighborKey = coordsToKey(nr, nc);
      if (settled.has(neighborKey)) continue;
      const tentativeG = g + 1;
      if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
        cameFrom.set(neighborKey, currentKey);
        gScore.set(neighborKey, tentativeG);
        open.push(tentativeG + manhattan(nr, nc, er, ec), neighborKey);
      }
    }
  }

  return { visitedNodes, path: [] };
};

// ─── Dijkstra ────────────────────────────────────────────────────────────────

export const runDijkstra = (grid: Grid, start: Coords, end: Coords): AlgorithmResult => {
  const [sr, sc] = start;
  const startKey = coordsToKey(sr, sc);
  const endKey = coordsToKey(...end);

  const dist = new Map<string, number>([[startKey, 0]]);
  const cameFrom = new Map<string, string>();
  const visitedNodes: Coords[] = [];
  const settled = new Set<string>();
  const pq = new MinHeap();
  pq.push(0, startKey);

  while (pq.size > 0) {
    const entry = pq.pop();
    if (!entry) break;
    const [d, currentKey] = entry;

    if (settled.has(currentKey)) continue;
    settled.add(currentKey);

    const [cr, cc] = keyToCoords(currentKey);
    visitedNodes.push([cr, cc]);

    if (currentKey === endKey) {
      return { visitedNodes, path: reconstructPath(cameFrom, endKey) };
    }

    for (const [dr, dc] of DIRS) {
      const nr = cr + dr;
      const nc = cc + dc;
      if (!isPassable(grid, nr, nc)) continue;
      const neighborKey = coordsToKey(nr, nc);
      if (settled.has(neighborKey)) continue;
      const newDist = d + 1;
      if (newDist < (dist.get(neighborKey) ?? Infinity)) {
        dist.set(neighborKey, newDist);
        cameFrom.set(neighborKey, currentKey);
        pq.push(newDist, neighborKey);
      }
    }
  }

  return { visitedNodes, path: [] };
};

// ─── BFS ─────────────────────────────────────────────────────────────────────

export const runBFS = (grid: Grid, start: Coords, end: Coords): AlgorithmResult => {
  const [sr, sc] = start;
  const endKey = coordsToKey(...end);
  const visited = new Set<string>([coordsToKey(sr, sc)]);
  const queue: string[] = [coordsToKey(sr, sc)];
  const cameFrom = new Map<string, string>();
  const visitedNodes: Coords[] = [];

  for (const currentKey of queue) {
    const [cr, cc] = keyToCoords(currentKey);
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
      const neighborKey = coordsToKey(nr, nc);
      if (!visited.has(neighborKey)) {
        visited.add(neighborKey);
        cameFrom.set(neighborKey, currentKey);
        queue.push(neighborKey);
      }
    }
  }

  return { visitedNodes, path: [] };
};

// ─── DFS ─────────────────────────────────────────────────────────────────────

export const runDFS = (grid: Grid, start: Coords, end: Coords): AlgorithmResult => {
  const [sr, sc] = start;
  const endKey = coordsToKey(...end);
  const visited = new Set<string>([coordsToKey(sr, sc)]);
  const stack: string[] = [coordsToKey(sr, sc)];
  const cameFrom = new Map<string, string>();
  const visitedNodes: Coords[] = [];

  while (stack.length > 0) {
    const currentKey = stack.pop();
    if (currentKey === undefined) break;

    const [cr, cc] = keyToCoords(currentKey);
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
      const neighborKey = coordsToKey(nr, nc);
      if (!visited.has(neighborKey)) {
        visited.add(neighborKey);
        cameFrom.set(neighborKey, currentKey);
        stack.push(neighborKey);
      }
    }
  }

  return { visitedNodes, path: [] };
};
