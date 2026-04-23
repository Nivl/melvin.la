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
      // Pause CSS transitions at their final frame so the drawer is fully
      // visible when Chromatic takes the snapshot (not mid-animation).
      pauseAnimationAtEnd: true,
    },
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
    //
    // findByRole waits for the real MobileDrawer to mount after its dynamic
    // import resolves (MobileDrawerLoading is aria-hidden and won't match).
    let button: HTMLElement | undefined = undefined;
    try {
      button = await canvas.findByRole("button", { name: "Open menu" }, { timeout: 5000 });
    } catch {
      return;
    }
    await userEvent.click(button);
    // Wait for the drawer content to appear before Chromatic takes its snapshot.
    // Without this the snapshot fires before the drawer finishes opening.
    try {
      await within(canvasElement.ownerDocument.body).findByTestId(
        "navbar-mobile-menu",
        {},
        { timeout: 5000 },
      );
    } catch {
      // Large viewports: button was hidden, drawer won't open — nothing to wait for.
    }
  },
};
