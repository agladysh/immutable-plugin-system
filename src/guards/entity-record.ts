import type { ImmutableEntityKey } from '../types.js';
import { isPlainObject } from './plain-object.js';

/**
 * Validates inner entity map keys for ambiguity and degeneracy.
 *
 * Rules enforced:
 * - Disallow empty string keys: ambiguous/degenerate identifier.
 * - Disallow numeric-like string keys (e.g. "0", "-1", "1.5", "1e3"): in JS,
 *   number keys on objects are coerced to strings, which makes numeric-looking
 *   strings ambiguous with number keys. For inner entity maps we require textual
 *   identifiers to avoid this ambiguity and align with TS types that exclude `number`.
 *
 * Note: This does not strip whitespace beyond recognizing empty string via `''`.
 * Whitespace-only keys remain ordinary strings and are not considered numeric-like.
 *
 * @param obj - Object whose keys to validate
 * @returns True if no invalid (empty or numeric-like) keys are present
 */
function hasNoInvalidKeys(obj: object): boolean {
  for (const key of Reflect.ownKeys(obj)) {
    if (typeof key === 'string') {
      const s = key;
      if (s === '') {
        return false;
      } // disallow empty string key
      if (s.trim() !== '' && Number.isFinite(Number(s))) {
        return false;
      } // disallow numeric-like keys
    }
  }
  return true;
}

/**
 * Type guard for inner entity maps: requires a plain object with only symbol or
 * non-numeric, non-empty string keys.
 *
 * Rationale: Avoid ambiguity with numeric object keys (coerced to strings in JS)
 * and ensure predictable textual identifiers for entity keys. Matches the API
 * contract where inner map keys exclude `number`.
 *
 * @param value - Candidate value
 * @returns True if value is a valid entity record (plain + no invalid keys)
 */
export function isEntityRecord(
  value: unknown
): value is Record<ImmutableEntityKey, unknown> {
  return isPlainObject(value) && hasNoInvalidKeys(value as object);
}

/**
 * Assertion variant of isEntityRecord that throws on failure.
 * @param value - Candidate value
 * @throws TypeError if value is not a valid entity record
 */
export function assertEntityRecord(
  value: unknown
): asserts value is Record<ImmutableEntityKey, unknown> {
  if (!isEntityRecord(value)) {
    throw new TypeError(
      'entity record must be a plain object with symbol or non-empty, non-numeric string keys'
    );
  }
}
