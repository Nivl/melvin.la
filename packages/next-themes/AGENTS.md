Read the repository root `AGENTS.md` first, then use this file for workspace-local
guidance inside `packages/next-themes`.

This package owns the split appearance/theme runtime used by the app. Run
package-local scripts from `packages/next-themes` unless the task explicitly
needs repo-wide orchestration from the root.

## Build, test, and lint commands

- Install dependencies from the repository root with `pnpm install`.
- From `packages/next-themes`, use `pnpm run test:unit` for the real test suite.
- From `packages/next-themes`, use `pnpm run validate-code` or
  `pnpm run validate-code:fix` for the package-level lint/format pass.
- The package also exposes `pnpm run lint`, `pnpm run lint:fix`, `pnpm run fmt`,
  and `pnpm run fmt:fix`.
- `pnpm run build`, `pnpm run dev`, and `pnpm run test:e2e` are currently
  placeholder scripts that only run `echo 1`. Do not treat them as meaningful
  validation.
- From the repository root, the equivalent targeted commands are
  `pnpm --filter @melvinla/next-themes test:unit` and
  `pnpm --filter @melvinla/next-themes validate-code`.

## High-level architecture

- `src/index.tsx` is the main runtime entry point and the package export target
  referenced by `package.json`. It owns the React context, `ThemeProvider`,
  `useTheme`, the inline `ThemeScript`, localStorage persistence, DOM updates on
  `document.documentElement`, system appearance tracking, storage-event syncing,
  and the legacy storage migration shim.
- `src/script.ts` is the pre-hydration inline script injected by
  `ThemeScript`. Runtime behavior changes must keep `src/index.tsx` and
  `src/script.ts` aligned so the no-flash path matches the hydrated path.
- `src/types.ts` defines the public API for the split appearance/theme model.
- `__tests__/index.test.tsx` covers provider and hook behavior, attribute and
  class application, persistence, forced values, storage events, system
  appearance handling, and legacy migration.
- `__tests__/script.test.ts` covers the inline script path and parity-sensitive
  edge cases such as unavailable localStorage, mapping omissions, and legacy
  migration.

## Key conventions

- Appearance and theme are separate axes. Appearance is
  `light | dark | system`; theme is an arbitrary named family such as `pink` or
  `blue`. They persist independently under `appearance` and `theme` by default.
- Preserve the legacy migration behavior in both runtime paths: if the
  appearance key is missing and the stored theme value is `light`, `dark`, or
  `system`, treat that legacy theme value as appearance and fall back to the
  configured default theme family.
- Theme mutations target `document.documentElement`, not `body`.
- `appearanceAttribute` and `themeAttribute` each support `"class"`, any
  `data-*` attribute, or an array of attributes.
- `appearanceValue` and `themeValue` remap DOM values only. Stored localStorage
  values stay semantic. If a mapping omits the active key, the package removes
  the attribute or class instead of falling back to the raw value.
- Nested `ThemeProvider` instances are intentionally ignored. The outer provider
  owns the behavior surface and inner providers only render children.
- Forced values are axis-specific. `forcedAppearance` blocks appearance writes
  and appearance storage-event updates; `forcedTheme` does the same for theme.
- When `enableSystem` is false, resolved appearance normalizes `"system"` to
  `"light"` for DOM updates and `color-scheme`.
- The media-query subscription intentionally uses
  `addListener` and `removeListener` for compatibility with older browsers and
  iOS WebKit. Do not change that casually.
- The package oxlint config ignores `src/index.tsx`, `src/script.ts`, and
  `__tests__/**`. When you touch those files, rely on targeted tests and careful
  review rather than assuming `pnpm run lint` covers them.
