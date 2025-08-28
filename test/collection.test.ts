import { test } from 'tap';
import { ImmutableEntityCollection } from '../src/ImmutableEntityCollection.js';
import type { ImmutableEntitiesRecord } from '../src/types.js';
import type { PluginURN } from '../src/types.js';

test('ImmutableEntityCollection can be instantiated', (t) => {
  const collection = new ImmutableEntityCollection<string, string>({});
  t.ok(collection, 'collection can be created');
  t.end();
});

test('constructor with empty plugins', (t) => {
  const collection = new ImmutableEntityCollection<string, string>({});
  t.equal(
    collection.get('any').length,
    0,
    'empty collection returns empty array'
  );
  t.equal(collection.flat().length, 0, 'empty collection has no flat entries');
  t.end();
});

test('constructor with single plugin', (t) => {
  const pluginEntities: ImmutableEntitiesRecord<string, string> = {
    'plugin-a': {
      key1: 'value1',
      key2: 'value2',
    },
  };
  const collection = new ImmutableEntityCollection(pluginEntities);

  t.equal(collection.get('key1').length, 1, 'key1 has one entity');
  t.equal(collection.get('key1')[0], 'value1', 'key1 returns correct value');
  t.equal(collection.get('key2')[0], 'value2', 'key2 returns correct value');
  t.equal(
    collection.get('nonexistent').length,
    0,
    'nonexistent key returns empty array'
  );
  t.end();
});

test('constructor with multiple plugins and different value types', (t) => {
  const pluginEntities: ImmutableEntitiesRecord<string, number | string> = {
    'plugin-a': {
      shared: 42,
      'unique-a': 'text-value',
    },
    'plugin-b': {
      shared: 100,
      'unique-b': 'another-text',
    },
  };
  const collection = new ImmutableEntityCollection(pluginEntities);

  const shared = collection.get('shared');
  t.equal(shared.length, 2, 'shared key has two entities');
  t.ok(shared.includes(42), 'shared includes number value from plugin-a');
  t.ok(shared.includes(100), 'shared includes number value from plugin-b');

  t.equal(
    collection.get('unique-a')[0],
    'text-value',
    'unique-a returns correct string value'
  );
  t.equal(
    collection.get('unique-b')[0],
    'another-text',
    'unique-b returns correct string value'
  );
  t.end();
});

test('get method edge cases', (t) => {
  const pluginEntities: ImmutableEntitiesRecord<string, string> = {
    'plugin-a': {
      key1: 'value1',
    },
  };
  const collection = new ImmutableEntityCollection(pluginEntities);

  t.same(
    collection.get('key1'),
    ['value1'],
    'get returns array for existing key'
  );
  t.same(
    collection.get('nonexistent'),
    [],
    'get returns empty array for nonexistent key'
  );
  t.same(collection.get(''), [], 'get handles empty string key');
  t.end();
});

test('entries method', (t) => {
  const pluginEntities: ImmutableEntitiesRecord<string, string> = {
    'plugin-a': {
      key1: 'value1',
      key2: 'value2',
    },
    'plugin-b': {
      key1: 'value1-b',
    },
  };
  const collection = new ImmutableEntityCollection(pluginEntities);

  const entriesIterable = { [Symbol.iterator]: () => collection.entries() };
  const entries = Array.from(entriesIterable);
  t.equal(entries.length, 2, 'entries returns correct number of keys');

  const entriesMap = new Map(entries);
  t.ok(entriesMap.has('key1'), 'entries includes key1');
  t.ok(entriesMap.has('key2'), 'entries includes key2');

  const key1Values = entriesMap.get('key1')!;
  t.equal(key1Values.length, 2, 'key1 has two values');
  t.ok(key1Values.includes('value1'), 'key1 includes value from plugin-a');
  t.ok(key1Values.includes('value1-b'), 'key1 includes value from plugin-b');

  const key2Values = entriesMap.get('key2')!;
  t.equal(key2Values.length, 1, 'key2 has one value');
  t.equal(key2Values[0], 'value2', 'key2 has correct value');
  t.end();
});

test('entries method with empty collection', (t) => {
  const collection = new ImmutableEntityCollection<string, string>({});
  const entriesIterable = { [Symbol.iterator]: () => collection.entries() };
  const entries = Array.from(entriesIterable);
  t.equal(entries.length, 0, 'empty collection entries returns empty array');
  t.end();
});

