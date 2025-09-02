[immutable-plugin-system](../README.md) / ImmutablePlugin

# Interface: ImmutablePlugin\<C\>

Defined in: [types.ts:91](https://github.com/agladysh/immutable-plugin-system/blob/main/src/types.ts#L91)

Interface representing an immutable plugin in the plugin system.
Plugins expose typed read-only entities to the host and other plugins.

## Type Parameters

### C

`C` *extends* [`ImmutableEntitiesRecord`](../type-aliases/ImmutableEntitiesRecord.md) = [`ImmutableEntitiesRecord`](../type-aliases/ImmutableEntitiesRecord.md)

The entities configuration type, where each entity type must be a record

## Properties

### entities

> `readonly` **entities**: `Readonly`\<`C`\>

Defined in: [types.ts:103](https://github.com/agladysh/immutable-plugin-system/blob/main/src/types.ts#L103)

The entities exposed by this plugin.
All entities are immutable and cannot be modified at runtime.

***

### name

> `readonly` **name**: `string`

Defined in: [types.ts:97](https://github.com/agladysh/immutable-plugin-system/blob/main/src/types.ts#L97)

Unique identifier for this plugin.
