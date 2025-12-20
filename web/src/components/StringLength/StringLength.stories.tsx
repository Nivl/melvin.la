import type { Meta, StoryObj } from '@storybook/nextjs';

import { StringLength } from './StringLength';

const meta: Meta<typeof StringLength> = {
  title: 'Tools/StringLength',
  component: StringLength,
  parameters: {
    layout: 'fullscreen',
  },
};

// eslint-disable-next-line import/no-default-export
export default meta;

type Story = StoryObj<typeof StringLength>;

export const Default: Story = {};
