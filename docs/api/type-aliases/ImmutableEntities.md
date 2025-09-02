[immutable-plugin-system](../README.md) / ImmutableEntities

# Type Alias: ImmutableEntities\<K, V\>

> **ImmutableEntities**\<`K`, `V`\> = `Readonly`\<`Record`\<`_NormalizedString`\<`_StringPart`\<`K`\>\> \| `_NonStringPart`\<`K`\>, `NonNullable`\<`V`\>\>\>

Defined in: [types.ts:69](https://github.com/agladysh/immutable-plugin-system/blob/1e3844304b71a6cb1d44c2f57e31e6fc81a4ed82/src/types.ts#L69)

Inner entity map type with normalized key constraints and defined values.

## Type Parameters

### K

`K` *extends* `string` \| `symbol`

### V

`V`
