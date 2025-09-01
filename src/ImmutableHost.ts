import type {
  ImmutableEntities,
  ImmutableEntitiesRecord,
  ImmutablePlugin,
  ImmutablePlugins,
  PluginURN,
} from './types.js';
import { ImmutableEntityCollection } from './ImmutableEntityCollection.js';
import { assertImmutablePlugins } from './guards/plugins.js';
import { isEntityRecord } from './guards/entity-record.js';

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
 * @template K - The entity key type, must extend PropertyKey
 * @template T - The entity types record, where each value must be a record
 */
type ImmutableEntityCollections<
  K extends PropertyKey,
  T extends { [k in K]: ImmutableEntitiesRecord[PropertyKey] },
> = {
  readonly [k in K]: ImmutableEntityCollection<
    Extract<keyof T[k], string | symbol>,
    T[k][keyof T[k]]
  >;
};

/**
 * Type that extracts entity collections from a plugin's entities.
 * Creates the appropriate entity collections based on the plugin's entity configuration.
 *
 * @template P - The plugin type, must extend ImmutablePlugin
 */
type ImmutableEntityCollectionsFromPlugin<
  P extends ImmutablePlugin<ImmutableEntitiesRecord>,
> = ImmutableEntityCollections<keyof P['entities'], P['entities']>;

/**
 * Main host class that manages immutable plugins and provides centralized entity discovery.
 * The host maintains the full set of entities available by plugin and provides
 * type-safe access to all entity collections.
 *
 * @template P - The plugin type, must extend ImmutablePlugin
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
   * Groups entities from all plugins by entity type into collections.
   *
   * @param plugins - Record of plugins mapped by their URNs
   * @param options - Optional runtime validation options for integrations.
   *  - `requiredEntityTypes`: if provided, each plugin must have these entity
   *    types present as own properties and valid inner records. This augments
   *    structural validation; primary enforcement remains at the type level.
   *
   * Typing note: The constructor accepts
   * `readonly (keyof P['entities'])[]` for `requiredEntityTypes` since the
   * generic `P` is known here. Standalone guard functions accept a runtime
   * `readonly PropertyKey[]` list for the same semantics (no generic context).
   * @throws TypeError if any plugin is invalid, has mismatched URN, or is
   *  missing a required entity type specified in `options`.
   */
  constructor(
    plugins: ImmutablePlugins<P>,
    options?: { requiredEntityTypes?: readonly (keyof P['entities'])[] }
  ) {
    // Validate plugins at runtime for additional type safety
    assertImmutablePlugins(plugins, options);
    this.plugins = { ...plugins };

    // Build entity collections by grouping entities from all plugins by type
    const entityCollections: Partial<ImmutableEntityCollectionsFromPlugin<P>> =
      {};

    // Get all unique entity type names across all plugins using efficient key iteration
    const allEntityTypes = new Set<keyof P['entities']>();
    for (const plugin of Object.values(plugins)) {
      // Include symbol keys as entity types
      for (const entityType of ownKeys(plugin.entities) as Array<
        keyof P['entities']
      >) {
        allEntityTypes.add(entityType);
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
        if (entitiesOfType != null && isEntityRecord(entitiesOfType)) {
          pluginEntitiesForType[pluginURN] =
            entitiesOfType as ImmutableEntities<KType, VType>;
        }
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
