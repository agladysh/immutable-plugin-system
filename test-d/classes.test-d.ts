import { expectType, expectError } from 'tsd';
import type {
  ImmutableEntitiesRecord,
  ImmutablePlugin,
  ImmutablePlugins,
  ImmutableEntityKey,
  PluginURN,
} from '..';
import { ImmutableEntityCollection, ImmutableHost } from '..';

// ImmutableEntityCollection class tests
type TestEntityCollection = ImmutableEntityCollection<
  string,
  { value: number }
>;
type SymbolEntityCollection = ImmutableEntityCollection<symbol, string>;
type MixedKeyEntityCollection = ImmutableEntityCollection<
  string | symbol,
  unknown
>;

declare const testCollection: TestEntityCollection;
declare const symbolCollection: SymbolEntityCollection;
declare const mixedCollection: MixedKeyEntityCollection;

// Constructor parameter validation
declare const pluginEntities: Record<
  PluginURN,
  Record<string, { value: number }>
>;
declare const symbolPluginEntities: Record<PluginURN, Record<symbol, string>>;

expectType<ImmutableEntityCollection<string, { value: number }>>(
  new ImmutableEntityCollection(pluginEntities)
);
expectType<ImmutableEntityCollection<symbol, string>>(
  new ImmutableEntityCollection(symbolPluginEntities)
);

// get() method tests
expectType<{ value: number }[]>(testCollection.get('someKey'));
expectType<string[]>(symbolCollection.get(Symbol('test')));
expectType<unknown[]>(mixedCollection.get('stringKey'));
expectType<unknown[]>(mixedCollection.get(Symbol('symbolKey')));

// get() return type is always array
expectType<{ value: number }[]>(testCollection.get('nonExistentKey'));

// entries() method tests
expectType<IterableIterator<[string, { value: number }[]]>>(
  testCollection.entries()
);
expectType<IterableIterator<[symbol, string[]]>>(symbolCollection.entries());
expectType<IterableIterator<[string | symbol, unknown[]]>>(
  mixedCollection.entries()
);

// flat() method tests
expectType<[{ value: number }, string, PluginURN][]>(testCollection.flat());
expectType<[string, symbol, PluginURN][]>(symbolCollection.flat());
expectType<[unknown, string | symbol, PluginURN][]>(mixedCollection.flat());

// map() method tests
declare const mapperFn: (entities: { value: number }[], key: string) => string;
declare const symbolMapperFn: (entities: string[], key: symbol) => boolean;

expectType<string[]>(testCollection.map(mapperFn));
expectType<boolean[]>(symbolCollection.map(symbolMapperFn));

// map() with generic return type
expectType<number[]>(testCollection.map(() => 123));
expectType<{ readonly result: true }[]>(
  symbolCollection.map(() => ({ result: true }) as const)
);

// flatMap() method tests
declare const flatMapperFn: (
  entity: { value: number },
  key: string,
  plugin: PluginURN
) => string;
declare const symbolFlatMapperFn: (
  entity: string,
  key: symbol,
  plugin: PluginURN
) => number;

expectType<string[]>(testCollection.flatMap(flatMapperFn));
expectType<number[]>(symbolCollection.flatMap(symbolFlatMapperFn));

// flatMap() with generic return type
expectType<boolean[]>(testCollection.flatMap(() => true));
expectType<true[]>(mixedCollection.flatMap(() => true as const));

// Symbol.iterator tests
expectType<Iterator<[{ value: number }, string, PluginURN]>>(
  testCollection[Symbol.iterator]()
);
expectType<Iterator<[string, symbol, PluginURN]>>(
  symbolCollection[Symbol.iterator]()
);
expectType<Iterator<[unknown, string | symbol, PluginURN]>>(
  mixedCollection[Symbol.iterator]()
);

// Iterator protocol compliance
for (const [entity, key, pluginURN] of testCollection) {
  expectType<{ value: number }>(entity);
  expectType<string>(key);
  expectType<PluginURN>(pluginURN);
}

