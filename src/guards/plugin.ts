import type { ImmutableEntitiesRecord, ImmutablePlugin } from '../types.js';
import { isPlainObject } from './plain-object.js';
import { isEntitiesRecord } from './entities-record.js';
import { isEntityRecord } from './entity-record.js';

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
