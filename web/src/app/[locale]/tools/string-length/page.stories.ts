import type { Meta, StoryObj } from "@storybook/nextjs";

import Page from "./page";

const meta: Meta<typeof Page> = {
  component: Page,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Pages/Tools/string-length",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
