import { describe, expect, it, vi } from "vitest";

const { reportCspViolation } = vi.hoisted(() => ({
  reportCspViolation: vi.fn<(report: unknown) => void>(),
}));

vi.mock(import("./report-csp-violation"), () => ({
  reportCspViolation,
}));

describe("pOST /api/csp-report", () => {
  it("forwards CSP violation payloads to the reporting helper and returns no content", async () => {
    expect.assertions(2);
    const { POST } = await import("./route");
    const payload = {
      "csp-report": {
        "blocked-uri": "https://evil.example/script.js",
        disposition: "report",
        "document-uri": "https://melvin.la/",
        "effective-directive": "script-src-elem",
        "violated-directive": "script-src-elem",
      },
    };

    const response = await POST(
      new Request("https://melvin.la/api/csp-report", {
        body: JSON.stringify(payload),
        headers: {
          "content-type": "application/csp-report",
        },
        method: "POST",
      }),
    );

    expect(response.status).toBe(204);
    expect(reportCspViolation).toHaveBeenCalledWith(payload);
  }, 5000);
});
