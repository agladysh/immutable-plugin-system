import { expectType, expectError } from 'tsd';
import type {
  ImmutableEntityKey,
  ImmutableEntities,
  ImmutablePlugin,
  ImmutablePlugins,
  NonEmptyString,
} from '..';
import { ImmutableHost } from '..';

// ImmutableEntityKey constraint tests - empty string rejection
expectError<ImmutableEntityKey>('');

// Valid entity keys - test the type constraint properly
declare const validEntityKey: ImmutableEntityKey;
expectType<symbol | NonEmptyString>(validEntityKey);

// Invalid entity keys - numeric keys rejection (not assignable to ImmutableEntityKey)
expectError<ImmutableEntityKey>(0);
expectError<ImmutableEntityKey>(1);
expectError<ImmutableEntityKey>(-1);
expectError<ImmutableEntityKey>(3.14);
expectError<ImmutableEntityKey>(Infinity);
expectError<ImmutableEntityKey>(NaN);

// ImmutableEntities constraint enforcement
type ValidEntities = ImmutableEntities<string, string>;
type SymbolEntitiesMap = ImmutableEntities<symbol, number>;

// Valid entity construction - using type assertions
declare const validStringEntities: ValidEntities;
declare const validSymbolEntities: SymbolEntitiesMap;
expectType<Readonly<Record<string, string>>>(validStringEntities);
expectType<Readonly<Record<symbol, number>>>(validSymbolEntities);

// Type constraint validation
// - Numeric keys are forbidden at the type level
declare const _ensureInvalidNumericKeys: never;
// Passing explicit generic argument outside the constraint produces an error

const _callWithInvalidNumeric = (
  // Using a generic to surface the constraint error in an expression
  fn: <EK extends string | symbol>(_x: ImmutableEntities<EK, string>) => void
) => {
  // @ts-expect-error - number does not satisfy string | symbol
  fn<number>({} as never);
};

// - Empty string keys are erased from literal unions (no runtime error), assert shape
type EmptyOnly = ImmutableEntities<'', string>;
declare const emptyOnly: EmptyOnly;
expectType<Readonly<Record<never, string>>>(emptyOnly);

// Mixed key types with proper constraints - use type variables
type ValidMixedKeyEntities = ImmutableEntities<string | symbol, {}>;
declare const validMixedKeyEntities: ValidMixedKeyEntities;
expectType<Readonly<Record<string | symbol, {}>>>(validMixedKeyEntities);

// Plugin URN consistency enforcement
type TestEntities = {
  assets: ImmutableEntities<string, string>;
};

type TestPlugin = ImmutablePlugin<TestEntities>;

// Valid plugin - URN matches name property
const validPlugin: TestPlugin = {
  name: 'test-plugin',
  entities: {
    assets: { key: 'value' },
  },
} as const;
expectType<TestPlugin>(validPlugin);

// Required entity types constraint
type RequiredEntities = {
  required1: ImmutableEntities<string, string>;
  required2: ImmutableEntities<string, number>;
};

type RequiredPlugin = ImmutablePlugin<RequiredEntities>;
type EmptyCapableEntities = {
  required: ImmutableEntities<string, string>;
  empty: ImmutableEntities<string, number>;
};

type EmptyCapablePlugin = ImmutablePlugin<EmptyCapableEntities>;

// Valid required plugin - all entity types present
const validRequiredPlugin: RequiredPlugin = {
  name: 'required-plugin',
  entities: {
    required1: { key: 'value' },
    required2: { key: 42 },
  },
} as const;
expectType<RequiredPlugin>(validRequiredPlugin);

// Invalid required plugin - missing required entity type
expectError(() => {
  const invalidPlugin: RequiredPlugin = {
    name: 'invalid-plugin',
    entities: {
      required1: { key: 'value' },
      // required2 missing - should cause error
    },
  };
  return invalidPlugin;
});

// Valid plugin where some entity types are empty but present
const validEmptyCapablePlugin: EmptyCapablePlugin = {
  name: 'empty-capable-plugin',
  entities: {
    required: { key: 'value' },
    empty: {},
  },
} as const;
expectType<EmptyCapablePlugin>(validEmptyCapablePlugin);

// Invalid plugin - missing required entity type even if intended empty
expectError<EmptyCapablePlugin>({
  name: 'invalid-empty-capable-plugin',
  entities: {
    required: { key: 'value' },
    // empty entity type missing
  },
});

