import type { Meta, StoryObj } from '@storybook/react';

import { ErrorWithCode } from '#error';
import { ErrCode, useStats } from '#hooks/fortnite/useStats.mock';
import { Data } from '#models/fortnite';

import validData from '../../../../../.storybook/fixtures/valid_fortnite_data.json';
import page from './page';

const meta = {
  title: 'Fortnite/Home',
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
        segments: ['fortnite'],
      },
    },
  },
  args: {
    params: {},
  },
};

export const Profile: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ['fortnite', 'M8%20Nîkof', 'epic'],
      },
    },
  },
  args: {
    params: {
      path: ['M8%20Nîkof', 'epic'],
    },
  },
  beforeEach() {
    useStats.mockImplementation(() => {
      return {
        isLoading: false,
        error: null,
        data: validData.data as unknown as Data,
      };
    });
  },
};

export const Loading: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ['fortnite', 'M8%20Nîkof', 'xbl'],
      },
    },
  },
  args: {
    params: {
      path: ['M8%20Nîkof', 'xbl'],
    },
  },
  async beforeEach() {
    useStats.mockImplementation(() => {
      return {
        isLoading: true,
        error: null,
        data: undefined,
      };
    });
  },
};

export const ErrorInvalidApiKey: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ['fortnite', 'M8%20Nîkof', 'epic'],
      },
    },
  },
  args: {
    params: {
      path: ['M8%20Nîkof', 'epic'],
    },
  },
  beforeEach() {
    useStats.mockImplementation(() => {
      return {
        isLoading: false,
        error: new ErrorWithCode('Invalid API Key', ErrCode.InvalidAPIKey),
        data: undefined,
      };
    });
  },
};

export const ErrorInvalidAccount: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ['fortnite', 'M8%20Nîkof', 'psn'],
      },
    },
  },
  args: {
    params: {
      path: ['M8%20Nîkof', 'psn'],
    },
  },
  beforeEach() {
    useStats.mockImplementation(() => {
      return {
        isLoading: false,
        error: new ErrorWithCode(
          'Account does not exist',
          ErrCode.AccountNotFound,
        ),
        data: undefined,
      };
    });
  },
};

export const ErrorPrivateAccount: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ['fortnite', 'M8%20Nîkof', 'xbl'],
      },
    },
  },
  args: {
    params: {
      path: ['M8%20Nîkof', 'xbl'],
    },
  },
  beforeEach() {
    useStats.mockImplementation(() => {
      return {
        isLoading: false,
        error: new ErrorWithCode('Account is private', ErrCode.AccountPrivate),
        data: undefined,
      };
    });
  },
};

export const ErrorInternalError: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ['fortnite', 'M8%20Nîkof', 'xbl'],
      },
    },
  },
  args: {
    params: {
      path: ['M8%20Nîkof', 'xbl'],
    },
  },
  beforeEach() {
    useStats.mockImplementation(() => {
      return {
        isLoading: false,
        error: new ErrorWithCode(
          'Something went wrong',
          ErrCode.SomethingWentWrong,
        ),
        data: undefined,
      };
    });
  },
};
