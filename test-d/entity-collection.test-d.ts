import { expectType } from 'tsd';
import type { PluginURN, ImmutableEntityKey } from '..';
import type { ImmutableEntityCollection } from '..';

// Test entity collection with various key and value types
type StringCollection = ImmutableEntityCollection<
  string,
  { name: string; value: number }
>;
type SymbolCollection = ImmutableEntityCollection<symbol, string[]>;
type MixedKeyCollection = ImmutableEntityCollection<string | symbol, unknown>;
type NumberValueCollection = ImmutableEntityCollection<string, number>;
type FunctionValueCollection = ImmutableEntityCollection<string, () => boolean>;

declare const stringCollection: StringCollection;
declare const symbolCollection: SymbolCollection;
declare const mixedKeyCollection: MixedKeyCollection;
declare const numberCollection: NumberValueCollection;
declare const functionCollection: FunctionValueCollection;

// get() method detailed tests
expectType<{ name: string; value: number }[]>(stringCollection.get('key1'));
expectType<{ name: string; value: number }[]>(
  stringCollection.get('nonExistent')
);
expectType<string[][]>(symbolCollection.get(Symbol('test')));
expectType<unknown[]>(mixedKeyCollection.get('stringKey'));
expectType<unknown[]>(mixedKeyCollection.get(Symbol('symbolKey')));
expectType<number[]>(numberCollection.get('numberKey'));
expectType<(() => boolean)[]>(functionCollection.get('functionKey'));

// get() always returns array, even for single values
expectType<{ name: string; value: number }[]>(
  stringCollection.get('singleValue')
);

// entries() iterator detailed tests
const stringEntries = stringCollection.entries();
expectType<IterableIterator<[string, { name: string; value: number }[]]>>(
  stringEntries
);

const symbolEntries = symbolCollection.entries();
expectType<IterableIterator<[symbol, string[][]]>>(symbolEntries);

const mixedEntries = mixedKeyCollection.entries();
expectType<IterableIterator<[string | symbol, unknown[]]>>(mixedEntries);

// entries() iterator protocol - manual iteration
const entriesIterator = stringCollection.entries();
let entriesResult = entriesIterator.next();
while (!entriesResult.done) {
  const [key, entities] = entriesResult.value;
  expectType<string>(key);
  expectType<{ name: string; value: number }[]>(entities);
  entriesResult = entriesIterator.next();
}

// flat() method detailed tests
const stringFlat = stringCollection.flat();
expectType<[{ name: string; value: number }, string, PluginURN][]>(stringFlat);

const symbolFlat = symbolCollection.flat();
expectType<[string[], symbol, PluginURN][]>(symbolFlat);

const mixedFlat = mixedKeyCollection.flat();
expectType<[unknown, string | symbol, PluginURN][]>(mixedFlat);

const numberFlat = numberCollection.flat();
expectType<[number, string, PluginURN][]>(numberFlat);

const functionFlat = functionCollection.flat();
expectType<[() => boolean, string, PluginURN][]>(functionFlat);

// flat() tuple destructuring
const [[entity, key, pluginURN], ...rest] = stringCollection.flat();
if (entity && key && pluginURN) {
  expectType<{ name: string; value: number }>(entity);
  expectType<string>(key);
  expectType<PluginURN>(pluginURN);
}

// map() method detailed tests
const stringMapper = (
  entities: { name: string; value: number }[],
  key: string
) => ({
  key,
  count: entities.length,
});
const stringMapped = stringCollection.map(stringMapper);
expectType<{ key: string; count: number }[]>(stringMapped);

const symbolMapper = (entities: string[][], key: symbol) => key.toString();
const symbolMapped = symbolCollection.map(symbolMapper);
expectType<string[]>(symbolMapped);

const numberMapper = (entities: number[], key: string) =>
  entities.reduce((a, b) => a + b, 0);
const numberMapped = numberCollection.map(numberMapper);
expectType<number[]>(numberMapped);

// map() with various return types
expectType<boolean[]>(stringCollection.map(() => true));
expectType<string[]>(symbolCollection.map(() => 'test'));
expectType<undefined[]>(mixedKeyCollection.map(() => undefined));

// map() callback parameter types
stringCollection.map((entities, key) => {
  expectType<{ name: string; value: number }[]>(entities);
  expectType<string>(key);
  return 'result';
});

symbolCollection.map((entities, key) => {
  expectType<string[][]>(entities);
  expectType<symbol>(key);
  return 42;
});

// flatMap() method detailed tests
const stringFlatMapper = (
  entity: { name: string; value: number },
  key: string,
  plugin: PluginURN
) => `${plugin}:${key}:${entity.name}`;
const stringFlatMapped = stringCollection.flatMap(stringFlatMapper);
expectType<string[]>(stringFlatMapped);

