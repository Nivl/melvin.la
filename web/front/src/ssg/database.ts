import { DatabaseSync } from 'node:sqlite';

import { DB_PATH } from './paths';

let db: DatabaseSync | undefined;

export const database = () => {
  db ??= new DatabaseSync(DB_PATH);
  return db;
};
