import { useLDClient } from 'launchdarkly-react-client-sdk';

export const useIsLDReady = (): boolean => {
  const ldClient = useLDClient();
  return ldClient !== undefined;
};
