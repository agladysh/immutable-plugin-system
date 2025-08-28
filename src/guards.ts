import type { ImmutablePlugin, PluginURN } from './types.js';

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
): value is Record<Exclude<PropertyKey, number>, unknown> {
  return isPlainObject(value) && hasNoInvalidKeys(value as object);
}

/**
 * Type guard for ImmutablePlugin shape.
 *
 * Validates:
 * - `name` exists and is a non-empty string.
 * - `entities` is a plain object (container-level validation).
 * - Each inner entity map is a valid entity record (plain + no invalid keys), for both string and symbol keys.
 *
 * @param plugin - Runtime candidate
 * @returns True if candidate matches ImmutablePlugin runtime contract
 */
export function isImmutablePlugin(
  plugin: unknown
): plugin is ImmutablePlugin<
  Record<PropertyKey, Record<Exclude<PropertyKey, number>, unknown>>
> {
  if (
    !plugin ||
    typeof plugin !== 'object' ||
    !('name' in plugin) ||
    !('entities' in plugin)
  ) {
    return false;
  }

  const p = plugin as Record<string | symbol, unknown>;
  if (typeof p.name !== 'string' || p.name.length === 0) {
    return false;
  }
  if (!isPlainObject(p.entities)) {
    return false;
  }

  const entities = p.entities as Record<PropertyKey, unknown>;
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
 * Assertion over a plugins record. Ensures each plugin is structurally valid and
 * its `name` matches its URN key.
 *
 * @param plugins - Record of plugins by URN
 * @throws TypeError if any plugin is invalid or has mismatched URN
 */
export function assertImmutablePlugins(
  plugins: Record<PluginURN, unknown>
): asserts plugins is Record<
  PluginURN,
  ImmutablePlugin<
    Record<PropertyKey, Record<Exclude<PropertyKey, number>, unknown>>
  >
> {
  for (const [urn, plugin] of Object.entries(plugins)) {
    if (!isImmutablePlugin(plugin)) {
      throw new TypeError(
        `Invalid plugin structure for URN "${urn}": plugin must have 'name' (non-empty string) and 'entities' (record of records)`
      );
    }
    if (plugin.name !== urn) {
      throw new TypeError(
        `Plugin name "${plugin.name}" does not match URN "${urn}"`
      );
    }
  }
}
