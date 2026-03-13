import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, expect, test, vi } from 'vitest';

import type { Board, BoardValue } from '#models/conway';

import { ConwayGrid } from './Grid';

// setPointerCapture is not fully implemented in jsdom; patch it for tests
beforeAll(() => {
  HTMLElement.prototype.setPointerCapture = vi.fn();
});
afterAll(() => {
  // Reset to a no-op; jsdom never had a real implementation so there is nothing to restore
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  HTMLElement.prototype.setPointerCapture = () => {};
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const makeBoard = (size: number, fill: BoardValue = 0): Board =>
  Array.from({ length: size }, (): BoardValue[] =>
    Array.from({ length: size }, (): BoardValue => fill),
  );

const setup = ({
  board = makeBoard(3),
  boardSize = 3,
  isPlaying = false,
  ariaLabel = 'Conway grid',
}: Partial<{
  board: Board;
  boardSize: number;
  isPlaying: boolean;
  ariaLabel: string;
}> = {}) => {
  const onSetCell = vi.fn();
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

test('renders the correct number of cells', () => {
  const { getByRole } = setup({ board: makeBoard(4), boardSize: 4 });
  const grid = getByRole('region');
  expect(grid.children.length).toBe(16);
});

test('applies the aria-label prop', () => {
  const { getByRole } = setup({ ariaLabel: 'My game grid' });
  expect(getByRole('region', { name: 'My game grid' })).toBeDefined();
});

test('calls onSetCell when pointer is pressed on a dead cell while not playing', () => {
  const { getByRole, onSetCell } = setup({ board: makeBoard(3), boardSize: 3 });
  const grid = getByRole('region');

  vi.spyOn(grid, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    width: 300,
    height: 300,
    right: 300,
    bottom: 300,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });

  // clientX=50, clientY=50 → col=floor((50/300)*3)=0, row=0 → dead cell → set alive
  fireEvent.pointerDown(grid, { clientX: 50, clientY: 50, pointerId: 1 });

  expect(onSetCell).toHaveBeenCalledWith(0, 0, 1);
});

test('calls onSetCell to kill an alive cell on pointer down', () => {
  const board = makeBoard(3);
  if (board[1]) board[1][1] = 1; // centre cell is alive
  const { getByRole, onSetCell } = setup({ board, boardSize: 3 });
  const grid = getByRole('region');

  vi.spyOn(grid, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    width: 300,
    height: 300,
    right: 300,
    bottom: 300,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });

  // clientX=150, clientY=150 → col=floor((150/300)*3)=1, row=1 → alive cell → set dead
  fireEvent.pointerDown(grid, { clientX: 150, clientY: 150, pointerId: 1 });

  expect(onSetCell).toHaveBeenCalledWith(1, 1, 0);
});

test('does not call onSetCell on pointer down while playing', () => {
  const { getByRole, onSetCell } = setup({ isPlaying: true });
  const grid = getByRole('region');
  fireEvent.pointerDown(grid, { clientX: 50, clientY: 50, pointerId: 1 });
  expect(onSetCell).not.toHaveBeenCalled();
});
