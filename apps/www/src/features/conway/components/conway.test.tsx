import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import type { Board } from "#features/conway/models";
import { boardSizes } from "#features/conway/models";
import { totalNeighbors } from "#features/conway/utils";
import { testWrapper as wrapper } from "#shared/utils/tests";

import { Conway } from "./conway";

const setup = () => {
  const user = userEvent.setup();
  const utils = render(<Conway />, { wrapper });
  return {
    ...utils,
    user,
  };
};

describe(Conway, () => {
  it("all the elements are on the page", () => {
    expect.assertions(5);
    const { getByRole, getByLabelText } = setup();

    expect(getByRole("heading", { level: 1, name: "Conway's Game of Life" })).toBeDefined();

    expect(getByLabelText("Speed", { selector: "input" })).toBeDefined();
    expect(getByLabelText("Board Size", { selector: "input" })).toBeDefined();
    expect(getByRole("button", { name: "Play" })).toBeDefined();
    expect(getByRole("switch", { name: "Wrap edges" })).toBeDefined();
  }, 5000);

  it("grid renders correct number of cells for default board size", () => {
    expect.assertions(2);
    const { getByRole } = setup();
    // Each cell is a div inside the grid container; the grid itself has role="region"
    const grid = getByRole("region");
    expect(grid).toBeDefined();
    // Derive expected cell count from the shared boardSizes constant to stay in sync with defaults
    const defaultSize = boardSizes[0];
    expect(grid.children).toHaveLength(defaultSize * defaultSize);
  }, 5000);
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

describe(totalNeighbors, () => {
  it("counts wrapped neighbours when toroidal is true", () => {
    expect.assertions(1);
    // col=1, row=0 — the three alive cells in row 2 wrap around to become neighbours
    expect(totalNeighbors(edgeBoard, 1, 0, true)).toBe(3);
  }, 5000);

  it("ignores out-of-bounds cells when toroidal is false", () => {
    expect.assertions(1);
    // col=1, row=0 — no valid in-bounds neighbours are alive
    expect(totalNeighbors(edgeBoard, 1, 0, false)).toBe(0);
  }, 5000);

  it("produces different counts for a corner cell depending on toroidal", () => {
    expect.assertions(1);
    // col=0, row=0 — with wrapping, board[2][2]=1 wraps to become a diagonal neighbour
    const toroidalCount = totalNeighbors(edgeBoard, 0, 0, true);
    const plainCount = totalNeighbors(edgeBoard, 0, 0, false);
    expect(toroidalCount).toBeGreaterThan(plainCount);
  }, 5000);
});
