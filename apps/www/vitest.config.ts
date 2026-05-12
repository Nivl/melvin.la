/* eslint-disable import/no-default-export */

import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    exclude: [...configDefaults.exclude, "e2e/*"],
    // restoreMocks / unstubEnvs / unstubGlobals replace per-file teardown hooks
    // so test files don't need `afterEach(() => vi.restoreAllMocks())` etc just
    // for cleanup (which would trip the no-hooks rule).
    restoreMocks: true,
    server: {
      deps: {
        // https://next-intl.dev/docs/environments/testing#vitest
        // https://github.com/vercel/next.js/issues/77200
        inline: ["next-intl"],
      },
    },
    setupFiles: ["./vitest.setup.ts"],
    unstubEnvs: true,
    unstubGlobals: true,
  },
});
