import { trpcMiddleware as SentryTrpcMiddleware } from "@sentry/nextjs";
import { initTRPC } from "@trpc/server";

export const createTRPCContext = (_opts: { headers: Headers }) => {
  return {};
};

const t = initTRPC.context<ReturnType<typeof createTRPCContext>>().create({});

const sentryMiddleware = t.middleware(
  SentryTrpcMiddleware({
    attachRpcInput: true,
  }),
);

// Base router and procedure helpers
export const createTRPCRouter = t.router;
// export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure.use(sentryMiddleware);
