import { describe, expect, it } from "vitest";

import { clearPII, PII_FIELDS } from "./sentry.default.config";

describe("pII Fields", () => {
  it("should be lowercase", () => {
    expect.hasAssertions();
    for (const field of PII_FIELDS) {
      expect(field).toBe(field.toLowerCase());
    }
  }, 5000);
});

describe(clearPII, () => {
  it("redacts known sensitive fields recursively", () => {
    expect.assertions(1);
    const rpcInput = {
      apiToken: "token-value",
      email: "user@example.com",
      emails: ["a@example.com", "b@example.com"],
      nested: {
        apiKey: "secret-api-key",
        safeValue: "safe",
        tokens: [
          {
            authorization: "Bearer secret",
          },
        ],
      },
      password: "super-secret",
      username: "Mongraal",
    };

    clearPII(rpcInput);

    expect(rpcInput).toStrictEqual({
      apiToken: "[REDACTED]",
      email: "[REDACTED]",
      emails: "[REDACTED]",
      nested: {
        apiKey: "[REDACTED]",
        safeValue: "safe",
        tokens: "[REDACTED]",
      },
      password: "[REDACTED]",
      username: "Mongraal",
    });
  }, 5000);
});
