[immutable-plugin-system](../README.md) / ImmutableHost

# Class: ImmutableHost\<P\>

Defined in: [ImmutableHost.ts:61](https://github.com/agladysh/immutable-plugin-system/blob/1e3844304b71a6cb1d44c2f57e31e6fc81a4ed82/src/ImmutableHost.ts#L61)

Main host class that manages immutable plugins and provides centralized entity discovery.
The host maintains the full set of entities available by plugin and provides
type-safe access to all entity collections.

## Type Parameters

### P

`P` *extends* [`ImmutablePlugin`](../interfaces/ImmutablePlugin.md)\<[`ImmutableEntitiesRecord`](../type-aliases/ImmutableEntitiesRecord.md)\>

The plugin type, must extend ImmutablePlugin

## Constructors

### Constructor

> **new ImmutableHost**\<`P`\>(`plugins`, `options?`): `ImmutableHost`\<`P`\>

Defined in: [ImmutableHost.ts:90](https://github.com/agladysh/immutable-plugin-system/blob/1e3844304b71a6cb1d44c2f57e31e6fc81a4ed82/src/ImmutableHost.ts#L90)

Creates a new ImmutableHost with the provided plugins.
Groups entities from all plugins by entity type into collections.

#### Parameters

##### plugins

[`ImmutablePlugins`](../type-aliases/ImmutablePlugins.md)\<`P`\>

Record of plugins mapped by their URNs

##### options?

Optional runtime validation options for integrations.
 - `requiredEntityTypes`: if provided, each plugin must have these entity
   types present as own properties and valid inner records. This augments
   structural validation; primary enforcement remains at the type level.

Typing note: The constructor accepts
`readonly (keyof P['entities'])[]` for `requiredEntityTypes` since the
generic `P` is known here. Standalone guard functions accept a runtime
`readonly PropertyKey[]` list for the same semantics (no generic context).

###### requiredEntityTypes?

readonly keyof `P`\[`"entities"`\][]

#### Returns

`ImmutableHost`\<`P`\>

#### Throws

TypeError if any plugin is invalid, has mismatched URN, or is
 missing a required entity type specified in `options`.

## Properties

### entities

> `readonly` **entities**: [`ImmutableEntityCollectionsFromPlugin`](../type-aliases/ImmutableEntityCollectionsFromPlugin.md)\<`P`\>

Defined in: [ImmutableHost.ts:71](https://github.com/agladysh/immutable-plugin-system/blob/1e3844304b71a6cb1d44c2f57e31e6fc81a4ed82/src/ImmutableHost.ts#L71)

Entity collections derived from all plugins, organized by entity type.
Provides centralized type-safe discovery for entities across all plugins.

***

### plugins

> `readonly` **plugins**: [`ImmutablePlugins`](../type-aliases/ImmutablePlugins.md)\<`P`\>

Defined in: [ImmutableHost.ts:65](https://github.com/agladysh/immutable-plugin-system/blob/1e3844304b71a6cb1d44c2f57e31e6fc81a4ed82/src/ImmutableHost.ts#L65)

All plugins managed by this host, indexed by their URNs.
