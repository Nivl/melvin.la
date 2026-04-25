import { describe, expect, it } from "vitest";

import { clearPII, PII_FIELDS } from "./sentry.default.config";

describe("PII Fields", () => {
  it("should be lowercase", () => {
    for (const field of PII_FIELDS) {
      expect(field).toBe(field.toLowerCase());
    }
  }, 5000);
});

describe(clearPII, () => {
  it("redacts known sensitive fields recursively", () => {
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

    expect(rpcInput).toEqual({
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
