/**
 * String identifier for plugins in the immutable plugin system.
 * Used to uniquely identify plugins within the host.
 */
export type PluginURN = string;

/**
 * Valid key type for inner entity maps.
 *
 * - Excludes `number` to avoid ambiguity with JS numeric key coercion.
 * - Excludes empty string `''` to prevent degenerate identifiers.
 */
export type ImmutableEntityKey = Exclude<PropertyKey, number | ''>;

/**
 * Type-safe record of entities mapped by keys.
 * Provides immutable entity collections with strongly typed keys and values.
 *
 * Keys are restricted to non-empty strings and symbols at runtime; this type
 * enforces the design intent by excluding `number` from acceptable key types.
 *
 * @template K - The key type, must extend ImmutableEntityKey
 * @template V - The value type for entities
 */
export type ImmutableEntities<K extends ImmutableEntityKey, V> = Readonly<
  Record<K, V>
>;

/**
 * Entities record grouped by entity type (top-level key) to inner entity maps.
 * Conforms to the specification alias name.
 *
 * @template V - The value type stored in entity maps
 */
export type ImmutableEntitiesRecord<
  K extends ImmutableEntityKey = ImmutableEntityKey,
  V = unknown,
> = Readonly<Record<PropertyKey, ImmutableEntities<K, V>>>;

/**
 * Interface representing an immutable plugin in the plugin system.
 * Plugins expose typed read-only entities to the host and other plugins.
 *
 * @template C - The entities configuration type, where each entity type must be a record
 */
export interface ImmutablePlugin<
  C extends ImmutableEntitiesRecord = ImmutableEntitiesRecord,
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
export type ImmutablePlugins<P extends ImmutablePlugin = ImmutablePlugin> =
  Readonly<Record<PluginURN, P>>;
