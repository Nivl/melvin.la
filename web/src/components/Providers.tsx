'use client';
import { HeroUIProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import moment from 'moment-timezone';
import { useRouter } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import { buildGetMessageFallback, MessagesType } from '../i18n/request';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const Providers = ({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: MessagesType;
}) => {
  const router = useRouter();
  moment.locale(locale);

  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider
        locale={locale}
        navigate={(...args) => {
          router.push(...args);
        }}
      >
        <NextThemesProvider attribute="class">
          <NextIntlClientProvider
            messages={messages}
            locale={locale}
            getMessageFallback={buildGetMessageFallback(locale)}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onError={() => {}}
          >
            {children}
          </NextIntlClientProvider>
        </NextThemesProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  );
};
