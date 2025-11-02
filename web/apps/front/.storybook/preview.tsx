/* <disabled>-eslint-disable import/no-default-export */

import '../src/app/globals.css';
import './fonts.css';

import type { Preview } from '@storybook/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { withNextThemes } from './decorators/withNextThemes';
import { supportedModes } from './modes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    viewport: {
      viewports: {
        xsmall: { name: 'XS', styles: { width: '320px', height: '490px' } },
        small: { name: 'Small', styles: { width: '700px', height: '800px' } },
        medium: {
          name: 'Medium',
          styles: { width: '768px', height: '1000px' },
        },
        large: { name: 'Large', styles: { width: '1024px', height: '2000px' } },
        xlarge: { name: 'XL', styles: { width: '1280px', height: '2000px' } },
        xxlarge: { name: 'XXL', styles: { width: '1440px', height: '2000px' } },
        FourK: { name: '4k', styles: { width: '2560px', height: '2000px' } },
      },
    },
    chromatic: {
      modes: {
        ...supportedModes,
      } as Record<string, { viewport?: string; theme?: 'light' | 'dark' }>,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    Story => {
      globalThis.window.localStorage.clear();
      return <Story />;
    },
    Story => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
    withNextThemes({
      themes: {
        light: 'light',
        dark: 'dark',
        system: 'system',
      },
      defaultTheme: 'system',
      enableSystem: true,
      attribute: 'class',
    }),
  ],
};

export default preview;