const symbolFlatMapper = (
  entity: string[],
  key: symbol,
  plugin: PluginURN
) => ({
  plugin,
  key: key.toString(),
  count: entity.length,
});
const symbolFlatMapped = symbolCollection.flatMap(symbolFlatMapper);
expectType<{ plugin: PluginURN; key: string; count: number }[]>(
  symbolFlatMapped
);

const numberFlatMapper = (entity: number, key: string, plugin: PluginURN) =>
  entity * 2;
const numberFlatMapped = numberCollection.flatMap(numberFlatMapper);
expectType<number[]>(numberFlatMapped);

// flatMap() with various return types
expectType<boolean[]>(stringCollection.flatMap(() => true));
expectType<string[]>(numberCollection.flatMap(() => 'converted'));
expectType<{ result: null }[]>(
  mixedKeyCollection.flatMap(() => ({ result: null }))
);

// flatMap() callback parameter types
stringCollection.flatMap((entity, key, plugin) => {
  expectType<{ name: string; value: number }>(entity);
  expectType<string>(key);
  expectType<PluginURN>(plugin);
  return entity.name;
});

symbolCollection.flatMap((entity, key, plugin) => {
  expectType<string[]>(entity);
  expectType<symbol>(key);
  expectType<PluginURN>(plugin);
  return entity.length;
});

functionCollection.flatMap((entity, key, plugin) => {
  expectType<() => boolean>(entity);
  expectType<string>(key);
  expectType<PluginURN>(plugin);
  return entity();
});

// Symbol.iterator detailed tests
const stringIterator = stringCollection[Symbol.iterator]();
expectType<Iterator<[{ name: string; value: number }, string, PluginURN]>>(
  stringIterator
);

const symbolIterator = symbolCollection[Symbol.iterator]();
expectType<Iterator<[string[], symbol, PluginURN]>>(symbolIterator);

const mixedIterator = mixedKeyCollection[Symbol.iterator]();
expectType<Iterator<[unknown, string | symbol, PluginURN]>>(mixedIterator);

// Iterator protocol in for-of loops
for (const [entity, key, plugin] of stringCollection) {
  expectType<{ name: string; value: number }>(entity);
  expectType<string>(key);
  expectType<PluginURN>(plugin);
}

for (const [entity, key, plugin] of symbolCollection) {
  expectType<string[]>(entity);
  expectType<symbol>(key);
  expectType<PluginURN>(plugin);
}

for (const [entity, key, plugin] of numberCollection) {
  expectType<number>(entity);
  expectType<string>(key);
  expectType<PluginURN>(plugin);
}

// Iterator destructuring
const [firstItem] = stringCollection;
if (firstItem) {
  const [entity, key, plugin] = firstItem;
  expectType<{ name: string; value: number }>(entity);
  expectType<string>(key);
  expectType<PluginURN>(plugin);
}

// Array spread from iterator
const allItems = [...stringCollection];
expectType<[{ name: string; value: number }, string, PluginURN][]>(allItems);

// Complex nested entity types
type ComplexEntity = {
  metadata: {
    id: string;
    tags: string[];
  };
  data: {
    values: number[];
    computed?: boolean;
  };
};

type ComplexCollection = ImmutableEntityCollection<string, ComplexEntity>;
declare const complexCollection: ComplexCollection;

// Complex type preservation through methods
expectType<ComplexEntity[]>(complexCollection.get('complexKey'));

const complexFlat = complexCollection.flat();
expectType<[ComplexEntity, string, PluginURN][]>(complexFlat);

const complexMapped = complexCollection.map((entities, key) => ({
  key,
  totalValues: entities.reduce((sum, e) => sum + e.data.values.length, 0),
}));
expectType<{ key: string; totalValues: number }[]>(complexMapped);

const complexFlatMapped = complexCollection.flatMap((entity, key, plugin) => ({
  plugin,
  key,
  id: entity.metadata.id,
  valueCount: entity.data.values.length,
}));
expectType<
  { plugin: PluginURN; key: string; id: string; valueCount: number }[]
>(complexFlatMapped);

// Generic constraint validation
type ValidKeyCollection = ImmutableEntityCollection<'key1' | 'key2', string>;
declare const validKeyCollection: ValidKeyCollection;
expectType<string[]>(validKeyCollection.get('key1'));
expectType<string[]>(validKeyCollection.get('key2'));

// Symbol key constraint validation
type SymbolKeyCollection = ImmutableEntityCollection<symbol, { value: string }>;
declare const symbolKeyCollection: SymbolKeyCollection;
expectType<{ value: string }[]>(symbolKeyCollection.get(Symbol('test')));

// Mixed key constraint validation
type MixedConstraintCollection = ImmutableEntityCollection<
  'stringKey' | symbol,
  boolean
>;
declare const mixedConstraintCollection: MixedConstraintCollection;
expectType<boolean[]>(mixedConstraintCollection.get('stringKey'));
expectType<boolean[]>(mixedConstraintCollection.get(Symbol('symbolKey')));
