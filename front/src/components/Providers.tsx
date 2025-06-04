'use client';
import { HeroUIProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import { LaunchDarklyProvider } from '#/components/LaunchDarklyProvider';
import { MswProvider } from '#/components/MswProvider';

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
        <HeroUIProvider
          navigate={(...args) => {
            router.push(...args);
          }}
        >
          <NextThemesProvider attribute="class">
            <LaunchDarklyProvider>{children}</LaunchDarklyProvider>
          </NextThemesProvider>
        </HeroUIProvider>
      </QueryClientProvider>
    </MswProvider>
  );
};
