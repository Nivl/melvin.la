export type {
  ErrorResponse,
  FortniteStats,
  FortniteStatsCategories,
  FortniteStatsDetails,
  operations,
} from '../gen/api';
import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';

import type { FortniteStats, paths } from '../gen/api';
import { operations } from '../gen/api';

export type FortnitePlatform =
  operations['fortniteGetStats']['parameters']['path']['platform'];

export type FortniteTimeWindow =
  operations['fortniteGetStats']['parameters']['path']['timeWindow'];

export type FortniteData = FortniteStats['data'];

const fetchClient = createFetchClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
});
export const $api = createClient(fetchClient);
