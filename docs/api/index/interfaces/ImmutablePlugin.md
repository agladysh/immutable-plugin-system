[immutable-plugin-system](../../README.md) / [index](../README.md) / ImmutablePlugin

# Interface: ImmutablePlugin\<C\>

Defined in: [types.ts:90](https://github.com/agladysh/immutable-plugin-system/blob/6e42ed226f57386126fa674261cc4cffcef8c585/src/types.ts#L90)

Interface representing an immutable plugin in the plugin system.
Plugins expose typed read-only entities to the host and other plugins.

## Type Parameters

### C

`C` *extends* [`ImmutableEntitiesRecord`](../type-aliases/ImmutableEntitiesRecord.md) = [`ImmutableEntitiesRecord`](../type-aliases/ImmutableEntitiesRecord.md)

The entities configuration type, where each entity type must be a record

## Properties

### entities

> `readonly` **entities**: `Readonly`\<`C`\>

Defined in: [types.ts:102](https://github.com/agladysh/immutable-plugin-system/blob/6e42ed226f57386126fa674261cc4cffcef8c585/src/types.ts#L102)

The entities exposed by this plugin.
All entities are immutable and cannot be modified at runtime.

***

### name

> `readonly` **name**: `string`

Defined in: [types.ts:96](https://github.com/agladysh/immutable-plugin-system/blob/6e42ed226f57386126fa674261cc4cffcef8c585/src/types.ts#L96)

Unique identifier for this plugin.