test('flat method', (t) => {
  const pluginEntities: ImmutableEntitiesRecord<string, string> = {
    'plugin-a': {
      key1: 'value1',
      key2: 'value2',
    },
    'plugin-b': {
      key1: 'value1-b',
    },
  };
  const collection = new ImmutableEntityCollection(pluginEntities);

  const flat = collection.flat();
  t.equal(flat.length, 3, 'flat returns correct number of entities');

  const key1Entries = flat.filter(([, key]) => key === 'key1');
  t.equal(key1Entries.length, 2, 'key1 has two flat entries');

  const key1PluginA = key1Entries.find(([, , plugin]) => plugin === 'plugin-a');
  const key1PluginB = key1Entries.find(([, , plugin]) => plugin === 'plugin-b');
  t.ok(key1PluginA, 'key1 has entry from plugin-a');
  t.ok(key1PluginB, 'key1 has entry from plugin-b');
  t.equal(key1PluginA![0], 'value1', 'plugin-a entry has correct value');
  t.equal(key1PluginB![0], 'value1-b', 'plugin-b entry has correct value');

  const key2Entries = flat.filter(([, key]) => key === 'key2');
  t.equal(key2Entries.length, 1, 'key2 has one flat entry');
  t.equal(key2Entries[0][0], 'value2', 'key2 entry has correct value');
  t.equal(key2Entries[0][2], 'plugin-a', 'key2 entry has correct plugin');
  t.end();
});

test('flat method with empty collection', (t) => {
  const collection = new ImmutableEntityCollection<string, string>({});
  const flat = collection.flat();
  t.equal(flat.length, 0, 'empty collection flat returns empty array');
  t.end();
});

test('map method', (t) => {
  const pluginEntities: ImmutableEntitiesRecord<string, string> = {
    'plugin-a': {
      key1: 'value1',
      key2: 'value2',
    },
    'plugin-b': {
      key1: 'value1-b',
    },
  };
  const collection = new ImmutableEntityCollection(pluginEntities);

  const mapped = collection.map((entities, key) => `${key}:${entities.length}`);
  t.equal(mapped.length, 2, 'map returns correct number of results');
  t.ok(mapped.includes('key1:2'), 'map includes key1 with count 2');
  t.ok(mapped.includes('key2:1'), 'map includes key2 with count 1');
  t.end();
});

test('map method with transformation', (t) => {
  const pluginEntities: ImmutableEntitiesRecord<string, number> = {
    'plugin-a': {
      numbers: 1,
      letters: 2,
    },
  };
  const collection = new ImmutableEntityCollection(pluginEntities);

  const mapped = collection.map((entities, key) => ({
    key,
    total: entities.reduce((sum, val) => sum + val, 0),
  }));

  t.equal(mapped.length, 2, 'map returns correct number of results');
  const numbersResult = mapped.find((r) => r.key === 'numbers');
  const lettersResult = mapped.find((r) => r.key === 'letters');
  t.equal(numbersResult?.total, 1, 'numbers total is correct');
  t.equal(lettersResult?.total, 2, 'letters total is correct');
  t.end();
});

test('flatMap method', (t) => {
  const pluginEntities: ImmutableEntitiesRecord<string, string> = {
    'plugin-a': {
      key1: 'value1',
      key2: 'value2',
    },
    'plugin-b': {
      key1: 'value1-b',
    },
  };
  const collection = new ImmutableEntityCollection(pluginEntities);

  const flatMapped = collection.flatMap(
    (entity, key, plugin) => `${entity}@${key}#${plugin}`
  );

  t.equal(flatMapped.length, 3, 'flatMap returns correct number of results');
  t.ok(
    flatMapped.includes('value1@key1#plugin-a'),
    'includes plugin-a key1 entry'
  );
  t.ok(
    flatMapped.includes('value2@key2#plugin-a'),
    'includes plugin-a key2 entry'
  );
  t.ok(
    flatMapped.includes('value1-b@key1#plugin-b'),
    'includes plugin-b key1 entry'
  );
  t.end();
});

test('flatMap method with simple transformation', (t) => {
  const pluginEntities: ImmutableEntitiesRecord<string, string> = {
    'plugin-a': {
      key1: 'abc',
    },
  };
  const collection = new ImmutableEntityCollection(pluginEntities);

  const flatMapped = collection.flatMap(
    (entity, key, plugin) => `${entity}-${key}-${plugin}`
  );
  t.same(
    flatMapped,
    ['abc-key1-plugin-a'],
    'flatMap transforms each entity individually'
  );
  t.end();
});

