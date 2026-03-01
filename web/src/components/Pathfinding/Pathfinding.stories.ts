import type { Meta, StoryObj } from '@storybook/nextjs';

import { Pathfinding } from './Pathfinding';

const meta = {
  title: 'Tools/Pathfinding',
  component: Pathfinding,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Pathfinding>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
