'use client';
import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

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
    <QueryClientProvider client={queryClient}>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider attribute="class">{children}</NextThemesProvider>
      </NextUIProvider>
    </QueryClientProvider>
  );
};
