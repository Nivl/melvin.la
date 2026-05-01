import { describe, expect, it, vi } from "vitest";

import { AccountTypes, TimeWindow } from "#features/fortnite/models";

type QueryOptionsMockResult = {
  queryFn: () => void;
  queryKey: string[][];
};

const { queryOptionsMock, useQueryMock } = vi.hoisted(() => ({
  queryOptionsMock: vi.fn<(input: unknown, opts: unknown) => QueryOptionsMockResult>(),
  useQueryMock: vi.fn<
    (options: unknown) => { data: undefined; error: undefined; isLoading: boolean }
  >(() => ({
    data: undefined,
    error: undefined,
    isLoading: false,
  })),
}));

vi.mock(import("@tanstack/react-query"), () => ({
  useQuery: useQueryMock as unknown as typeof import("@tanstack/react-query").useQuery,
}));

vi.mock(import("#trpc/client"), () => ({
  useTRPC: (() =>
    ({
      fortniteGetStats: {
        queryOptions: queryOptionsMock,
      },
    }) as unknown as ReturnType<
      typeof import("#trpc/client").useTRPC
    >) as typeof import("#trpc/client").useTRPC,
}));

describe("useStats", () => {
  it("opts into request abortion on unmount", async () => {
    const { useStats } = await import("./use-stats");

    queryOptionsMock.mockReturnValue({
      queryFn: vi.fn<() => void>(),
      queryKey: [["fortniteGetStats"]],
    });

    useStats("ninja", AccountTypes.Epic, TimeWindow.Lifetime);

    expect(queryOptionsMock).toHaveBeenCalledWith({
      platform: AccountTypes.Epic,
      timeWindow: TimeWindow.Lifetime,
      username: "ninja",
    });
    expect(useQueryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: true,
        staleTime: 600_000,
      }),
    );
  }, 5000);
});
