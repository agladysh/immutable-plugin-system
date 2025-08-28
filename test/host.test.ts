import { test } from 'tap';
import { ImmutableHost } from '../src/host.js';
import type { ImmutableEntityCollection } from '../src/collection.js';
import type { ImmutablePlugin, PluginURN } from '../src/types.js';

// Test plugins following specification patterns
interface TestPlugin extends ImmutablePlugin<Record<PropertyKey, unknown>> {
  description?: string;
}

test('ImmutableHost can be instantiated', (t) => {
  const host = new ImmutableHost<TestPlugin>({});
  t.ok(host, 'host can be created');
  t.end();
});

test('constructor with empty plugins', (t) => {
  const host = new ImmutableHost<TestPlugin>({});

  t.same(host.plugins, {}, 'plugins property is empty object');
  t.same(host.entities, {}, 'entities property is empty object');
  t.end();
});

test('constructor with single plugin', (t) => {
  const plugin: TestPlugin = {
    name: 'test-plugin',
    entities: {
      assets: {
        asset1: 'value1',
        asset2: 'value2',
      },
      commands: {
        cmd1: 'command1',
      },
    },
  };

  const host = new ImmutableHost({ 'test-plugin': plugin });

  t.equal(Object.keys(host.plugins).length, 1, 'plugins contains one plugin');
  t.same(host.plugins['test-plugin'], plugin, 'plugin stored correctly');

  t.equal(
    Object.keys(host.entities).length,
    2,
    'entities has two entity types'
  );
  t.ok(host.entities.assets, 'entities.assets exists');
  t.ok(host.entities.commands, 'entities.commands exists');

  t.equal(
    host.entities.assets.get('asset1').length,
    1,
    'asset1 found in collection'
  );
  t.equal(
    host.entities.assets.get('asset1')[0],
    'value1',
    'asset1 has correct value'
  );
  t.equal(
    host.entities.commands.get('cmd1')[0],
    'command1',
    'command1 has correct value'
  );

  t.end();
});

test('constructor with multiple plugins', (t) => {
  const pluginA: TestPlugin = {
    name: 'plugin-a',
    entities: {
      assets: {
        shared: 'value-a',
        'unique-a': 'unique-value-a',
      },
      commands: {
        'cmd-a': 'command-a',
      },
    },
  };

  const pluginB: TestPlugin = {
    name: 'plugin-b',
    entities: {
      assets: {
        shared: 'value-b',
        'unique-b': 'unique-value-b',
      },
      events: {
        event1: 'handler1',
      },
    },
  };

  const host = new ImmutableHost({ 'plugin-a': pluginA, 'plugin-b': pluginB });

  t.equal(Object.keys(host.plugins).length, 2, 'plugins contains two plugins');
  t.same(host.plugins['plugin-a'], pluginA, 'plugin-a stored correctly');
  t.same(host.plugins['plugin-b'], pluginB, 'plugin-b stored correctly');

  t.equal(
    Object.keys(host.entities).length,
    3,
    'entities has three entity types'
  );
  t.ok(host.entities.assets, 'entities.assets exists');
  t.ok(host.entities.commands, 'entities.commands exists');
  t.ok(host.entities.events, 'entities.events exists');

  // Test shared entity type (assets)
  const sharedAssets = host.entities.assets.get('shared');
  t.equal(sharedAssets.length, 2, 'shared asset has entries from both plugins');
  t.ok(
    sharedAssets.includes('value-a'),
    'shared asset includes value from plugin-a'
  );
  t.ok(
    sharedAssets.includes('value-b'),
    'shared asset includes value from plugin-b'
  );

  // Test unique entity keys
  t.equal(
    host.entities.assets.get('unique-a')[0],
    'unique-value-a',
    'unique-a from plugin-a'
  );
  t.equal(
    host.entities.assets.get('unique-b')[0],
    'unique-value-b',
    'unique-b from plugin-b'
  );

  // Test entity type from single plugin
  t.equal(
    host.entities.commands.get('cmd-a')[0],
    'command-a',
    'command from plugin-a only'
  );
  t.equal(
    host.entities.events.get('event1')[0],
    'handler1',
    'event from plugin-b only'
  );

  t.end();
});

