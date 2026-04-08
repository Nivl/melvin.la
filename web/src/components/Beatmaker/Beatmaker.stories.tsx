import type { Meta, StoryObj } from "@storybook/nextjs";

import { Beatmaker } from "./Beatmaker";

const meta = {
  title: "Games/Beatmaker",
  component: Beatmaker,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Beatmaker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
