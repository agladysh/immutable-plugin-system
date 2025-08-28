/**
 * Plain-object guard used for container validation.
 *
 * Accepts objects with prototype `Object.prototype` or `null` and rejects arrays,
 * class instances, and exotic built-ins implicitly via the prototype check.
 *
 * Rationale: We use this for validating the top-level `plugin.entities` map where
 * key type is intentionally broader (strings, numbers, symbols) and we only need
 * to establish the "plain object" container shape. Specific key constraints are
 * applied by more specialized guards.
 *
 * @param value - The runtime value to validate
 * @returns True if the value is a plain object
 */
export function isPlainObject(
  value: unknown
): value is Record<PropertyKey, unknown> {
  if (value == null || typeof value !== 'object') {
    return false;
  }
  const proto = Object.getPrototypeOf(value as object);
  const isPlain = proto === Object.prototype || proto === null;
  return isPlain;
}

/**
 * Assertion variant of isPlainObject that throws on failure.
 * @param value - Candidate value
 * @throws TypeError if value is not a plain object
 */
export function assertPlainObject(
  value: unknown
): asserts value is Record<PropertyKey, unknown> {
  if (!isPlainObject(value)) {
    throw new TypeError('value must be a plain object');
  }
}