test('Symbol.iterator method', (t) => {
  const pluginEntities: ImmutableEntitiesRecord<string, string> = {
    'plugin-a': {
      key1: 'value1',
      key2: 'value2',
    },
    'plugin-b': {
      key1: 'value1-b',
    },
  };
  const collection = new ImmutableEntityCollection(pluginEntities);

  const iterated = Array.from(collection);
  t.equal(iterated.length, 3, 'iterator returns correct number of items');

  const key1Items = iterated.filter(([, key]) => key === 'key1');
  t.equal(key1Items.length, 2, 'iterator includes both key1 entries');

  const pluginAKey1 = key1Items.find(([, , plugin]) => plugin === 'plugin-a');
  const pluginBKey1 = key1Items.find(([, , plugin]) => plugin === 'plugin-b');
  t.ok(pluginAKey1, 'iterator includes plugin-a key1');
  t.ok(pluginBKey1, 'iterator includes plugin-b key1');
  t.equal(pluginAKey1![0], 'value1', 'plugin-a key1 has correct value');
  t.equal(pluginBKey1![0], 'value1-b', 'plugin-b key1 has correct value');
  t.end();
});

test('Symbol.iterator with for...of loop', (t) => {
  const pluginEntities: ImmutableEntitiesRecord<string, string> = {
    'plugin-a': {
      key1: 'value1',
    },
  };
  const collection = new ImmutableEntityCollection(pluginEntities);

  const results: Array<[string, string, PluginURN]> = [];
  for (const item of collection) {
    results.push(item);
  }

  t.equal(results.length, 1, 'for...of loop processes correct number of items');
  t.same(
    results[0],
    ['value1', 'key1', 'plugin-a'],
    'for...of item has correct structure'
  );
  t.end();
});

test('plugin attribution consistency', (t) => {
  const pluginEntities: Record<string, Record<string, string>> = {
    'plugin-alpha': {
      shared: 'alpha-value',
      unique: 'alpha-unique',
    },
    'plugin-beta': {
      shared: 'beta-value',
    },
  };
  const collection = new ImmutableEntityCollection(pluginEntities);

  const flat = collection.flat();
  const sharedEntries = flat.filter(([, key]) => key === 'shared');

  t.equal(sharedEntries.length, 2, 'shared key has entries from both plugins');

  const alphaShared = sharedEntries.find(
    ([, , plugin]) => plugin === 'plugin-alpha'
  );
  const betaShared = sharedEntries.find(
    ([, , plugin]) => plugin === 'plugin-beta'
  );

  t.ok(alphaShared, 'shared key includes plugin-alpha entry');
  t.ok(betaShared, 'shared key includes plugin-beta entry');
  t.equal(
    alphaShared![0],
    'alpha-value',
    'plugin-alpha shared has correct value'
  );
  t.equal(betaShared![0], 'beta-value', 'plugin-beta shared has correct value');

  const uniqueEntries = flat.filter(([, key]) => key === 'unique');
  t.equal(uniqueEntries.length, 1, 'unique key has one entry');
  t.equal(
    uniqueEntries[0][2],
    'plugin-alpha',
    'unique entry has correct plugin attribution'
  );
  t.end();
});

test('type safety with different entity types', (t) => {
  interface TestEntity {
    id: number;
    name: string;
  }

  const pluginEntities: ImmutableEntitiesRecord<string, TestEntity> = {
    'plugin-objects': {
      entity1: { id: 1, name: 'first' },
      entity2: { id: 2, name: 'second' },
    },
  };
  const collection = new ImmutableEntityCollection(pluginEntities);

  const entities = collection.get('entity1');
  t.equal(entities.length, 1, 'object entity retrieved correctly');
  t.equal(entities[0].id, 1, 'object entity has correct id');
  t.equal(entities[0].name, 'first', 'object entity has correct name');

  const flat = collection.flat();
  t.equal(flat[0][0].id, 1, 'flat preserves object structure');
  t.end();
});

test('immutability of returned arrays', (t) => {
  const pluginEntities: ImmutableEntitiesRecord<string, string> = {
    'plugin-a': {
      key1: 'value1',
    },
  };
  const collection = new ImmutableEntityCollection(pluginEntities);

  const entities1 = collection.get('key1');
  const entities2 = collection.get('key1');

  entities1.push('modified');
  t.equal(
    entities2.length,
    1,
    'modifying returned array does not affect subsequent calls'
  );
  t.equal(
    collection.get('key1').length,
    1,
    'original collection is not modified'
  );
  t.end();
});

