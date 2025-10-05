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

// Basic usage without options
expectType<boolean>(isImmutablePlugin(pluginCandidate));

// Type predicate narrows correctly
if (isImmutablePlugin(pluginCandidate)) {
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

// isImmutablePlugins tests
declare const pluginsCandidate: unknown;

// Basic usage without options
expectType<boolean>(isImmutablePlugins(pluginsCandidate));

// Type predicate narrows correctly
if (isImmutablePlugins(pluginsCandidate)) {
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
