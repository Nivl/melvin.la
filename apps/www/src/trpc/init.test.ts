import { describe, expect, it } from "vitest";

import { sentryMiddlewareOptions } from "./init";

describe("trpc sentry middleware", () => {
  it("disables blanket rpc input capture", () => {
    expect.assertions(1);
    expect(sentryMiddlewareOptions).toStrictEqual({
      attachRpcInput: false,
    });
  }, 5000);
});
