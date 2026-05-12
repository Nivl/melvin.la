import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Board, BoardValue } from "#features/conway/models";

import { ConwayGrid } from "./grid";

// setPointerCapture is not defined in jsdom; install a stub at module load.
// vitest isolates each test file so the polyfill stays local to this file.
HTMLElement.prototype.setPointerCapture = () => {};

const makeBoard = (size: number, fill: BoardValue = 0): Board =>
  Array.from({ length: size }, (): BoardValue[] =>
    Array.from({ length: size }, (): BoardValue => fill),
  );

const setup = ({
  board = makeBoard(3),
  boardSize = 3,
  isPlaying = false,
  ariaLabel = "Conway grid",
}: Partial<{
  board: Board;
  boardSize: number;
  isPlaying: boolean;
  ariaLabel: string;
}> = {}) => {
  const onSetCell = vi.fn<(row: number, col: number, value: BoardValue) => void>();
  const utils = render(
    <ConwayGrid
      board={board}
      boardSize={boardSize}
      isPlaying={isPlaying}
      ariaLabel={ariaLabel}
      onSetCell={onSetCell}
    />,
  );
  return { ...utils, onSetCell };
};

const stubGridRect = (grid: Element) => {
  vi.spyOn(grid, "getBoundingClientRect").mockReturnValue({
    bottom: 300,
    height: 300,
    left: 0,
    right: 300,
    toJSON: () => ({}),
    top: 0,
    width: 300,
    x: 0,
    y: 0,
  });
};

describe(ConwayGrid, () => {
  it("renders the correct number of cells", () => {
    expect.assertions(1);
    const { getByRole } = setup({ board: makeBoard(4), boardSize: 4 });
    const grid = getByRole("region");
    expect(grid.children).toHaveLength(16);
  }, 5000);

  it("applies the aria-label prop", () => {
    expect.assertions(1);
    const { getByRole } = setup({ ariaLabel: "My game grid" });
    expect(getByRole("region", { name: "My game grid" })).toBeDefined();
  }, 5000);

  it("calls onSetCell when pointer is pressed on a dead cell while not playing", () => {
    expect.assertions(1);
    const { getByRole, onSetCell } = setup({ board: makeBoard(3), boardSize: 3 });
    const grid = getByRole("region");
    stubGridRect(grid);

    // clientX=50, clientY=50 → col=floor((50/300)*3)=0, row=0 → dead cell → set alive
    fireEvent.pointerDown(grid, { clientX: 50, clientY: 50, pointerId: 1 });

    expect(onSetCell).toHaveBeenCalledWith(0, 0, 1);
  }, 5000);

  it("calls onSetCell to kill an alive cell on pointer down", () => {
    expect.assertions(1);
    const board = makeBoard(3);
    board[1][1] = 1; // centre cell is alive
    const { getByRole, onSetCell } = setup({ board, boardSize: 3 });
    const grid = getByRole("region");
    stubGridRect(grid);

    // clientX=150, clientY=150 → col=floor((150/300)*3)=1, row=1 → alive cell → set dead
    fireEvent.pointerDown(grid, { clientX: 150, clientY: 150, pointerId: 1 });

    expect(onSetCell).toHaveBeenCalledWith(1, 1, 0);
  }, 5000);

  it("does not call onSetCell on pointer down while playing", () => {
    expect.assertions(1);
    const { getByRole, onSetCell } = setup({ isPlaying: true });
    const grid = getByRole("region");
    fireEvent.pointerDown(grid, { clientX: 50, clientY: 50, pointerId: 1 });
    expect(onSetCell).not.toHaveBeenCalled();
  }, 5000);
});
