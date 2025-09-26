import type { ImmutableEntities, PluginURN } from './types.js';

/**
 * Internal storage item that tracks an entity with its source plugin.
 *
 * @typeParam E - The entity type
 */
interface EntityWithPlugin<E> {
  /**
   * The entity value.
   */
  readonly entity: E;

  /**
   * The URN of the plugin that provided this entity.
   */
  readonly pluginURN: PluginURN;
}

/**
 * Implementation of immutable entity collections that provide convenient iteration methods.
 * Wraps Map\<K, E[]\> functionality with additional utility methods for working with entities.
 * Tracks which plugin each entity came from for proper attribution.
 *
 * @typeParam K - The key type, must extend PropertyKey
 * @typeParam E - The entity type
 */
export class ImmutableEntityCollection<K extends string | symbol, E> {
  /**
   * Internal storage mapping keys to arrays of entities with their plugin URNs.
   */
  private readonly storage = new Map<K, EntityWithPlugin<E>[]>();

  /**
   * Creates a new ImmutableEntityCollection from plugin entities.
   *
   * @param pluginEntities - Record of plugin URN to entities for that plugin
   */
  constructor(pluginEntities: Record<PluginURN, ImmutableEntities<K, E>>) {
    for (const [pluginURN, entities] of Object.entries(pluginEntities)) {
      // Iterate all own keys (string, number-as-string, symbol) exactly once
      for (const key of Reflect.ownKeys(entities) as K[]) {
        const entity = (entities as Record<PropertyKey, E>)[key as PropertyKey];
        if (entity === undefined) {
          throw new TypeError(
            `entity value must be defined for key "${String(key)}" in plugin "${pluginURN}"`
          );
        }
        const existing = this.storage.get(key) ?? [];
        existing.push({ entity, pluginURN });
        this.storage.set(key, existing);
      }
    }
  }

  /**
   * Retrieves all entities associated with the given key.
   *
   * @param key - The key to look up
   * @returns Array of entities for the key, empty array if key not found
   */
  get(key: K): E[] {
    const entities = this.storage.get(key);
    return entities ? entities.map((item) => item.entity) : [];
  }

  /**
   * Returns the number of unique keys in the collection.
   *
   * @returns The count of unique keys
   */
  get size(): number {
    return this.storage.size;
  }

  /**
   * Returns an iterator over the unique keys in the collection.
   *
   * @returns Iterator yielding unique keys in insertion order
   */
  keys(): IterableIterator<K> {
    return this.storage.keys();
  }

  /**
   * Returns an iterator over the entity arrays for each key in the collection.
   *
   * @returns Iterator yielding entity arrays in insertion order
   */
  values(): IterableIterator<E[]> {
    const storage = this.storage;
    function* gen(): IterableIterator<E[]> {
      for (const [, list] of storage.entries()) {
        yield list.map((item) => item.entity);
      }
    }
    return gen();
  }

  /**
   * Returns an iterator over all key-entity array pairs.
   *
   * @returns Iterator yielding [key, entities[]] tuples
   */
  entries(): IterableIterator<[K, E[]]> {
    const storage = this.storage;
    function* gen(): IterableIterator<[K, E[]]> {
      for (const [key, list] of storage.entries()) {
        yield [key, list.map((item) => item.entity)];
      }
    }
    return gen();
  }

  /**
   * Flattens all entities into a single array with metadata.
   * Each entity is returned as a tuple with the entity, its key, and plugin URN.
   *
   * @returns Array of [entity, key, pluginURN] tuples
   */
  flat(): [E, K, PluginURN][] {
    const result: [E, K, PluginURN][] = [];
    for (const [key, entityItems] of this.storage.entries()) {
      for (const { entity, pluginURN } of entityItems) {
        result.push([entity, key, pluginURN]);
      }
    }
    return result;
  }

  /**
   * Maps over entity arrays by key, applying the transform function to each group.
   *
   * @typeParam U - The return type of the mapping function
   * @param fn - Function that transforms an entity array and key into type U
   * @returns Array of transformed values
   */
  map<U>(fn: (entities: E[], key: K) => U): U[] {
    const result: U[] = [];
    for (const [key, entityItems] of this.storage.entries()) {
      const entities = entityItems.map((item) => item.entity);
      result.push(fn(entities, key));
    }
    return result;
  }

  /**
   * Flat maps over individual entities, applying the transform function to each entity.
   *
   * @typeParam U - The return type of the mapping function
   * @param fn - Function that transforms an entity, key, and plugin URN into type U
   * @returns Array of transformed values
   */
  flatMap<U>(fn: (entity: E, key: K, plugin: PluginURN) => U): U[] {
    const result: U[] = [];
    for (const [key, entityItems] of this.storage.entries()) {
      for (const { entity, pluginURN } of entityItems) {
        result.push(fn(entity, key, pluginURN));
      }
    }
    return result;
  }

  /**
   * Makes the collection iterable over individual entities with metadata.
   * Each iteration yields a tuple of [entity, key, pluginURN].
   *
   * @returns Iterator yielding [entity, key, pluginURN] tuples
   */
  [Symbol.iterator](): Iterator<[E, K, PluginURN]> {
    const flattened = this.flat();
    let index = 0;

    return {
      next(): IteratorResult<[E, K, PluginURN]> {
        if (index >= flattened.length) {
          return { done: true, value: undefined };
        }
        return { done: false, value: flattened[index++] };
      },
    };
  }
}
