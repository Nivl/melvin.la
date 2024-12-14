/* eslint-disable no-console */

import type { SetupWorker } from 'msw/browser';
import type { SetupServer } from 'msw/node';

export const enableMSW = async () => {
  if (typeof window === 'undefined') {
    const { server } = (await require('./server')) as { server: SetupServer }; // eslint-disable-line @typescript-eslint/no-require-imports
    server.listen();
  } else {
    const { worker } = (await require('./browser')) as { worker: SetupWorker }; // eslint-disable-line @typescript-eslint/no-require-imports
    void worker.start({
      onUnhandledRequest(req: Request) {
        console.log(
          `Found an unhandled ${req.method} request to ${req.url}`,
          req.body,
        );
      },
    });
  }
};
