import type { Meta, StoryObj } from "@storybook/nextjs";
import { TRPC_ERROR_CODE_NUMBER } from "@trpc/server";

import { useStats } from "#features/fortnite/hooks/useStats.mock";
import { FortniteStatsData } from "#features/fortnite/models";

import validData from "../../../../../../.storybook/fixtures/valid_fortnite_data.json";
import validNoData from "../../../../../../.storybook/fixtures/valid_fortnite_no_data.json";
import page from "./page";

const meta = {
  title: "Pages/Tools/Fortnite",
  component: page,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ["tools", "fortnite"],
      },
    },
  },
  args: {
    params: new Promise((resolve) => {
      resolve({
        locale: "en",
      });
    }),
  },
};

export const Profile: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ["tools", "fortnite", "M8%20Nîkof", "epic"],
      },
    },
  },
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

    useStats.mockImplementation(() => {
      return {
        isLoading: false,
        error: null,
        data: fortniteData,
      };
    });
  },
};

export const Loading: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ["tools", "fortnite", "M8%20Nîkof", "xbl"],
      },
    },
  },
  args: {
    params: new Promise((resolve) => {
      resolve({
        locale: "en",
        path: ["M8%20Nîkof", "xbl"],
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

export const NoData: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ["tools", "fortnite", "M8%20Nîkof", "psn"],
      },
    },
  },
  args: {
    params: new Promise((resolve) => {
      resolve({
        locale: "en",
        path: ["M8%20Nîkof", "psn"],
      });
    }),
  },
  beforeEach() {
    useStats.mockImplementation(() => {
      return {
        isLoading: false,
        error: null,
        data: validNoData.data,
      };
    });
  },
};

export const ErrorInvalidAccount: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ["tools", "fortnite", "M8%20Nîkof", "psn"],
      },
    },
  },
  args: {
    params: new Promise((resolve) => {
      resolve({
        locale: "en",
        path: ["M8%20Nîkof", "psn"],
      });
    }),
  },
  beforeEach() {
    useStats.mockImplementation(() => {
      return {
        isLoading: false,
        error: {
          shape: {
            message: "Account does not exist",
            code: -32_004 as TRPC_ERROR_CODE_NUMBER,
            data: {
              code: "NOT_FOUND",
              httpStatus: 404,
            },
          },
          message: "Account does not exist",
          data: {
            httpStatus: 404,
            code: "NOT_FOUND",
          },
        },
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
        segments: ["tools", "fortnite", "M8%20Nîkof", "xbl"],
      },
    },
  },
  args: {
    params: new Promise((resolve) => {
      resolve({
        locale: "en",
        path: ["M8%20Nîkof", "xbl"],
      });
    }),
  },
  beforeEach() {
    useStats.mockImplementation(() => {
      return {
        isLoading: false,
        error: {
          shape: {
            message: "Account is private",
            code: -32_003 as TRPC_ERROR_CODE_NUMBER,
            data: {
              code: "FORBIDDEN",
              httpStatus: 403,
            },
          },
          message: "Account is private",
          data: {
            httpStatus: 403,
            code: "FORBIDDEN",
          },
        },
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
        segments: ["tools", "fortnite", "M8%20Nîkof", "xbl"],
      },
    },
  },
  args: {
    params: new Promise((resolve) => {
      resolve({
        locale: "en",
        path: ["M8%20Nîkof", "xbl"],
      });
    }),
  },
  beforeEach() {
    useStats.mockImplementation(() => {
      return {
        isLoading: false,
        error: {
          shape: {
            message: "Internal Server Error",
            code: -32_603 as TRPC_ERROR_CODE_NUMBER,
            data: {
              code: "INTERNAL_SERVER_ERROR",
              httpStatus: 500,
            },
          },
          message: "Something went wrong",
          data: {
            httpStatus: 500,
            code: "INTERNAL_SERVER_ERROR",
          },
        },
        data: undefined,
      };
    });
  },
};
