import {
  $api,
  type FortnitePlatform,
  type FortniteTimeWindow,
} from '#backend/api';

export const useStats = (
  accountName: string,
  accountType: FortnitePlatform,
  timeWindow: FortniteTimeWindow,
  disabled = false,
) => {
  const { data, isLoading, error } = $api.useQuery(
    'get',
    '/fortnite/stats/{username}/{platform}/{timeWindow}',
    {
      params: {
        path: { username: accountName, platform: accountType, timeWindow },
      },
    },
    {
      enabled: !disabled && !!accountName,
    },
  );

  return { data: data?.data, isLoading, error };
};
