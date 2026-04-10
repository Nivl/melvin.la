import { Button, Label, Slider, Switch } from "@heroui/react";
import { useTranslations } from "next-intl";
import { FaPause as PauseIcon, FaPlay as Playicon } from "react-icons/fa6";

import {
  Board,
  boardSizes,
  BoardValue,
  gliderPreset,
  HeavyweightPreset,
  PentadecathlonPreset,
  pulsarPreset,
} from "#features/conway/models";
import { Heading } from "#shared/components/layout/Heading";

import { Preset } from "./Preset";

const newRow = (size: number): BoardValue[] => {
  return Array.from<BoardValue>({ length: size }).fill(0);
};

const resizeBoard = (board: Board, newSize: number): Board => {
  const numRows = board.length;

  // Adjust each existing row to newSize columns (handles non-square presets)
  const newBoard: Board = board.slice(0, newSize).map((row) => {
    if (row.length === newSize) return row;
    if (row.length > newSize) return row.slice(0, newSize);
    return [...row, ...newRow(newSize - row.length)];
  });

  // Add extra rows if needed
  for (let i = numRows; i < newSize; i++) {
    newBoard.push(newRow(newSize));
  }

  return newBoard;
};

export const Side = ({
  board,
  setBoard,
  speed,
  setSpeed,
  isPlaying,
  setIsPlaying,
  boardSize,
  setBoardSize,
  toroidal,
  setToroidal,
}: {
  board: Board;
  setBoard: (_: Board) => void;
  speed: number;
  setSpeed: (_: number) => void;
  isPlaying: boolean;
  setIsPlaying: (_: boolean) => void;
  boardSize: number;
  setBoardSize: (_: number) => void;
  toroidal: boolean;
  setToroidal: (_: boolean) => void;
}) => {
  const setPreset = (preset: Board) => {
    setBoard(resizeBoard(preset, boardSize));
  };
  const t = useTranslations("conway.controls");

  return (
    <>
      <Heading level={3}>{t("title")}</Heading>
      {isPlaying ? (
        <Button
          variant="primary"
          className="w-full"
          onPress={() => {
            setIsPlaying(false);
          }}
        >
          <PauseIcon className="mr-2" />
          {t("pause")}
        </Button>
      ) : (
        <Button
          variant="primary"
          className="w-full"
          onPress={() => {
            setIsPlaying(true);
          }}
        >
          <Playicon className="mr-2" />
          {t("play")}
        </Button>
      )}

      <Slider
        value={speed}
        className="max-w-md"
        step={0.25}
        maxValue={5}
        minValue={0.25}
        onChange={(v) => {
          if (typeof v === "number" && !Number.isNaN(v)) {
            setSpeed(v);
          }
        }}
      >
        <Label>{t("speed")}</Label>
        <Slider.Output>
          {({ state }) => {
            return `${state.values[0].toFixed(2)}x`;
          }}
        </Slider.Output>
        <Slider.Track>
          <Slider.Fill />
          <Slider.Thumb />
        </Slider.Track>
      </Slider>

      <Slider
        // value={boardSize}
        className="max-w-md"
        minValue={0}
        maxValue={boardSizes.length - 1}
        isDisabled={isPlaying}
        onChange={(v) => {
          const x = typeof v === "object" ? v[0] : v;
          const newSize = boardSizes[x] || boardSizes[0];
          if (newSize === boardSize) {
            return;
          }

          const newBoard = resizeBoard(board, newSize);
          setBoardSize(newSize);
          setBoard(newBoard);
        }}
      >
        <Label>{t("boardSize")}</Label>
        <Slider.Output>
          {({ state }) => {
            const sizeIndex = state.values[0];
            const actualSize = boardSizes[~~sizeIndex] || boardSizes[0];
            return `${actualSize.toString()}x${actualSize.toString()}`;
          }}
        </Slider.Output>
        <Slider.Track>
          <Slider.Fill />
          <Slider.Thumb />
        </Slider.Track>
      </Slider>

      <Switch isSelected={toroidal} onChange={setToroidal} aria-label={t("wrapEdges")}>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Switch.Content>
          <Label className="text-sm">{t("wrapEdges")}</Label>
        </Switch.Content>
      </Switch>

      <Heading level={3}>{t("presets.title")}</Heading>

      <div className="flex w-56 flex-wrap justify-center gap-4">
        <Preset
          name={t("presets.glider")}
          onClick={() => {
            setPreset(gliderPreset);
          }}
        />

        <Preset
          name={t("presets.pulsar")}
          onClick={() => {
            setPreset(pulsarPreset);
          }}
        />

        <Preset
          name={t("presets.pentadecathlon")}
          onClick={() => {
            setPreset(PentadecathlonPreset);
          }}
        />

        <Preset
          name={t("presets.heavySpaceship")}
          onClick={() => {
            setPreset(HeavyweightPreset);
          }}
        />
      </div>
    </>
  );
};
