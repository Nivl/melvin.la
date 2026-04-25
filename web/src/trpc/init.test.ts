import { describe, expect, it } from "vitest";

import { sentryMiddlewareOptions } from "./init";

describe("trpc sentry middleware", () => {
  it("disables blanket rpc input capture", () => {
    expect(sentryMiddlewareOptions).toEqual({
      attachRpcInput: false,
    });
  }, 5000);
});
