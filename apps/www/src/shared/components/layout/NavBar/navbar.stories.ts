import type { Meta, StoryObj } from "@storybook/nextjs";
import { userEvent, within } from "storybook/test";

import { Navbar } from "./navbar";

const meta = {
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
  title: "Components/Layout/navbar",
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
    // Keep Storybook's local preview on a small viewport, but don't rely on the
    // viewport addon for the play function itself: Chromatic snapshots the
    // standalone iframe, where globals alone don't change window width.
    viewport: { value: "xsmall" },
  },
  parameters: {
    chromatic: {
      delay: 300,
      // Only snapshot at mobile viewports — the menu is hidden at large sizes.
      modes: {
        "light xsmall": { theme: "light", viewport: "xsmall" },
        xsmall: { theme: "dark", viewport: "xsmall" },
      },
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Force the mobile controls visible even when the standalone iframe is
    // wider than the mobile breakpoint, then disable animations so the drawer
    // settles synchronously before Chromatic snapshots it.
    const style = canvasElement.ownerDocument.createElement("style");
    style.textContent = String.raw`*, *::before, *::after { transition-duration: 0ms !important; animation-duration: 0ms !important; transition-delay: 0ms !important; animation-delay: 0ms !important; } .md\:flex { display: none !important; } .md\:hidden { display: inline-flex !important; }`;
    canvasElement.ownerDocument.head.append(style);

    const canvas = within(canvasElement);
    // findByRole waits for the real MobileDrawer to mount after its dynamic
    // import resolves (MobileDrawerLoading is aria-hidden and won't match).
    const button = await canvas.findByRole("button", { name: "Open menu" }, { timeout: 5000 });
    await userEvent.click(button);
    // Wait for the drawer body to appear in the DOM (portal renders to document.body).
    await within(canvasElement.ownerDocument.body).findByTestId(
      "navbar-mobile-menu",
      {},
      { timeout: 5000 },
    );
  },
};
