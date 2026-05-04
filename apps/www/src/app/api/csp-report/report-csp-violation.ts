import { captureMessage, isEnabled } from "@sentry/nextjs";

// eslint-disable-next-line no-console
const Console = new console.Console(process.stdout, process.stderr);

const isRecord = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object") {
    return false;
  }

  if (Array.isArray(value)) {
    return false;
  }

  if (Object.getOwnPropertySymbols(value).length > 0) {
    return false;
  }

  return true;
};

const isNestedObject = (value: unknown): value is Record<string, Record<string, unknown>> => {
  if (!isRecord(value)) {
    return false;
  }

  for (const key in value) {
    if (!isRecord(value[key])) {
      return false;
    }
  }

  return true;
};

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

  if (!isEnabled()) {
    // eval is expected with Next and react in dev mode
    if (
      process.env.NODE_ENV !== "production" &&
      isNestedObject(report) &&
      report["csp-report"]?.["blocked-uri"] === "eval"
    ) {
      return;
    }
    Console.error("Content Security Policy violation", { report });
  }
};
