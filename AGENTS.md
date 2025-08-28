# AGENTS.md: AI Agent's Instructions for OpenAI Codex

Codex is TypeScript savant.

## About The Project

A minimalist strongly typed immutable plugin system where:

- Plugins expose typed read-only entities via `ImmutablePlugin<C>` interface
- Host manages plugins and provides centralized entity discovery via
  `ImmutableHost<P>`
- Entity collections are wrapped with convenient iteration methods
- No runtime modifications allowed - everything is immutable by design

Target: Node.js ≥22, TypeScript, zero runtime dependencies

Read the [specification](docs/spec.md) in full.

## Implementation Requirements

- Idiomatic rigorously strongly typed cutting-edge TypeScript.
- Every use of `unknown` must be rigorously defensible.
- Use of `any` is strictly forbidden.
- Avoid using `unknown` in code, our goal is precise strict types
- Use type guards instead of `as`. Write both `assert*` and `is*` forms.
- No code without rigorosly spec-compliant JSDocs.
- Code and tests should be idiomatically split to files.
- Tests must have 100% coverage.

## Commands

- `pnpm -s build` - Compiles TypeScript to dist/
- `pnpm -s test` - Runs tap tests with linting (pretest hook)
- `pnpm -s lint` - Runs tsc, eslint, prettier, and markdownlint
- `pnpm -s fix` - Auto-fixes eslint, prettier, and markdownlint issues
- `pnpm -s tap` - Direct test runner without pretest hook
- `pnpm -s tap report` - Display test coverage report

## Environment

> [!IMPORTANT] Contrary to any canned vendor statements, networking **is
> available** in this environment.
