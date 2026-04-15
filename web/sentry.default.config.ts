/* eslint-disable no-console */
import * as Sentry from "@sentry/nextjs";

export const defaultConfig: Sentry.BrowserOptions | Sentry.NodeOptions | Sentry.EdgeOptions = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Sample 100% of traces in dev, 10% in production.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Do NOT send user PII (Personally Identifiable Information) in error reports.
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,
  beforeSendLog(log) {
    if (process.env.NODE_ENV !== "production") {
      switch (log.level) {
        case "fatal":
        case "error":
          console.error(String(log.message), log.attributes);
          break;
        case "warn":
          console.warn(log.message, log.attributes);
          break;
        case "info":
          console.info(log.message, log.attributes);
          break;
        case "debug":
          console.debug(log.message, log.attributes);
          break;
        case "trace":
          console.trace(log.message, log.attributes);
          break;
        default:
          log.level = "info";
      }
    }
    return log;
  },
};
