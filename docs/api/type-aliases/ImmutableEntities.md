[immutable-plugin-system](../README.md) / ImmutableEntities

# Type Alias: ImmutableEntities\<K, V\>

> **ImmutableEntities**\<`K`, `V`\> = `Readonly`\<`Record`\<`_NormalizedString`\<`_StringPart`\<`K`\>\> \| `_NonStringPart`\<`K`\>, `NonNullable`\<`V`\>\>\>

Defined in: [types.ts:70](https://github.com/agladysh/immutable-plugin-system/blob/main/src/types.ts#L70)

Inner entity map type with normalized key constraints and defined values.

## Type Parameters

### K

`K` *extends* `string` \| `symbol`

### V

`V`
