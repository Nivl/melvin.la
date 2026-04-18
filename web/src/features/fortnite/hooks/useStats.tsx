import { useQuery } from "@tanstack/react-query";

import { AccountTypes, TimeWindow } from "#features/fortnite/models";
import { useTRPC } from "#trpc/client";

export const useStats = (
  accountName: string,
  accountType: AccountTypes,
  timeWindow: TimeWindow,
  disabled = false,
) => {
  const trpc = useTRPC();

  const { data, isLoading, error } = useQuery({
    ...trpc.fortniteGetStats.queryOptions({
      username: accountName,
      platform: accountType,
      timeWindow: timeWindow,
    }),
    enabled: !disabled && !!accountName,
  });

  return { data: data, isLoading, error };
};
