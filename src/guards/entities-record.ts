import type { ImmutableEntitiesRecord } from '../types.js';
import { isPlainObject } from './plain-object.js';
import { isEntityRecord } from './entity-record.js';

/**
 * Predicate that checks whether a value is an `ImmutableEntitiesRecord`.
 * Value must be a plain object where each own property value is a valid inner
 * entity record.
 */
export function isEntitiesRecord(
  value: unknown
): value is ImmutableEntitiesRecord {
  if (!isPlainObject(value)) {
    return false;
  }
  const entities = value as Record<PropertyKey, unknown>;
  for (const key of Object.keys(entities)) {
    if (!isEntityRecord(entities[key])) {
      return false;
    }
  }
  for (const key of Object.getOwnPropertySymbols(entities)) {
    if (!isEntityRecord(entities[key])) {
      return false;
    }
  }
  return true;
}

/**
 * Assertion variant of `isEntitiesRecord` that throws on failure.
 *
 * @param value - Runtime candidate for entities record
 * @throws TypeError if validation fails
 */
export function assertEntitiesRecord(
  value: unknown
): asserts value is ImmutableEntitiesRecord {
  if (!isPlainObject(value)) {
    throw new TypeError('entities must be a plain object');
  }
  const entities = value as Record<PropertyKey, unknown>;
  for (const key of Object.keys(entities)) {
    if (!isEntityRecord(entities[key])) {
      throw new TypeError('entities must be a record of entity records');
    }
  }
  for (const key of Object.getOwnPropertySymbols(entities)) {
    if (!isEntityRecord(entities[key])) {
      throw new TypeError('entities must be a record of entity records');
    }
  }
}
