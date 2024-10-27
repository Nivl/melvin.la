'use client';
import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import { MswProvider } from '#/components/MswProvider';
import { MeProvider } from '#contexts/MeContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  return (
    <MswProvider>
      <QueryClientProvider client={queryClient}>
        <NextUIProvider navigate={router.push}>
          <NextThemesProvider attribute="class">
            <MeProvider>{children}</MeProvider>
          </NextThemesProvider>
        </NextUIProvider>
      </QueryClientProvider>
    </MswProvider>
  );
};