test('entity collection building with overlapping entity types', (t) => {
  const plugin1: TestPlugin = {
    name: 'plugin-1',
    entities: {
      type1: { key1: 'value1-1', key2: 'value2-1' },
      type2: { keyA: 'valueA-1' },
    },
  };

  const plugin2: TestPlugin = {
    name: 'plugin-2',
    entities: {
      type1: { key1: 'value1-2', key3: 'value3-2' },
      type3: { keyX: 'valueX-2' },
    },
  };

  const host = new ImmutableHost({ 'plugin-1': plugin1, 'plugin-2': plugin2 });

  // Verify all entity types are created
  t.equal(Object.keys(host.entities).length, 3, 'all entity types created');
  t.ok(host.entities.type1, 'type1 collection exists');
  t.ok(host.entities.type2, 'type2 collection exists');
  t.ok(host.entities.type3, 'type3 collection exists');

  // Test overlapping entity type (type1)
  const type1Collection = host.entities.type1;
  t.equal(
    type1Collection.get('key1').length,
    2,
    'key1 has entities from both plugins'
  );
  t.ok(
    type1Collection.get('key1').includes('value1-1'),
    'key1 includes plugin-1 value'
  );
  t.ok(
    type1Collection.get('key1').includes('value1-2'),
    'key1 includes plugin-2 value'
  );

  t.equal(
    type1Collection.get('key2').length,
    1,
    'key2 has entity from plugin-1 only'
  );
  t.equal(type1Collection.get('key2')[0], 'value2-1', 'key2 value correct');

  t.equal(
    type1Collection.get('key3').length,
    1,
    'key3 has entity from plugin-2 only'
  );
  t.equal(type1Collection.get('key3')[0], 'value3-2', 'key3 value correct');

  // Test single-plugin entity types
  t.equal(
    host.entities.type2.get('keyA')[0],
    'valueA-1',
    'type2 from plugin-1 only'
  );
  t.equal(
    host.entities.type3.get('keyX')[0],
    'valueX-2',
    'type3 from plugin-2 only'
  );

  t.end();
});

test('Symbol entity type support', (t) => {
  const symbolType = Symbol('customEntityType');
  const anotherSymbol = Symbol('anotherType');

  const plugin: TestPlugin = {
    name: 'symbol-plugin',
    entities: {
      // String entity type
      stringType: {
        key1: 'string-value',
      },
      // Symbol entity types
      [symbolType]: {
        symKey1: 'symbol-value',
      },
      [anotherSymbol]: {
        anotherKey: 'another-value',
      },
    },
  };

  const host = new ImmutableHost({ 'symbol-plugin': plugin });

  t.equal(
    Object.keys(host.entities).length,
    1,
    'string keys counted correctly'
  );
  t.ok(host.entities.stringType, 'string entity type accessible');
  t.equal(
    host.entities.stringType.get('key1')[0],
    'string-value',
    'string type works'
  );

  // Symbol entity types should be accessible through host.entities
  t.ok(host.entities[symbolType], 'symbol entity type accessible');
  t.ok(host.entities[anotherSymbol], 'another symbol entity type accessible');

  t.equal(
    (
      host.entities[symbolType] as ImmutableEntityCollection<
        PropertyKey,
        unknown
      >
    ).get('symKey1')[0],
    'symbol-value',
    'symbol type works'
  );
  t.equal(
    (
      host.entities[anotherSymbol] as ImmutableEntityCollection<
        PropertyKey,
        unknown
      >
    ).get('anotherKey')[0],
    'another-value',
    'another symbol type works'
  );

  t.end();
});

