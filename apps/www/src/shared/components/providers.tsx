"use client";

import { I18nProvider, Toast } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "@melvinla/next-themes";
import { NextIntlClientProvider } from "next-intl";

import { buildGetMessageFallback, MessagesType } from "#i18n/request";
import { TRPCReactProvider } from "#trpc/provider";

export const Providers = ({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: MessagesType;
}) => (
  <TRPCReactProvider>
    <NextIntlClientProvider
      messages={messages}
      locale={locale}
      getMessageFallback={buildGetMessageFallback(locale)}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onError={() => {}}
    >
      <I18nProvider locale={locale}>
        <NextThemesProvider>
          <Toast.Provider placement="bottom end" />
          {children}
        </NextThemesProvider>
      </I18nProvider>
    </NextIntlClientProvider>
  </TRPCReactProvider>
);
