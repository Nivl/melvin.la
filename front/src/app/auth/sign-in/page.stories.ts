import type { Meta, StoryObj } from '@storybook/react';

import { User } from '#backend/api';
import { useSignIn } from '#hooks/auth/useSignIn.mock';

import page from './page';

const meta = {
  title: 'Auth/Sign In',
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
        segments: ['auth', 'sign-in'],
      },
    },
  },
  args: {
    params: {},
  },
};

export const Errors: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ['auth', 'sign-in'],
      },
    },
  },
  args: {
    params: {},
  },
  beforeEach() {
    useSignIn.mockImplementation(() => {
      return {
        isPending: false,
        isSuccess: false,
        error: { code: 500, message: 'Something went wrong' },
        signInAsync: () => Promise.resolve({} as User),
        data: undefined,
      };
    });
  },
};
