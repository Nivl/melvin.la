import { setupServer } from "msw/node";

import { handler as getStats } from "#features/fortnite/backend/getStats.mock";

export const server = setupServer(getStats);
