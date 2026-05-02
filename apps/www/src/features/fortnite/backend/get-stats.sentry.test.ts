import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AccountTypes, TimeWindow } from "#features/fortnite/models";

type EventProcessor = (
  event: Record<string, unknown>,
  hint: { originalException: unknown },
) =>
  | Promise<Record<string, unknown> | null | undefined>
  | Record<string, unknown>
  | null
  | undefined;

const applyProcessors = async (
  processors: EventProcessor[],
  event: Record<string, unknown> | undefined,
  error: unknown,
  index = 0,
): Promise<Record<string, unknown> | undefined> => {
  if (event === undefined) {
    return undefined;
  }

  const processor = processors.at(index);

  if (processor === undefined) {
    return event;
  }

  return applyProcessors(
    processors,
    (await processor(event, { originalException: error })) ?? undefined,
    error,
    index + 1,
  );
};

const {
  captureExceptionMock,
  getCurrentScopeMock,
  reportedErrors,
  resetScope,
  trpcMiddlewareMock,
} = vi.hoisted(() => {
  type MockScope = {
    addEventProcessor: (processor: EventProcessor) => void;
    processors: EventProcessor[];
    setContext: (name: string, value: unknown) => void;
  };

  const createScope = (): MockScope => ({
    addEventProcessor(processor) {
      this.processors.push(processor);
    },
    processors: [],
    setContext: vi.fn<(name: string, value: unknown) => void>(),
  });

  let currentScope = createScope();
  const reportedErrorsState: unknown[] = [];

  const captureExceptionFn = vi.fn<(error: unknown) => Promise<void>>(async (error: unknown) => {
    const event = await applyProcessors(currentScope.processors, {}, error);

    if (event === undefined) {
      return;
    }

    reportedErrorsState.push(error);
  });

  const resetScopeState = () => {
    captureExceptionFn.mockClear();
    reportedErrorsState.length = 0;
    currentScope = createScope();
  };

  const getCurrentScopeFn = (() =>
    currentScope) as unknown as typeof import("@sentry/nextjs").getCurrentScope;
  const trpcMiddlewareFn = (() =>
    async ({ next }: { next: () => Promise<unknown> }) => {
      currentScope = createScope();

      try {
        const result = await next();

        if (
          typeof result === "object" &&
          result !== null &&
          "ok" in result &&
          result.ok === false &&
          "error" in result
        ) {
          await captureExceptionFn(result.error);
        }

        return result;
      } catch (error) {
        await captureExceptionFn(error);
        throw error;
      }
    }) as unknown as typeof import("@sentry/nextjs").trpcMiddleware;

  return {
    captureExceptionMock: captureExceptionFn,
    getCurrentScopeMock: getCurrentScopeFn,
    reportedErrors: reportedErrorsState,
    resetScope: resetScopeState,
    trpcMiddlewareMock: trpcMiddlewareFn,
  };
});

vi.mock(import("@sentry/nextjs"), () => ({
  captureException:
    captureExceptionMock as unknown as typeof import("@sentry/nextjs").captureException,
  getCurrentScope: getCurrentScopeMock,
  trpcMiddleware: trpcMiddlewareMock,
}));

const buildInput = (username: string) => ({
  platform: AccountTypes.Epic,
  timeWindow: TimeWindow.Lifetime,
  username,
});

const createCaller = async () => {
  vi.resetModules();
  const { appRouter } = await import("#trpc/routers/_app");

  return {
    caller: appRouter.createCaller({}),
  };
};

describe("fortniteGetStats sentry reporting", () => {
  beforeEach(() => {
    vi.stubEnv("API_FORTNITE_API_KEY", "test-key");
  });

  afterEach(() => {
    resetScope();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it.each([
    { code: "FORBIDDEN", status: 403 },
    { code: "NOT_FOUND", status: 404 },
  ])(
    "does not report expected %s responses to Sentry",
    async ({ code, status }) => {
      vi.stubGlobal(
        "fetch",
        vi.fn<() => Promise<Response>>().mockResolvedValue(
          new Response(undefined, {
            status,
          }),
        ),
      );

      const { caller } = await createCaller();

      await expect(caller.fortniteGetStats(buildInput("ninja"))).rejects.toMatchObject({
        code,
      });
      expect(captureExceptionMock).toHaveBeenCalledTimes(1);
      expect(reportedErrors).toHaveLength(0);
    },
    5000,
  );

  it("still reports unexpected upstream failures to Sentry", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<() => Promise<Response>>().mockResolvedValue(
        new Response(undefined, {
          status: 500,
        }),
      ),
    );

    const { caller } = await createCaller();

    await expect(caller.fortniteGetStats(buildInput("ninja"))).rejects.toMatchObject({
      code: "INTERNAL_SERVER_ERROR",
    });
    expect(captureExceptionMock).toHaveBeenCalledTimes(1);
    expect(reportedErrors).toHaveLength(1);
  }, 5000);
});
