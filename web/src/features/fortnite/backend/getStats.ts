import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { AccountTypes, FortniteAPIStatsResponse, TimeWindow } from "#features/fortnite/models";
import { baseProcedure } from "#trpc/init";

const fortniteStatsUrl = "https://fortnite-api.com/v2/stats/br/v2";

function isFortniteAPIStatsResponse(value: unknown): value is FortniteAPIStatsResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    typeof value.status === "number" &&
    "data" in value &&
    typeof value.data === "object" &&
    value.data !== null
  );
}

export const endpoint = baseProcedure
  .input(
    z.object({
      username: z.string().trim().min(1),
      platform: z.enum(Object.values(AccountTypes)),
      timeWindow: z.enum(Object.values(TimeWindow)),
    }),
  )
  .query(async ({ input }) => {
    const params = new URLSearchParams();
    params.append("name", input.username);
    params.append("accountType", input.platform);
    params.append("timeWindow", input.timeWindow);

    if (!process.env.API_FORTNITE_API_KEY) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "API key is missing" });
    }

    const rawRes = await fetch(`${fortniteStatsUrl}?${params.toString()}`, {
      headers: {
        "content-type": "application/json",
        Authorization: process.env.API_FORTNITE_API_KEY,
      },
      method: "GET",
    });

    switch (rawRes.status) {
      case 200: {
        const res: unknown = await rawRes.json();

        if (!isFortniteAPIStatsResponse(res)) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "invalid response shape from fortnite-api",
          });
        }
        return res.data;
      }
      case 403:
        throw new TRPCError({ code: "FORBIDDEN", message: "account is private" });
      case 404:
        throw new TRPCError({ code: "NOT_FOUND", message: "account not found" });
      default:
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `unexpected status code from fortnite-api: ${rawRes.status.toString()}`,
        });
    }
  });
