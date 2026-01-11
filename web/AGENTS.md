# AI AGENT INSTRUCTIONS

**PRIORITY**: If `./AGENTS.local.md` exists, its instructions takes over the one in this file.

**PROJECT**: Next.js frontend app deployed to Vercel at https://melvin.la
**WORKING DIRECTORY**: This current directory

## FILE STRUCTURE

```
.storybook/               # Storybook configuration
e2e/                      # Playwright end-to-end tests
├── helpers.ts            # Playwright helpers, most imports should be made from here
├── blog.spec.ts          # Blog e2e tests
└── home.spec.ts          # Home page e2e tests
messages/                 # i18n files
src/
├── app/                  # Next.js App Router pages
│   └── globals.css       # Global styles + Tailwind config
├── components/           # Reusable React components
│   ├── blog/             # Blog-specific components
│   ├── fortnite/         # Fortnite-specific components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── gen/                  # Generated API client (run: pnpm oapi-gen)
├── backend/              # API integration utilities
│   └── mocks/            # Mock data and utilities for backend
├── bundled_static/       # Static content processed at build time
│   └── content/blog/     # MDX blog posts`
└── utils/                # Utility functions
```

## ARCHITECTURE

**Framework**: Latest version of Next.js with App Router
**Language**: TypeScript
**Styling**: Tailwind CSS + HeroUI components
**Package Manager**: pnpm
**Routing**: App Router (`src/app/` directory structure)
**Testing**:
- unit-test: Vitest + React Testing Library + helpers in `src/utils/test.ts`
- end-to-end: Playwright
- Visual regression: Storybook + Chromatic
- Mock API: MSW (in `src/backend/mocks/`)
**Internationalization**: `next-intl`
**Logger**: `@sentry/nextjs`

### Key Dependencies
- `next-mdx-remote`: MDX content rendering
- `@tanstack/react-query`: Server state management
- `openapi-react-query`: Generated API client hooks
- `@heroui/react`: UI component library
- `motion`: Animations
- `next-themes`: Theme switching

### Code Organization

The app directory should only contains routing and layout files. All reusable components should go into `src/components/` and all hooks into `src/hooks/`.

## IMPORT CONVENTIONS

**REQUIRED**: Use `#` prefix for all src imports (mapped to `./src/`)
```typescript
// ✅ Correct
import { BlogPost } from '#components/blog/BlogPost'
import { useStats } from '#hooks/fortnite/useStats'

// ❌ Wrong
import { BlogPost } from '../components/blog/BlogPost'
import { BlogPost } from './src/components/blog/BlogPost'
```

**Exception**: Relative imports only for files in same directory
```typescript
// ✅ Acceptable if in same folder
import { helper } from './helper'
```

## COMPONENT PATTERNS

### File Naming
- Components: PascalCase directories and files
- Tests: `ComponentName.test.tsx` (same directory)
- Stories: `ComponentName.stories.tsx` (same directory)

### Organization
- General components: `src/components/`
- Feature-specific: `src/components/[feature]/`
- Hooks: `src/hooks/` or `src/hooks/[feature]/`

### Required Files for New Components
1. Component file: `ComponentName.tsx`
2. Test file: `ComponentName.test.tsx`
3. Story file: `ComponentName.stories.tsx`

## BLOG SYSTEM

**Content Location**: `src/bundled_static/content/blog/<article_key>/<language_code>.mdx`
**Build Process**: 
1. `scripts/prebuild.ts` - Processes MDX files into SQLite database
2. `scripts/postbuild.ts` - Post-build cleanup

**MDX Frontmatter Format**:
```yaml
---
title: "Article Title"
slug: "url-slug"
excerpt: "Short description"
image: "cover.avif"
ogImage: "cover.jpg"
createdAt: "2025-07-03"
updatedAt: "2025-07-03"  # optional
---
```

**Dev Note**: Restart dev server after blog content changes.

## API INTEGRATION

**API Server**: Must be running for Fortnite features (see `../../../api/AGENTS.md`)
**Client Generation**: `pnpm oapi-gen` → generates `src/gen/api.d.ts`
**OpenAPI Spec**: `../api/internal/gen/openapi.yml`

## Testing

- API endpoints are mocked using MSW in `src/backend/mocks/`.
- API Fixtures are located in `src/backend/fixtures/`.
- Any API changes require updating the mocks accordingly.
- New API endpoints must have corresponding mocks for testing.
- Mocks should allow easy triggering of error states for testing purposes.
- Playwright tests should import helpers from `e2e/helpers.ts`.


## INTERNATIONALIZATION (i18n)

**Configuration**: `src/i18n/`
**Messages**: `messages/`

### Adding a New Locale
1.  Update `src/i18n/locales.ts`:
    *   Add the new locale code to the `locales` array.
2.  Create a new message file:
    *   Create `messages/[locale].json` (e.g., `messages/es.json`).
    *   Fill out the file based off `messages/en.d.json.ts`.
3.  Write all the blog articles for that locale (`src/bundled_static/content/blog/*/[locale].mdx`)

