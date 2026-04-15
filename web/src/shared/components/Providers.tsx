"use client";

import { I18nProvider, Toast } from "@heroui/react";
import moment from "moment-timezone";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { buildGetMessageFallback, MessagesType } from "#i18n/request";
import { TRPCReactProvider } from "#trpc/client";

export const Providers = ({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: MessagesType;
}) => {
  const momentLocale = locale == "zh" ? "zh-cn" : locale;
  moment.locale(momentLocale);

  return (
    <TRPCReactProvider>
      <NextIntlClientProvider
        messages={messages}
        locale={locale}
        getMessageFallback={buildGetMessageFallback(locale)}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onError={() => {}}
      >
        <I18nProvider locale={locale}>
          <NextThemesProvider attribute="class">
            <Toast.Provider placement="bottom end" />
            {children}
          </NextThemesProvider>
        </I18nProvider>
      </NextIntlClientProvider>
    </TRPCReactProvider>
  );
};
