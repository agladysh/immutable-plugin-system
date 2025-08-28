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
export type ImmutableEntities<K extends PropertyKey, V> = Readonly<
  Record<K, V>
>;

/**
 * Interface representing an immutable plugin in the plugin system.
 * Plugins expose typed read-only entities to the host and other plugins.
 *
 * @template C - The entities configuration type, where each entity type must be a record
 */
export interface ImmutablePlugin<
  C extends Record<PropertyKey, Record<Exclude<PropertyKey, number>, unknown>>,
> {
  /**
   * Unique identifier for this plugin.
   */
  readonly name: PluginURN;

  /**
   * The entities exposed by this plugin.
   * All entities are immutable and cannot be modified at runtime.
   */
  readonly entities: Readonly<C>;
}

/**
 * Type representing a record of plugins mapped by their URNs.
 * This type is used to define collections of plugins for the host.
 *
 * @template P - The plugin type, must extend ImmutablePlugin
 */
export type ImmutablePlugins<
  P extends ImmutablePlugin<
    Record<PropertyKey, Record<Exclude<PropertyKey, number>, unknown>>
  >,
> = Readonly<Record<PluginURN, P>>;
