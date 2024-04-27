'use client';

import { useState } from 'react';

import { Board, boardSizes, defaultPresets } from '@/models/conway';

import { Footer } from '../Home/Footer';
import { Heading } from '../Home/Heading';
import { Section } from '../Home/Section';
import { Canvas } from './Canvas';
import { Side } from './Side';

export const Conway = () => {
  const [board, setBoard] = useState<Board>(defaultPresets);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [boardSize, setBoardSize] = useState(boardSizes[0]);

  return (
    <>
      <Section className="lg:hidden">
        <div className="text-center">
          A device with a large screen is needed to access this page
        </div>
      </Section>

      <div className="hidden lg:block">
        <Section>
          <h1 className="mb-5 pb-5 text-center text-3xl font-black uppercase">
            Conway&apos;s Game of Life
          </h1>
        </Section>

        <Section>
          <p>
            The Game of Life, is a cellular automaton devised by the British
            mathematician John Horton Conway in 1970. It is a zero-player game,
            meaning that its evolution is determined by its initial state,
            requiring no further input. One interacts with the Game of Life by
            creating an initial configuration and observing how it evolves. It
            is Turing complete and can simulate a universal constructor or any
            other Turing machine. —{' '}
            <a
              className="text-accent"
              href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
            >
              Wikipedia
            </a>
          </p>
        </Section>

        <Section>
          <Heading className="text-xl xl:text-2xl" level={2}>
            How to play
          </Heading>
          <p>
            The universe of the Game of Life is a two-dimensional orthogonal
            grid of square cells, each of which is in one of two possible
            states, live or dead. Every cell interacts with its eight neighbors,
            which are the cells that are horizontally, vertically, or diagonally
            adjacent. At each step in time, the following transitions occur:
          </p>
          <ol className="my-5 list-inside list-decimal">
            <li>
              Any live cell with fewer than two live neighbors dies, as if by
              underpopulation.
            </li>
            <li>
              Any live cell with two or three live neighbors lives on to the
              next generation.
            </li>
            <li>
              Any live cell with more than three live neighbors dies, as if by
              overpopulation.
            </li>
            <li>
              Any dead cell with exactly three live neighbors becomes a live
              cell, as if by reproduction.
            </li>
          </ol>
          <p>
            The initial pattern constitutes the seed of the system. The first
            generation is created by applying the above rules simultaneously to
            every cell in the seed, live or dead; births and deaths occur
            simultaneously. Each generation is a pure function of the preceding
            one. The rules continue to be applied repeatedly to create further
            generations.
          </p>
          <p className="my-5">
            The grid has been pre-filled with random cells. You can edit the
            grid by clicking on a cell to change its state.
          </p>
        </Section>

        <Section fullScreen>
          <div className="flex flex-row justify-center gap-10">
            <Canvas
              width="701px"
              height="701px"
              className="h-[701px] w-[701px]"
              board={board}
              setBoard={setBoard}
              speed={speed}
              isPlaying={isPlaying}
              boardSize={boardSize}
            />

            <div className="flex min-w-56 flex-col gap-7">
              <Side
                board={board}
                setBoard={setBoard}
                speed={speed}
                setSpeed={setSpeed}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                boardSize={boardSize}
                setBoardSize={setBoardSize}
              />
            </div>
          </div>
        </Section>

        <Section className="mb-3 lg:mb-8">
          <Footer />
        </Section>
      </div>
    </>
  );
};
