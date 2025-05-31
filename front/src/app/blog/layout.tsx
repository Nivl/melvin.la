'use client';

import { Spinner } from '@heroui/react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useRouter } from 'next/navigation';

import { FLAG_ENABLE_BLOG } from '#backend/flags';
import { useIsLDReady } from '#hooks/useIsLDReady';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isReady = useIsLDReady();
  const flags = useFlags();
  const router = useRouter();

  if (!isReady) {
    return (
      <div className="absolute left-0 top-0 flex h-screen w-screen items-center justify-center">
        <Spinner label="Loading..." color="primary" className="" />
      </div>
    );
  }

  if (!flags[FLAG_ENABLE_BLOG]) {
    router.replace('/');
  }

  return <>{children}</>;
}
