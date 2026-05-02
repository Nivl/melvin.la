/* eslint-disable import/no-default-export */

import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  deps: {
    neverBundle: ["react"],
  },
  dts: true,
  entry: ["src/index.tsx"],
  format: ["esm", "cjs"],
  minify: true,
  sourcemap: false,
  target: false,
});
