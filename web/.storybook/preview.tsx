/* eslint-disable import/no-default-export */

// globals.css is a special case and is expected to be imported
// eslint-disable import/no-restricted-imports
import "#app/globals.css";
import "./fonts.css";

import type { Preview } from "@storybook/nextjs";
import { NextIntlClientProvider } from "next-intl";

import defaultMessages from "#messages/en.json";
import { TRPCReactProvider } from "#trpc/provider";

import { withNextThemes } from "./decorators/withNextThemes";
import { supportedModes } from "./modes";

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    viewport: {
      viewports: {
        xsmall: { name: "XS", styles: { width: "320px", height: "490px" } },
        small: { name: "Small", styles: { width: "700px", height: "800px" } },
        medium: {
          name: "Medium",
          styles: { width: "768px", height: "1000px" },
        },
        large: { name: "Large", styles: { width: "1024px", height: "2000px" } },
        xlarge: { name: "XL", styles: { width: "1280px", height: "2000px" } },
        xxlarge: { name: "XXL", styles: { width: "1440px", height: "2000px" } },
        FourK: { name: "4k", styles: { width: "2560px", height: "2000px" } },
      },
    },
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
  },
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
      themes: {
        light: "light",
        dark: "dark",
        system: "system",
      },
      defaultTheme: "system",
      enableSystem: true,
      attribute: "class",
    }),
  ],
};

export default preview;
