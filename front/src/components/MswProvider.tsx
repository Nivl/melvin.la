'use client';
import { ReactNode, useEffect } from 'react';

export const MswProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_MOCKING?.toLowerCase() === 'true') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { enableMSW } = require('../backend/mocks') as {
        enableMSW: () => void;
      };
      enableMSW();
    }
  }, []);

  return children;
};
