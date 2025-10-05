import { test } from 'tap';
import {
  isPlainObject,
  assertPlainObject,
} from '../src/guards/plain-object.js';
import {
  isEntityRecord,
  assertEntityRecord,
} from '../src/guards/entity-record.js';
import {
  isEntitiesRecord,
  assertEntitiesRecord,
} from '../src/guards/entities-record.js';
import {
  isImmutablePlugin,
  assertImmutablePlugin,
} from '../src/guards/plugin.js';
import {
  isImmutablePlugins,
  assertImmutablePlugins,
} from '../src/guards/plugins.js';
import type { ImmutablePlugin } from '../src/types.js';

test('isPlainObject - accepts only plain objects', (t) => {
  // Accepts
  t.ok(isPlainObject({}), 'object literal accepted');
  t.ok(isPlainObject(Object.create(null)), 'null-prototype object accepted');

  // Rejects primitives and null/undefined
  t.notOk(isPlainObject(null), 'null rejected');
  t.notOk(isPlainObject(undefined), 'undefined rejected');
  t.notOk(isPlainObject(42), 'number rejected');
  t.notOk(isPlainObject('str'), 'string rejected');
  t.notOk(isPlainObject(true), 'boolean rejected');

  // Rejects arrays and exotic built-ins
  t.notOk(isPlainObject([]), 'array rejected');
  t.notOk(isPlainObject(new Date()), 'date rejected');
  t.notOk(isPlainObject(/re/), 'regexp rejected');
  t.notOk(isPlainObject(new Map()), 'map rejected');
  t.notOk(isPlainObject(new Set()), 'set rejected');

  // Rejects class instances
  class Foo {
    a = 1;
  }
  t.notOk(isPlainObject(new Foo()), 'class instance rejected');

  t.end();
});

test('isImmutablePlugin rejects exotic entities containers', (t) => {
  const bads: unknown[] = [new Date(), /x/, new Map(), new Set()];
  for (const entities of bads) {
    t.notOk(
      isImmutablePlugin({ name: 'p', entities } as unknown),
      `rejects entities container: ${Object.prototype.toString.call(entities)}`
    );
  }
  t.end();
});

test('isImmutablePlugins rejects record with undefined plugin value', (t) => {
  t.notOk(
    isImmutablePlugins({ p: undefined } as unknown),
    'predicate rejects when a plugin value is undefined'
  );
  t.throws(
    () =>
      assertImmutablePlugins({ p: undefined } as unknown as Record<
        string,
        unknown
      >),
    /Invalid plugin structure/,
    'assertion throws when a plugin value is undefined'
  );
  t.end();
});

test('assertPlainObject - assertion variant', (t) => {
  t.doesNotThrow(() => assertPlainObject({}), 'accepts object');
  t.throws(
    () => assertPlainObject(1 as unknown),
    /plain object/,
    'rejects non-object'
  );
  t.end();
});

test('isEntitiesRecord / assertEntitiesRecord', (t) => {
  t.ok(isEntitiesRecord({ ok: { a: 1 } }), 'predicate accepts valid record');
  t.notOk(isEntitiesRecord('nope'), 'predicate rejects non-object');
  t.notOk(isEntitiesRecord({ bad: 'x' }), 'predicate rejects non-record');
  t.notOk(
    isEntitiesRecord({ bad: { '': 'x' } }),
    'predicate rejects invalid inner'
  );

  t.doesNotThrow(
    () => assertEntitiesRecord({ ok: { a: 1 } }),
    'assertion accepts valid record'
  );
  t.throws(
    () => assertEntitiesRecord('nope'),
    /plain object/,
    'assertion rejects non-object'
  );
  t.throws(
    () => assertEntitiesRecord({ bad: 'x' }),
    /record of entity records/,
    'assertion rejects non-record'
  );
  t.throws(
    () => assertEntitiesRecord({ bad: { '': 'x' } }),
    /record of entity records/,
    'assertion rejects invalid inner'
  );

  // Symbol-keyed entity type with invalid inner record to cover symbol branch
  const sym = Symbol('s');
  t.notOk(
    isEntitiesRecord({ [sym]: { '': 'x' } }),
    'predicate rejects invalid inner on symbol key'
  );
  t.throws(
    () => assertEntitiesRecord({ [sym]: { '': 'x' } }),
    /record of entity records/,
    'assertion rejects invalid inner on symbol key'
  );

  t.end();
});

