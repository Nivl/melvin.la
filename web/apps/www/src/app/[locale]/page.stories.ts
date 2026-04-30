import type { Meta, StoryObj } from "@storybook/nextjs";

import page from "./page";

const meta = {
  component: page,
  parameters: {
    layout: "fullscreen",
  },
  title: "Pages/home",
} satisfies Meta<typeof page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
