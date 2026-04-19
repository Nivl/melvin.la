import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // eslint-disable-next-line import/no-relative-parent-imports
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    // eslint-disable-next-line import/no-relative-parent-imports
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
