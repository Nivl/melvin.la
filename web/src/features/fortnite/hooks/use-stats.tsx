import { useQuery } from "@tanstack/react-query";

import { AccountTypes, TimeWindow } from "#features/fortnite/models";
import { useTRPC } from "#trpc/client";

const TEN_MINUTES = 10 * 60 * 1000;

export const useStats = (
  accountName: string,
  accountType: AccountTypes,
  timeWindow: TimeWindow,
  disabled = false,
) => {
  const trpc = useTRPC();

  const { data, isLoading, error } = useQuery({
    ...trpc.fortniteGetStats.queryOptions({
      platform: accountType,
      timeWindow,
      username: accountName,
    }),
    enabled: !disabled && Boolean(accountName),
    staleTime: TEN_MINUTES, // a game last 5 to 25 minutes
  });

  return { data, error, isLoading };
};
