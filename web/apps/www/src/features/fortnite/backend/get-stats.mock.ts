import { http, HttpResponse } from "msw";

import stats200 from "./fixtures/200.json" with { type: "json" };

// tRPC JSON-RPC error codes — must match @trpc/server error codes
const TRPC_INTERNAL_SERVER_ERROR = -32_603;
const TRPC_FORBIDDEN = -32_003;
const TRPC_NOT_FOUND = -32_004;

export const handler = http.get("/api/trpc/fortniteGetStats", ({ request }) => {
  const url = new URL(request.url);
  const rawInput = url.searchParams.get("input");
  let username: string | undefined = undefined;

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
    case "400": {
      return HttpResponse.json(
        [
          {
            error: {
              code: TRPC_INTERNAL_SERVER_ERROR,
              data: { code: "INTERNAL_SERVER_ERROR", httpStatus: 500, path: "fortniteGetStats" },
              message: "unexpected status code from fortnite-api: 400",
            },
          },
        ],
        { status: 500 },
      );
    }
    case "403": {
      return HttpResponse.json(
        [
          {
            error: {
              code: TRPC_FORBIDDEN,
              data: { code: "FORBIDDEN", httpStatus: 403, path: "fortniteGetStats" },
              message: "account is private",
            },
          },
        ],
        { status: 403 },
      );
    }
    case "404": {
      return HttpResponse.json(
        [
          {
            error: {
              code: TRPC_NOT_FOUND,
              data: { code: "NOT_FOUND", httpStatus: 404, path: "fortniteGetStats" },
              message: "account not found",
            },
          },
        ],
        { status: 404 },
      );
    }
    case "500": {
      return HttpResponse.json(
        [
          {
            error: {
              code: TRPC_INTERNAL_SERVER_ERROR,
              data: { code: "INTERNAL_SERVER_ERROR", httpStatus: 500, path: "fortniteGetStats" },
              message: "unexpected status code from fortnite-api: 500",
            },
          },
        ],
        { status: 500 },
      );
    }
    default: {
      return HttpResponse.json([{ result: { data: stats200.data } }], { status: 200 });
    }
  }
});
