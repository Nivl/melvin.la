// This scripts runs at build time in a Node environment.
// eslint-disable import/no-nodejs-modules

import { rm } from "node:fs/promises";

import { database } from "#features/blog/ssg/database.ts";
import { BUILD_DIR } from "#features/blog/ssg/paths.ts";

import { setup } from "./utils";

const main = async () => {
  await setup();
  const db = database();

  db.close();
  await rm(BUILD_DIR, { force: true, recursive: true });
};

await main();
