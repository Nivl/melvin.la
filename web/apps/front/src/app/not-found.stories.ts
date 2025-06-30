import type { Meta, StoryObj } from '@storybook/nextjs';

import page from './not-found';

const meta = {
  title: '404/Page',
  component: page,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
