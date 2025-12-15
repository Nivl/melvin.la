import type { Meta, StoryObj } from '@storybook/nextjs';

import Page from './page';

const meta: Meta<typeof Page> = {
  title: 'Pages/tools/count',
  component: Page,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
