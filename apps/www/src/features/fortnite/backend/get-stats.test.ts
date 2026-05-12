import { describe, expect, it, vi } from "vitest";

import type { FortniteStatsData } from "#features/fortnite/models";
import { AccountTypes, TimeWindow } from "#features/fortnite/models";
import { appRouter } from "#trpc/routers/_app";

const mockStatsResponse: FortniteStatsData = {
  account: {
    id: "account-id",
    name: "Mongraal",
  },
  battlePass: {
    level: 1,
    progress: 0,
  },
  stats: {},
};

const buildInput = (username: string) => ({
  platform: AccountTypes.Epic,
  timeWindow: TimeWindow.Lifetime,
  username,
});

const stubFortniteEnv = () => {
  vi.stubEnv("API_FORTNITE_API_KEY", "test-key");
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation(async () =>
      Response.json(
        { data: mockStatsResponse, status: 200 },
        {
          status: 200,
        },
      ),
    ),
  );
};

describe("fortniteGetStats input validation", () => {
  it("accepts plausible Fortnite usernames", async () => {
    expect.assertions(4);
    stubFortniteEnv();
    const caller = appRouter.createCaller({});

    await expect(caller.fortniteGetStats(buildInput("Mongraal"))).resolves.toStrictEqual(
      mockStatsResponse,
    );
    await expect(caller.fortniteGetStats(buildInput("DIG Aussie1X"))).resolves.toStrictEqual(
      mockStatsResponse,
    );
    await expect(caller.fortniteGetStats(buildInput("M8 Nîkof"))).resolves.toStrictEqual(
      mockStatsResponse,
    );
    await expect(caller.fortniteGetStats(buildInput("Player#1234"))).resolves.toStrictEqual(
      mockStatsResponse,
    );
  }, 5000);

  it("rejects empty usernames after trimming", async () => {
    expect.assertions(1);
    stubFortniteEnv();
    const caller = appRouter.createCaller({});

    await expect(caller.fortniteGetStats(buildInput("   "))).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  }, 5000);

  it("rejects usernames with control characters", async () => {
    expect.assertions(1);
    stubFortniteEnv();
    const caller = appRouter.createCaller({});

    await expect(caller.fortniteGetStats(buildInput("bad\u0000name"))).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  }, 5000);

  it("rejects usernames longer than 30 characters", async () => {
    expect.assertions(1);
    stubFortniteEnv();
    const caller = appRouter.createCaller({});

    await expect(caller.fortniteGetStats(buildInput("a".repeat(31)))).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  }, 5000);
});
