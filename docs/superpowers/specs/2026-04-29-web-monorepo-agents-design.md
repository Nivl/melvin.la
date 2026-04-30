---
post_title: "web monorepo agents guide design"
author1: "Copilot"
post_slug: "2026-04-29-web-monorepo-agents-design"
microsoft_alias: "copilot"
featured_image: ""
categories:
  - engineering
tags:
  - ai-agents
  - monorepo
  - documentation
ai_note: "AI-assisted design document for repository agent guidance."
summary: "Defines the role, scope, structure, and content of the new web-level AGENTS.md file for the Turborepo monorepo."
post_date: "2026-04-29"
---

## Problem

The `web/` directory is now the monorepo root for the web stack. It has a
single app today (`apps/www`) but is expected to gain more apps and packages.
Agents need a root guide that explains how to work safely at the monorepo
level, while still deferring app-specific and package-specific instructions to
local `AGENTS.md` files.

## Goals

- Create a root `web/AGENTS.md` that is useful on day one and scales as more
  workspaces are added.
- Keep the root guide focused on monorepo coordination instead of duplicating
  `apps/www/AGENTS.md`.
- Establish a clear contract that every app and package should ship its own
  local `AGENTS.md`.
- Explain when to work from `web/` versus a child workspace.
- Document the shared tooling expectations around Turborepo, pnpm workspaces,
  and the root catalog.

## Non-Goals

- Rewriting or summarizing the full `apps/www/AGENTS.md` contents.
- Defining implementation details for future apps or packages that do not exist
  yet.
- Changing existing app-level validation commands or coding conventions.

## Recommended Approach

Write `web/AGENTS.md` as an operational root guide. The file should orient an
agent to the workspace layout, the shared build and dependency tooling, and the
rules for delegation to child guides. It should act as the first document an
agent reads when entering `web/`, then direct the agent to the nearest
workspace-level `AGENTS.md` before making localized changes.

This approach is preferred over a thin router because it gives enough context
to avoid mistakes at the monorepo root. It is preferred over a large policy
manual because it avoids duplicating guidance that belongs closer to each app or
package.

## Proposed `web/AGENTS.md` Structure

### Monorepo Role

Explain that `web/` is the root of the web monorepo, not an app. Clarify that
root-level tasks usually involve shared tooling, shared configuration, workspace
wiring, or work spanning multiple apps or packages.

### Workspace Layout

Describe the current layout:

- `apps/*` contains deployable applications.
- `packages/*` contains shared libraries, utilities, or config packages.
- `apps/www` is the current primary app and already owns detailed local
  instructions.

State that future apps and packages are expected to follow the same pattern and
carry their own `AGENTS.md`.

### Instruction Resolution

Define how agents should read instructions:

1. Start with the repository root `AGENTS.md`.
2. Read `web/AGENTS.md` when working anywhere under `web/`.
3. Before editing inside an app or package, read that workspace's local
   `AGENTS.md`.
4. When local instructions conflict with root-level web instructions, the
   workspace-local guide wins for that workspace.

### Working Directory Rules

Document when commands should run from `web/` and when they should run from a
child workspace:

- Use `web/` for Turborepo, pnpm workspace, and cross-workspace operations.
- Use the app or package directory for workspace-local scripts unless the root
  guide explicitly says otherwise.
- Avoid assuming that a command for `apps/www` will be correct for future apps.

### Shared Tooling

Explain the shared tools and why they matter:

- `pnpm` is the package manager for the monorepo.
- `pnpm-workspace.yaml` defines workspaces and shared catalog versions.
- `turbo` coordinates tasks across apps and packages.
- The root `package.json` is intentionally small and exists mainly for monorepo
  tooling, not app logic.

### Dependency Management Rules

Capture the key monorepo package-management rules:

- Prefer `catalog:` versions for shared dependencies.
- Keep the root catalog alphabetized.
- Make workspace-wide dependency and version coordination changes from `web/`.
- Avoid adding app-specific dependency policy to the root guide when it belongs
  in a child workspace.

### Validation Expectations

Explain that validation is two-layered:

- Root-level changes should be validated with the relevant workspace-aware
  commands.
- App-level or package-level changes must also satisfy the local validation
  checklist defined by that workspace's `AGENTS.md`.

Because the exact task graph can evolve, the root guide should describe the
principle and point agents to the local guide instead of freezing a brittle list
of future root commands.

### Authoring Contract for Future Workspaces

State that every new directory added under `apps/` or `packages/` should add a
local `AGENTS.md` early, and that the local file should cover:

- Purpose of the workspace
- Working directory expectations
- Validation commands
- Architecture and code organization
- Workspace-specific conventions

## Expected Tone and Style

The root guide should be concise, operational, and durable. It should avoid
long app-specific explanations, but it should still be specific enough that an
agent can immediately understand how to navigate the monorepo safely.

## Success Criteria

The resulting `web/AGENTS.md` should let a new agent answer all of the
following without guessing:

- What is `web/` responsible for?
- Where do apps and packages live?
- Which instructions should be read before editing inside a workspace?
- When should commands run from root versus the local workspace?
- How should shared dependencies and catalogs be managed?
- What must future apps and packages provide for agents?
