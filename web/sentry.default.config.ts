/* eslint-disable no-console */
import { BrowserOptions, EdgeOptions, NodeOptions } from "@sentry/nextjs";

// Do NOT send user PII (Personally Identifiable Information) in error reports.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
export const defaultConfig: BrowserOptions | NodeOptions | EdgeOptions = {
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
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
};
