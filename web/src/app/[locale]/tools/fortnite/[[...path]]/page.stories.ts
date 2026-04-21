import type { Meta, StoryObj } from "@storybook/nextjs";
import { TRPC_ERROR_CODE_NUMBER } from "@trpc/server";

import { useStats } from "#features/fortnite/hooks/use-stats.mock";
import { FortniteStatsData } from "#features/fortnite/models";
import validData from "#storybook/fixtures/valid_fortnite_data.json";
import validNoData from "#storybook/fixtures/valid_fortnite_no_data.json";

import page from "./page";

const meta = {
  component: page,
  parameters: {
    layout: "fullscreen",
  },
  title: "Pages/Tools/fortnite",
} satisfies Meta<typeof page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    params: new Promise((resolve) => {
      resolve({
        locale: "en",
      });
    }),
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ["tools", "fortnite"],
      },
    },
  },
};

export const Profile: Story = {
  args: {
    params: new Promise((resolve) => {
      resolve({
        locale: "en",
        path: ["M8%20Nîkof", "epic"],
      });
    }),
  },
  beforeEach() {
    const fortniteData: FortniteStatsData = validData.data;

    useStats.mockImplementation(() => ({
      data: fortniteData,
      error: null,
      isLoading: false,
    }));
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ["tools", "fortnite", "M8%20Nîkof", "epic"],
      },
    },
  },
};

export const Loading: Story = {
  args: {
    params: new Promise((resolve) => {
      resolve({
        locale: "en",
        path: ["M8%20Nîkof", "xbl"],
      });
    }),
  },
  beforeEach() {
    useStats.mockImplementation(() => ({
      data: undefined,
      error: null,
      isLoading: true,
    }));
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ["tools", "fortnite", "M8%20Nîkof", "xbl"],
      },
    },
  },
};

export const NoData: Story = {
  args: {
    params: new Promise((resolve) => {
      resolve({
        locale: "en",
        path: ["M8%20Nîkof", "psn"],
      });
    }),
  },
  beforeEach() {
    useStats.mockImplementation(() => ({
      data: validNoData.data,
      error: null,
      isLoading: false,
    }));
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ["tools", "fortnite", "M8%20Nîkof", "psn"],
      },
    },
  },
};

export const ErrorInvalidAccount: Story = {
  args: {
    params: new Promise((resolve) => {
      resolve({
        locale: "en",
        path: ["M8%20Nîkof", "psn"],
      });
    }),
  },
  beforeEach() {
    useStats.mockImplementation(() => ({
      data: undefined,
      error: {
        data: {
          code: "NOT_FOUND",
          httpStatus: 404,
        },
        message: "Account does not exist",
        shape: {
          code: -32_004 as TRPC_ERROR_CODE_NUMBER,
          data: {
            code: "NOT_FOUND",
            httpStatus: 404,
          },
          message: "Account does not exist",
        },
      },
      isLoading: false,
    }));
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ["tools", "fortnite", "M8%20Nîkof", "psn"],
      },
    },
  },
};

export const ErrorPrivateAccount: Story = {
  args: {
    params: new Promise((resolve) => {
      resolve({
        locale: "en",
        path: ["M8%20Nîkof", "xbl"],
      });
    }),
  },
  beforeEach() {
    useStats.mockImplementation(() => ({
      data: undefined,
      error: {
        data: {
          code: "FORBIDDEN",
          httpStatus: 403,
        },
        message: "Account is private",
        shape: {
          code: -32_003 as TRPC_ERROR_CODE_NUMBER,
          data: {
            code: "FORBIDDEN",
            httpStatus: 403,
          },
          message: "Account is private",
        },
      },
      isLoading: false,
    }));
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ["tools", "fortnite", "M8%20Nîkof", "xbl"],
      },
    },
  },
};

export const ErrorInternalError: Story = {
  args: {
    params: new Promise((resolve) => {
      resolve({
        locale: "en",
        path: ["M8%20Nîkof", "xbl"],
      });
    }),
  },
  beforeEach() {
    useStats.mockImplementation(() => ({
      data: undefined,
      error: {
        data: {
          code: "INTERNAL_SERVER_ERROR",
          httpStatus: 500,
        },
        message: "Something went wrong",
        shape: {
          code: -32_603 as TRPC_ERROR_CODE_NUMBER,
          data: {
            code: "INTERNAL_SERVER_ERROR",
            httpStatus: 500,
          },
          message: "Internal Server Error",
        },
      },
      isLoading: false,
    }));
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ["tools", "fortnite", "M8%20Nîkof", "xbl"],
      },
    },
  },
};
