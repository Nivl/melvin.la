# Melvin.la Frontend

This is the frontend webapp for [melvin.la](https://melvin.la) - a personal website featuring various tools and games.

## Tech Stack

- **Framework**: Latest Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: HeroUI (NextUI v2)
- **State Management**: TanStack Query (React Query)
- **Testing**: Vitest + Testing Library
- **Storybook**: Component development and documentation

## Project Structure

```
src/
├── app/                     # Next.js App Router pages
├── components/              # Reusable UI components
├── models/                  # TypeScript types and data models
├── utils/                   # Utility functions
├── hooks/                   # Custom React hooks
├── gen/                     # Generated API types (DO NOT EDIT)
└── bundled_static/          # Static assets and content
```

## Environment Setup

### Environment Files Structure

```
web/
├── .env.development   # Development defaults (committed)
└── .env.local         # Local overrides (gitignored)
```

### Environment Loading Priority

1. **`.env.local`** - Personal/sensitive overrides (highest priority, gitignored)
2. **`.env.development`** - Development defaults (committed to repo)
3. **System environment variables** - OS-level variables

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | **Yes** | - | Backend API base URL |
| `NEXT_PUBLIC_BASE_URL` | No | `https://melvin.la` | Frontend base URL for metadata |
| `NEXT_PUBLIC_GCP_MAP_API_KEY` | **Yes** | - | Google Maps API key for contact page |

### Quick Setup

Create a `.env.local` file in this directory with your configuration:

```bash
# .env.local
NEXT_PUBLIC_GCP_MAP_API_KEY=your_google_maps_api_key_here
```

### Development Defaults

The committed `.env.development` file contains safe defaults:

```bash
NEXT_PUBLIC_API_URL=http://localhost
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### API Key Requirements

To run all features locally, you'll need:

1. **Google Maps API Key**: 
   - Get from [Google Cloud Console](https://console.cloud.google.com)
   - Enable the Maps JavaScript API
   - Required for the contact page map

### Security Notes

- Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Never commit sensitive data to `.env.development`
- Use `.env.local` for all sensitive configuration
- The `.env.local` file is gitignored and won't be committed


## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended)

### Installation & Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Open http://localhost:3000 in your browser
```

### Available Scripts

```bash
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run start        # Start production server
pnpm run lint         # Run ESLint
pnpm run test:unit    # Run unit tests with Vitest
pnpm run storybook    # Start Storybook dev server
```

## Features

- **Tools**: Fortnite stats, UUID generator, timestamp converter, timezone converter
- **Games**: Conway's Game of Life
- **Blog**: Statically generated MDX-powered blog with SQLite for content management
- **Responsive Design**: Mobile-first approach with dark/light theme support

## How the Blog Works

The blog system uses **Static Site Generation (SSG)** with a unique build-time approach:

1. **Content Storage**: Blog posts are written as MDX files in [`src/bundled_static/content/blog/`](src/bundled_static/content/blog/)
2. **Build Process**: During build time ([`scripts/prebuild.ts`](scripts/prebuild.ts)):
   - Reads all `.mdx` files from the content directory
   - Parses frontmatter (title, excerpt, dates, etc.)
   - Stores content and metadata in a SQLite database
3. **Runtime Queries**: Pages use [`src/ssg/queries.ts`](src/ssg/queries.ts) to fetch blog data from the SQLite database
4. **Static Generation**: All blog pages are pre-rendered at build time using Next.js SSG

This approach provides the following benefits:
- SSG: the blog is fully static and loads very fast
- We can easily add features like categories, tags, paginations, etc. and everything is still instantly fast and static
- We can easily change the storage method. Right now the article are stored in this git repo as MDX files, but we could switch to a diferent git repo, to an external database, or even a headless CMS in the future without changing the blog code itself

## Backend Dependencies

Some features require the backend API to be running:

- **Fortnite Stats Tool**: Fetches player statistics from external APIs

To run the full application with all features:

1. Start the backend API (see [`../../api/README.md`](../../api/README.md) for setup instructions)
2. Ensure the frontend is configured with the correct API URL via `NEXT_PUBLIC_API_URL`

## Development Notes

- API types are auto-generated from OpenAPI specs in [`../../api/`](../../api/)
- Follow the component patterns established in existing code
- Use Storybook for component development and testing
- All new components should have corresponding stories and tests

## Deployment

The app is deployed to Vercel. The `main` branch auto-deploys to production at [melvin.la](https://melvin.la).

For detailed development guidelines, see [`./AGENTS.md`](./AGENTS.md).
