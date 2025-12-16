# AI AGENT INSTRUCTIONS

**PRIORITY**: If `./AGENTS.local.md` exists, its instructions takes over the one in this file.

**PROJECT**: Next.js frontend app deployed to Vercel at https://melvin.la
**WORKING DIRECTORY**: This current directory

## FILE STRUCTURE

```
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
├── bundled_static/       # Static content processed at build time
│   └── content/blog/     # MDX blog posts
└── utils/                # Utility functions
```

## ARCHITECTURE

**Framework**: Latest version of Next.js with App Router
**Language**: TypeScript
**Styling**: Tailwind CSS + HeroUI components
**Package Manager**: pnpm
**Routing**: App Router (`src/app/` directory structure)
**Testing**: Vitest + React Testing Library + helpers in `src/utils/test.ts`

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

**Content Location**: `src/bundled_static/content/blog/*.mdx`
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
**OpenAPI Spec**: `../../../api/internal/gen/openapi.yml`

## ENVIRONMENT VARIABLES

**Development** (`.env.development` - committed):
```
NEXT_PUBLIC_API_URL=http://localhost
NEXT_PUBLIC_BASE_URL=http://localhost:3000  
NEXT_PUBLIC_GCP_MAP_API_KEY=
```

**Local** (`.env.local` - gitignored): Add sensitive/personal config here

## COMMANDS

```bash
pnpm run dev          # Start dev server
pnpm run build        # Production build
pnpm run check-types  # TypeScript type check
pnpm run lint         # ESLint check
pnpm run test:unit    # Run all tests
pnpm run knip         # Check unused dependencies
pnpm oapi-gen         # Generate API client
```

## QUALITY REQUIREMENTS

**Eslint**: must not disable any rules unless absolutely necessary.

**Any new code is only deemed valid after running the following**:
1. `pnpm run lint --fix` (must pass)
2. `pnpm run check-types` (must pass)
3. `pnpm run test:unit` (must pass)
4. `pnpm run knip` (must pass)

**New Component Checklist**:
- [ ] Component implementation
- [ ] Unit tests (.test.tsx)
- [ ] Storybook stories (.stories.tsx)
- [ ] Proper imports using `#` prefix

## COMMIT STANDARDS

**Format**: Conventional Commits (https://conventionalcommits.org/)
**Scopes**: Feature name, then optionally project name
**Examples**:
```
feat(blog): add MDX support for code blocks
fix(fortnite,front): resolve API connection issues
```

**Validation**: See `../../../.github/semantic.yml` for allowed types
