import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.tsx"],
  sourcemap: false,
  minify: true,
  dts: true,
  clean: true,
  format: ["esm", "cjs"],
  splitting: false,
  deps: {
    neverBundle: ["react"],
  },
  target: false,
});
