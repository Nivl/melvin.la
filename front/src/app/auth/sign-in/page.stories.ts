import type { Meta, StoryObj } from '@storybook/nextjs';

import { Me } from '#backend/types';
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
        error: new Error('Something went wrong'),
        signInAsync: () => Promise.resolve({} as Me),
        signIn: () => {},
        data: undefined,
      };
    });
  },
};
