import type { Meta, StoryObj } from "@storybook/nextjs";

import page from "./not-found";

const meta = {
  component: page,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  title: "Pages/404",
} satisfies Meta<typeof page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
