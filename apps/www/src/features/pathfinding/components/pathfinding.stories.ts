import type { Meta, StoryObj } from "@storybook/nextjs";

import { Pathfinding } from "./pathfinding";

const meta = {
  component: Pathfinding,
  parameters: {
    layout: "fullscreen",
  },
  title: "Tools/pathfinding",
} satisfies Meta<typeof Pathfinding>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
