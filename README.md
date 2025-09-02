# Immutable Plugin System (TypeScript, Node.js ≥22)

[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
![Documentation coverage](docs/api/coverage.svg)
![Test coverage](https://img.shields.io/badge/coverage-100%25-green.svg)
![CI](https://github.com/agladysh/immutable-plugin-system/actions/workflows/ci.yml/badge.svg)

Minimalist, strongly typed, immutable plugin system.

- Zero runtime dependencies
- ESM only (`"type": "module"`)
- Thoroughly type‑safe API and guards
- Deterministic, attribution‑preserving entity discovery

Links:

- Specification: [docs/spec.md](docs/spec.md) (status: FINAL, v1.1.0 / r1.1.6)
- API Reference: [docs/api](docs/api/README.md)
- Example: [examples/events](examples/events/README.md)

## Install

- Requirements: Node.js ≥22, pnpm ≥10.

Install from npm:

```bash
pnpm add immutable-plugin-system
```

## Core Ideas

- Plugins provide typed read‑only entities via `ImmutablePlugin<C>`.
- Host aggregates plugins and exposes centralized, typed discovery via
  `ImmutableHost<P>`.
- Entities are grouped per “entity type” into iterable collections with helpers.
- Library guarantees structural immutability and preserves provenance (which
  plugin provided an entity). Values are treated as immutable by convention.

## Types At A Glance

- `ImmutableEntities<K, V>`: inner entity map
  (`Readonly<Record<K, NonNullable<V>>>`).
- `ImmutableEntitiesRecord`: mapping of entity types to inner maps.
- `ImmutablePlugin<C>`: plugin with `name: PluginURN` and `entities: C`.
- `ImmutableHost<P>`: host that builds `entities` collections across all
  plugins.
- `ImmutableEntityCollection<K, E>`: iterable view with `get`, `entries`,
  `flat`, `map`, `flatMap`.

Key rules enforced by runtime guards:

- Entity keys: symbols or non‑empty, non‑numeric‑like strings (e.g. `"0"`,
  `"-1"`, `"1.5"` are rejected).
- Values must be defined (`undefined` is forbidden). Omit the key instead.
- Plugin `name` must be non‑empty, and equal the URN key in the plugins record.

## Quick Start (TypeScript)

```ts
import {
  ImmutableHost,
  type ImmutablePlugin,
  type ImmutableEntities,
} from 'immutable-plugin-system';

// 1) Define your integration’s entities schema
type Command = (...args: string[]) => string;
type Entities = {
  assets: ImmutableEntities<string, string>;
  commands: ImmutableEntities<string, Command>;
};

// 2) Model your plugin
interface Plugin extends ImmutablePlugin<Entities> {
  description: string;
}

const pluginA: Plugin = {
  name: 'pluginA',
  description: 'this is plugin A',
  entities: {
    assets: { foo: 'this is `foo`', duplicate: 'duplicate from A' },
    commands: { hello: (...args) => `hello(${args.join(',')})` },
  },
};

const pluginB: Plugin = {
  name: 'pluginB',
  description: 'this is plugin B',
  entities: {
    assets: { bar: 'this is `bar`', duplicate: 'duplicate from B' },
    commands: { world: (...args) => `world(${args.join(',')})` },
  },
};

// 3) Create the host; optionally require entity types at runtime
const host = new ImmutableHost<Plugin>(
  { pluginA, pluginB },
  { requiredEntityTypes: ['assets'] }
);

// 4) Discover entities
for (const [value, key, plugin] of host.entities.assets) {
  console.log(`asset ${String(key)} from ${plugin}: ${value}`);
}

// Get by key (returns all contributors)
const dup = host.entities.assets.get('duplicate'); // ['duplicate from A','duplicate from B']

// Call a command (integration decides on uniqueness/selection semantics)
const results = host.entities.commands.get('hello').map((fn) => fn('arg'));
```

## Collections API

- `get(key: K): E[]` — returns all entities for a key. Returns a fresh array
  copy; mutating it does not affect the collection.
- `entries(): Iterator<[K, E[]]>` — per‑key grouped arrays.
- `flat(): [E, K, PluginURN][]` — flattened entities with provenance.
- `map(fn)` / `flatMap(fn)` — transform grouped or individual items.
- Iterable: `for (const [e, k, p] of collection) { … }`.

## Runtime Guards (Optional)

Importable helpers validate shapes and invariants when needed by your
integration:

- `isPlainObject`, `assertPlainObject`
- `isEntityRecord`, `assertEntityRecord`
- `isEntitiesRecord`, `assertEntitiesRecord`
- `isImmutablePlugin`, `assertImmutablePlugin`
- `isImmutablePlugins`, `assertImmutablePlugins`

The host uses the same rules internally.

Notes:

- Primary contract is TypeScript; runtime validation is optional and
  integration‑driven.
- Use `requiredEntityTypes` to enforce presence of specific entity types at
  runtime when such knowledge exists for your concrete integration.

Guards return booleans (`is*`) or throw on violation (`assert*`). Host
constructor performs the same validations and throws `TypeError` with
descriptive messages on failure.

### Guard usage examples

Validate a single plugin or a plugin record before constructing the host:

```ts
import {
  assertImmutablePlugin,
  assertImmutablePlugins,
  type ImmutablePlugin,
  type ImmutableEntities,
} from 'immutable-plugin-system';

type P = ImmutablePlugin<{ assets?: ImmutableEntities<string, string> }>;
const good: P = { name: 'p', entities: {} };

assertImmutablePlugin(good); // throws TypeError on violation
assertImmutablePlugins({ p: good }); // throws TypeError on violation
```

Require a symbol‑keyed entity type at runtime (optional):

```ts
const symType = Symbol('sym');
type P = ImmutablePlugin<{ [symType]?: Record<string, string> }>;

// Will throw TypeError if a plugin is missing the symbol entity type
new ImmutableHost<P>(
  {
    /* plugins */
  },
  { requiredEntityTypes: [symType] }
);
```

## Example: Events

An end‑to‑end, didactic example lives in `examples/events/` (with tests):

- Build: `pnpm -s build:examples`
- Run (after build): `node examples/events/dist/main.js`

It demonstrates custom entity types (assets, commands, event listeners) and
event emission.

Note: the example README is a work‑in‑progress; the example itself is complete,
built in CI, and validated by the test suite.

## Development

- Install deps: `pnpm -s install`
- Fast iteration: `pnpm -s test:fix` (auto‑fix + build + type + tests)
- Full pipeline (CI‑equivalent): `pnpm -s test`
- Lint only: `pnpm -s lint`
- Build everything (lib, examples, docs): `pnpm -s build`

Conventions:

- TypeScript, strict types; `any` is forbidden. Minimal, defensible `unknown`
  only with guards.
- TSDoc everywhere; validated by ESLint (`tsdoc/syntax`).
- No runtime mutations; library never deep‑clones entity values.

## Out of Scope

- Plugin discovery.
- Plugin ordering and dependency resolution.
- Plugin/host configuration.

These are integration concerns; see the specification for discussion and
recommendations.

## Design Notes

- Required/optional entity types are primarily a TypeScript contract. At
  runtime, the host cannot infer “requiredness” without an explicit schema. Use
  `requiredEntityTypes` when runtime enforcement is desirable.
- Entity keys exclude numbers and numeric‑like strings to avoid JS coercion
  ambiguity. Prefer textual identifiers or symbols.

- Performance: Host construction groups inner maps by entity type with
  straightforward iteration. Complexity is linear in the number of plugins and
  entity maps; large sets are covered by tests.

- Collections are plain JavaScript iterables. Iteration order follows the
  standard `Map` insertion order semantics and is not a stability guarantee
  across different plugin sets.

## Contributing

- Requirements: Node.js ≥22, pnpm ≥10.
- Install: `pnpm -s install`
- Iterate: `pnpm -s test:fix` (eslint + prettier + markdownlint auto‑fix, then
  build + tsd + tap)
- Full checks: `pnpm -s test` (runs lint and all tests)
- Pre‑commit hook runs the equivalent of `pnpm -s lint`.
- Coding standards:
  - TypeScript strict types; `any` is forbidden, `unknown` only with proper
    guards.
  - TSDoc everywhere; enforced by ESLint (`tsdoc/syntax`).
  - No runtime mutation of library‑owned containers; do not freeze/clone entity
    values.
  - Use conventional commits for clarity and tooling compatibility.

## Stability

This package is pre‑1.0 (`0.x`). While the specification is stable (v1.1.0), the
public API may evolve before `1.0.0`. Follow semver and consult the changelog
once released.

## License

MIT — see LICENSE
