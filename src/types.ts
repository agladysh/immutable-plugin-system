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

/**
 * Interface for immutable entity collections that provide convenient iteration methods.
 * Wraps Map<K, E[]> functionality with additional utility methods for working with entities.
 *
 * @template K - The key type, must extend PropertyKey
 * @template E - The entity type
 */
export interface ImmutableEntityCollection<K extends PropertyKey, E> {
  /**
   * Retrieves all entities associated with the given key.
   *
   * @param key - The key to look up
   * @returns Array of entities for the key, empty array if key not found
   */
  get(key: K): E[];

  /**
   * Returns an iterator over all key-entity array pairs.
   *
   * @returns Iterator yielding [key, entities[]] tuples
   */
  entries(): Iterator<[K, E[]]>;

  /**
   * Flattens all entities into a single array with metadata.
   * Each entity is returned as a tuple with the entity, its key, and plugin URN.
   *
   * @returns Array of [entity, key, pluginURN] tuples
   */
  flat(): [E, K, PluginURN][];

  /**
   * Maps over entity arrays by key, applying the transform function to each group.
   *
   * @template U - The return type of the mapping function
   * @param fn - Function that transforms an entity array and key into type U
   * @returns Array of transformed values
   */
  map<U>(fn: (entities: E[], key: K) => U): U[];

  /**
   * Flat maps over individual entities, applying the transform function to each entity.
   *
   * @template U - The return type of the mapping function
   * @param fn - Function that transforms an entity, key, and plugin URN into type U
   * @returns Array of transformed values
   */
  flatMap<U>(fn: (entity: E, key: K, plugin: PluginURN) => U): U[];

  /**
   * Makes the collection iterable over individual entities with metadata.
   * Each iteration yields a tuple of [entity, key, pluginURN].
   *
   * @returns Iterator yielding [entity, key, pluginURN] tuples
   */
  [Symbol.iterator](): Iterator<[E, K, PluginURN]>;
}

/**
 * Type representing a record of plugins mapped by their URNs.
 *
 * @template P - The plugin type, must extend ImmutablePlugin
 */
type ImmutablePlugins<P extends ImmutablePlugin<Record<PropertyKey, unknown>>> =
  Record<PluginURN, P>;

/**
 * Type that creates entity collections for each entity type in the plugin.
 * Maps entity keys to their corresponding ImmutableEntityCollection types.
 *
 * @template K - The entity key type, must extend PropertyKey
 * @template T - The entity types record
 */
type ImmutableEntityCollections<
  K extends PropertyKey,
  T extends { [k in K]: unknown },
> = {
  [k in K]: ImmutableEntityCollection<k, T[k]>;
};

/**
 * Type that extracts entity collections from a plugin's entities.
 * Creates the appropriate entity collections based on the plugin's entity configuration.
 *
 * @template P - The plugin type, must extend ImmutablePlugin
 */
type ImmutableEntityCollectionsFromPlugin<
  P extends ImmutablePlugin<Record<PropertyKey, unknown>>,
> = ImmutableEntityCollections<keyof P['entities'], P['entities']>;

/**
 * Main host class that manages immutable plugins and provides centralized entity discovery.
 * The host maintains the full set of entities available by plugin and provides
 * type-safe access to all entity collections.
 *
 * @template P - The plugin type, must extend ImmutablePlugin
 */
export declare class ImmutableHost<
  P extends ImmutablePlugin<Record<PropertyKey, unknown>>,
> {
  /**
   * Creates a new ImmutableHost with the provided plugins.
   *
   * @param plugins - Record of plugins mapped by their URNs
   */
  constructor(plugins: ImmutablePlugins<P>);

  /**
   * All plugins managed by this host, indexed by their URNs.
   */
  readonly plugins: ImmutablePlugins<P>;

  /**
   * Entity collections derived from all plugins, organized by entity type.
   * Provides centralized type-safe discovery for entities across all plugins.
   */
  readonly entities: ImmutableEntityCollectionsFromPlugin<P>;
}