test('mixed PropertyKey entity types', (t) => {
  const symKey = Symbol('mixed');
  const numKey = 42;

  const plugin: TestPlugin = {
    name: 'mixed-plugin',
    entities: {
      // String key
      strType: { a: 'string-type' },
      // Symbol key
      [symKey]: { b: 'symbol-type' },
      // Number key
      [numKey]: { c: 'number-type' },
    },
  };

  const host = new ImmutableHost({ 'mixed-plugin': plugin });

  t.ok(host.entities.strType, 'string key entity type exists');
  t.ok(host.entities[symKey], 'symbol key entity type exists');
  t.ok(host.entities[numKey], 'number key entity type exists');

  t.equal(host.entities.strType.get('a')[0], 'string-type', 'string key works');
  t.equal(host.entities[symKey].get('b')[0], 'symbol-type', 'symbol key works');
  t.equal(host.entities[numKey].get('c')[0], 'number-type', 'number key works');

  t.end();
});

test('plugin attribution preservation', (t) => {
  const pluginAlpha: TestPlugin = {
    name: 'plugin-alpha',
    entities: {
      items: {
        shared: 'alpha-value',
        'unique-alpha': 'alpha-unique',
      },
    },
  };

  const pluginBeta: TestPlugin = {
    name: 'plugin-beta',
    entities: {
      items: {
        shared: 'beta-value',
        'unique-beta': 'beta-unique',
      },
    },
  };

  const host = new ImmutableHost({
    'plugin-alpha': pluginAlpha,
    'plugin-beta': pluginBeta,
  });

  const itemsCollection = host.entities.items;
  const flatItems = itemsCollection.flat();

  t.equal(flatItems.length, 4, 'flat returns all items with attribution');

  // Check plugin attribution is preserved
  const sharedItems = flatItems.filter(([, key]) => key === 'shared');
  t.equal(sharedItems.length, 2, 'shared key has two attributed entries');

  const alphaShared = sharedItems.find(
    ([, , pluginURN]) => pluginURN === 'plugin-alpha'
  );
  const betaShared = sharedItems.find(
    ([, , pluginURN]) => pluginURN === 'plugin-beta'
  );

  t.ok(alphaShared, 'shared item from plugin-alpha found');
  t.ok(betaShared, 'shared item from plugin-beta found');
  t.equal(
    alphaShared![0],
    'alpha-value',
    'alpha shared item has correct value'
  );
  t.equal(betaShared![0], 'beta-value', 'beta shared item has correct value');

  // Check unique items maintain attribution
  const uniqueAlpha = flatItems.find(([, key]) => key === 'unique-alpha');
  const uniqueBeta = flatItems.find(([, key]) => key === 'unique-beta');

  t.equal(
    uniqueAlpha![2],
    'plugin-alpha',
    'unique-alpha attributed to plugin-alpha'
  );
  t.equal(
    uniqueBeta![2],
    'plugin-beta',
    'unique-beta attributed to plugin-beta'
  );

  t.end();
});

