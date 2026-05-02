/* eslint-disable no-console */
import { BrowserOptions, EdgeOptions, NodeOptions } from "@sentry/nextjs";

// PII_FIELDS must be lowercase. A unit test should fail if a field with an uppercase letter is added.
export const PII_FIELDS = new Set(["password", "token", "email", "key", "authorization"]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const containsPIIField = (key: string) => {
  const normalisedKey = key.toLowerCase();

  return [...PII_FIELDS].some((field) => normalisedKey.includes(field));
};

export const clearPII = (obj: Record<string, unknown>) => {
  for (const [key, value] of Object.entries(obj)) {
    if (containsPIIField(key)) {
      obj[key] = "[REDACTED]";
      continue;
    }

    if (Array.isArray(value)) {
      for (const entry of value) {
        if (isRecord(entry)) {
          clearPII(entry);
        }
      }
      continue;
    }

    if (isRecord(value)) {
      clearPII(value);
    }
  }
};

// Do NOT send user PII (Personally Identifiable Information) in error reports.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
export const defaultConfig: BrowserOptions | NodeOptions | EdgeOptions = {
  beforeSend(evt) {
    const extraRpcInput = evt.extra?.rpcInput;
    if (isRecord(extraRpcInput)) {
      clearPII(extraRpcInput);
    }

    const contextRpcInput = evt.contexts?.rpcInput;
    if (isRecord(contextRpcInput)) {
      clearPII(contextRpcInput);
    }

    return evt;
  },

  beforeSendLog(log) {
    if (process.env.NODE_ENV !== "production") {
      switch (log.level) {
        case "fatal":
        case "error": {
          console.error(String(log.message), log.attributes);
          break;
        }
        case "warn": {
          console.warn(log.message, log.attributes);
          break;
        }
        case "info": {
          console.info(log.message, log.attributes);
          break;
        }
        case "debug": {
          console.debug(log.message, log.attributes);
          break;
        }
        case "trace": {
          console.trace(log.message, log.attributes);
          break;
        }
        default: {
          log.level = "info";
        }
      }
    }
    return log;
  },

  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  enableLogs: true,

  sendDefaultPii: false,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.01 : 1,
};
