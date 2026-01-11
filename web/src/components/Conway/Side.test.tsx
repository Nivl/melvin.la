import { cleanup, fireEvent, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';

import { Board, boardSizes } from '#models/conway';
import { testWrapper as wrapper } from '#utils/tests';

import { Side } from './Side';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const setup = ({
  board = [] as Board,
  boardSize = boardSizes[0],
  speed = 1,
  isPlaying = false,
}: {
  board?: Board;
  boardSize?: number;
  speed?: number;
  isPlaying?: boolean;
} = {}) => {
  const user = userEvent.setup();
  const setBoard = vi.fn();
  const setBoardSize = vi.fn();
  const setSpeed = vi.fn();
  const setIsPlaying = vi.fn();

  const utils = render(
    <Side
      board={board}
      setBoard={setBoard}
      boardSize={boardSize}
      setBoardSize={setBoardSize}
      speed={speed}
      setSpeed={setSpeed}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
    />,
    { wrapper },
  );
  return {
    ...utils,
    user,
    spies: {
      setBoard,
      setBoardSize,
      setSpeed,
      setIsPlaying,
    },
  };
};

test('starting the game', async () => {
  const {
    getByRole,
    user,
    spies: { setIsPlaying },
  } = setup();

  const playButton = getByRole('switch', { name: 'Play' });
  expect(playButton, 'Play button not found').toBeDefined();
  await user.click(playButton);
  expect(
    setIsPlaying,
    'pressing play should start the game',
  ).toHaveBeenCalledWith(true);
});

test('pausing the game', async () => {
  const {
    getByRole,
    user,
    spies: { setIsPlaying },
  } = setup({ isPlaying: true });

  const pauseButton = getByRole('switch', { name: 'Pause' });
  expect(pauseButton, 'Pause button not found').toBeDefined();
  await user.click(pauseButton);
  expect(
    setIsPlaying,
    'pressing pause should pause the game',
  ).toHaveBeenCalledWith(false);
});

test('changing the speed', () => {
  const {
    getByLabelText,
    spies: { setSpeed },
  } = setup();

  const speedInput = getByLabelText('Speed', { selector: 'input' });
  expect(speedInput, 'Speed input not found').toBeDefined();

  // user.type wont allow to pass a number, so we use fireEvent
  fireEvent.change(speedInput, { target: { value: 2 } });

  expect(setSpeed, 'changing speed should update speed').toHaveBeenCalledWith(
    2,
  );
});

test('Can start/pause the game', () => {
  const {
    getByLabelText,
    spies: { setBoardSize },
  } = setup();

  const boardSizeInput = getByLabelText('Board Size', { selector: 'input' });
  expect(boardSizeInput, 'Board Size input not found').toBeDefined();

  // user.type wont allow to pass a number, so we use fireEvent
  fireEvent.change(boardSizeInput, { target: { value: 1 } });

  expect(
    setBoardSize,
    'changing board size should update board size',
  ).toHaveBeenCalledWith(boardSizes[1]);
});
