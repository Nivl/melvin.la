# @melvinla/eslint-config

Shared ESLint configuration for all projects in the melvin.la monorepo.

## Usage

Import and use the configuration in your `eslint.config.mjs` file:

```javascript
/* eslint-disable import/no-default-export */

import { createESLintConfig } from '@melvinla/eslint-config';

export default createESLintConfig({
  projectRoot: import.meta.dirname,
});
```

## Configuration

The configuration includes:

- TypeScript strict type checking
- Next.js specific rules
- Prettier integration
- Import sorting and organization
- Unicorn plugin for additional code quality
- Storybook support

## Options

- `projectRoot` (optional): The root directory of your project. Defaults to `import.meta.dirname`.

## Dependencies

All ESLint dependencies are managed by this package, so consuming projects only need to install:
- `eslint` (peer dependency)
- `@melvinla/eslint-config`
