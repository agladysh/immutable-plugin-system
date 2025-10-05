import type {
  ImmutableEntitiesRecord,
  ImmutablePlugin,
  PluginURN,
} from '../types.js';
import { isPlainObject } from './plain-object.js';
import { assertImmutablePlugin, isImmutablePlugin } from './plugin.js';

/**
 * Predicate that checks if a value is a record of immutable plugins keyed by
 * URN and each plugin's `name` matches its key.
 */
export function isImmutablePlugins(
  plugins: unknown
): plugins is Record<PluginURN, ImmutablePlugin<ImmutableEntitiesRecord>> {
  if (!isPlainObject(plugins)) {
    return false;
  }
  for (const [urn, plugin] of Object.entries(plugins)) {
    if (!isImmutablePlugin(plugin)) {
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
 * and its `name` matches its URN key.
 *
 * @param plugins - Record of plugins by URN
 * @throws TypeError if any plugin is invalid, has mismatched URN, or contains an
 *  invalid entities record
 */
export function assertImmutablePlugins(
  plugins: Record<PluginURN, unknown>
): asserts plugins is Record<
  PluginURN,
  ImmutablePlugin<ImmutableEntitiesRecord>
> {
  for (const [urn, plugin] of Object.entries(plugins)) {
    if (!isImmutablePlugin(plugin)) {
      throw new TypeError(
        `Invalid plugin structure for URN "${urn}": plugin must have 'name' (non-empty string) and 'entities' (record of records)`
      );
    }
    if ((plugin as ImmutablePlugin<ImmutableEntitiesRecord>).name !== urn) {
      throw new TypeError(
        `Plugin name "${(plugin as ImmutablePlugin<ImmutableEntitiesRecord>).name}" does not match URN "${urn}"`
      );
    }
    assertImmutablePlugin(plugin);
  }
}
