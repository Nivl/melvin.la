import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("GET /api/trpc/fortniteGetStats", () => {
  beforeEach(() => {
    vi.stubEnv("API_FORTNITE_API_KEY", "test-key");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns a 499 tRPC error when the request aborts during the upstream fetch", async () => {
    const { GET } = await import("./route");
    const controller = new AbortController();

    vi.stubGlobal(
      "fetch",
      vi.fn<(url: string, init?: RequestInit) => Promise<Response>>().mockImplementation(
        async (_url: string, init?: RequestInit) =>
          new Promise((_resolve, reject) => {
            if (init?.signal?.aborted) {
              reject(new DOMException("The user aborted a request", "AbortError"));
              return;
            }

            init?.signal?.addEventListener(
              "abort",
              () => {
                reject(new DOMException("The user aborted a request", "AbortError"));
              },
              { once: true },
            );
          }),
      ),
    );

    const responsePromise = GET(
      new Request(
        "https://melvin.la/api/trpc/fortniteGetStats?batch=1&input=" +
          encodeURIComponent(
            JSON.stringify({
              0: {
                platform: "epic",
                timeWindow: "lifetime",
                username: "ninja",
              },
            }),
          ),
        {
          method: "GET",
          signal: controller.signal,
        },
      ),
    );

    controller.abort();

    const response = await responsePromise;
    const payload = (await response.json()) as [
      { error: { data: { code: string; httpStatus: number }; message: string } },
    ];

    expect(response.status).toBe(499);
    expect(payload[0].error.data.code).toBe("CLIENT_CLOSED_REQUEST");
    expect(payload[0].error.data.httpStatus).toBe(499);
    expect(payload[0].error.message).toBe("cancelled");
  }, 5000);
});
