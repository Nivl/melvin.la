import { http, HttpResponse } from "msw";

import stats200 from "./fixtures/200.json" with { type: "json" };
import stats400 from "./fixtures/400.json" with { type: "json" };
import stats403 from "./fixtures/403.json" with { type: "json" };
import stats404 from "./fixtures/404.json" with { type: "json" };
import stats500 from "./fixtures/500.json" with { type: "json" };
// Must stay in sync with fortniteStatsUrl in getStats.ts
const fortniteStatsUrl = "https://fortnite-api.com/v2/stats/br/v2";

// Handler for Node.js/unit-test environments: intercepts the external Fortnite API
// (used by src/trpc/mock.ts for vitest tests and storybook)
export const handler = http.get(fortniteStatsUrl, ({ request }) => {
  const url = new URL(request.url);
  const name = url.searchParams.get("name");

  switch (name) {
    case "400":
      return HttpResponse.json(stats400, { status: 400 });
    case "403":
      return HttpResponse.json(stats403, { status: 403 });
    case "404":
      return HttpResponse.json(stats404, { status: 404 });
    case "500":
      return HttpResponse.json(stats500, { status: 500 });
    default:
      return HttpResponse.json(stats200, { status: 200 });
  }
});

// tRPC JSON-RPC error codes — must match @trpc/server error codes
const TRPC_INTERNAL_SERVER_ERROR = -32_603;
const TRPC_FORBIDDEN = -32_003;
const TRPC_NOT_FOUND = -32_004;

// Handler for browser/e2e environments: intercepts the tRPC endpoint the browser
// actually calls. The real fortnite-api.com fetch happens server-side, so the
// browser MSW service worker cannot intercept it.
export const e2eHandler = http.get(
  "http://localhost:3000/api/trpc/fortineGetStats",
  ({ request }) => {
    const url = new URL(request.url);
    const rawInput = url.searchParams.get("input");
    let username: string | undefined;
    try {
      const parsed: unknown = JSON.parse(rawInput ?? "{}");
      if (parsed !== null && typeof parsed === "object" && "0" in parsed) {
        const item = (parsed as Record<string, unknown>)["0"];
        if (item !== null && typeof item === "object" && "username" in item) {
          username = String((item as Record<string, unknown>).username);
        }
      }
    } catch {
      // ignore malformed input — fall through to default
    }

    switch (username) {
      case "400":
        return HttpResponse.json(
          [
            {
              error: {
                message: "unexpected status code from fortnite-api: 400",
                code: TRPC_INTERNAL_SERVER_ERROR,
                data: { code: "INTERNAL_SERVER_ERROR", httpStatus: 500, path: "fortineGetStats" },
              },
            },
          ],
          { status: 500 },
        );
      case "403":
        return HttpResponse.json(
          [
            {
              error: {
                message: "account is private",
                code: TRPC_FORBIDDEN,
                data: { code: "FORBIDDEN", httpStatus: 403, path: "fortineGetStats" },
              },
            },
          ],
          { status: 403 },
        );
      case "404":
        return HttpResponse.json(
          [
            {
              error: {
                message: "account not found",
                code: TRPC_NOT_FOUND,
                data: { code: "NOT_FOUND", httpStatus: 404, path: "fortineGetStats" },
              },
            },
          ],
          { status: 404 },
        );
      case "500":
        return HttpResponse.json(
          [
            {
              error: {
                message: "unexpected status code from fortnite-api: 500",
                code: TRPC_INTERNAL_SERVER_ERROR,
                data: { code: "INTERNAL_SERVER_ERROR", httpStatus: 500, path: "fortineGetStats" },
              },
            },
          ],
          { status: 500 },
        );
      default:
        return HttpResponse.json([{ result: { data: stats200.data } }], { status: 200 });
    }
  },
);
