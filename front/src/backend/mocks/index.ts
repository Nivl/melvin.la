/* eslint-disable no-console */

export const enableMSW = async () => {
  if (typeof window === 'undefined') {
    const { server } = await require('./server'); // eslint-disable-line @typescript-eslint/no-require-imports
    server.listen();
  } else {
    const { worker } = await require('./browser'); // eslint-disable-line @typescript-eslint/no-require-imports
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