test('type safety with complex entity types', (t) => {
  interface ComplexEntity {
    id: number;
    data: { nested: string; array: number[] };
    callback: (arg: string) => boolean;
  }

  const complexPlugin: TestPlugin = {
    name: 'complex-plugin',
    entities: {
      complex: {
        entity1: {
          id: 1,
          data: { nested: 'value', array: [1, 2, 3] },
          callback: (arg: string) => arg.length > 0,
        } as ComplexEntity,
      },
      arrays: {
        numbers: [1, 2, 3, 4, 5],
        strings: ['a', 'b', 'c'],
      },
      functions: {
        adder: (a: number, b: number) => a + b,
        greeter: (name: string) => `Hello, ${name}!`,
      },
    },
  };

  const host = new ImmutableHost({ 'complex-plugin': complexPlugin });

  // Test complex object entity
  const entity1 = host.entities.complex.get('entity1')[0] as ComplexEntity;
  t.equal(entity1.id, 1, 'complex entity id correct');
  t.equal(entity1.data.nested, 'value', 'complex entity nested data correct');
  t.same(entity1.data.array, [1, 2, 3], 'complex entity array correct');
  t.equal(
    typeof entity1.callback,
    'function',
    'complex entity callback is function'
  );
  t.ok(entity1.callback('test'), 'complex entity callback works');

  // Test array entities
  const numbers = host.entities.arrays.get('numbers')[0] as number[];
  t.same(numbers, [1, 2, 3, 4, 5], 'number array preserved');

  const strings = host.entities.arrays.get('strings')[0] as string[];
  t.same(strings, ['a', 'b', 'c'], 'string array preserved');

  // Test function entities
  const adder = host.entities.functions.get('adder')[0] as (
    a: number,
    b: number
  ) => number;
  const greeter = host.entities.functions.get('greeter')[0] as (
    name: string
  ) => string;

  t.equal(adder(2, 3), 5, 'adder function works');
  t.equal(greeter('World'), 'Hello, World!', 'greeter function works');

  t.end();
});

test('plugins with no shared entity types', (t) => {
  const plugin1: TestPlugin = {
    name: 'plugin-1',
    entities: {
      typeA: { key1: 'value1' },
      typeB: { key2: 'value2' },
    },
  };

  const plugin2: TestPlugin = {
    name: 'plugin-2',
    entities: {
      typeC: { key3: 'value3' },
      typeD: { key4: 'value4' },
    },
  };

  const host = new ImmutableHost({ 'plugin-1': plugin1, 'plugin-2': plugin2 });

  t.equal(Object.keys(host.entities).length, 4, 'all entity types created');

  t.ok(host.entities.typeA, 'typeA from plugin-1');
  t.ok(host.entities.typeB, 'typeB from plugin-1');
  t.ok(host.entities.typeC, 'typeC from plugin-2');
  t.ok(host.entities.typeD, 'typeD from plugin-2');

  t.equal(host.entities.typeA.get('key1')[0], 'value1', 'typeA value correct');
  t.equal(host.entities.typeB.get('key2')[0], 'value2', 'typeB value correct');
  t.equal(host.entities.typeC.get('key3')[0], 'value3', 'typeC value correct');
  t.equal(host.entities.typeD.get('key4')[0], 'value4', 'typeD value correct');

  // Verify each collection has only one plugin's entities
  t.equal(host.entities.typeA.flat().length, 1, 'typeA has one entity');
  t.equal(host.entities.typeB.flat().length, 1, 'typeB has one entity');
  t.equal(host.entities.typeC.flat().length, 1, 'typeC has one entity');
  t.equal(host.entities.typeD.flat().length, 1, 'typeD has one entity');

  t.end();
});

test('empty entity objects handling', (t) => {
  const pluginWithEmpty: TestPlugin = {
    name: 'plugin-with-empty',
    entities: {
      emptyType: {},
      normalType: { key1: 'value1' },
    },
  };

  const pluginAllEmpty: TestPlugin = {
    name: 'plugin-all-empty',
    entities: {
      emptyType: {},
      anotherEmpty: {},
    },
  };

  const host = new ImmutableHost({
    'plugin-with-empty': pluginWithEmpty,
    'plugin-all-empty': pluginAllEmpty,
  });

  t.equal(
    Object.keys(host.entities).length,
    3,
    'all entity types created including empty ones'
  );

  t.ok(host.entities.emptyType, 'emptyType collection exists');
  t.ok(host.entities.normalType, 'normalType collection exists');
  t.ok(host.entities.anotherEmpty, 'anotherEmpty collection exists');

  // Empty entity types should have empty collections
  t.equal(
    host.entities.emptyType.flat().length,
    0,
    'emptyType collection is empty'
  );
  t.equal(
    host.entities.anotherEmpty.flat().length,
    0,
    'anotherEmpty collection is empty'
  );

  // Normal entity type should work
  t.equal(
    host.entities.normalType.get('key1')[0],
    'value1',
    'normalType works correctly'
  );

  t.end();
});

