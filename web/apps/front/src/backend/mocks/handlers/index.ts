// export const handlers = [...fortniteHandlers];
import { createOpenApiHttp } from 'openapi-msw';

import type { paths } from '../../../gen/api';
import { makeHandlers as makeFortniteHandlers } from './fortnite.ts';

const http = createOpenApiHttp<paths>();

export const handlers = [...makeFortniteHandlers(http)];
