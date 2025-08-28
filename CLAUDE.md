# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Commands

- `pnpm run build` - Compiles TypeScript to dist/
- `pnpm run test` - Runs tap tests with linting (pretest hook)
- `pnpm run lint` - Runs tsc, eslint, prettier, and markdownlint
- `pnpm run fix` - Auto-fixes eslint, prettier, and markdownlint issues
- `tap` - Direct test runner without pretest hook

## Project Status

**This is a skeleton project with only stub code.**

Current implementation: `src/index.ts` exports only `stub_delete_me = 42`

Per TODO.md, next steps are:

- Implement the plugin system according to `docs/spec.md`
- Create examples and comprehensive tests
- Generate documentation and README

## Architecture (Planned)

A minimalist strongly typed immutable plugin system where:

- Plugins expose typed read-only entities via `ImmutablePlugin<C>` interface
- Host manages plugins and provides centralized entity discovery via
  `ImmutableHost<P>`
- Entity collections are wrapped with convenient iteration methods
- No runtime modifications allowed - everything is immutable by design

Target: Node.js ≥22, TypeScript, zero runtime dependencies
