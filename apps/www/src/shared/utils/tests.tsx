// This is a test file
//eslint-disable only-export-components

// hack for next-intl routing
// https://github.com/vercel/next.js/discussions/48937#discussioncomment-6395245
import {
  AppRouterContext,
  AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import React, { useMemo } from "react";
import { vi } from "vitest";

import { locales } from "#i18n/locales.ts";
import messages from "#messages/en.json";
import { Providers } from "#shared/components/providers.tsx";

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
      back: vi.fn<AppRouterInstance["back"]>(),
      forward: vi.fn<AppRouterInstance["forward"]>(),
      prefetch: vi.fn<AppRouterInstance["prefetch"]>(),
      push: vi.fn<AppRouterInstance["push"]>(),
      refresh: vi.fn<AppRouterInstance["refresh"]>(),
      replace: vi.fn<AppRouterInstance["replace"]>(),
      ...router,
    }),
    [router],
  );
  return <AppRouterContext.Provider value={mockedRouter}>{children}</AppRouterContext.Provider>;
};

export const testWrapper: React.JSXElementConstructor<{
  children: React.ReactNode;
}> = ({ children }: { children: React.ReactNode }) => (
  <AppRouterContextProviderMock>
    <Providers locale={locales[0]} messages={messages}>
      {children}
    </Providers>
  </AppRouterContextProviderMock>
);
