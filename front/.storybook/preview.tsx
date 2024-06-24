import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import '../src/app/globals.css';


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
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [withThemeByClassName({
      themes: {
          light: '',
          dark: 'dark',
      },
      defaultTheme: 'dark',
  }),
  (Story) => (
    <QueryClientProvider client={queryClient}>
        <Story />
    </QueryClientProvider>
  )
]
};

export default preview;
