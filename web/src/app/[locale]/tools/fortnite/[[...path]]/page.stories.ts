import type { Meta, StoryObj } from '@storybook/nextjs';

import { type FortniteData } from '#backend/api';
import { useStats } from '#hooks/fortnite/useStats.mock';

import validData from '../../../../../../.storybook/fixtures/valid_fortnite_data.json';
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
        segments: ['tools', 'fortnite'],
      },
    },
  },
  args: {
    params: new Promise(resolve => {
      resolve({
        locale: 'en',
      });
    }),
  },
};

export const Profile: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ['tools', 'fortnite', 'M8%20Nîkof', 'epic'],
      },
    },
  },
  args: {
    params: new Promise(resolve => {
      resolve({
        locale: 'en',
        path: ['M8%20Nîkof', 'epic'],
      });
    }),
  },
  beforeEach() {
    useStats.mockImplementation(() => {
      return {
        isLoading: false,
        error: null,
        data: validData.data as unknown as FortniteData,
      };
    });
  },
};

export const Loading: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ['tools', 'fortnite', 'M8%20Nîkof', 'xbl'],
      },
    },
  },
  args: {
    params: new Promise(resolve => {
      resolve({
        locale: 'en',
        path: ['M8%20Nîkof', 'xbl'],
      });
    }),
  },
  beforeEach() {
    useStats.mockImplementation(() => {
      return {
        isLoading: true,
        error: null,
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
        segments: ['tools', 'fortnite', 'M8%20Nîkof', 'psn'],
      },
    },
  },
  args: {
    params: new Promise(resolve => {
      resolve({
        locale: 'en',
        path: ['M8%20Nîkof', 'psn'],
      });
    }),
  },
  beforeEach() {
    useStats.mockImplementation(() => {
      return {
        isLoading: false,
        error: { code: 404, message: 'Account does not exist' },
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
        segments: ['tools', 'fortnite', 'M8%20Nîkof', 'xbl'],
      },
    },
  },
  args: {
    params: new Promise(resolve => {
      resolve({
        locale: 'en',
        path: ['M8%20Nîkof', 'xbl'],
      });
    }),
  },
  beforeEach() {
    useStats.mockImplementation(() => {
      return {
        isLoading: false,
        error: { code: 403, message: 'Account is private' },
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
        segments: ['tools', 'fortnite', 'M8%20Nîkof', 'xbl'],
      },
    },
  },
  args: {
    params: new Promise(resolve => {
      resolve({
        locale: 'en',
        path: ['M8%20Nîkof', 'xbl'],
      });
    }),
  },
  beforeEach() {
    useStats.mockImplementation(() => {
      return {
        isLoading: false,
        error: { code: 500, message: 'Something went wrong' },
        data: undefined,
      };
    });
  },
};