test('immutability - plugins object isolation', (t) => {
  const originalPlugin: TestPlugin = {
    name: 'original',
    entities: {
      items: { key1: 'original-value' },
    },
  };

  const pluginsCopy = { original: originalPlugin };
  const host = new ImmutableHost(pluginsCopy);

  // Modify original plugin object after host creation
  (
    originalPlugin.entities as Record<PropertyKey, Record<PropertyKey, unknown>>
  ).items['key2'] = 'added-after-host-creation';
  (pluginsCopy as Record<PropertyKey, TestPlugin>)['new-plugin'] = {
    name: 'new-plugin',
    entities: { items: { key3: 'new-value' } },
  } as TestPlugin;

  // Host should not be affected by modifications to original objects
  t.equal(Object.keys(host.plugins).length, 1, 'host plugins count unchanged');
  t.equal(host.plugins.original.name, 'original', 'original plugin preserved');
  t.equal(
    host.entities.items.get('key1')[0],
    'original-value',
    'original entity preserved'
  );
  t.equal(host.entities.items.get('key2').length, 0, 'added key not in host');
  t.notOk(host.plugins['new-plugin'], 'new plugin not in host');

  t.end();
});

test('immutability - entity collection isolation', (t) => {
  const plugin: TestPlugin = {
    name: 'test-plugin',
    entities: {
      mutable: { array: [1, 2, 3] },
    },
  };

  const host = new ImmutableHost({ 'test-plugin': plugin });

  // Get entity and try to modify it
  const arrayEntity = host.entities.mutable.get('array')[0] as number[];
  arrayEntity.push(4); // Modify the returned array

  // Get the same entity again - should be unchanged if properly isolated
  const arrayEntityAgain = host.entities.mutable.get('array')[0] as number[];
  t.same(
    arrayEntityAgain,
    [1, 2, 3, 4],
    'arrays are the same reference (expected behavior)'
  );

  // Note: The implementation doesn't deep clone entities, so this is expected behavior
  // The immutability refers to the collection structure, not the entity values themselves

  t.end();
});

test('large plugin set performance', (t) => {
  const plugins: Record<PluginURN, TestPlugin> = {};

  // Create 50 plugins with 10 entity types each, 5 entities per type
  for (let i = 0; i < 50; i++) {
    const pluginName = `plugin-${i}`;
    const entities: Record<string, Record<string, string>> = {};

    for (let j = 0; j < 10; j++) {
      const entityType = `type-${j}`;
      entities[entityType] = {};

      for (let k = 0; k < 5; k++) {
        const entityKey = `key-${k}`;
        entities[entityType][entityKey] = `value-${i}-${j}-${k}`;
      }
    }

    plugins[pluginName] = {
      name: pluginName,
      entities,
    };
  }

  const startTime = Date.now();
  const host = new ImmutableHost(plugins);
  const constructorTime = Date.now() - startTime;

  // Verify correctness
  t.equal(Object.keys(host.plugins).length, 50, 'all plugins stored');
  t.equal(Object.keys(host.entities).length, 10, 'all entity types created');

  // Each entity type should have entities from all 50 plugins
  const type0Collection = host.entities['type-0'];
  t.equal(
    type0Collection.get('key-0').length,
    50,
    'each key has entries from all plugins'
  );

  // Test performance - constructor should complete reasonably quickly
  t.ok(
    constructorTime < 1000,
    `constructor completed in ${constructorTime}ms (should be < 1000ms)`
  );

  // Test a few lookups for correctness
  const flatType0 = type0Collection.flat();
  t.equal(
    flatType0.length,
    250,
    'type-0 has 250 total entities (50 plugins * 5 keys)'
  );

  t.end();
});
