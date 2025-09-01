import t from 'tap';
import { ImmutableEntityCollection } from '../src/ImmutableEntityCollection.js';
import { assertEntitiesRecord } from '../src/guards/entities-record.js';
import { isEntityRecord } from '../src/guards/entity-record.js';

t.test(
  'ImmutableEntityCollection constructor throws on undefined entity values',
  (t) => {
    const pluginEntities = {
      'plugin-a': {
        key1: 'ok',
        key2: undefined,
      },
    } as unknown as Record<string, Record<string, string | undefined>>;

    t.throws(
      () =>
        new ImmutableEntityCollection<string, string>(pluginEntities as never),
      /must be defined/,
      'constructor rejects undefined entity values'
    );
    t.end();
  }
);

t.test('entity record guard rejects undefined entity values', (t) => {
  const valid = { a: 1 };
  const invalid = { a: undefined };
  t.equal(isEntityRecord(valid), true, 'valid record accepted');
  t.equal(isEntityRecord(invalid), false, 'invalid record rejected');
  t.throws(
    () => assertEntitiesRecord({ sec: invalid } as unknown),
    /record of entity records|defined values/,
    'assertion throws on invalid inner record'
  );
  t.end();
});
