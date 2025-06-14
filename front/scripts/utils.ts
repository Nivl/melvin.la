import { mkdir } from 'node:fs/promises';

import { BUILD_DIR } from '../src/ssg/paths';

export const setup = async () => {
  await mkdir(BUILD_DIR, { recursive: true });
};
