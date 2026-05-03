# AGENTS.md

## Build, test, and lint commands

- Use `pnpm` at the repository root. The workspace expects Node `>=20` and pnpm `>=9`.
- Install dependencies: `pnpm install`
- Build everything in the workspace: `pnpm build`
- Build only the published package: `pnpm --filter next-themes build`
- Run the library unit tests: `pnpm test`
- Run a single Vitest file: `pnpm --filter next-themes exec vitest run __tests__/index.test.tsx`
- Run a single Vitest test by name: `pnpm --filter next-themes exec vitest run __tests__/index.test.tsx -t "should return system-theme when no default-theme is set"`
- Run the Playwright suite: `pnpm test:e2e`
- Run a single Playwright file: `pnpm exec playwright test test/system-theme.test.ts`
- `pnpm lint` is a formatting pass, not a read-only lint check. It runs `prettier . --write` across the repo.

## High-level architecture

- This is a small `pnpm` workspace orchestrated by `turbo`. The root scripts fan out to the published package in `next-themes/` and the runnable example apps in `examples/*`.
- `next-themes/src/index.tsx` is the main runtime entry point. It owns the React context, `ThemeProvider`, `useTheme`, `ThemeScript`, DOM updates on `document.documentElement`, localStorage persistence, system theme listeners, and cross-tab storage synchronization.
- `next-themes/src/script.ts` is the pre-hydration inline script injected by `ThemeScript`. If you change theme application behavior, check both `index.tsx` and `script.ts` so the early no-flash path stays aligned with the runtime path.
- `next-themes/src/types.ts` defines the public API types, and `next-themes/tsup.config.ts` bundles only `src/index.tsx` into `dist/` as ESM, CJS, and `.d.ts` output.
- `examples/example` is the main pages-router integration surface and the app exercised by Playwright. Its `/`, `/dark`, and `/light` routes cover normal switching plus forced-theme behavior.
- The other examples document distinct integration modes: `examples/with-app-dir` shows the app router setup, `examples/tailwind` shows `attribute="class"` usage, and `examples/multi-theme` shows multi-theme configuration.
- `test/` contains Playwright coverage for system theme resolution, switching, forced themes, and storage-event syncing. `test/util.ts` centralizes browser-context setup, especially seeded localStorage and preferred color scheme.

## Key conventions

- Treat `ThemeProvider`, `ThemeScript`, and `useTheme` as one behavior surface. A change in provider logic often also needs updates in the serialized script path and example/e2e coverage.
- The persisted localStorage value is the semantic theme name (`theme` by default), even when the `value` prop remaps DOM attribute values. Do not assume the DOM value and stored value are identical.
- Theme mutations target `document.documentElement`, not `body`. `attribute` can be `'class'`, any `data-*` attribute, or an array of attributes.
- Hydration safety matters throughout this repo. UI that reads `theme` directly should be gated until mount, and app-router examples rely on `suppressHydrationWarning` on `<html>` because `next-themes` mutates that element.
- Nested `ThemeProvider`s are intentionally ignored; the outer provider wins and inner providers just render children.
- Cross-tab syncing is part of the contract. Storage-event handling updates state without writing back to localStorage again to avoid loops, and forced-theme pages should ignore user switching until the page is no longer forced.
- The media-query listener intentionally uses `addListener`/`removeListener` for older browser and iOS compatibility. Do not “modernize” that behavior without checking compatibility expectations and tests.
