import "server-only";

import { endpoint as getStats } from "./get-stats";

export const routes = {
  fortniteGetStats: getStats,
};