test('isImmutablePlugin - validates full plugin structure', (t) => {
  const symType = Symbol('sym');

  const good: ImmutablePlugin = {
    name: 'good-plugin',
    entities: {
      strType: { a: 1 },
      [symType]: { b: 2 },
    },
  };

  t.ok(isImmutablePlugin(good), 'valid plugin accepted');

  // Invalid: null
  t.notOk(isImmutablePlugin(null), 'null plugin rejected');

  // Invalid: missing name
  t.notOk(
    isImmutablePlugin({ entities: {} } as unknown),
    'missing name rejected'
  );

  // Invalid: empty name
  t.notOk(
    isImmutablePlugin({ name: '', entities: {} } as unknown),
    'empty name rejected'
  );

  // Invalid: entities not plain object
  t.notOk(
    isImmutablePlugin({ name: 'x', entities: [] } as unknown),
    'array entities rejected'
  );

  // Invalid: inner entity not a record
  t.notOk(
    isImmutablePlugin({ name: 'x', entities: { bad: 'str' } } as unknown),
    'non-record inner entity rejected'
  );

  // Invalid: inner record with numeric key
  t.notOk(
    isImmutablePlugin({ name: 'x', entities: { type: { 1: 'x' } } } as unknown),
    'numeric inner key rejected'
  );

  // Invalid: inner record with empty key
  t.notOk(
    isImmutablePlugin({
      name: 'x',
      entities: { type: { '': 'x' } },
    } as unknown),
    'empty inner key rejected'
  );

  t.end();
});
test('assertImmutablePlugin / isImmutablePlugins', (t) => {
  const good = { name: 'p', entities: { t: { a: 1 } } };
  t.doesNotThrow(() => assertImmutablePlugin(good), 'assert single plugin');
  t.ok(isImmutablePlugins({ p: good }), 'predicate for plugins record');
  t.notOk(
    isImmutablePlugins({ p: { name: '', entities: {} } }),
    'predicate fails invalid'
  );
  t.notOk(
    isImmutablePlugins({ p: { name: 'different', entities: { t: { a: 1 } } } }),
    'predicate fails on URN/name mismatch'
  );
  t.notOk(
    isImmutablePlugins('nope' as unknown),
    'predicate rejects non-object'
  );
  t.throws(
    () => assertImmutablePlugin({ name: '', entities: {} }),
    /Invalid plugin structure/,
    'assert single plugin throws on invalid'
  );
  t.end();
});

test('assertImmutablePlugins - asserts and checks URN match', (t) => {
  const validPlugin: ImmutablePlugin = {
    name: 'plugin-a',
    entities: { type: { k: 'v' } },
  };

  t.doesNotThrow(
    () => assertImmutablePlugins({ 'plugin-a': validPlugin }),
    'valid plugins record passes assertion'
  );

  // Mismatch URN
  const mismatch: ImmutablePlugin = {
    name: 'different',
    entities: { type: { k: 'v' } },
  };
  t.throws(
    () => assertImmutablePlugins({ 'plugin-a': mismatch }),
    /does not match URN/,
    'name/URN mismatch throws'
  );

  // Invalid plugin structure
  t.throws(
    () =>
      assertImmutablePlugins({ bad: { name: '', entities: {} } as unknown }),
    /Invalid plugin structure/,
    'invalid plugin structure throws'
  );

  t.end();
});

test('isEntityRecord - rejects numeric keys, allows symbols and non-numeric strings', (t) => {
  const sym = Symbol('s');

  // Allowed: only non-numeric string and symbols
  t.ok(isEntityRecord({ a: 1, b: 2 }), 'letter keys allowed');
  t.ok(isEntityRecord({ [sym]: 1 }), 'symbol keys allowed');
  t.ok(isEntityRecord(Object.create(null)), 'empty null-proto allowed');

  // Disallowed: numeric keys
  t.notOk(isEntityRecord({ '': 'x' }), 'empty string key rejected');
  t.notOk(isEntityRecord({ '0': 'x' }), 'numeric string key rejected');
  t.notOk(
    isEntityRecord({ '123': 'x' }),
    'multi-digit numeric string key rejected'
  );
  t.notOk(
    isEntityRecord({ '-1': 'x' }),
    'negative numeric string key rejected'
  );
  t.notOk(
    isEntityRecord({ '1.5': 'x' }),
    'decimal numeric string key rejected'
  );
  t.notOk(
    isEntityRecord({ '1e3': 'x' }),
    'exponent numeric string key rejected'
  );
  t.notOk(isEntityRecord({ 1: 'x' }), 'numeric literal key rejected');

  // isPlainObject accepts plain objects regardless of numeric keys
  t.ok(
    isPlainObject({ 1: 'x' }),
    'plain object with numeric key accepted by isPlainObject'
  );

  // Assertion variant coverage: invalid entity record
  t.throws(
    () => assertEntityRecord({ '': 1 }),
    /entity record must be a plain object/,
    'assertEntityRecord rejects invalid keys'
  );

  t.end();
});
