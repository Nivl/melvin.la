import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  AccountTypes,
  FortniteAPIStatsResponse,
  TimeWindow,
  userNameMaxLength,
} from "#features/fortnite/models";
import { baseProcedure } from "#trpc/init";

const fortniteStatsUrl = "https://fortnite-api.com/v2/stats/br/v2";
const USERNAME_MIN = 1;
// Allow Unicode names plus common Epic separators while excluding control/bidi formatting chars.
const USERNAME_REGEX = /^[\p{L}\p{N}\p{M}_.#\- ]+$/u;

const getStatsInputSchema = z.object({
  platform: z.enum(Object.values(AccountTypes)),
  timeWindow: z.enum(Object.values(TimeWindow)),
  username: z
    .string()
    .trim()
    .min(USERNAME_MIN, "Username is required")
    .max(userNameMaxLength, "Username too long")
    .regex(USERNAME_REGEX, "Username contains unsupported characters"),
});

const isFortniteAPIStatsResponse = (value: unknown): value is FortniteAPIStatsResponse =>
  typeof value === "object" &&
  value !== null &&
  "status" in value &&
  typeof value.status === "number" &&
  "data" in value &&
  typeof value.data === "object" &&
  value.data !== null;

export const endpoint = baseProcedure.input(getStatsInputSchema).query(async ({ input }) => {
  const params = new URLSearchParams();
  params.append("name", input.username);
  params.append("accountType", input.platform);
  params.append("timeWindow", input.timeWindow);

  if (process.env.API_FORTNITE_API_KEY === undefined || process.env.API_FORTNITE_API_KEY === "") {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "API key is missing" });
  }

  const rawRes = await fetch(`${fortniteStatsUrl}?${params.toString()}`, {
    headers: {
      Authorization: process.env.API_FORTNITE_API_KEY,
      "content-type": "application/json",
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
    case 403: {
      throw new TRPCError({ code: "FORBIDDEN", message: "account is private" });
    }
    case 404: {
      throw new TRPCError({ code: "NOT_FOUND", message: "account not found" });
    }
    default: {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `unexpected status code from fortnite-api: ${rawRes.status.toString()}`,
      });
    }
  }
});
