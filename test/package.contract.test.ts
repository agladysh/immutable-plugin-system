import t from 'tap';
import {
  ImmutableEntityCollection,
  assertEntitiesRecord,
  assertPlainObject,
  assertEntityRecord,
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

t.test('plain-object guard: predicate and assertion', (t) => {
  t.equal(isPlainObject({}), true, 'accepts plain object');
  t.equal(
    isPlainObject(Object.create(null)),
    true,
    'accepts null-proto object'
  );
  t.equal(isPlainObject([]), false, 'rejects array');
  t.throws(
    () => assertPlainObject(1 as unknown as object),
    /plain object/,
    'assertPlainObject throws'
  );
  t.throws(
    () => assertEntitiesRecord(123 as unknown as object),
    /plain object/,
    'entities-record assertion rejects non-object'
  );
  t.end();
});

t.test(
  'entity-record guard: string and symbol keys; undefined rejected',
  (t) => {
    const sym = Symbol('s');
    t.equal(isEntityRecord({ a: 1 }), true, 'accepts string key record');
    t.equal(isEntityRecord({ [sym]: 1 }), true, 'accepts symbol key record');
    t.equal(isEntityRecord({ '': 1 }), false, 'rejects empty string key');
    t.equal(
      isEntityRecord({ 0: 1 } as unknown as Record<string, unknown>),
      false,
      'rejects numeric-like key'
    );
    t.equal(
      isEntityRecord({ a: undefined }),
      false,
      'rejects undefined values'
    );
    t.doesNotThrow(
      () => assertEntityRecord({ [sym]: 'v' }),
      'assert accepts valid record'
    );
    t.throws(
      () => assertEntityRecord({ a: undefined }),
      /defined values/,
      'assert rejects undefined value'
    );
    t.end();
  }
);

t.test(
  'package ImmutableEntityCollection: constructor throws on undefined values',
  (t) => {
    const bad = { a: { k: undefined as unknown as string } } as Record<
      string,
      Record<string, string>
    >;
    t.throws(
      () => new ImmutableEntityCollection<string, string>(bad),
      /must be defined/,
      'constructor rejects undefined'
    );
    t.end();
  }
);

t.test('plugins assertion: name/URN mismatch branch', (t) => {
  type E = { a: ImmutableEntities<string, string> };
  const mismatch = {
    ok: { name: 'wrong', entities: { a: { k: 'v' } } },
  } as unknown as ImmutablePlugins<ImmutablePlugin<E>>;
  t.throws(
    () => assertImmutablePlugins(mismatch),
    /does not match URN/,
    'assertImmutablePlugins rejects name mismatch'
  );
  t.end();
});

t.test('entities-record predicate: non-object returns false (package)', (t) => {
  t.equal(
    isEntitiesRecord(42 as unknown as object),
    false,
    'non-object rejected'
  );
  t.end();
});

t.test('plugins predicate: non-object returns false (package)', (t) => {
  t.equal(
    isImmutablePlugins(42 as unknown as object),
    false,
    'non-object rejected'
  );
  t.end();
});

t.test('collection iterator: termination after items', (t) => {
  const col = new ImmutableEntityCollection<string, string>({ p: { a: '1' } });
  const it = col[Symbol.iterator]();
  const first = it.next();
  t.equal(first.done, false, 'first item yielded');
  const second = it.next();
  t.same(second, { done: true, value: undefined }, 'iterator done after items');
  // next() again still returns done
  const third = it.next();
  t.same(third, { done: true, value: undefined }, 'iterator remains done');
  t.end();
});

t.test(
  'entities-record guard: symbol branch covered; assertion throws',
  (t) => {
    const sym = Symbol('etype');
    t.equal(
      isEntitiesRecord({ [sym]: { a: 1 } }),
      true,
      'accepts symbol entity type'
    );
    t.equal(
      isEntitiesRecord({ [sym]: 1 } as unknown as object),
      false,
      'rejects non-record under symbol'
    );
    t.throws(
      () => assertEntitiesRecord({ [sym]: 1 } as unknown as object),
      /record of entity records/,
      'assert rejects on symbol inner non-record'
    );
    t.end();
  }
);

t.test(
  'plugin and plugins guards: required types, mismatch, assertions',
  (t) => {
    type E = {
      a?: ImmutableEntities<string, string>;
      b?: ImmutableEntities<string, number>;
    };
    type P = ImmutablePlugin<E>;
    const ok: P = { name: 'ok', entities: { a: { k: 'v' } } };
    const badName = { name: 'mismatch', entities: { a: { k: 'v' } } } as P;
    const badInner = {
      name: 'bad',
      entities: { a: { k: undefined as unknown as string } },
    } as P;

    t.equal(isImmutablePlugin(ok), true, 'isImmutablePlugin accepts');
    t.equal(
      isImmutablePlugin({} as unknown),
      false,
      'isImmutablePlugin rejects non-object'
    );
    t.equal(
      isImmutablePlugin(ok, { requiredEntityTypes: ['a'] }),
      true,
      'required a present'
    );
    t.equal(
      isImmutablePlugin(ok, { requiredEntityTypes: ['b'] }),
      false,
      'required b missing'
    );
    t.equal(
      isImmutablePlugin(badInner, { requiredEntityTypes: ['a'] }),
      false,
      'invalid inner rejected'
    );
    t.doesNotThrow(
      () => assertImmutablePlugin(ok),
      'assertImmutablePlugin accepts'
    );
    t.throws(
      () => assertImmutablePlugin({} as unknown),
      /Invalid plugin structure/,
      'assertImmutablePlugin rejects non-object'
    );

    const rec: ImmutablePlugins<P> = { ok } as const;
    const mismatch = { bad: badName } as unknown as Record<string, P>;
    t.equal(isImmutablePlugins(rec), true, 'isImmutablePlugins accepts');
    t.equal(
      isImmutablePlugins(mismatch),
      false,
      'isImmutablePlugins rejects name mismatch'
    );
    // Predicate explicit mismatch via package export
    {
      type E2 = { a: ImmutableEntities<string, string> };
      const bad = {
        ok: { name: 'wrong', entities: { a: { k: 'v' } } },
      } as unknown as ImmutablePlugins<ImmutablePlugin<E2>>;
      t.equal(
        isImmutablePlugins(bad),
        false,
        'predicate: name/URN mismatch returns false'
      );
    }
    t.doesNotThrow(
      () => assertImmutablePlugins(rec),
      'assertImmutablePlugins accepts'
    );
    t.throws(
      () =>
        assertImmutablePlugins({ bad: undefined } as unknown as Record<
          string,
          unknown
        >),
      /Invalid plugin structure/,
      'assertImmutablePlugins rejects invalid plugin value'
    );
    t.end();
  }
);

t.test(
  'package ImmutableEntityCollection: empty and iterator end branch',
  (t) => {
    const col = new ImmutableEntityCollection<string, string>({});
    // entries empty path
    t.same(
      Array.from({ [Symbol.iterator]: () => col.entries() }),
      [],
      'entries() on empty yields no pairs'
    );
    // iterator end branch
    const it = col[Symbol.iterator]();
    t.same(
      it.next(),
      { done: true, value: undefined },
      'iterator immediately done on empty'
    );
    // map/flatMap empty behavior
    t.same(
      col.map(() => 1),
      [],
      'map on empty returns empty'
    );
    t.same(
      col.flatMap(() => 1),
      [],
      'flatMap on empty returns empty'
    );
    t.end();
  }
);

t.test(
  'package ImmutableEntityCollection: map on non-empty hits branch',
  (t) => {
    const col = new ImmutableEntityCollection<string, string>({
      p: { a: '1', b: '2' },
    });
    const mapped = col.map(
      (entities, key) => `${String(key)}=${entities.join(',')}`
    );
    t.same(mapped.sort(), ['a=1', 'b=2'].sort(), 'map collects per-key arrays');
    t.end();
  }
);

t.test(
  'plugin predicate: required type re-check fails after shape changes',
  (t) => {
    // entities.a returns valid record on first read, then an invalid value
    let toggled = false;
    const entities = {} as Record<string, unknown>;
    Object.defineProperty(entities, 'a', {
      enumerable: true,
      get() {
        const v = toggled ? 1 : { k: 'v' };
        toggled = true;
        return v as unknown;
      },
    });
    const plugin = { name: 'p', entities } as unknown as ImmutablePlugin<{
      a: ImmutableEntities<string, string>;
    }>;
    t.equal(
      isImmutablePlugin(plugin, { requiredEntityTypes: ['a'] }),
      false,
      'predicate re-check fails when inner record becomes invalid'
    );
    t.end();
  }
);

t.test('plugins predicate: invalid plugin value returns false', (t) => {
  t.equal(
    isImmutablePlugins({ bad: undefined } as unknown as Record<
      string,
      unknown
    >),
    false,
    'plugins predicate rejects invalid value'
  );
  t.end();
});
