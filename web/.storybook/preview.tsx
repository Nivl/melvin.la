/* eslint-disable import/no-default-export */

// globals.css is a special case and is expected to be imported
// eslint-disable import/no-restricted-imports
import "#app/globals.css";
import "./fonts.css";

import type { Preview } from "@storybook/nextjs";
import { NextIntlClientProvider } from "next-intl";

import defaultMessages from "#messages/en.json";
import { TRPCReactProvider } from "#trpc/provider";

import { withNextThemes } from "./decorators/with-next-themes";
import { supportedModes } from "./modes";

const preview: Preview = {
  decorators: [
    (Story) => {
      globalThis.window.localStorage.clear();
      return <Story />;
    },
    (Story) => (
      <TRPCReactProvider>
        <Story />
      </TRPCReactProvider>
    ),
    (Story) => (
      <NextIntlClientProvider locale="en" messages={defaultMessages}>
        <Story />
      </NextIntlClientProvider>
    ),
    withNextThemes({
      attribute: "class",
      defaultTheme: "system",
      enableSystem: true,
      themes: {
        dark: "dark",
        light: "light",
        system: "system",
      },
    }),
  ],
  parameters: {
    chromatic: {
      modes: {
        ...supportedModes,
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
    viewport: {
      viewports: {
        FourK: { name: "4k", styles: { height: "2000px", width: "2560px" } },
        large: { name: "Large", styles: { height: "2000px", width: "1024px" } },
        medium: {
          name: "Medium",
          styles: { height: "1000px", width: "768px" },
        },
        small: { name: "Small", styles: { height: "800px", width: "700px" } },
        xlarge: { name: "XL", styles: { height: "2000px", width: "1280px" } },
        xsmall: { name: "XS", styles: { height: "490px", width: "320px" } },
        xxlarge: { name: "XXL", styles: { height: "2000px", width: "1440px" } },
      },
    },
  },
};

export default preview;
