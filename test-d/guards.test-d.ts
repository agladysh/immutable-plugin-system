import { expectType, expectError } from 'tsd';
import type {
  ImmutableEntitiesRecord,
  ImmutablePlugin,
  ImmutableEntityKey,
} from '..';
import {
  isPlainObject,
  assertPlainObject,
  isEntityRecord,
  assertEntityRecord,
  isEntitiesRecord,
  assertEntitiesRecord,
  isImmutablePlugin,
  assertImmutablePlugin,
  isImmutablePlugins,
  assertImmutablePlugins,
} from '..';

// isPlainObject tests
declare const unknownValue: unknown;

// Return type is type predicate
expectType<boolean>(isPlainObject(unknownValue));

// Type predicate narrows correctly
if (isPlainObject(unknownValue)) {
  expectType<Record<PropertyKey, unknown>>(unknownValue);
}

// Works with specific objects
expectType<boolean>(isPlainObject({}));
expectType<boolean>(isPlainObject({ key: 'value' }));
expectType<boolean>(isPlainObject([])); // Should return false but type allows it
expectType<boolean>(isPlainObject(null));

// assertPlainObject tests
declare let candidateValue: unknown;

// Function signature - assertPlainObject is properly typed
expectType<typeof assertPlainObject>(assertPlainObject);

// After assertion, type is narrowed
if (typeof candidateValue === 'object' && candidateValue !== null) {
  assertPlainObject(candidateValue);
  expectType<Record<PropertyKey, unknown>>(candidateValue);
}

// isEntityRecord tests
declare const potentialRecord: unknown;

// Return type is type predicate
expectType<boolean>(isEntityRecord(potentialRecord));

// Type predicate narrows correctly
if (isEntityRecord(potentialRecord)) {
  expectType<Record<ImmutableEntityKey, unknown>>(potentialRecord);
}

// assertEntityRecord tests
declare let recordCandidate: unknown;

// Function signature - assertEntityRecord is properly typed
expectType<typeof assertEntityRecord>(assertEntityRecord);

// After assertion, type is narrowed
if (typeof recordCandidate === 'object' && recordCandidate !== null) {
  assertEntityRecord(recordCandidate);
  expectType<Record<ImmutableEntityKey, unknown>>(recordCandidate);
}

// isEntitiesRecord tests
declare const entitiesCandidate: unknown;

// Return type is type predicate
expectType<boolean>(isEntitiesRecord(entitiesCandidate));

// Type predicate narrows correctly
if (isEntitiesRecord(entitiesCandidate)) {
  expectType<ImmutableEntitiesRecord>(entitiesCandidate);
}

// assertEntitiesRecord tests
declare let entitiesRecordCandidate: unknown;

// Function signature - assertEntitiesRecord is properly typed
expectType<typeof assertEntitiesRecord>(assertEntitiesRecord);

// After assertion, type is narrowed
if (
  typeof entitiesRecordCandidate === 'object' &&
  entitiesRecordCandidate !== null
) {
  assertEntitiesRecord(entitiesRecordCandidate);
  expectType<ImmutableEntitiesRecord>(entitiesRecordCandidate);
}

// isImmutablePlugin tests
declare const pluginCandidate: unknown;
declare const requiredEntityTypes: readonly PropertyKey[];

// Basic usage without options
expectType<boolean>(isImmutablePlugin(pluginCandidate));

// With options parameter
expectType<boolean>(
  isImmutablePlugin(pluginCandidate, { requiredEntityTypes })
);
expectType<boolean>(isImmutablePlugin(pluginCandidate, {}));

// Type predicate narrows correctly
if (isImmutablePlugin(pluginCandidate)) {
  expectType<ImmutablePlugin<ImmutableEntitiesRecord>>(pluginCandidate);
}

// With options and type predicate
if (isImmutablePlugin(pluginCandidate, { requiredEntityTypes: ['assets'] })) {
  expectType<ImmutablePlugin<ImmutableEntitiesRecord>>(pluginCandidate);
}

// assertImmutablePlugin tests
declare let pluginAssertCandidate: unknown;

// Function signature - assertImmutablePlugin is properly typed
expectType<typeof assertImmutablePlugin>(assertImmutablePlugin);

