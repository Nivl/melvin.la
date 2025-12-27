import * as Sentry from '@sentry/nextjs';

export const defaultConfig:
  | Sentry.BrowserOptions
  | Sentry.NodeOptions
  | Sentry.EdgeOptions = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Do NOT send user PII (Personally Identifiable Information) in error reports.
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,
};
