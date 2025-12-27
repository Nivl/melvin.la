// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

import { defaultConfig } from '../sentry.default.config';

Sentry.init({
  ...defaultConfig,
});

// https://github.com/getsentry/sentry-javascript/issues/9728
// eslint-disable-next-line import/namespace
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