for (const [entity, key, pluginURN] of symbolCollection) {
  expectType<string>(entity);
  expectType<symbol>(key);
  expectType<PluginURN>(pluginURN);
}

// ImmutableHost class tests
type TestEntities = {
  assets: Record<string, string>;
  commands: Record<string, () => void>;
  optional?: Record<string, number>;
};

type TestPlugin = ImmutablePlugin<TestEntities>;
type TestPlugins = ImmutablePlugins<TestPlugin>;

declare const testPlugins: TestPlugins;
declare const testHost: ImmutableHost<TestPlugin>;

// Constructor without options
expectType<ImmutableHost<TestPlugin>>(new ImmutableHost(testPlugins));

// Constructor with options
expectType<ImmutableHost<TestPlugin>>(
  new ImmutableHost(testPlugins, { requiredEntityTypes: ['assets'] })
);
expectType<ImmutableHost<TestPlugin>>(
  new ImmutableHost(testPlugins, {
    requiredEntityTypes: ['assets', 'commands'],
  })
);
expectType<ImmutableHost<TestPlugin>>(new ImmutableHost(testPlugins, {}));

// plugins property tests
expectType<ImmutablePlugins<TestPlugin>>(testHost.plugins);
expectType<TestPlugin>(testHost.plugins['somePluginURN']);

// entities property tests - should derive collections from plugin type
expectType<ImmutableEntityCollection<string, string>>(testHost.entities.assets);
expectType<ImmutableEntityCollection<string, () => void>>(
  testHost.entities.commands
);

// Optional entity type handling - skip for type test as it may not exist

// Host requires plugins parameter
expectType<ImmutableHost<TestPlugin>>(testHost);

// Default plugin type behavior
type DefaultHost = ImmutableHost<ImmutablePlugin<ImmutableEntitiesRecord>>;
declare const defaultPlugins: ImmutablePlugins<
  ImmutablePlugin<ImmutableEntitiesRecord>
>;
expectType<DefaultHost>(new ImmutableHost(defaultPlugins));

// Complex plugin type with multiple entity types
type ComplexEntities = {
  type1: Record<string, { prop1: string; prop2: number }>;
  type2: Record<symbol, string[]>;
  type3: Record<string | symbol, {}>;
};

type ComplexPlugin = ImmutablePlugin<ComplexEntities>;
declare const complexPlugins: ImmutablePlugins<ComplexPlugin>;
declare const complexHost: ImmutableHost<ComplexPlugin>;

expectType<ImmutableHost<ComplexPlugin>>(new ImmutableHost(complexPlugins));

// Entity collections should preserve complex types
expectType<ImmutableEntityCollection<string, { prop1: string; prop2: number }>>(
  complexHost.entities.type1
);
expectType<ImmutableEntityCollection<symbol, string[]>>(
  complexHost.entities.type2
);
expectType<ImmutableEntityCollection<string | symbol, {}>>(
  complexHost.entities.type3
);

// Host properties are readonly
expectError((testHost.plugins = {}));
expectError((testHost.entities = {} as any));

// Constructor options parameter typing
declare const validRequiredTypes: readonly (keyof TestEntities)[];
declare const validRequiredTypesConst: readonly ['assets', 'commands'];

expectType<ImmutableHost<TestPlugin>>(
  new ImmutableHost(testPlugins, { requiredEntityTypes: validRequiredTypes })
);
expectType<ImmutableHost<TestPlugin>>(
  new ImmutableHost(testPlugins, {
    requiredEntityTypes: validRequiredTypesConst,
  })
);

// Symbol keys in required entity types
// Symbol keys not applicable for TestEntities

// Empty required entity types
expectType<ImmutableHost<TestPlugin>>(
  new ImmutableHost(testPlugins, { requiredEntityTypes: [] })
);
