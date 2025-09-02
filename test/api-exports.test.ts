import t from 'tap';
import {
  ImmutableHost,
  assertEntitiesRecord,
  assertImmutablePlugin,
  assertImmutablePlugins,
  isEntitiesRecord,
  isEntityRecord,
  isImmutablePlugin,
  isImmutablePlugins,
  isPlainObject,
  type ImmutableEntities,
  type ImmutablePlugin,
  type ImmutablePlugins,
} from 'immutable-plugin-system';
import type { PluginURN } from 'immutable-plugin-system';

t.test('guards: success and failure cases', (t) => {
  t.equal(isPlainObject({}), true, 'isPlainObject accepts object');
  t.equal(isPlainObject(new Date()), false, 'isPlainObject rejects Date');

  t.equal(isEntityRecord({ a: 1 }), true, 'isEntityRecord accepts');
  t.equal(isEntityRecord({ '': 1 }), false, 'rejects empty string key');
  t.equal(
    isEntityRecord({ 0: 1 } as unknown as Record<string, unknown>),
    false,
    'rejects numeric-like key'
  );
  t.equal(isEntityRecord({ a: undefined }), false, 'rejects undefined value');

  t.equal(isEntitiesRecord({ x: { a: 1 } }), true, 'isEntitiesRecord accepts');
  t.equal(
    isEntitiesRecord({ bad: 1 } as unknown as object),
    false,
    'rejects non-record inner'
  );

  t.throws(
    () => assertEntitiesRecord({ a: { b: undefined } }),
    /record of entity records|defined values/,
    'assertEntitiesRecord throws on invalid inner record'
  );
  t.doesNotThrow(
    () => assertEntitiesRecord({ a: { b: 1 } }),
    'assertEntitiesRecord accepts valid'
  );

  const POK: ImmutablePlugin<{ assets: ImmutableEntities<string, string> }> = {
    name: 'ok',
    entities: { assets: { a: 'v' } },
  };
  const PBAD = { name: '', entities: {} } as unknown;
  t.equal(isImmutablePlugin(POK), true, 'isImmutablePlugin accepts valid');
  t.equal(isImmutablePlugin(PBAD), false, 'isImmutablePlugin rejects invalid');
  t.equal(
    isImmutablePlugin(
      { name: 'x', entities: { sec: { a: undefined } } },
      { requiredEntityTypes: ['sec'] }
    ),
    false,
    'rejects plugin with undefined value'
  );
  t.doesNotThrow(
    () => assertImmutablePlugin(POK),
    'assertImmutablePlugin accepts'
  );
  t.throws(
    () => assertImmutablePlugin(PBAD),
    /Invalid plugin structure/,
    'assertImmutablePlugin rejects'
  );

  const P: ImmutablePlugins<typeof POK> = { ok: POK };
  t.equal(
    isImmutablePlugins(P),
    true,
    'isImmutablePlugins accepts valid record'
  );
  t.equal(
    isImmutablePlugins({ bad: { ...POK, name: 'mismatch' } }),
    false,
    'rejects name/URN mismatch'
  );
  t.doesNotThrow(
    () => assertImmutablePlugins(P),
    'assertImmutablePlugins accepts'
  );
  t.throws(
    () =>
      assertImmutablePlugins({ bad: undefined } as unknown as Record<
        string,
        unknown
      >),
    /Invalid plugin structure/,
    'assertImmutablePlugins rejects invalid'
  );

  t.end();
});

t.test('host and collection via package exports', (t) => {
  type Entities = { assets: ImmutableEntities<string, string> };
  const pa: ImmutablePlugin<Entities> = {
    name: 'a',
    entities: { assets: { k: 'va' } },
  };
  const pb: ImmutablePlugin<Entities> = {
    name: 'b',
    entities: { assets: { k: 'vb' } },
  };
  const host = new ImmutableHost<ImmutablePlugin<Entities>>({ a: pa, b: pb });

  const list = host.entities.assets.flat();
  t.equal(list.length, 2, 'flat has two items');
  const entries = Array.from(host.entities.assets.entries());
  t.equal(entries.length, 1, 'entries yields one key');
  const flatMapRes = host.entities.assets.flatMap(
    (v: string, k: string, p: PluginURN) => `${p}:${k}:${v}`
  );
  t.same(
    flatMapRes.sort(),
    ['a:k:va', 'b:k:vb'].sort(),
    'flatMap decorates items'
  );
  t.end();
});
