import { rm } from 'node:fs/promises';

import { database } from '#ssg/database';
import { BUILD_DIR } from '#ssg/paths';

import { setup } from './utils';

const main = async () => {
  await setup();
  const db = database();

  db.close();
  await rm(BUILD_DIR, { recursive: true, force: true });
};

await main();