test('Symbol keys support', (t) => {
  const symKey1 = Symbol('command1');
  const symKey2 = Symbol('command2');
  const sharedSym = Symbol('shared');

  const pluginEntities: ImmutableEntitiesRecord<symbol, string | number> = {
    'plugin-a': {
      [symKey1]: 'command-a',
      [sharedSym]: 42,
    },
    'plugin-b': {
      [symKey2]: 'command-b',
      [sharedSym]: 100,
    },
  };
  const collection = new ImmutableEntityCollection(pluginEntities);

  t.equal(
    collection.get(symKey1)[0],
    'command-a',
    'symbol key1 returns correct value'
  );
  t.equal(
    collection.get(symKey2)[0],
    'command-b',
    'symbol key2 returns correct value'
  );

  const sharedValues = collection.get(sharedSym);
  t.equal(
    sharedValues.length,
    2,
    'shared symbol key has entities from both plugins'
  );
  t.ok(sharedValues.includes(42), 'shared symbol includes value from plugin-a');
  t.ok(
    sharedValues.includes(100),
    'shared symbol includes value from plugin-b'
  );

  const flat = collection.flat();
  t.equal(flat.length, 4, 'flat includes all symbol-keyed entities');

  const symEntries = flat.filter(([, key]) => typeof key === 'symbol');
  t.equal(symEntries.length, 4, 'all entries use symbol keys');

  t.end();
});

test('mixed key types (string and Symbol)', (t) => {
  const symKey = Symbol('special');

  const pluginEntities: Record<
    string,
    Record<string | symbol, boolean | number>
  > = {
    'plugin-mixed': {
      stringKey: true,
      [symKey]: 999,
    },
  };
  const collection = new ImmutableEntityCollection(pluginEntities);

  t.equal(
    collection.get('stringKey')[0],
    true,
    'string key returns boolean value'
  );
  t.equal(collection.get(symKey)[0], 999, 'symbol key returns number value');

  const flat = collection.flat();
  t.equal(
    flat.length,
    2,
    'flat includes both string and symbol keyed entities'
  );

  const stringEntry = flat.find(([, key]) => typeof key === 'string');
  const symbolEntry = flat.find(([, key]) => typeof key === 'symbol');

  t.ok(stringEntry, 'flat includes string key entry');
  t.ok(symbolEntry, 'flat includes symbol key entry');
  t.equal(stringEntry![0], true, 'string entry has correct value');
  t.equal(symbolEntry![0], 999, 'symbol entry has correct value');

  t.end();
});

test('large dataset performance', (t) => {
  const pluginEntities: Record<string, Record<string, number>> = {};

  // Create 10 plugins, each with 20 entities (one for each key-0 to key-19)
  for (let pluginNum = 0; pluginNum < 10; pluginNum++) {
    const pluginName = `plugin-${pluginNum}`;
    pluginEntities[pluginName] = {};

    for (let keyNum = 0; keyNum < 20; keyNum++) {
      const key = `key-${keyNum}`;
      pluginEntities[pluginName][key] = pluginNum * 100 + keyNum;
    }
  }

  const collection = new ImmutableEntityCollection(pluginEntities);

  const flat = collection.flat();
  t.equal(flat.length, 200, 'large dataset flat returns correct count'); // 10 plugins * 20 keys = 200

  const key0Entities = collection.get('key-0');
  t.equal(key0Entities.length, 10, 'shared key has entities from all plugins');

  const mapped = collection.map((entities) => entities.length);
  const totalMapped = mapped.reduce((sum, count) => sum + count, 0);
  t.equal(totalMapped, 200, 'map processes all entities correctly'); // 10 entities per key * 20 keys = 200

  t.end();
});

test('empty plugin entities', (t) => {
  const pluginEntities: ImmutableEntitiesRecord<string, string> = {
    'plugin-empty': {},
    'plugin-with-data': {
      key1: 'value1',
    },
  };
  const collection = new ImmutableEntityCollection(pluginEntities);

  t.equal(
    collection.get('key1').length,
    1,
    'non-empty plugin data is accessible'
  );
  t.equal(
    collection.flat().length,
    1,
    'empty plugin does not contribute entities'
  );

  const entriesIterable = { [Symbol.iterator]: () => collection.entries() };
  const entries = Array.from(entriesIterable);
  t.equal(entries.length, 1, 'empty plugin does not create entries');
  t.end();
});