// After assertion without options, type is narrowed
if (
  typeof pluginAssertCandidate === 'object' &&
  pluginAssertCandidate !== null
) {
  assertImmutablePlugin(pluginAssertCandidate);
  expectType<ImmutablePlugin<ImmutableEntitiesRecord>>(pluginAssertCandidate);
}

// After assertion with options, type is narrowed
if (
  typeof pluginAssertCandidate === 'object' &&
  pluginAssertCandidate !== null
) {
  assertImmutablePlugin(pluginAssertCandidate, {
    requiredEntityTypes: ['commands'],
  });
  expectType<ImmutablePlugin<ImmutableEntitiesRecord>>(pluginAssertCandidate);
}

// isImmutablePlugins tests
declare const pluginsCandidate: unknown;

// Basic usage without options
expectType<boolean>(isImmutablePlugins(pluginsCandidate));

// With options parameter
expectType<boolean>(
  isImmutablePlugins(pluginsCandidate, { requiredEntityTypes })
);
expectType<boolean>(isImmutablePlugins(pluginsCandidate, {}));

// Type predicate narrows correctly
if (isImmutablePlugins(pluginsCandidate)) {
  expectType<Record<string, ImmutablePlugin<ImmutableEntitiesRecord>>>(
    pluginsCandidate
  );
}

// With options and type predicate
if (
  isImmutablePlugins(pluginsCandidate, {
    requiredEntityTypes: ['assets', 'commands'],
  })
) {
  expectType<Record<string, ImmutablePlugin<ImmutableEntitiesRecord>>>(
    pluginsCandidate
  );
}

// assertImmutablePlugins tests
declare let pluginsAssertCandidate: Record<string, unknown>;

// Function signature - assertImmutablePlugins is properly typed
expectType<typeof assertImmutablePlugins>(assertImmutablePlugins);

// After assertion without options, type is narrowed
assertImmutablePlugins(pluginsAssertCandidate);
expectType<Record<string, ImmutablePlugin<ImmutableEntitiesRecord>>>(
  pluginsAssertCandidate
);

// After assertion with options, type is narrowed
pluginsAssertCandidate = {} as Record<string, unknown>; // Reset for next test
assertImmutablePlugins(pluginsAssertCandidate, {
  requiredEntityTypes: ['assets'],
});
expectType<Record<string, ImmutablePlugin<ImmutableEntitiesRecord>>>(
  pluginsAssertCandidate
);

// Options parameter typing tests
declare const validOptions: { requiredEntityTypes?: readonly PropertyKey[] };
declare const invalidOptions1: { requiredEntityTypes: string[] };
declare const invalidOptions2: { requiredEntityTypes: PropertyKey[] };
declare const invalidOptions3: { wrongProperty: string[] };

// Valid options
expectType<boolean>(isImmutablePlugin(pluginCandidate, validOptions));
expectType<boolean>(
  isImmutablePlugin(pluginCandidate, { requiredEntityTypes: ['assets'] })
);
expectType<boolean>(
  isImmutablePlugin(pluginCandidate, { requiredEntityTypes: [Symbol('test')] })
);
expectType<boolean>(
  isImmutablePlugin(pluginCandidate, {
    requiredEntityTypes: ['assets', Symbol('commands')],
  })
);

// Readonly array requirement
expectType<boolean>(
  isImmutablePlugin(pluginCandidate, { requiredEntityTypes: ['test'] as const })
);

// Empty options should work
expectType<boolean>(isImmutablePlugin(pluginCandidate, {}));

// Undefined options should work
expectType<boolean>(isImmutablePlugin(pluginCandidate, undefined));

// Options parameter validation for all guard functions
const testOptions = { requiredEntityTypes: ['assets', 'commands'] as const };

// All plugin guards should accept the same options format
expectType<boolean>(isImmutablePlugin(pluginCandidate, testOptions));
assertImmutablePlugin(pluginAssertCandidate, testOptions);
expectType<boolean>(isImmutablePlugins(pluginsCandidate, testOptions));
assertImmutablePlugins(pluginsAssertCandidate, testOptions);
