# Events Example (Immutable Plugin System)

This example demonstrates a small integration built on the immutable plugin
system:

- Three entity types provided by plugins:
  - `assets`: strings (may have duplicates across plugins)
  - `commands`: stateless functions executed by the host
  - `on`: event listeners consumed by a minimal synchronous emitter
- The example host aggregates entities, enforces command uniqueness at startup,
  and emits two events around command execution.

The example is covered by the main test suite as a black‑box CLI program. Its
expected output is stored in `examples/events/expected.txt`.

## Prerequisites

- Node.js ≥ 22
- pnpm ≥ 10

## How It’s Wired

- The example compiles TypeScript in this folder to `./dist`.
- It imports the library by package name (`immutable-plugin-system`) via pnpm
  workspace linking. This requires the root library to be built so type
  declarations are available to the example.

## Run (from repo root)

This is the canonical flow used by CI and tests.

1. Build the library, example, and docs

```bash
pnpm -s build
```

1. Run the example CLI

```bash
pnpm -s -C examples/events start
# or equivalently
node examples/events/dist/main.js
```

The output should match `examples/events/expected.txt`.

## Run (example folder, standalone build)

This folder has its own `package.json` and can build its TS independently. It
still relies on the root library build artefacts for runtime imports.

```bash
cd examples/events
pnpm -s install         # installs typescript + @types/node for this example
pnpm -s -C ../.. build  # build the library once (required)
pnpm -s build           # build this example
pnpm -s start           # run CLI
```

If you see errors resolving `immutable-plugin-system`, ensure you installed
workspace deps in this folder and built the root library:

```bash
pnpm -s install && pnpm -s -C ../.. build
```

## What It Shows

- Entities aggregation per type via `ImmutableHost`.
- Provenance preservation: iterating `host.entities.assets` yields
  `[value, key, pluginURN]` tuples.
- Command uniqueness validation: the host throws on duplicates during
  construction and before any execution.
- Minimal synchronous event emitter built either from an entities record or from
  a discovered `ImmutableEntityCollection` (see `src/events.ts`).

## Key Types (excerpt)

- `Entities` (integration‑defined):
  - `assets: ImmutableEntities<string, string>`
  - `commands: ImmutableEntities<string, (ctx, ...args) => string>`
  - `on: EventEntities<Events>`
- `Plugin`: `ImmutablePlugin<Entities>` plus a `description: string`.
- `Host`: extends `ImmutableHost<Plugin>` and wires the event emitter from
  `entities.on`, then validates command uniqueness.

## Expected Output

The example prints a deterministic sequence. Inspect or compare with
`expected.txt` to verify:

```bash
node dist/main.js | diff -u - expected.txt
```

## Notes & Troubleshooting

- The library treats entity values as immutable by convention; it never
  deep‑clones or freezes values. Containers are immutable by construction.
- If TypeScript compilation in this folder fails with missing Node typings, run
  `pnpm -s install` in `examples/events` to install local dev dependencies.
- Ensure Node.js ≥22; ESM only.

## License

MIT — see the repository root `LICENSE`.
