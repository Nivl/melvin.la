'use client';
import { HeroUIProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import moment from 'moment-timezone';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import { useRouter } from '#i18n/routing';

import { buildGetMessageFallback, MessagesType } from '../i18n/request';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// HeroUIProvider needs the router, but to be able to get the router
// with useRouter(), we need to be in a child of NextIntlClientProvider.
// this prevents us from having a single Providers component.
const UIProviders = ({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) => {
  const router = useRouter();

  return (
    <HeroUIProvider
      locale={locale}
      navigate={(...args) => {
        router.push(...args);
      }}
    >
      <NextThemesProvider attribute="class">{children}</NextThemesProvider>
    </HeroUIProvider>
  );
};

export const Providers = ({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: MessagesType;
}) => {
  const momentLocale = locale == 'zh' ? 'zh-cn' : locale;
  moment.locale(momentLocale);

  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider
        messages={messages}
        locale={locale}
        getMessageFallback={buildGetMessageFallback(locale)}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onError={() => {}}
      >
        <UIProviders locale={locale}>{children} </UIProviders>
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
};
