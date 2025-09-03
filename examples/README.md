# Examples

This directory hosts integration examples for the immutable plugin system. Each
example is a small, focused program that demonstrates a concrete usage pattern
with strong types and deterministic discovery behavior.

Currently available:

- Events example: `examples/events` — demonstrates three entity types (`assets`,
  `commands`, `on` event listeners), provenance‑preserving discovery, and
  emitting events around command execution.

## Requirements

- Node.js ≥ 22
- pnpm ≥ 10

## Build Order and Imports

- Examples import the library by package name (`immutable-plugin-system`) via
  pnpm workspaces. This mirrors consumer usage and keeps paths stable.
- Examples compile TypeScript to their local `./dist` directories.
- The library must be built at the repository root so the example can resolve
  the published type declarations used by its TS config.

## Typical Workflow (from repo root)

1. Install and build

```bash
pnpm -s install
pnpm -s build
```

1. Run an example

```bash
pnpm -s -C examples/events start
```

## Per‑Example Docs

- See `examples/events/README.md` for the events example usage, expected output,
  and troubleshooting.

## Notes

- Examples are tested by the main test suite. If you change example output,
  update the corresponding `expected.txt` fixture and re‑run tests.
- Examples treat entities as immutable by convention; the library does not deep
  clone or freeze entity values.