// Readonly constraint enforcement
type ReadonlyTestPlugin = ImmutablePlugin<{
  assets: ImmutableEntities<string, { mutable: string }>;
}>;

declare const readonlyPlugin: ReadonlyTestPlugin;

// Plugin properties are readonly
expectError((readonlyPlugin.name = 'new-name'));
expectError((readonlyPlugin.entities = {} as any));

// Plugin entities are readonly
expectError((readonlyPlugin.entities.assets = {} as any));

// Inner entity values should be readonly through the type system
const assets = readonlyPlugin.entities.assets;
expectType<Readonly<Record<string, { mutable: string }>>>(assets);

// ImmutablePlugins readonly constraint
type TestPlugins = ImmutablePlugins<ReadonlyTestPlugin>;
declare const testPlugins: TestPlugins;

// Plugins record is readonly
expectType<Readonly<Record<string, ReadonlyTestPlugin>>>(testPlugins);
expectError((testPlugins['plugin-name'] = {} as any));

// Host readonly constraint enforcement
declare const testHost: ImmutableHost<ReadonlyTestPlugin>;

// Host properties are readonly
expectError(() => {
  testHost.plugins = {} as never;
});
expectError(() => {
  testHost.entities = {} as never;
});

// Entity collections are readonly (though individual methods may return mutable arrays)
expectError(() => {
  testHost.entities.assets = {} as never;
});

// Plain object container constraints (enforced at runtime, validated at type level)
type PlainObjectEntities = {
  valid: ImmutableEntities<string, string>;
};

// These would be caught by runtime guards, but type system allows them
type PlainObjectTestPlugin = ImmutablePlugin<PlainObjectEntities>;
declare const plainObjectTestPlugin: PlainObjectTestPlugin;
expectType<PlainObjectTestPlugin>(plainObjectTestPlugin);

// Constraint: Plugin must have entities property
expectError(() => {
  const invalidPlugin: ImmutablePlugin = {
    name: 'test',
    // entities property missing
  };
  return invalidPlugin;
});

// Constraint: Entities may be empty only when no entity types are declared
type NoEntities = {};
type NoEntitiesPlugin = ImmutablePlugin<NoEntities>;

const validEmptyPlugin: NoEntitiesPlugin = {
  name: 'empty-plugin',
  entities: {},
} as const;
expectType<NoEntitiesPlugin>(validEmptyPlugin);

// Invalid - missing entities property entirely
expectError<NoEntitiesPlugin>({
  name: 'invalid-empty-plugin',
  // entities property missing entirely
});

// Entity type presence constraints with symbol keys
type SymbolEntitiesConfig = {
  required: ImmutableEntities<string, string>;
  symbol: ImmutableEntities<symbol, number>;
};

type SymbolPlugin = ImmutablePlugin<SymbolEntitiesConfig>;

const validSymbolPlugin: SymbolPlugin = {
  name: 'symbol-plugin',
  entities: {
    required: { key: 'value' },
    symbol: {},
  },
} as const;
expectType<SymbolPlugin>(validSymbolPlugin);

// Host construction constraint - plugins must match their URN keys
type ConstraintTestPlugin = ImmutablePlugin<{
  test: ImmutableEntities<string, string>;
}>;

// This should work - plugin names match URN keys
const validPluginsRecord: ImmutablePlugins<ConstraintTestPlugin> = {
  'plugin-a': {
    name: 'plugin-a',
    entities: { test: { key: 'value' } },
  },
  'plugin-b': {
    name: 'plugin-b',
    entities: { test: { key: 'value' } },
  },
} as const;

expectType<ImmutableHost<ConstraintTestPlugin>>(
  new ImmutableHost(validPluginsRecord)
);

// Type-level constraint: generic parameters must be properly constrained
// (see numeric case above via generic-call trick); empty string keys resolve to never
type EmptyRemoved = ImmutableEntities<'', string>;
declare const emptyRemoved: EmptyRemoved;
expectType<Readonly<Record<never, string>>>(emptyRemoved);

// Host generic parameter constraint - must extend ImmutablePlugin
expectError({} as ImmutableHost<{ notAPlugin: true }>);
expectError({} as ImmutableHost<string>);
expectError({} as ImmutableHost<number>);

// Valid host with proper plugin constraint
type ValidHost = ImmutableHost<ImmutablePlugin>;
declare const validPlugins: ImmutablePlugins;
expectType<ValidHost>(new ImmutableHost(validPlugins));
