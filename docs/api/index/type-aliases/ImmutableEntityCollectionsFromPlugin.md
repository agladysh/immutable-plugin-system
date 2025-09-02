[immutable-plugin-system](../../README.md) / [index](../README.md) / ImmutableEntityCollectionsFromPlugin

# Type Alias: ImmutableEntityCollectionsFromPlugin\<P\>

> **ImmutableEntityCollectionsFromPlugin**\<`P`\> = [`ImmutableEntityCollections`](ImmutableEntityCollections.md)\<keyof `P`\[`"entities"`\], `P`\[`"entities"`\]\>

Defined in: [ImmutableHost.ts:50](https://github.com/agladysh/immutable-plugin-system/blob/6e42ed226f57386126fa674261cc4cffcef8c585/src/ImmutableHost.ts#L50)

Helper alias used to derive the entity collections mapping from a
plugin's entities definition.

## Type Parameters

### P

`P` *extends* [`ImmutablePlugin`](../interfaces/ImmutablePlugin.md)\<[`ImmutableEntitiesRecord`](ImmutableEntitiesRecord.md)\>
