# Repository Guidelines

## Project Structure & Module Organization

This repository is spec-driven. The canonical source of truth lives in the ignored local `specs/` directory, especially `specs/00-overview.md` and the command specs such as `specs/05-check.md`. The current implementation follows this workspace layout:

- `packages/cli` for the `velty` binary
- `packages/core` for orchestration, workspace detection, and planning
- `packages/generators` for official file generators
- `packages/addon-*` for future lazy add-ons loaded on demand
- `packages/testing` for fixtures and helpers

Keep design and behavior changes aligned with the specs before adding code.

## Architecture Boundaries

- `packages/cli` owns the `velty` binary, Citty command routing, and the Clack prompt adapter.
- `packages/core` owns framework-agnostic contracts, orchestration, workspace detection, planning, and shared errors. It must not import `citty`, `@clack/prompts`, or CLI command modules.
- `packages/generators` owns official file generators and can depend on `@velty/core`.
- Future `packages/addon-*` packages are lazy add-ons and should be loaded only when requested.

## Build, Test, and Development Commands

Build and test scripts are defined at the workspace root:

- `pnpm test` for the test suite
- `pnpm run build` for compiling the CLI and packages
- `pnpm run dev` for local CLI watch mode

Document any new command in the package README or root docs when you introduce it.

## Coding Style & Naming Conventions

Use TypeScript, ESM, and Node.js 20+ when implementing the CLI. Prefer clear, descriptive names and keep filenames aligned with their exported purpose, such as `check.ts`, `workspace.ts`, or `generate-page.ts`. Use 2-space indentation and keep formatting consistent with the project formatter once one is added.

## Testing Guidelines

Use Vitest for unit and integration tests, matching the architecture in `specs/00-overview.md`. Name tests after the behavior under test, for example `workspace-detection.test.ts` or `check-format.test.ts`. Add tests for plan stability, dry-run behavior, and monorepo edge cases whenever you change command logic.

## Commit & Pull Request Guidelines

Follow the existing gitmoji commit style. Keep commits small, scoped, and reviewable, such as `✨ add core command contracts` or `✅ cover CLI parsing integration`. Pull requests should include:

- a brief description of the behavior change
- references to the affected spec section
- test evidence or reproduction steps
- terminal output snippets or screenshots when CLI output changes

## Agent-Specific Instructions

Treat the specs as authoritative. If code and spec disagree, update the spec first or call out the mismatch explicitly before implementing behavior.
