import type { Meta, StoryObj } from '@storybook/nextjs';

import page from './page';

const meta = {
  title: 'Uuid/Home',
  component: page,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ['tools', 'uuid'],
      },
    },
  },
  args: {
    params: {},
  },
};
