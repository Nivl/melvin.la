/* eslint-disable no-console, @typescript-eslint/no-var-requires */

export const enableMSW = async () => {
  if (typeof window === 'undefined') {
    const { server } = await require('./server');
    server.listen();
  } else {
    const { worker } = await require('./browser');
    worker.start({
      onUnhandledRequest(req: Request) {
        console.log(
          `Found an unhandled ${req.method} request to ${req.url}`,
          req.body,
        );
      },
    });
  }
};
