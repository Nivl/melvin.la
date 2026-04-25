import { trpcMiddleware as SentryTrpcMiddleware } from "@sentry/nextjs";
import { initTRPC } from "@trpc/server";

export const createTRPCContext = (_opts: { headers: Headers }) => ({});

const t = initTRPC.context<ReturnType<typeof createTRPCContext>>().create({});
export const sentryMiddlewareOptions = {
  attachRpcInput: false,
} as const;

const sentryMiddleware = t.middleware(SentryTrpcMiddleware(sentryMiddlewareOptions));

// Base router and procedure helpers
export const createTRPCRouter = t.router;
// export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure.use(sentryMiddleware);
