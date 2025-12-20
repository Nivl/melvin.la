// export const handlers = [...fortniteHandlers];
import { createOpenApiHttp } from 'openapi-msw';

import type { paths } from '../../../gen/api';
import { makeHandlers as makeFortniteHandlers } from './fortnite.ts';

const http = createOpenApiHttp<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost',
});

export const handlers = [...makeFortniteHandlers(http)];
