import type {
  ImmutableEntities,
  ImmutableEntitiesRecord,
  ImmutablePlugin,
  ImmutablePlugins,
  PluginURN,
} from './types.js';
import { ImmutableEntityCollection } from './ImmutableEntityCollection.js';
import { assertImmutablePlugins } from './guards/plugins.js';
import { assertEntityRecord } from './guards/entity-record.js';

/**
 * Typed helper to get all own keys (including symbols) of an object.
 * Returns keys narrowed to the object's keyof type intersected with PropertyKey.
 */
function ownKeys<T extends object>(
  obj: T
): Array<Extract<keyof T, PropertyKey>> {
  return Reflect.ownKeys(obj as object) as Array<Extract<keyof T, PropertyKey>>;
}

/**
 * Type that creates entity collections for each entity type in the plugin.
 * Maps entity keys to their corresponding ImmutableEntityCollection types.
 * This implementation correctly handles the constraint that all entity types are records.
 *
 * @typeParam K - The entity key type, must extend PropertyKey
 * @typeParam T - The entity types record, where each value must be a record
 */
export type ImmutableEntityCollections<
  K extends PropertyKey,
  T extends { [k in K]: ImmutableEntitiesRecord[PropertyKey] },
> = {
  readonly [k in K]-?: ImmutableEntityCollection<
    Extract<keyof T[k], string | symbol>,
    T[k][keyof T[k]]
  >;
};

/**
 * Type that extracts entity collections from a plugin's entities.
 * Creates the appropriate entity collections based on the plugin's entity configuration.
 *
 * @typeParam P - The plugin type, must extend ImmutablePlugin
 */
/**
 * Helper alias used to derive the entity collections mapping from a plugin's
 * entities definition.
 */
export type ImmutableEntityCollectionsFromPlugin<
  P extends ImmutablePlugin<ImmutableEntitiesRecord>,
> = ImmutableEntityCollections<keyof P['entities'], P['entities']>;

/**
 * Main host class that manages immutable plugins and provides centralized entity discovery.
 * The host maintains the full set of entities available by plugin and provides
 * type-safe access to all entity collections.
 *
 * @typeParam P - The plugin type, must extend ImmutablePlugin
 */
export class ImmutableHost<P extends ImmutablePlugin<ImmutableEntitiesRecord>> {
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
   * Groups entities from all plugins by entity type into collections and
   * enforces that every declared entity type is present on each plugin.
   *
   * @param plugins - Record of plugins mapped by their URNs
   * @throws TypeError if any plugin is invalid, has mismatched URN, or is
   *  missing a declared entity type
   */
  constructor(plugins: ImmutablePlugins<P>) {
    // Validate plugins at runtime for additional type safety
    assertImmutablePlugins(plugins);
    this.plugins = { ...plugins };

    // Build entity collections by grouping entities from all plugins by type
    const entityCollections: Partial<ImmutableEntityCollectionsFromPlugin<P>> =
      {};

    // Collect the set of entity types advertised by the plugins
    const allEntityTypes = new Set<keyof P['entities']>();
    for (const plugin of Object.values(plugins)) {
      // Include symbol keys as entity types
      for (const entityType of ownKeys(plugin.entities) as Array<
        keyof P['entities']
      >) {
        allEntityTypes.add(entityType);
      }
    }

    // Ensure there is a consistent set of entity types across all plugins
    for (const [pluginURN, plugin] of Object.entries(plugins)) {
      for (const entityType of allEntityTypes) {
        if (!Object.hasOwn(plugin.entities, entityType as PropertyKey)) {
          throw new TypeError(
            `plugin "${pluginURN}" is missing entity type ${String(entityType)}`
          );
        }
        assertEntityRecord(plugin.entities[entityType]);
      }
    }

    // For each entity type, create a collection with entities from all plugins
    for (const entityType of allEntityTypes) {
      // Infer inner key/value types from the plugin's declaration for this entity type
      type ET = typeof entityType;
      type EntitiesMap = P['entities'][ET];
      type KType = Extract<keyof EntitiesMap, string | symbol>;
      type VType = EntitiesMap[keyof EntitiesMap];

      const pluginEntitiesForType = {} as Record<
        PluginURN,
        ImmutableEntities<KType, VType>
      >;

      // Collect entities of this type from all plugins
      for (const [pluginURN, plugin] of Object.entries(plugins)) {
        const entitiesOfType = plugin.entities[entityType];
        assertEntityRecord(entitiesOfType);
        pluginEntitiesForType[pluginURN] = entitiesOfType as ImmutableEntities<
          KType,
          VType
        >;
      }

      // Create entity collection for this entity type
      entityCollections[entityType] = new ImmutableEntityCollection<
        KType,
        VType
      >(pluginEntitiesForType);
    }

    // Safe assignment: entityCollections structure matches expected type
    this.entities =
      entityCollections as ImmutableEntityCollectionsFromPlugin<P>;
  }
}
