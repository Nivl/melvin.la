import 'vitest-canvas-mock';

import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { server } from './src/backend/mocks/node.js';

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});
