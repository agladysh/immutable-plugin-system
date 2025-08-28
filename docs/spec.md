# Specification: Immutable Plugin System

- **Specification Version:** 1.1.0
- **Document Revision:** 1.1.0
- **Status:** FINAL

This document specifies a minimalist strongly typed immutable plugin system for
Node.js.

## Concept

- Plugins provide typed read-only entities to the host and other plugins.
- Host provides centralized type-safe discovery for entities.
- Plugin and their entity sets are immutable, no runtime changes supported.

Via negativa, we're:

- **Not a runtime plugin system:** plugin sandboxing is not applicable
- **Not an application framework:** our error handling requirements are simple
- **Not a package management system:** we need plugin names only for asset
  disambiguation
- **Not a resource management system:** our memory and performance overhead is
  minimal

### Entities

- Plugins expose the full set of their available entities.
- Host maintains the full set of the entities available by plugin.
- Entity matching logic is provided by implementation for each entity type.
- Entity conflicts are handled by implementations. Host is agnostic to entity
  duplication between plugins.

### Out of Scope

- **Plugin and entity lifetime management**. Immutable by design.
- **Plugin discovery.** See e.g.
  [`installed-node-modules`](https://www.npmjs.com/package/installed-node-modules).
- **Plugin ordering and dependency management.** Handled prior to initialization
  by implementations.
- **API version management.** Concrete version is handled on the implementation
  end. We provide a high-level generic API. If we ever find a need to introduce
  a breaking change post v1.0.0, it will be released as a separate module (e.g.
  simple-plugin-host-2).
- **Plugin and host configuration.** Implementations provide their own.

## API

- Our code ensures maximal type safety reasonably possible.
- Our code must be async-neutral where reasonable.

### Types

- Only types marked as `export` are a normative part of the API.
- Helper types are not normative (but their contracts are).
- Actual code should strengthen types further, whenever reasonable.
- We explicitly define simple exported types

#### `ImmutableEntities`

- Exclude numeric keys to avoid ambiguity with JavaScript's coercion of numeric
  object keys to strings and to enforce stable textual identifiers.
- Excludes empty string `''` to prevent degenerate identifiers.

```ts
export type ImmutableEntityKey = Exclude<PropertyKey, number | ''>;

// Keys are textual (non-empty strings) or symbols; numeric keys are forbidden
export type ImmutableEntities<K extends ImmutableEntityKey, V> = Readonly<
  Record<K, V>
>;
```

#### `ImmutablePlugin`

```ts
export type PluginURN = string;

export type ImmutableEntitiesRecord<
  K extends ImmutableEntityKey = ImmutableEntityKey,
  V extends unknown = unknown,
> = Readonly<Record<PropertyKey, ImmutableEntities<K, V>>>;

export interface ImmutablePlugin<
  C extends ImmutableEntitiesRecord = ImmutableEntitiesRecord,
> {
  readonly name: PluginURN;
  readonly entities: Readonly<C>;
}
```

#### `ImmutableEntityCollection`

- Wrapper over `Map<K, E[]>`.
- Includes idiomatic `flat`, `map` and `flatMap` methods for convenience.

```ts
export interface ImmutableEntityCollection<K extends PropertyKey, E> {
  get(key: K): E[];
  entries(): Iterator<[K, E[]]>;
  flat(): [E, K, PluginURN][];
  map<U>(fn: (entities: E[], key: K) => U): U[];
  flatMap<U>(fn: (entity: E, key: K, plugin: PluginURN) => U): U[];
  [Symbol.iterator](): Iterator<[E, K, PluginURN]>;
}
```

#### `ImmutableHost`

```ts
type ImmutablePlugins<P extends ImmutablePlugin = ImmutablePlugin> = Readonly<
  Record<PluginURN, P>
>;

type ImmutableEntityCollections<
  K extends PropertyKey,
  T extends { [k in K]: unknown },
> = {
  [k in K]: ImmutableEntityCollection<keyof T[k], T[k][keyof T[k]]>;;
};

type ImmutableEntityCollectionsFromPlugin<P extends ImmutablePlugin> =
  ImmutableEntityCollections<keyof P['entities'], P['entities']>;

// Intentionally no default parameter to prevent accidental use.
export class ImmutableHost<P extends ImmutablePlugin> {
  constructor(plugins: ImmutablePlugins<P>);
  readonly plugins: ImmutablePlugins<P>;
  readonly entities: ImmutableEntityCollectionsFromPlugin<P>;
}
```

## Example

A simple didactic usage example is included in [`examples/`](../examples/):

- Three entity types:
  - command: a uniquely named stateless function,
  - asset: a non-uniquely named string,
  - event handler.
- Host emits events:
  - before command execution with its name,
  - after command execution with its name and return value.
- Example:
  - defines two plugins with assets,
  - prints all plugins,
  - prints all available assets,
  - prints an asset,
  - prints all available commands and calls them,
  - calls a command.

The example is tested by the main test suite as a black-box program, verifying
against expected output, which is stored alongside the example.

### Reference Implementation

Code below is normative, and, in addition to being the example, further
illustrating intended semantics of the module implementation.

#### Events Module

Normative pseudocode.

```ts
type EventURN = string;

interface Event<T extends EventURN> {
  readonly name: T;
}

type EventListener<E extends Event> = (event: E) => void;

type Events<
  EventUnion extends Event,
  K extends EventUnion['name'] = EventUnion['name']
> = Record<K, EventUnion>;

type EventEntities<EventUnion extends Event> = ImmutableEntities<
  EventUnion['name'],
  { [E in EventUnion as E['name']]: EventListener<E> }
>;

interface Emitter<EventUnion extends Event> {
  emit(event: EventUnion) => boolean;
  on<E extends EventUnion>(listener: EventListener<E>) => this;
}

function emitterFromEntities<
  EventUnion extends Event
>(entities: EventEntities<EventUnion>): Emitter<EventUnion>;
```

### Example Program

- Normative

```ts
import type {
  ImmutableHost,
  ImmutablePlugin,
  ImmutablePlugins,
  ImmutableEntities
} from 'simple-plugin-host';
import type { Emitter, EventEntities } from 'events.ts';
import { emitterFromEntities } from 'events.ts';

class Context {
  emitter: Emitter<Events>;
  constructor(emitter: Emitter<Events>) {
    this.emitter = emitter;
  }
  print(text: string): void {
    globalThis.process.stdout.write(`${text}\n`);
  }
}

type Command = (ctx: Context, ...args: string[]) => string;

type Entities = {
  assets: ImmutableEntities<string, string>;
  commands: ImmutableEntities<string, Command>;
  on: EventEntities<Events>;
};

type BeforeCommandExecution = {
  name: 'beforeCommandExecution',
  ctx: Context,
  command: string
};

type AfterCommandExecution = {
  name: 'afterCommandExecution',
  ctx: Context,
  command: string,
  result: string,
};

type Events = BeforeCommandExecution | AfterCommandExecution;

interface Plugin extends ImmutablePlugin<Entities> {
  description: string;
}

const pluginA: Plugin = {
  name: 'pluginA',
  description: 'this is plugin A',
  entities: {
    on: {
      beforeCommandExecution: (e: BeforeCommandExecution) => {
        e.ctx.print(
          `[pluginA] beforeCommandExecution command: "${e.command}"`
        );
      },
      afterCommandExecution: (e: AfterCommandExecution) => {
        e.ctx.print(
          `[pluginA] afterCommandExecution command: "${e.command}" result: "${e.result}"`
        );
      },
    },
    assets: {
      foo: 'this is `foo`',
      duplicate: 'this is duplicate asset from PluginA',
    },
    commands: {
      bar: (ctx: Context, ...args: string[]): string => {
        ctx.print(`this is bar(${args.join(', ')})`);
        return '`bar` return value';
      },
    },
  },
};

class PluginB implements Plugin {
  readonly name: string;
  readonly description: string;
  readonly entities: {
    on: {
      beforeCommandExecution: (e: BeforeCommandExecution) => {
        e.ctx.print(
          `[pluginB] beforeCommandExecution command: "${e.command}"`
        );
      },
      afterCommandExecution: (e: AfterCommandExecution) => {
        e.ctx.print(
          `[pluginB] afterCommandExecution command: "${e.command}" result: "${e.result}"`
        );
      },
    },
    assets: {
      baz: 'this is `baz`',
      duplicate: 'this is duplicate asset from PluginB',
    },
    commands: {
      quo: (ctx: Context, ...args: string[]): string => {
        ctx.print(`this is quo(${args.join(', ')})`);
        return '`quo` return value';
      },
    },
  },
  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
};

const pluginB = new PluginB('pluginB', 'this is plugin B');

class Host extends ImmutableHost<Plugin> {
  context: Context;

  constructor(plugins: ImmutablePlugins<Plugin>) {
    super(plugins);
    this.context = new Context(emitterFromEntities<Events>(this.entities.on));
    // Verify commands are unique on load
    for ([ name, items ] of this.entities.commands.entries()) {
      if (items.length !== 1) {
        throw new Error(`duplicate commands "${name}" found: ${JSON.stringify(items)}`);
      }
    }
  }

  assets(name: string): string[] {
    return this.entities.assets.get(name);
  }

  run(name: string, ...args: string[]): string {
    // We know commands are unique
    const [ command ] = this.entities.commands.get(name);
    if (!command) {
      throw new Error(`unknown command "${name}"`);
    }

    this.context.emitter.emit({
      name: 'beforeCommandExecution',
      ctx: this.context,
      command: name
    });

    const result = command(this.context, ...args);

    this.context.emitter.emit({
      name: 'afterCommandExecution',
      ctx: this.context,
      command: name,
      result
    });

    return result;
  }
}

const host = new Host({ pluginA, pluginB });

const ctx = host.context;

ctx.emitter.on((e: BeforeCommandExecution) => {
  e.ctx.print(
    `[main] beforeCommandExecution: "${e.command}"`
  );
});

ctx.emitter.on((e: AfterCommandExecution) => {
  e.ctx.print(
    `[main] afterCommandExecution: "${e.command}" result: "${e.result}"`
  );
});

ctx.print('Available plugins:');
for (const [ name, plugin ] of Object.entries(host.plugins)) {
  ctx.print(`- ${name}: ${plugin.description}`);
}

ctx.print(`PluginA name: ${host.plugins['pluginA'].name}`);

ctx.print('Available assets:');
for (const [ value, uri, plugin_name ] of host.entities.assets) {
  // Prints both duplicates
  ctx.print(`- ${uri} [${plugin_name}]: "${value}"`);
}

ctx.print(`Assets "duplicate": "${host.assets('duplicate').join('", "')}"}`);

ctx.print('Available commands:');
for (const [ command, name, plugin_name ] of host.entities.commands) {
  ctx.print(`- ${name} [${plugin_name}]: ${host.run(name, 'hello')}`);
}

// Triggers events
ctx.print(`Running "bar": ${ host.run('bar', 'world') }`);
```

