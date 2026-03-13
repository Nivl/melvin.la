import type { Meta, StoryObj } from '@storybook/nextjs';

import type { Board } from '#models/conway';

import { ConwayGrid } from './Grid';

const makeBoard = (size: number): Board =>
  Array.from<(0 | 1)[]>({ length: size }, () =>
    Array.from<0 | 1>({ length: size }, () => 0),
  );

const meta = {
  title: 'Tools/Conway/Grid',
  component: ConwayGrid,
  parameters: {
    layout: 'centered',
  },
  args: {
    board: makeBoard(10),
    boardSize: 10,
    isPlaying: false,
    ariaLabel: "Conway's Game of Life grid",
    onSetCell: () => {},
  },
} satisfies Meta<typeof ConwayGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Playing: Story = {
  args: {
    isPlaying: true,
  },
};
