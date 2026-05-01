import { QueryClient } from "@tanstack/react-query";

export const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnReconnect: true, // only if the data are stale
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });
