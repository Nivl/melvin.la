import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getSafeRpcInput } from "#features/fortnite/backend/get-stats";
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

describe("fortniteGetStats input validation", () => {
  beforeEach(() => {
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
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("accepts plausible Fortnite usernames", async () => {
    const caller = appRouter.createCaller({});

    await expect(caller.fortniteGetStats(buildInput("Mongraal"))).resolves.toEqual(
      mockStatsResponse,
    );
    await expect(caller.fortniteGetStats(buildInput("DIG Aussie1X"))).resolves.toEqual(
      mockStatsResponse,
    );
    await expect(caller.fortniteGetStats(buildInput("M8 Nîkof"))).resolves.toEqual(
      mockStatsResponse,
    );
    await expect(caller.fortniteGetStats(buildInput("Player#1234"))).resolves.toEqual(
      mockStatsResponse,
    );
  }, 5000);

  it("omits the username from Sentry rpcInput context", () => {
    expect(getSafeRpcInput(buildInput("Player#1234"))).toEqual({
      platform: AccountTypes.Epic,
      timeWindow: TimeWindow.Lifetime,
    });
  }, 5000);

  it("rejects empty usernames after trimming", async () => {
    const caller = appRouter.createCaller({});

    await expect(caller.fortniteGetStats(buildInput("   "))).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  }, 5000);

  it("rejects usernames with control characters", async () => {
    const caller = appRouter.createCaller({});

    await expect(caller.fortniteGetStats(buildInput("bad\u0000name"))).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  }, 5000);

  it("rejects usernames longer than 30 characters", async () => {
    const caller = appRouter.createCaller({});

    await expect(caller.fortniteGetStats(buildInput("a".repeat(31)))).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  }, 5000);
});
