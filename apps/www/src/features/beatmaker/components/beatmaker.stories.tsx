import type { Meta, StoryObj } from "@storybook/nextjs";

import { Beatmaker } from "#features/beatmaker/components/beatmaker";

const meta = {
  component: Beatmaker,
  parameters: {
    layout: "fullscreen",
  },
  title: "Games/beatmaker",
} satisfies Meta<typeof Beatmaker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
