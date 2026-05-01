# AGENTS.md

This directory is the root of the repository and the root of the web monorepo.

- Read this file first for any task in this repository.
- Before editing inside a specific app or package, read that workspace's local
  `AGENTS.md`.

## Scope

Use this file for monorepo-wide guidance only.

- The repository root is the coordination layer for the workspaces.
- Root-level work usually involves shared tooling, workspace configuration,
  dependency management, or tasks that touch multiple workspaces.
- Do not copy app-specific implementation rules into this file when they belong
  in a workspace-local guide.

## Workspace layout

The workspace layout is defined in `pnpm-workspace.yaml`.

- `apps/*` contains deployable applications.
- `packages/*` contains shared libraries, utilities, and reusable config.
- `apps/www` is the current app and owns detailed local instructions in
  `apps/www/AGENTS.md`.

Future apps and packages should follow the same pattern and carry their own
local `AGENTS.md`.

## Instruction order

Use this order when gathering instructions:

1. Repository root `AGENTS.md`
2. The nearest workspace-local `AGENTS.md`

If a local app or package guide conflicts with this file, the local guide wins
for work inside that workspace.

## Working directory rules

- Run monorepo-wide commands from the repository root.
- Run workspace-local scripts from the app or package directory unless that
  workspace's guide says otherwise.
- Avoid assuming `apps/www` command patterns will automatically apply to future
  workspaces.

Use the repository root as the working directory for:

- Turborepo task orchestration
- pnpm workspace operations
- shared dependency changes
- workspace wiring changes

Use the owning workspace directory when running implementation-specific scripts.

## Shared tooling

Shared tooling currently lives at the repository root:

- `package.json` keeps the root package intentionally small.
- `pnpm-workspace.yaml` defines the workspaces and root dependency catalog.
- `turbo.json` defines cross-workspace task names such as `lint`, `build`,
  `validate-code`, `test:unit`, and `test:e2e`.

## Dependency management

The monorepo uses pnpm catalogs for shared versions.

- Prefer `catalog:` for shared dependency versions.
- Keep the root catalog alphabetized.
- Make workspace-wide dependency coordination changes from the repository root.
- Keep app-specific dependency details in the owning workspace instead of this
  file.

## Validation expectations

Validation is layered:

- Root-level changes should use the relevant workspace-aware commands from the
  repository root.
- App-level and package-level changes must also satisfy the local validation
  checklist defined by that workspace's `AGENTS.md`.

If a task touches both root configuration and a workspace, validate both levels.

## Notes on the flattened layout

Older docs or commit history may still refer to a `web/` directory. That
directory no longer wraps the monorepo.

- Treat old `web/...` paths as repository-root-relative paths unless a file was
  intentionally moved somewhere else.
- When updating shared instructions or tooling docs, prefer the current
  root-based layout and remove stale `web/` prefixes.

## Contract for new workspaces

Every new directory added under `apps/` or `packages/` should add a local
`AGENTS.md` early. That local file should explain:

- the workspace purpose
- the correct working directory
- validation commands
- architecture and code organization
- workspace-specific conventions

The root guide should stay concise and durable. Push detailed implementation
rules down into the local workspace guides.