## Tests

- Black-box test of an example cli program as described above
- Full contract tests on all sources
- Rigorous implementation tests with full coverage

## Stack

### Implementation

- TypeScript: ^5.9.2
- Node.js: >= 22

No external dependencies.

### Testing

- tap

### Code Infrastructure

- Git
- pnpm: >= 10
- ESLint
- Prettier
- markdownlint
- lefthook

- Single package repository
- Cutting-edge `package.json` structure.

## Document Revision History

### r1.1.0 / v1.1.0

- Key type refinement for inner maps:
  - Added `ImmutableEntityKey = Exclude<PropertyKey, number | ''>`.
  - `ImmutableEntities<K, V>` now uses `K extends ImmutableEntityKey` (was
    `PropertyKey`). This excludes numeric and empty-string keys from inner
    entity maps to avoid JS numeric key coercion ambiguity and degenerate
    identifiers.
- New top-level entities alias:
  - Introduced `ImmutableEntitiesRecord<K, V>` to model the entities container
    mapping entity types to inner entity maps.
- Immutability made explicit:
  - `ImmutableEntities<K, V>` and `ImmutableEntitiesRecord<K, V>` are
    `Readonly<…>`.
  - `ImmutablePlugins<P>` is `Readonly<Record<…>>`.
  - `ImmutablePlugin.entities` is `Readonly<C>`.
- Ergonomics:
  - `ImmutablePlugin` now defaults its generic to `ImmutableEntitiesRecord`, and
    `ImmutablePlugins` defaults to `ImmutablePlugin`.
  - `ImmutableHost` intentionally has no default parameter.

### r1.0.1 / v1.0.0

- Fixed `ImmutableEntityCollections` type to remove accidental type coupling of
  entities record keys and keys of its nested object

  ```diff
  - [k in K]: ImmutableEntityCollection<k, T[k]>;
  + [k in K]: ImmutableEntityCollection<keyof T[k], T[k][keyof T[k]]>
  ```

### r1.0.0 / v1.0.0

- Initial revision
