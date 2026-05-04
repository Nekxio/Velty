# Velty

Opinionated CLI for Svelte and SvelteKit.

```
velty create my-app
velty add tailwindcss vitest
velty generate page about
velty doctor
```

## Overview

Velty is a standalone CLI orchestrator for Svelte/SvelteKit projects, inspired by the `nuxi` experience for Nuxt. The current MVP wires the CLI stack, command tree, context boundary, and prompt abstraction. The command behavior remains spec-driven and will cover creation, add-ons, file generation, diagnostics, type checking, and migrations as the workflows are implemented.

## Commands

| Command                      | Description                                              |
| ---------------------------- | -------------------------------------------------------- |
| `velty create [path]`        | Create a new Svelte or SvelteKit project                 |
| `velty add [addOns...]`      | Add one or more add-ons to an existing project           |
| `velty generate` / `velty g` | Generate SvelteKit files (page, layout, api, component…) |
| `velty doctor`               | Diagnose a Svelte/SvelteKit project                      |
| `velty check`                | Run Svelte diagnostics via `svelte-check`                |
| `velty migrate [migration]`  | Run guarded Svelte/SvelteKit migrations                  |

## Global Flags

```
--cwd <path>     Override the working directory
--dry-run        Plan changes without writing files or installing dependencies
--format <type>  Output format
--verbose        Enable verbose logs
--no-color       Disable ANSI colors
--version        Print the version
--help           Show help
```

Write commands must honor `--dry-run` when their implementation is added.

## Add-ons

Future official add-ons will be published as `@velty/addon-*` packages and loaded only when requested.

_Coming soon_

## CI Support

Set `CI=true` or another truthy CI value such as `CI=1` to disable interactive prompts. Every decision must be passed as a flag. Ambiguous states should produce an error rather than a prompt.

## Monorepo

Velty will detect workspace roots and target the correct project root automatically. Pass `--cwd <package>` to target a specific package explicitly.

## Package Managers

npm, pnpm, yarn, and bun are target package managers. Velty should resolve the package manager from `--install`, `package.json#packageManager`, lockfile detection, or a prompt. In CI without an explicit flag, an ambiguous state is an error.

## Requirements

- Node.js >= 20.11

## Development

```bash
pnpm install
pnpm run build
pnpm run typecheck
pnpm run lint
pnpm run format:check
pnpm test
node packages/cli/dist/index.js --help
```

## Architecture

```
packages/
  cli/                # velty binary: Citty routing + Clack adapter only
  core/               # @velty/core: command contracts, env guards, errors
  generators/         # @velty/generators: official generator registry
  addon-*/            # future lazy add-ons, loaded on demand
docs/
  adr/
    001-cli-stack.md  # CLI stack decision: citty + @clack/prompts
specs/                # Feature specifications
```

`velty` stays a small CLI orchestrator. `@velty/core` is a required package and does not import Citty or Clack. `@velty/generators` is a required workspace package for official file generation. Future `@velty/addon-*` packages should remain lazy and loaded only when the user requests the matching add-on.

## Exit Codes

| Code | Meaning           |
| ---: | ----------------- |
|    0 | Success           |
|    1 | Functional error  |
|    2 | Invalid arguments |
|  130 | User cancellation |

## License

MIT
