'use client';
import { LDProvider } from 'launchdarkly-react-client-sdk';
import { ReactNode } from 'react';

export const LaunchDarklyProvider = ({ children }: { children: ReactNode }) => {
  return (
    <LDProvider
      clientSideID={
        process.env.NEXT_PUBLIC_LAUNCH_DARKLY_CLIENT_ID ?? 'id-not-set'
      }
      reactOptions={{
        useCamelCaseFlagKeys: false,
      }}
    >
      {children}
    </LDProvider>
  );
};
