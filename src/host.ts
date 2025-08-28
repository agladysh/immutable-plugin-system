import type { ImmutablePlugin, ImmutablePlugins, PluginURN } from './types.js';
import { ImmutableEntityCollection } from './collection.js';
import { assertImmutablePlugins, isEntityRecord } from './guards.js';

// Type guard helpers moved to src/guards.ts

// Plugin guard and assertion are defined in src/guards.ts

/**
 * Type that creates entity collections for each entity type in the plugin.
 * Maps entity keys to their corresponding ImmutableEntityCollection types.
 * This implementation correctly handles the constraint that all entity types are records.
 *
 * @template K - The entity key type, must extend PropertyKey
 * @template T - The entity types record, where each value must be a record
 */
type ImmutableEntityCollections<
  K extends PropertyKey,
  T extends { [k in K]: Record<Exclude<PropertyKey, number>, unknown> },
> = {
  [k in K]: ImmutableEntityCollection<keyof T[k], T[k][keyof T[k]]>;
};

/**
 * Type that extracts entity collections from a plugin's entities.
 * Creates the appropriate entity collections based on the plugin's entity configuration.
 *
 * @template P - The plugin type, must extend ImmutablePlugin
 */
type ImmutableEntityCollectionsFromPlugin<
  P extends ImmutablePlugin<
    Record<PropertyKey, Record<Exclude<PropertyKey, number>, unknown>>
  >,
> = ImmutableEntityCollections<keyof P['entities'], P['entities']>;

/**
 * Main host class that manages immutable plugins and provides centralized entity discovery.
 * The host maintains the full set of entities available by plugin and provides
 * type-safe access to all entity collections.
 *
 * @template P - The plugin type, must extend ImmutablePlugin
 */
export class ImmutableHost<
  P extends ImmutablePlugin<
    Record<PropertyKey, Record<Exclude<PropertyKey, number>, unknown>>
  >,
> {
  /**
   * All plugins managed by this host, indexed by their URNs.
   */
  readonly plugins: ImmutablePlugins<P>;

  /**
   * Entity collections derived from all plugins, organized by entity type.
   * Provides centralized type-safe discovery for entities across all plugins.
   */
  readonly entities: ImmutableEntityCollectionsFromPlugin<P>;

  /**
   * Creates a new ImmutableHost with the provided plugins.
   * Groups entities from all plugins by entity type into collections.
   *
   * @param plugins - Record of plugins mapped by their URNs
   * @throws TypeError if any plugin is invalid or has mismatched URN
   */
  constructor(plugins: ImmutablePlugins<P>) {
    // Validate plugins at runtime for additional type safety
    assertImmutablePlugins(plugins);
    this.plugins = { ...plugins };

    // Build entity collections by grouping entities from all plugins by type
    const entityCollections = {} as Record<PropertyKey, unknown>;

    // Get all unique entity type names across all plugins using efficient key iteration
    const allEntityTypes = new Set<PropertyKey>();
    for (const plugin of Object.values(plugins)) {
      // Use Reflect.ownKeys for efficient iteration over all property keys (strings, numbers, symbols)
      for (const entityType of Reflect.ownKeys(plugin.entities)) {
        allEntityTypes.add(entityType);
      }
    }

    // For each entity type, create a collection with entities from all plugins
    for (const entityType of allEntityTypes) {
      const pluginEntitiesForType: Record<
        PluginURN,
        Record<PropertyKey, unknown>
      > = {};

      // Collect entities of this type from all plugins
      for (const [pluginURN, plugin] of Object.entries(plugins)) {
        const entitiesOfType = plugin.entities[entityType];
        if (entitiesOfType != null && isEntityRecord(entitiesOfType)) {
          // Type-safe assignment after runtime validation
          pluginEntitiesForType[pluginURN] = entitiesOfType;
        }
      }

      // Create entity collection for this entity type
      entityCollections[entityType] = new ImmutableEntityCollection(
        pluginEntitiesForType
      );
    }

    // Safe assignment: entityCollections structure matches expected type
    this.entities =
      entityCollections as ImmutableEntityCollectionsFromPlugin<P>;
  }
}
