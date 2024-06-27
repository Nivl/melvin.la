import type { Meta, StoryObj } from '@storybook/react';

import page from './page';

const meta = {
  title: 'Home/Page',
  component: page,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
