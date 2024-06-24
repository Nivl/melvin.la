'use client';

import { useTheme } from 'next-themes';
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { Board } from '#models/conway';

const drawBoard = (ctx: CanvasRenderingContext2D, boardSize: number) => {
  const cellSize = ~~(701 / boardSize);
  ctx.clearRect(0, 0, 701, 701);
  ctx.fillStyle = '#838383';
  for (let x = 0; x < boardSize + 1; x++) {
    ctx.fillRect(x * cellSize, 0, 1, 700);
    ctx.fillRect(0, x * cellSize, 700, 1);
  }
};

const totalNeighbors = (board: Board, x: number, y: number) => {
  let total = 0;
  // Row above
  if (typeof board[y - 1] !== 'undefined') {
    total += ~~board[y - 1][x - 1];
    total += ~~board[y - 1][x];
    total += ~~board[y - 1][x + 1];
  }
  // current row
  total += ~~board[y][x - 1] + ~~board[y][x + 1];
  // row below
  if (typeof board[y + 1] !== 'undefined') {
    total += ~~board[y + 1][x - 1];
    total += ~~board[y + 1][x];
    total += ~~board[y + 1][x + 1];
  }
  return total;
};

const drawCell = (
  ctx: CanvasRenderingContext2D,
  boardSize: number,
  state: 0 | 1,
  x: number,
  y: number,
  darkMode: boolean,
) => {
  const cellSize = ~~(701 / boardSize);
  const cursorX = x * cellSize + 1;
  const cursorY = y * cellSize + 1;

  ctx.fillStyle = darkMode
    ? state
      ? 'white'
      : 'black'
    : state
      ? 'black'
      : 'white';
  ctx.fillRect(cursorX, cursorY, cellSize - 1, cellSize - 1);
};

export const Canvas = ({
  board,
  setBoard,
  speed,
  isPlaying,
  boardSize,
  ...delegated
}: {
  board: Board;
  setBoard: Dispatch<SetStateAction<Board>>;
  speed: number;
  isPlaying: boolean;
  boardSize: number;
  [x: string]: unknown;
}) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  const updateBoard = useCallback(() => {
    const ctx = canvas.current?.getContext('2d', {
      willReadFrequently: true,
    });
    if (ctx) {
      setBoard(board => {
        return board.map((row, y) => {
          return row.map((cell, x) => {
            const neighbors = totalNeighbors(board, x, y);
            let newValue = board[y][x];
            switch (cell) {
              case 1: // Alive
                // 1. Any live cell with two or three live neighbors lives on
                //    to the next generation
                // 2. Any live cell with fewer than two live neighbors dies,
                //    as if by underpopulation.
                // 3. Any live cell with more than three live neighbors dies,
                //    as if by overpopulation.
                if (neighbors < 2 || neighbors > 3) {
                  newValue = 0;
                }
                break;
              case 0: // Dead
                // Any dead cell with exactly three live neighbors becomes a
                // live cell, as if by reproduction
                if (neighbors == 3) {
                  newValue = 1;
                }
                break;
            }

            drawCell(ctx, boardSize, newValue, x, y, isDarkMode);
            return newValue;
          });
        });
      });
    }
  }, [isDarkMode, setBoard, boardSize]);

  // Board in editing mode
  useEffect(() => {
    if (!isPlaying) {
      const ctx = canvas.current?.getContext('2d', {
        willReadFrequently: true,
      });
      if (ctx) {
        drawBoard(ctx, boardSize);

        for (let y = 0; y < board.length; y++) {
          for (let x = 0; x < board[y].length; x++) {
            drawCell(ctx, boardSize, board[y][x], x, y, isDarkMode);
          }
        }
      }
    }
  }, [isDarkMode, canvas, board, isPlaying, boardSize]);

  // Board in playing mode
  useEffect(() => {
    if (isPlaying) {
      const baseSpeed = 1000;
      let refreshRate = baseSpeed;
      if (speed > 1) {
        refreshRate = baseSpeed / speed;
      } else if (speed < 1) {
        refreshRate = baseSpeed * (speed + 1);
      }

      const interval = setInterval(() => updateBoard(), refreshRate);
      return () => {
        clearInterval(interval);
      };
    }
  }, [isPlaying, speed, updateBoard]);

  return (
    <canvas
      {...delegated}
      ref={canvas}
      onClick={(e: MouseEvent<HTMLElement>) => {
        const rect = canvas.current?.getBoundingClientRect();
        if (!isPlaying && rect) {
          const cellSize = ~~(701 / boardSize);
          const x = ~~((e.clientX - rect.left) / cellSize);
          const y = ~~((e.clientY - rect.top) / cellSize);
          const newBoard = [...board];
          newBoard[y][x] = newBoard[y][x] ? 0 : 1;
          setBoard(newBoard);
        }
      }}
    ></canvas>
  );
};
