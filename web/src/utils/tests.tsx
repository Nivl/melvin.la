// hack for next-intl routing
// https://github.com/vercel/next.js/discussions/48937#discussioncomment-6395245
import {
  AppRouterContext,
  AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import React, { useMemo } from "react";
import { vitest } from "vitest";

import { Providers } from "#components/Providers.tsx";
import { locales } from "#i18n/locales.ts";

import messages from "../../messages/en.json";

type AppRouterContextProviderMockProps = {
  router?: Partial<AppRouterInstance>;
  children: React.ReactNode;
};

const AppRouterContextProviderMock = ({
  router = {},
  children,
}: AppRouterContextProviderMockProps): React.ReactNode => {
  const mockedRouter: AppRouterInstance = useMemo(
    () => ({
      back: vitest.fn(),
      forward: vitest.fn(),
      push: vitest.fn(),
      replace: vitest.fn(),
      refresh: vitest.fn(),
      prefetch: vitest.fn(),
      ...router,
    }),
    [router],
  );
  return <AppRouterContext.Provider value={mockedRouter}>{children}</AppRouterContext.Provider>;
};

export const testWrapper: React.JSXElementConstructor<{
  children: React.ReactNode;
}> = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppRouterContextProviderMock>
      <Providers locale={locales[0]} messages={messages}>
        {children}
      </Providers>
    </AppRouterContextProviderMock>
  );
};
