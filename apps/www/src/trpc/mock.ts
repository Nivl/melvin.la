import { setupServer } from "msw/node";

import { handlers as fortniteHandlers } from "#features/fortnite/backend/mocks";

export const server = setupServer(...fortniteHandlers);
