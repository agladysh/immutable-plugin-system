import type {
  ImmutableEntitiesRecord,
  ImmutablePlugin,
  PluginURN,
} from '../types.js';
import { isPlainObject } from './plain-object.js';
import { isImmutablePlugin } from './plugin.js';

/**
 * Predicate that checks if a value is a record of immutable plugins keyed by
 * URN and each plugin's `name` matches its key. Optionally enforces required
 * entity types on each plugin when provided via `options.requiredEntityTypes`.
 * Typing note: `requiredEntityTypes` is `readonly PropertyKey[]` here (no
 * generic plugin context). The `ImmutableHost` constructor accepts a compile‑time
 * typed `readonly (keyof P['entities'])[]` list for the same semantics.
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
    if ((plugin as ImmutablePlugin<ImmutableEntitiesRecord>).name !== urn) {
      return false;
    }
  }
  return true;
}

/**
 * Assertion over a plugins record. Ensures each plugin is structurally valid
 * and its `name` matches its URN key. Optionally enforces presence and
 * validity of `options.requiredEntityTypes` for each plugin. Typing note:
 * see `isImmutablePlugins` on the rationale for using `PropertyKey[]` in
 * guards vs. a typed list in the host constructor.
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
    if ((plugin as ImmutablePlugin<ImmutableEntitiesRecord>).name !== urn) {
      throw new TypeError(
        `Plugin name "${(plugin as ImmutablePlugin<ImmutableEntitiesRecord>).name}" does not match URN "${urn}"`
      );
    }
  }
}
