import { useQuery } from '@tanstack/react-query';
import { useLDClient } from 'launchdarkly-react-client-sdk';
import { createContext } from 'react';
import { ReactNode, useEffect, useState } from 'react';

import { deleteToken, get, hasToken } from '#backend/request';
import { Me } from '#backend/types';
import { useWindow } from '#hooks/useWindow';

export interface MeContextInterface {
  me: Me | null;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  setMe: (_: Me | null) => void;
}

export const MeProvider = ({ children }: { children: ReactNode }) => {
  const [me, setMe] = useState<Me | null>(null);
  const [win] = useWindow();
  const ldClient = useLDClient();

  const { data, isLoading, fetchStatus, isError, error } = useQuery({
    queryKey: ['me'],
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
    retry: false,
    enabled: !!win && hasToken() && !me,
    queryFn: async () => {
      const res = await get('/users/me');
      if (!res.ok) {
        // we're not expecting any errors since the query should
        // not be made if the user has no token.
        // This should trigger if:
        // - Backend has an error
        // - token is invalid (need to be refreshed for example)
        if (res.status === 401) {
          deleteToken();
          return null;
        }
        throw new Error('unexpected network error');
      }
      return (await res.json()) as Me;
    },
  });
  useEffect(() => {
    if (data) {
      setMe(data);
    }
  }, [data]);

  useEffect(() => {
    if (ldClient) {
      const identity = me ? { key: me.id } : { anonymous: true };
      void ldClient.identify(identity);
    }
  }, [me, ldClient]);

  const toProvide: MeContextInterface = {
    me: data || me,
    setMe,
    isLoading: !win || (isLoading && fetchStatus !== 'idle'),
    isError,
    error,
  };

  return <MeContext.Provider value={toProvide}>{children}</MeContext.Provider>;
};

export const MeContext = createContext<{
  me: Me | null;
  setMe: (_: Me | null) => void;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
}>({
  me: null,
  setMe: () => null,
  isLoading: false,
  isError: false,
});
