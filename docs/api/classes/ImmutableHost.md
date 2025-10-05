[immutable-plugin-system](../README.md) / ImmutableHost

# Class: ImmutableHost\<P\>

Defined in: [ImmutableHost.ts:61](https://github.com/agladysh/immutable-plugin-system/blob/main/src/ImmutableHost.ts#L61)

Main host class that manages immutable plugins and provides centralized entity discovery.
The host maintains the full set of entities available by plugin and provides
type-safe access to all entity collections.

## Type Parameters

### P

`P` *extends* [`ImmutablePlugin`](../interfaces/ImmutablePlugin.md)\<[`ImmutableEntitiesRecord`](../type-aliases/ImmutableEntitiesRecord.md)\>

The plugin type, must extend ImmutablePlugin

## Constructors

### Constructor

> **new ImmutableHost**\<`P`\>(`plugins`): `ImmutableHost`\<`P`\>

Defined in: [ImmutableHost.ts:82](https://github.com/agladysh/immutable-plugin-system/blob/main/src/ImmutableHost.ts#L82)

Creates a new ImmutableHost with the provided plugins.
Groups entities from all plugins by entity type into collections and
enforces that every declared entity type is present on each plugin.

#### Parameters

##### plugins

[`ImmutablePlugins`](../type-aliases/ImmutablePlugins.md)\<`P`\>

Record of plugins mapped by their URNs

#### Returns

`ImmutableHost`\<`P`\>

#### Throws

TypeError if any plugin is invalid, has mismatched URN, or is
 missing a declared entity type

## Properties

### entities

> `readonly` **entities**: [`ImmutableEntityCollectionsFromPlugin`](../type-aliases/ImmutableEntityCollectionsFromPlugin.md)\<`P`\>

Defined in: [ImmutableHost.ts:71](https://github.com/agladysh/immutable-plugin-system/blob/main/src/ImmutableHost.ts#L71)

Entity collections derived from all plugins, organized by entity type.
Provides centralized type-safe discovery for entities across all plugins.

***

### plugins

> `readonly` **plugins**: [`ImmutablePlugins`](../type-aliases/ImmutablePlugins.md)\<`P`\>

Defined in: [ImmutableHost.ts:65](https://github.com/agladysh/immutable-plugin-system/blob/main/src/ImmutableHost.ts#L65)

All plugins managed by this host, indexed by their URNs.
