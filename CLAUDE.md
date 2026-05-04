# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Velty** is a spec-driven Svelte/SvelteKit CLI tool (comparable to `nuxi` for Nuxt). The ignored local `specs/` directory is the canonical source of truth. Never add behavior that contradicts the specs; update the spec first or flag the mismatch.

## Commands

Core build and test scripts are defined at the workspace root:

```bash
pnpm test        # Vitest test suite
pnpm build       # Compile CLI and packages with tsup
pnpm dev         # CLI watch mode
```

Document any new command in the package README when you introduce it.

## Architecture

Workspace layout:

```
packages/
  cli/          # velty binary (citty + @clack/prompts)
  core/         # @velty/core contracts, env guards, planning primitives
  generators/   # @velty/generators official file generator registry
  addon-*/      # future lazy add-ons, loaded on demand
  testing/      # fixtures, helpers, e2e snapshots
specs/          # canonical behavior specs (French)
```

Architecture boundaries:

- `packages/cli` owns Citty routing and the Clack adapter.
- `packages/core` must stay framework-agnostic and must not import `citty`, `@clack/prompts`, or CLI command modules.
- `packages/generators` can depend on `@velty/core`.
- `packages/addon-*` packages are future lazy add-ons, loaded only when requested.

**Execution cycle for all write operations:**

1. **detect** — read context, no disk writes
2. **plan** — produce a JSON-serializable plan
3. **apply** — write files via `.velty-tmp/` staging
4. **install** — install deps if requested
5. **verify** — check light invariants
6. **summary** — display files, deps, next commands

## Key Constraints

- **Plans must be JSON-serializable** — required for dry-run, diffs, snapshots, and security audit
- **`--dry-run` is mandatory** on all write commands — never skip it in implementation
- **Relative paths only** in all output — never absolute paths
- **Atomicity via staging** — all writes go through `.velty-tmp/` before commit
- **TypeScript + ESM + Node.js ≥ 20.11** — no CommonJS
- **2-space indentation**, filenames match their exported purpose (`check.ts`, `workspace.ts`)
- **Vitest** for unit and integration tests; name test files after behavior (`workspace-detection.test.ts`)

## Behavioral Guidelines

### Think Before Coding

Before implementing: state assumptions, surface tradeoffs, ask when unclear.

### Simplicity First

Minimum code that solves the problem. No speculative features, abstractions for single-use code, or error handling for impossible scenarios.

### Surgical Changes

Touch only what the task requires. Match existing style. Remove only what your changes make unused.

### Goal-Driven Execution

Transform tasks into verifiable goals. State a brief plan for multi-step tasks:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
```
