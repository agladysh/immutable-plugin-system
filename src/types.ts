/**
 * String identifier for plugins in the immutable plugin system.
 * Used to uniquely identify plugins within the host.
 */
export type PluginURN = string;

/**
 * Type-safe record of entities mapped by keys.
 * Provides immutable entity collections with strongly typed keys and values.
 *
 * @template K - The key type, must extend PropertyKey
 * @template V - The value type for entities
 */
export type ImmutableEntities<K extends PropertyKey, V> = Record<K, V>;

/**
 * Interface representing an immutable plugin in the plugin system.
 * Plugins expose typed read-only entities to the host and other plugins.
 *
 * @template C - The entities configuration type, must extend Record<PropertyKey, unknown>
 */
export interface ImmutablePlugin<C extends Record<PropertyKey, unknown>> {
  /**
   * Unique identifier for this plugin.
   */
  readonly name: PluginURN;

  /**
   * The entities exposed by this plugin.
   * All entities are immutable and cannot be modified at runtime.
   */
  readonly entities: C;
}
