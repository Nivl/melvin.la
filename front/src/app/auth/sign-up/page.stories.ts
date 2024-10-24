import type { Meta, StoryObj } from '@storybook/react';

import { useSignUp } from '#hooks/auth/useSignUp.mock';

import page from './page';

const meta = {
  title: 'Auth/Sign Up',
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
        segments: ['auth', 'sign-up'],
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
        segments: ['auth', 'sign-up'],
      },
    },
  },
  args: {
    params: {},
  },
  beforeEach() {
    useSignUp.mockImplementation(() => {
      return {
        isPending: false,
        isSuccess: false,
        error: new Error('Something went wrong'),
        signUpAsync: () => Promise.resolve(),
        signUp: () => {},
      };
    });
  },
};
