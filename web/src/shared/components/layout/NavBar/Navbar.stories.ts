import type { Meta, StoryObj } from "@storybook/nextjs";
import { userEvent, within } from "storybook/test";

import { Navbar } from "./Navbar";

const meta = {
  title: "Components/Layout/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
};

export const SubMenu: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/games/conway",
      },
    },
  },
};

export const MobileMenuOpen: Story = {
  globals: {
    // `globals.viewport` is applied before rendering, so Tailwind's md:hidden
    // correctly hides the desktop nav and reveals the mobile hamburger button.
    // `parameters.viewport.defaultViewport` is only a UI preference and does
    // not resize the actual browser viewport when the play function runs.
    viewport: { value: "xsmall" },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The hamburger button is only accessible at mobile viewports (md:hidden on
    // desktop). When Chromatic renders this story with a large viewport mode
    // (xxlarge, FourK), the button is absent from the accessibility tree, so
    // skip the interaction rather than error.
    const button = canvas.queryByRole("button", { name: "Open menu" });
    if (!button) return;
    await userEvent.click(button);
  },
};
