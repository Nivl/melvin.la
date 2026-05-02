// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { captureRouterTransitionStart, init } from "@sentry/nextjs";

// eslint-disable-next-line import/no-relative-parent-imports
import { defaultConfig } from "../sentry.default.config";

init({
  ...defaultConfig,
});

// https://github.com/getsentry/sentry-javascript/issues/9728
// eslint-disable-next-line import/namespace
export const onRouterTransitionStart = captureRouterTransitionStart;
