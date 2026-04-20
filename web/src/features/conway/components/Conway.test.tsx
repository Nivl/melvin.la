import { cleanup, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";

import { type Board, boardSizes } from "#features/conway/models";
import { totalNeighbors } from "#features/conway/utils";
import { testWrapper as wrapper } from "#shared/utils/tests";

import { Conway } from "./Conway";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const setup = () => {
  const user = userEvent.setup();
  const utils = render(<Conway />, { wrapper });
  return {
    ...utils,
    user,
  };
};

test("All the elements are on the page", () => {
  const { getByRole, getByLabelText } = setup();

  expect(getByRole("heading", { level: 1, name: "Conway's Game of Life" })).toBeDefined();

  expect(getByLabelText("Speed", { selector: "input" })).toBeDefined();
  expect(getByLabelText("Board Size", { selector: "input" })).toBeDefined();
  expect(getByRole("button", { name: "Play" })).toBeDefined();
  expect(getByRole("switch", { name: "Wrap edges" })).toBeDefined();
});

test("Grid renders correct number of cells for default board size", () => {
  const { getByRole } = setup();
  // Each cell is a div inside the grid container; the grid itself has role="region"
  const grid = getByRole("region");
  expect(grid).toBeDefined();
  // Derive expected cell count from the shared boardSizes constant to stay in sync with defaults
  const defaultSize = boardSizes[0];
  expect(grid.children.length).toBe(defaultSize * defaultSize);
});

// ── totalNeighbors unit tests ────────────────────────────────────────────────

// Board used for edge-wrapping tests:
//   row 0: . . .
//   row 1: . . .
//   row 2: 1 1 1
// Cell [row=0, col=1] has no in-bounds neighbours but gains 3 via toroidal wrap.
const edgeBoard: Board = [
  [0, 0, 0],
  [0, 0, 0],
  [1, 1, 1],
];

test("totalNeighbors counts wrapped neighbours when toroidal is true", () => {
  // col=1, row=0 — the three alive cells in row 2 wrap around to become neighbours
  expect(totalNeighbors(edgeBoard, 1, 0, true)).toBe(3);
});

test("totalNeighbors ignores out-of-bounds cells when toroidal is false", () => {
  // col=1, row=0 — no valid in-bounds neighbours are alive
  expect(totalNeighbors(edgeBoard, 1, 0, false)).toBe(0);
});

test("totalNeighbors produces different counts for a corner cell depending on toroidal", () => {
  // col=0, row=0 — with wrapping, board[2][2]=1 wraps to become a diagonal neighbour
  const toroidalCount = totalNeighbors(edgeBoard, 0, 0, true);
  const plainCount = totalNeighbors(edgeBoard, 0, 0, false);
  expect(toroidalCount).toBeGreaterThan(plainCount);
});
