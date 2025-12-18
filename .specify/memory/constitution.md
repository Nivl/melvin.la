<!--
Sync Impact Report

Version change: none → 0.1.0

Modified placeholders: [PROJECT_NAME],[PRINCIPLE_1_NAME..5],[SECTION_2_NAME],[SECTION_3_NAME],[GOVERNANCE_RULES],[CONSTITUTION_VERSION],[RATIFICATION_DATE],[LAST_AMENDED_DATE]

Modified principles: placeholders → concrete principles (see sections below)

Added sections: Security & Privacy Requirements; Development Workflow

Removed sections: none

Templates updated: /Users/melvin/dev/melvin.la/.specify/templates/tasks-template.md ✅ updated
Templates reviewed (no change required): /Users/melvin/dev/melvin.la/.specify/templates/plan-template.md, /Users/melvin/dev/melvin.la/.specify/templates/spec-template.md, /Users/melvin/dev/melvin.la/.specify/templates/checklist-template.md

Follow-up TODOs: none
-->

# melvin.la Constitution

## Core Principles

### I. Site Purpose & Minimal Surface
The project exists to deliver a small, personal website and related API surface. Code MUST prioritize clarity, accessibility, and privacy. Features added to the repo MUST have a clear, documentable user value and remain as small as possible to achieve that value.

### II. API-First and Explicit Contracts
APIs and public contracts MUST be explicit, versioned, and documented (OpenAPI where applicable). Server and client integration points MUST include contract tests and be discoverable from the repository's `openapi/` and `api/` folders.

### III. Test-First (NON-NEGOTIABLE)
All changes to code MUST include automated tests: unit tests and/or end-to-end (e2e) tests. Tests MUST be added before or alongside implementation work and MUST fail initially (red) when a change defines new behavior. CI gates MUST enforce passing tests before merge. Test types and scope:
- Unit tests: for pure functions, utilities, and small components.
- Integration tests: for service boundaries and OpenAPI contract verification.
- E2E tests: for critical user journeys in the frontend and API-backed flows.

### IV. Integration & Contract Testing
Integration testing is required when code affects inter-service contracts, shared schemas, or public API surfaces. Any breaking change to a contract MUST be accompanied by a migration plan, version bump, and coordinated rollout steps.

### V. Observability, Versioning & Simplicity
Structured logging and clear error handling are REQUIRED for backend services. Versioning MUST follow `MAJOR.MINOR.PATCH` semver: breaking API changes increment MAJOR; new backwards-compatible functionality increments MINOR; documentation/typo/fixes increment PATCH. Favor simple designs: prefer clarity and maintainability over speculative generalization.

## Security & Privacy Requirements
Secrets MUST never be committed to the repo. Use environment configuration and secret managers; local development may use `.env` ignored files. The site MUST use TLS for all public endpoints. Personal data collection is disallowed unless explicitly justified and documented; if collected, document retention and deletion policies.

## Development Workflow
Pull requests MUST include:
- A description of the change and the motivating issue or user story.
- Tests that demonstrate the change (unit or e2e).
- Evidence of local verification (how to run tests or a short reproduction).
Pre-merge checks (CI) MUST run linters, tests, and OpenAPI contract validation. Significant changes to public API surfaces require a changelog entry and a minor/major version bump per semver guidance.

## Governance
Amendments to this constitution MUST be proposed via a pull request that documents the change, the rationale, and any migration steps. An amendment takes effect when at least one maintainer approves the PR and CI passes. Major governance changes (redefinitions of core principles) SHOULD include a 7-day comment period for stakeholders.

All PRs affecting core behavior MUST reference this constitution and demonstrate compliance in the PR description. Use the repository's `/specify/templates/` artifacts to validate plan and spec alignment.

**Version**: 0.1.0 | **Ratified**: 2025-12-17 | **Last Amended**: 2025-12-17
