'use client';
import { Suspense, use } from 'react';

// https://github.com/mswjs/msw/issues/1644
// https://github.com/mswjs/examples/pull/101/files
const mockingEnabledPromise =
  process.env.NEXT_PUBLIC_API_MOCKING?.toLowerCase() === 'true'
    ? import('../backend/mocks').then(async ({ enableMSW }) => {
        await enableMSW();
      })
    : Promise.resolve();

export function MswProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // If MSW is enabled, we need to wait for the worker to start,
  // so we wrap the children in a Suspense boundary until it's ready.
  return (
    <Suspense fallback={null}>
      <MSWProviderWrapper>{children}</MSWProviderWrapper>
    </Suspense>
  );
}

function MSWProviderWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  use(mockingEnabledPromise);
  return children;
}
