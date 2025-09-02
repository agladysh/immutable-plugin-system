[immutable-plugin-system](../README.md) / ImmutableEntityCollectionsFromPlugin

# Type Alias: ImmutableEntityCollectionsFromPlugin\<P\>

> **ImmutableEntityCollectionsFromPlugin**\<`P`\> = [`ImmutableEntityCollections`](ImmutableEntityCollections.md)\<keyof `P`\[`"entities"`\], `P`\[`"entities"`\]\>

Defined in: [ImmutableHost.ts:50](https://github.com/agladysh/immutable-plugin-system/blob/1e3844304b71a6cb1d44c2f57e31e6fc81a4ed82/src/ImmutableHost.ts#L50)

Helper alias used to derive the entity collections mapping from a
plugin's entities definition.

## Type Parameters

### P

`P` *extends* [`ImmutablePlugin`](../interfaces/ImmutablePlugin.md)\<[`ImmutableEntitiesRecord`](ImmutableEntitiesRecord.md)\>
