'use client';
import { ReactNode, useEffect } from 'react';

export const MswProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_MOCKING?.toLowerCase() === 'true') {
      const enableMSW = require('../backend/mocks').enableMSW; // eslint-disable-line @typescript-eslint/no-var-requires
      enableMSW();
    }
  }, []);

  return children;
};
