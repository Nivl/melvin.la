import { describe, expect, it } from "vitest";

import nextConfig from "./next.config";

describe("next.config security headers", () => {
  it("applies the required security headers site-wide while keeping beatmaker caching", async () => {
    expect.assertions(9);
    const rules = await nextConfig.headers?.();

    expect(rules).toBeDefined();

    const globalRule = rules?.find((rule) => rule.source === "/:path*");
    expect(globalRule).toBeDefined();

    const globalHeaders = new Map(globalRule?.headers.map((header) => [header.key, header.value]));
    expect(globalHeaders.get("Strict-Transport-Security")).toContain("includeSubDomains");
    expect(globalHeaders.get("X-Content-Type-Options")).toBe("nosniff");
    expect(globalHeaders.get("X-Frame-Options")).toBe("DENY");
    expect(globalHeaders.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(globalHeaders.get("Permissions-Policy")).toContain("camera=()");
    expect(globalHeaders.get("Content-Security-Policy-Report-Only")).toContain(
      "report-uri /api/csp-report",
    );

    const assetRule = rules?.find(
      (rule) => rule.source === "/assets/games/beatmaker/samples/:version/:rest*",
    );
    expect(assetRule?.headers).toContainEqual({
      key: "Cache-Control",
      value: "public, max-age=31536000, immutable",
    });
  }, 5000);
});