### Adding New Strings
1.  Add the key-value pair to `messages/en.json` (source of truth).
2.  Add the corresponding translation to all other `messages/[locale].json` files.
3.  Use nested keys for organization (e.g., `"HomePage": { "title": "..." }`).

### Usage in Components
```typescript
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('HomePage');
  return <h1>{t('title')}</h1>;
}
```

## ENVIRONMENT VARIABLES

**Development** (`.env.development` - committed):
```
NEXT_PUBLIC_API_URL=http://localhost
NEXT_PUBLIC_BASE_URL=http://localhost:3000  
NEXT_PUBLIC_GCP_MAP_API_KEY=
```

**Local** (`.env.local` - gitignored): Add sensitive/personal config here

## Logging, Tracing, and Error tracking

These examples should be used as guidance when configuring Sentry functionality within a project.

### Exception Catching

Use `Sentry.captureException(error)` to capture an exception and log the error in Sentry.
Use this in try catch blocks or areas where exceptions are expected

### Tracing Examples

Spans should be created for meaningful actions within an applications like button clicks, API calls, and function calls
Use the `Sentry.startSpan` function to create a span
Child spans can exist within a parent span

#### Custom Span instrumentation in component actions

The `name` and `op` properties should be meaninful for the activities in the call.
Attach attributes based on relevant information and metrics from the request

```javascript
function TestComponent() {
  const handleTestButtonClick = () => {
    // Create a transaction/span to measure performance
    Sentry.startSpan(
      {
        op: "ui.click",
        name: "Test Button Click",
      },
      (span) => {
        const value = "some config";
        const metric = "some metric";

        // Metrics can be added to the span
        span.setAttribute("config", value);
        span.setAttribute("metric", metric);

        doSomething();
      },
    );
  };

  return (
    <button type="button" onClick={handleTestButtonClick}>
      Test Sentry
    </button>
  );
}
```

### Logs

Where logs are used, ensure Sentry is imported using `import * as Sentry from "@sentry/nextjs"`
Enable logging in Sentry using `Sentry.init({  enableLogs: true })`
Reference the logger using `const { logger } = Sentry`
Sentry offers a consoleLoggingIntegration that can be used to log specific console error types automatically without instrumenting the individual logger calls

#### Configuration

In NextJS the client side Sentry initialization is in `instrumentation-client.(js|ts)`, the server initialization is in `sentry.server.config.ts` and the edge initialization is in `sentry.edge.config.ts`
Initialization does not need to be repeated in other files, it only needs to happen the files mentioned above. You should use `import * as Sentry from "@sentry/nextjs"` to reference Sentry functionality

##### Baseline

```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  enableLogs: true,
});
```

##### Logger Integration

```javascript
Sentry.init({
  integrations: [
    // send console.log, console.warn, and console.error calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
});
```

#### Logger Examples

`logger.fmt` is a template literal function that should be used to bring variables into the structured logs.

```javascript
logger.trace("Starting database connection", { database: "users" });
logger.debug(logger.fmt`Cache miss for user: ${userId}`);
logger.info("Updated profile", { profileId: 345 });
logger.warn("Rate limit reached for endpoint", {
  endpoint: "/api/results/",
  isEnterprise: false,
});
logger.error("Failed to process payment", {
  orderId: "order_123",
  amount: 99.99,
});
logger.fatal("Database connection pool exhausted", {
  database: "users",
  activeConnections: 100,
});
```


## COMMANDS

```bash
pnpm run dev          # Start dev server
pnpm run build        # Production build
pnpm run typecheck    # TypeScript type check
pnpm run lint         # ESLint check
pnpm run test:unit    # Run all unit tests
pnpm run test:e2e     # Run all end-to-end tests
pnpm run knip         # Check unused dependencies
pnpm oapi-gen         # Generate API client
pnpm i18n:check       # Check i18n consistency
pnpm validate-code    # Validate code quality
```

## QUALITY REQUIREMENTS

**Eslint**: must not disable any rules unless absolutely necessary.

**critical**: Always make sure this file is up to date with the latest standards and code architecture when changing any piece of code.

**Any new code is only deemed valid after running the following**:
1. `pnpm run lint --fix` (must pass)
2. `pnpm run validate-code` (must pass)
3. `pnpm run test:unit` (must pass)
4. `pnpm run test:e2e` (must pass)

**New Component Checklist**:
- [ ] Component implementation
- [ ] Unit tests (.test.tsx)
- [ ] Updated end-to-end tests if applicable
- [ ] Storybook stories (.stories.tsx)
- [ ] Proper imports using `#` prefix
- [ ] Documentation (this file) updated if applicable

## COMMIT STANDARDS

**Format**: Conventional Commits (https://conventionalcommits.org/)
**Scopes**: Feature name, then optionally project name
**Examples**:
```
feat(blog): add MDX support for code blocks
fix(fortnite,web): resolve API connection issues
```

**Validation**: See `../../../.github/semantic.yml` for allowed types
