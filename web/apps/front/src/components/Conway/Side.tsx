import { Slider } from '@heroui/slider';
import { Switch } from '@heroui/switch';
import { FaPause as PauseIcon, FaPlay as Playicon } from 'react-icons/fa6';

import {
  Board,
  boardSizes,
  BoardValue,
  gliderPreset,
  HeavyweightPreset,
  PentadecathlonPreset,
  pulsarPreset,
} from '#models/conway';

import { Heading } from '../layout/Heading';
import { Preset } from './Preset';

const newRow = (size: number): BoardValue[] => {
  return Array.from<BoardValue>({ length: size }).fill(0);
};

const resizeBoard = (board: Board, newSize: number): Board => {
  const boardSize = board.length;
  if (newSize === boardSize) {
    return board;
  }
  // Shrinks the board
  if (newSize < boardSize) {
    return board.slice(0, newSize).map(row => {
      return row.slice(0, newSize);
    });
  }

  // Extends the existing rows
  const newBoard: Board = board.map(row => {
    return [...row, ...newRow(newSize - boardSize)];
  });
  // Adds extra rows
  for (let i = 0; i < newSize - boardSize; i++) {
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
}: {
  board: Board;
  setBoard: (_: Board) => void;
  speed: number;
  setSpeed: (_: number) => void;
  isPlaying: boolean;
  setIsPlaying: (_: boolean) => void;
  boardSize: number;
  setBoardSize: (_: number) => void;
}) => {
  const setPreset = (preset: Board) => {
    setBoard(resizeBoard(preset, boardSize));
  };

  return (
    <>
      <Heading level={3}>Controls</Heading>

      <Switch
        size="lg"
        color="primary"
        onChange={() => {
          setIsPlaying(!isPlaying);
        }}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        thumbIcon={({ isSelected }) =>
          isSelected ? (
            <Playicon className="text-gray-700" />
          ) : (
            <PauseIcon className="text-gray-700" />
          )
        }
      ></Switch>

      <Slider
        label="Speed"
        getValue={speed => `${speed.toString()}x`}
        step={0.25}
        maxValue={5}
        minValue={0.25}
        defaultValue={speed}
        className="max-w-md"
        onChange={v => {
          if (typeof v === 'number' && !Number.isNaN(v)) {
            setSpeed(v);
          }
        }}
      />

      <Slider
        label="Grid Size"
        minValue={0}
        maxValue={boardSizes.length - 1}
        className="max-w-md"
        isDisabled={isPlaying}
        getValue={sizeIndex => {
          const actualSize = boardSizes[~~sizeIndex] || boardSizes[0];
          return `${actualSize.toString()}x${actualSize.toString()}`;
        }}
        onChange={v => {
          const x = typeof v === 'object' ? v[0] : v;
          const newSize = boardSizes[x] || boardSizes[0];
          if (newSize === boardSize) {
            return;
          }

          const newBoard = resizeBoard(board, newSize);
          setBoardSize(newSize);
          setBoard(newBoard);
        }}
      />

      <Heading level={3}>Presets</Heading>

      <div className="flex w-56 flex-wrap justify-center gap-4">
        <Preset
          name="Glider"
          onClick={() => {
            setPreset(gliderPreset);
          }}
        />

        <Preset
          name="Pulsar"
          onClick={() => {
            setPreset(pulsarPreset);
          }}
        />

        <Preset
          name="Penta-decathlon"
          onClick={() => {
            setPreset(PentadecathlonPreset);
          }}
        />

        <Preset
          name="Heavy spaceship"
          onClick={() => {
            setPreset(HeavyweightPreset);
          }}
        />
      </div>
    </>
  );
};
