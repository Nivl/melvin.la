import { mkdir } from "node:fs/promises";

import { BUILD_DIR } from "#features/blog/ssg/paths.ts";

export const setup = async () => {
  await mkdir(BUILD_DIR, { recursive: true });
};
