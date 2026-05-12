import { fireEvent, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Board, boardSizes } from "#features/conway/models";
import { testWrapper as wrapper } from "#shared/utils/tests";

import { Side } from "./side";

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
  const setBoard = vi.fn<(value: Board) => void>();
  const setBoardSize = vi.fn<(value: number) => void>();
  const setSpeed = vi.fn<(value: number) => void>();
  const setIsPlaying = vi.fn<(value: boolean) => void>();

  const setToroidal = vi.fn<(value: boolean) => void>();

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
      toroidal={false}
      setToroidal={setToroidal}
    />,
    { wrapper },
  );
  return {
    ...utils,
    spies: {
      setBoard,
      setBoardSize,
      setIsPlaying,
      setSpeed,
      setToroidal,
    },
    user,
  };
};

describe(Side, () => {
  it("starting the game", async () => {
    expect.assertions(2);
    const {
      getByRole,
      user,
      spies: { setIsPlaying },
    } = setup();

    const playButton = getByRole("button", { name: "Play" });
    expect(playButton, "Play button not found").toBeDefined();
    await user.click(playButton);
    expect(setIsPlaying, "pressing play should start the game").toHaveBeenCalledWith(true);
  }, 5000);

  it("pausing the game", async () => {
    expect.assertions(2);
    const {
      getByRole,
      user,
      spies: { setIsPlaying },
    } = setup({ isPlaying: true });

    const pauseButton = getByRole("button", { name: "Pause" });
    expect(pauseButton, "Pause button not found").toBeDefined();
    await user.click(pauseButton);
    expect(setIsPlaying, "pressing pause should pause the game").toHaveBeenCalledWith(false);
  }, 5000);

  it("changing the speed", () => {
    expect.assertions(2);
    const {
      getByLabelText,
      spies: { setSpeed },
    } = setup();

    const speedInput = getByLabelText("Speed", { selector: "input" });
    expect(speedInput, "Speed input not found").toBeDefined();

    // user.type wont allow to pass a number, so we use fireEvent
    fireEvent.change(speedInput, { target: { value: 2 } });

    expect(setSpeed, "changing speed should update speed").toHaveBeenCalledWith(2);
  }, 5000);

  it("toggling wrap edges calls setToroidal", async () => {
    expect.assertions(2);
    const {
      getByRole,
      user,
      spies: { setToroidal },
    } = setup();

    const wrapSwitch = getByRole("switch", { name: "Wrap edges" });
    expect(wrapSwitch, "Wrap edges switch not found").toBeDefined();
    await user.click(wrapSwitch);
    expect(
      setToroidal,
      "toggling wrap edges should call setToroidal with true",
    ).toHaveBeenCalledWith(true);
  }, 5000);

  it("can start/pause the game", () => {
    expect.assertions(2);
    const {
      getByLabelText,
      spies: { setBoardSize },
    } = setup();

    const boardSizeInput = getByLabelText("Board Size", { selector: "input" });
    expect(boardSizeInput, "Board Size input not found").toBeDefined();

    // user.type wont allow to pass a number, so we use fireEvent
    fireEvent.change(boardSizeInput, { target: { value: 1 } });

    expect(setBoardSize, "changing board size should update board size").toHaveBeenCalledWith(
      boardSizes[1],
    );
  }, 5000);
});
