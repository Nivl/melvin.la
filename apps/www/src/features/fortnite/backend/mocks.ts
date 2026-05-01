import "server-only";

import { handler as getStats } from "#features/fortnite/backend/get-stats.mock";

export const handlers = [getStats];
