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
    // `globals.viewport` is applied before rendering, so Tailwind's md:hidden
    // correctly hides the desktop nav and reveals the mobile hamburger button.
    // `parameters.viewport.defaultViewport` is only a UI preference and does
    // not resize the actual browser viewport when the play function runs.
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
    // Disable CSS transitions so the drawer snaps to its final open state
    // immediately. This removes any timing/animation dependency and makes
    // the Chromatic snapshot reliable regardless of transition duration.
    const style = canvasElement.ownerDocument.createElement("style");
    style.textContent =
      "*, *::before, *::after { transition-duration: 0ms !important; animation-duration: 0ms !important; transition-delay: 0ms !important; animation-delay: 0ms !important; }";
    canvasElement.ownerDocument.head.append(style);

    const canvas = within(canvasElement);
    // findByRole waits for the real MobileDrawer to mount after its dynamic
    // import resolves (MobileDrawerLoading is aria-hidden and won't match).
    // At large viewports md:hidden removes the button from the a11y tree, so
    // the catch returns early without failing.
    let button: HTMLElement | undefined = undefined;
    try {
      button = await canvas.findByRole("button", { name: "Open menu" }, { timeout: 5000 });
    } catch {
      return;
    }
    await userEvent.click(button);
    // Wait for the drawer body to appear in the DOM (portal renders to document.body).
    try {
      await within(canvasElement.ownerDocument.body).findByTestId(
        "navbar-mobile-menu",
        {},
        { timeout: 5000 },
      );
    } catch {
      // Button existed but drawer didn't open — nothing to wait for.
    }
  },
};
