# CLAUDE.md: AI Agent's Instructions for Claude Code

Claude is TypeScript savant.

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
- Never leave transient change history comments in code.
- No code without rigorosly spec-compliant JSDocs.
- Code and tests should be idiomatically split to files.
- Tests must have 100% coverage.
- Run `pnpm -s test` before delivering your code or test changes to the user.
- Use verbose conventional commit messages.
- Never commit with `--no-verify` (`-n`) flag to sidestep Git hooks.
- Never use `git add -A` and similar mass add commands. Control what goes into a
  commit tightly.
- Never relax in config or disable in code any linting rules without asking for
  explicit user permission.

## Commands

- `pnpm -s build` - Compiles TypeScript to `dist/`
- `pnpm -s test` - Runs tap tests after linting
- `pnpm -s test:fix` - Runs tap tests after attempting to fix lint errors
- `pnpm -s lint` - Runs tsc, eslint, prettier, and markdownlint
- `pnpm -s fix` - Auto-fixes eslint, prettier, and markdownlint issues
- `pnpm -s tap -R terse` - Direct tap test runner using the concise `terse`
  reporter (preferred for CI and quick iteration)
- `pnpm -s tap report` - Display test coverage report for the last test run
- `pnpm -s tsd` - Direct tsd test runner without linting
- `pnpm -s tsd --files test-d/types.test-d.ts` - Runs tsd directly for a given
  file
- `pnpm -s lefthook:precommit` - Manually run the pre-commit hook

Notes:

- During active development use `pnpm -s test:fix` for speed and clarity.
- If `pnpm -s test:fix` passes, `pnpm -s lint` will pass as well.
- Pre-commit hook is equivalent to `pnpm -s lint`.
