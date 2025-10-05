import type { ImmutableEntitiesRecord, ImmutablePlugin } from '../types.js';
import { isPlainObject } from './plain-object.js';
import { isEntitiesRecord } from './entities-record.js';
import { assertEntityRecord } from './entity-record.js';

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

  return true;
}

/**
 * Assertion over a single plugin. Structural validation only by default.
 */
export function assertImmutablePlugin(
  plugin: unknown
): asserts plugin is ImmutablePlugin<ImmutableEntitiesRecord> {
  if (!isImmutablePlugin(plugin)) {
    throw new TypeError(
      "Invalid plugin structure: plugin must have 'name' (non-empty string) and 'entities' (record of records)"
    );
  }

  const entities = (plugin as ImmutablePlugin<ImmutableEntitiesRecord>)
    .entities;
  for (const key of Reflect.ownKeys(entities)) {
    assertEntityRecord((entities as Record<PropertyKey, unknown>)[key]);
  }
}
