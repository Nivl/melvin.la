import { captureException } from "@sentry/nextjs";

import { reportCspViolation } from "./report-csp-violation";

export const POST = async (request: Request) => {
  try {
    const report = (await request.json()) as unknown;

    reportCspViolation(report);

    return new Response(undefined, {
      status: 204,
    });
  } catch (error) {
    captureException(error);
    return new Response(undefined, {
      status: 400,
    });
  }
};
