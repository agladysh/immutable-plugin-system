/**
 * String identifier for plugins in the immutable plugin system.
 * Used to uniquely identify plugins within the host.
 */
export type PluginURN = string;

/**
 * Non-empty string type that excludes empty string literals.
 */
/**
 * Compile-time erasure of the empty string literal from a string type.
 *
 * Notes:
 * - For the broad `string`, the empty string remains allowed at the type level
 *   (ergonomics). Runtime guards still reject empty keys where applicable.
 * - For literal unions, `''` is excluded precisely.
 */
export type NonEmptyString<S extends string = string> = '' extends S
  ? never
  : S;

/**
 * Valid key type for inner entity maps.
 * Keys are textual (non-empty strings) or symbols; numeric keys are forbidden.
 */
/**
 * Alias for the allowed inner map keys (symbol or non-empty string).
 * Numeric keys are intentionally excluded by design; numeric-like strings are
 * rejected by runtime guards to avoid JS coercion ambiguity.
 */
export type ImmutableEntityKey = symbol | NonEmptyString;

/**
 * Type-safe record of entities mapped by keys with normalized string constraints.
 *
 * Goals (ergonomics + safety):
 * - Broad `string` keys remain `Record<string, V>` for usability (do not collapse to `never`).
 * - Literal string unions exclude the empty string at the type level via `NonEmptyString`.
 * - Non-string keys (e.g., `symbol`) are preserved as-is.
 * - Numeric keys are excluded by `ImmutableEntityKey`.
 *
 * Implementation: split `K` into its string and non-string parts. For string
 * keys, retain `string` if the input is the broad `string`; otherwise, apply
 * `NonEmptyString<…>` to erase `''` from literal unions. Intersect the two
 * records to reconstruct the full map type.
 *
 * @template K - The key type, must extend ImmutableEntityKey
 * @template V - The value type for entities
 */
/** String component of a key union. */
type _StringPart<K> = Extract<K, string>;
/** Non-string component (e.g., symbol) of a key union. */
type _NonStringPart<K> = Exclude<K, string>;
/**
 * Normalize string keys:
 * - keep broad `string` as-is for ergonomics;
 * - remove `''` from literal unions for correctness.
 */
type _NormalizedString<S> = S extends string
  ? string extends S
    ? string
    : NonEmptyString<S>
  : never;

/**
 * Inner entity map type with normalized key constraints and defined values.
 */
export type ImmutableEntities<K extends string | symbol, V> = Readonly<
  Record<_NormalizedString<_StringPart<K>> | _NonStringPart<K>, NonNullable<V>>
>;

/**
 * Entities record grouped by entity type (top-level key) to inner entity maps.
 * Conforms to the specification alias name.
 *
 * @template V - The value type stored in entity maps
 */
export type ImmutableEntitiesRecord<
  K extends string | symbol = string | symbol,
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
