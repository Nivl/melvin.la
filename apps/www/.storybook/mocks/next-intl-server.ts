// Pass-through for the `#next-intl-server` subpath import in non-Storybook
// builds. The `default` condition in package.json must point at a relative
// file (Turbopack does not follow bare-specifier values), so this file
// re-exports the real `next-intl/server` package. Bundle-active conditions
// (`react-server` for the RSC build, etc.) still apply, so each consumer
// gets the correct variant.

export { setRequestLocale } from "next-intl/server";
