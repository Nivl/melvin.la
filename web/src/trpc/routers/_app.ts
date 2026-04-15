import { routes as fortniteRoutes } from "#features/fortnite/backend";

import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  ...fortniteRoutes,
});

export type AppRouter = typeof appRouter;
