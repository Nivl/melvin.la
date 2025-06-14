import { rm } from 'node:fs/promises';

import { database } from '../src/ssg/database';
import { BUILD_DIR } from '../src/ssg/paths';
import { setup } from './utils';

const main = async () => {
  await setup();
  const db = database();

  db.close();
  await rm(BUILD_DIR, { recursive: true, force: true });
};

main().catch((error: unknown) => {
  process.stderr.write(`Error during postbuild: ${error}\n`);
  process.exit(1);
});
