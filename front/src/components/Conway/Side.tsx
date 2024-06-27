import { Slider, Switch } from '@nextui-org/react';
import { FaPause as PauseIcon, FaPlay as Playicon } from 'react-icons/fa6';

import {
  Board,
  boardSizes,
  gliderPreset,
  HeavyweightPreset,
  PentadecathlonPreset,
  pulsarPreset,
} from '#models/conway';

import { Heading } from '../Home/Heading';
import { Preset } from './Preset';

const growBoard = (board: Board, newSize: number): Board => {
  const boardSize = board.length;
  if (newSize === boardSize) {
    return board;
  }
  if (newSize < boardSize) {
    throw new Error('cannot reduce board size');
  }

  const newBoard = board.map(row => {
    return row.concat(Array(newSize - boardSize).fill(0));
  });
  for (let i = 0; i < newSize - boardSize; i++) {
    newBoard.push(Array(newSize).fill(0));
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
  setBoard: (b: Board) => void;
  speed: number;
  setSpeed: (b: number) => void;
  isPlaying: boolean;
  setIsPlaying: (b: boolean) => void;
  boardSize: number;
  setBoardSize: (b: number) => void;
}) => {
  const setPreset = (preset: Board) => {
    setBoard(growBoard(preset, boardSize));
  };

  return (
    <>
      <Heading level={3}>Controls</Heading>

      <Switch
        size="lg"
        color="primary"
        onClick={() => {
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
        getValue={speed => `${speed}x`}
        step={0.25}
        maxValue={5}
        minValue={0.25}
        defaultValue={speed}
        className="max-w-md"
        onChange={v => {
          if (typeof v === 'number') {
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
          return `${actualSize}x${actualSize}`;
        }}
        onChange={v => {
          const x = typeof v === 'object' ? v[0] : v;
          const newSize = boardSizes[x] || boardSizes[0];
          if (newSize === boardSize) {
            return;
          }

          if (newSize < boardSize) {
            const newBoard = board.slice(0, newSize).map(row => {
              return row.slice(0, newSize);
            });

            setBoardSize(newSize);
            setBoard(newBoard);
            return;
          }

          const newBoard = board.map(row => {
            return row.concat(Array(newSize - boardSize).fill(0));
          });
          for (let i = 0; i < newSize - boardSize; i++) {
            newBoard.push(Array(newSize).fill(0));
          }

          setBoardSize(newSize);
          setBoard(newBoard);
        }}
      />

      <Heading level={3}>Presets</Heading>

      <div className="grid grid-cols-2 gap-y-4">
        <Preset
          name="Glider"
          alt="Spaceship that will move through the map diagonally"
          imgUrl="/images/conway/glider.png"
          onClick={() => {
            setPreset(gliderPreset);
          }}
        />

        <Preset
          name="Pulsar"
          alt="Oscillator that repeats itself every 3 generations"
          imgUrl="/images/conway/pulsar.png"
          onClick={() => {
            setPreset(pulsarPreset);
          }}
        />

        <Preset
          name="Penta-decathlon"
          alt="Oscillator that repeats itself every 15 generations"
          imgUrl="/images/conway/penta.png"
          onClick={() => {
            setPreset(PentadecathlonPreset);
          }}
        />

        <Preset
          name="Heavy spaceship"
          alt="Spaceship that will move through the map horizontally"
          imgUrl="/images/conway/heavy.png"
          onClick={() => {
            setPreset(HeavyweightPreset);
          }}
        />
      </div>
    </>
  );
};
