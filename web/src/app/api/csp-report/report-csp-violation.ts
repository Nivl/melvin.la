import { captureMessage } from "@sentry/nextjs";

export const reportCspViolation = (report: unknown) => {
  captureMessage("Content Security Policy violation", {
    extra: {
      report,
    },
    level: "warning",
    tags: {
      endpoint: "csp-report",
    },
  });
};
