import type {
  ImmutableEntityKey,
  ImmutableEntitiesRecord,
  ImmutablePlugin,
  PluginURN,
} from './types.js';

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
/**
 * Type guard for ImmutablePlugin shape with optional enforcement of required entity types.
 *
 * Validates:
 * - `name` exists and is a non-empty string.
 * - `entities` is a plain object (container-level validation).
 * - Each inner entity map is a valid entity record (plain + no invalid keys), for both string and symbol keys.
 * - Optionally enforces that specific entity types are present and valid when `options.requiredEntityTypes` is provided.
 *
 * @param plugin - Runtime candidate
 * @param options - Optional validation options
 * @returns True if candidate matches ImmutablePlugin runtime contract
 */
export function isImmutablePlugin(
  plugin: unknown,
  options?: { requiredEntityTypes?: readonly PropertyKey[] }
): plugin is ImmutablePlugin<ImmutableEntitiesRecord> {
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
  if (!isPlainObject(p.entities) || !isEntitiesRecord(p.entities)) {
    return false;
  }

  // Optional enforcement of required entity types if provided by the integration.
  if (options?.requiredEntityTypes && options.requiredEntityTypes.length > 0) {
    const entities = p.entities as Record<PropertyKey, unknown>;
    for (const et of options.requiredEntityTypes) {
      // Require presence as own property and validate inner record shape
      if (!Object.prototype.hasOwnProperty.call(entities, et)) {
        return false;
      }
      if (!isEntityRecord((entities as Record<PropertyKey, unknown>)[et])) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Predicate that checks if a value is a record of immutable plugins keyed by URN
 * and each plugin's `name` matches its key.
 */
/**
 * Predicate that checks if a value is a record of immutable plugins keyed by URN
 * and each plugin's `name` matches its key. Optionally enforces required entity types
 * on each plugin when provided via `options.requiredEntityTypes`.
 */
export function isImmutablePlugins(
  plugins: unknown,
  options?: { requiredEntityTypes?: readonly PropertyKey[] }
): plugins is Record<PluginURN, ImmutablePlugin<ImmutableEntitiesRecord>> {
  if (!isPlainObject(plugins)) {
    return false;
  }
  for (const [urn, plugin] of Object.entries(plugins)) {
    if (!isImmutablePlugin(plugin, options)) {
      return false;
    }
    if (plugin.name !== urn) {
      return false;
    }
  }
  return true;
}

/**
 * Assertion over a single plugin. Structural validation only; does not check
 * any particular URN association.
 */
/**
 * Assertion over a single plugin. Structural validation only by default; optionally
 * enforces presence and validity of `options.requiredEntityTypes`.
 */
export function assertImmutablePlugin(
  plugin: unknown,
  options?: { requiredEntityTypes?: readonly PropertyKey[] }
): asserts plugin is ImmutablePlugin<ImmutableEntitiesRecord> {
  if (!isImmutablePlugin(plugin, options)) {
    throw new TypeError(
      "Invalid plugin structure: plugin must have 'name' (non-empty string) and 'entities' (record of records)"
    );
  }
}

/**
 * Assertion over a plugins record. Ensures each plugin is structurally valid and
 * its `name` matches its URN key.
 *
 * @param plugins - Record of plugins by URN
 * @throws TypeError if any plugin is invalid or has mismatched URN
 */
/**
 * Assertion over a plugins record. Ensures each plugin is structurally valid and
 * its `name` matches its URN key. Optionally enforces presence and validity of
 * `options.requiredEntityTypes` for each plugin.
 *
 * @param plugins - Record of plugins by URN
 * @param options - Optional validation options
 * @throws TypeError if any plugin is invalid or has mismatched URN, or if required entity types are missing/invalid
 */
export function assertImmutablePlugins(
  plugins: Record<PluginURN, unknown>,
  options?: { requiredEntityTypes?: readonly PropertyKey[] }
): asserts plugins is Record<
  PluginURN,
  ImmutablePlugin<ImmutableEntitiesRecord>
> {
  for (const [urn, plugin] of Object.entries(plugins)) {
    if (!isImmutablePlugin(plugin, options)) {
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
