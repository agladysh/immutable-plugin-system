[immutable-plugin-system](../../README.md) / [index](../README.md) / ImmutableEntityCollections

# Type Alias: ImmutableEntityCollections\<K, T\>

> **ImmutableEntityCollections**\<`K`, `T`\> = \{ readonly \[k in K\]: ImmutableEntityCollection\<Extract\<keyof T\[k\], string \| symbol\>, T\[k\]\[keyof T\[k\]\]\> \}

Defined in: [ImmutableHost.ts:30](https://github.com/agladysh/immutable-plugin-system/blob/6e42ed226f57386126fa674261cc4cffcef8c585/src/ImmutableHost.ts#L30)

Type that creates entity collections for each entity type in the plugin.
Maps entity keys to their corresponding ImmutableEntityCollection types.
This implementation correctly handles the constraint that all entity types are records.

## Type Parameters

### K

`K` *extends* `PropertyKey`

The entity key type, must extend PropertyKey

### T

`T` *extends* `{ [k in K]: ImmutableEntitiesRecord[PropertyKey] }`

The entity types record, where each value must be a record
