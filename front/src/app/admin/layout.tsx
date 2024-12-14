'use client';

import { Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

import { MeContext } from '#contexts/MeContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { me, isLoading: isPageLoading } = useContext(MeContext);

  useEffect(() => {
    if (!isPageLoading && !me) {
      router.replace('/auth/sign-in');
    }

    // We don't put the router here to avoid an infinite loop
  }, [me, isPageLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isPageLoading || !me) {
    return (
      <div className="absolute left-0 top-0 flex h-screen w-screen items-center justify-center">
        <Spinner label="Loading..." color="primary" className="" />
      </div>
    );
  }

  return <>{children}</>;
}
