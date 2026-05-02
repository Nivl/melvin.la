// This runs at build time in a Node environment
// eslint-disable import/no-nodejs-modules
import { DatabaseSync } from "node:sqlite";

import { DB_PATH } from "./paths";

let db: DatabaseSync | undefined = undefined;

export const database = () => {
  db ??= new DatabaseSync(DB_PATH);
  return db;
};
