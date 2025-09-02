[immutable-plugin-system](../../README.md) / [index](../README.md) / ImmutableEntitiesRecord

# Type Alias: ImmutableEntitiesRecord\<K, V\>

> **ImmutableEntitiesRecord**\<`K`, `V`\> = `Readonly`\<`Record`\<`PropertyKey`, [`ImmutableEntities`](ImmutableEntities.md)\<`K`, `V`\>\>\>

Defined in: [types.ts:79](https://github.com/agladysh/immutable-plugin-system/blob/6e42ed226f57386126fa674261cc4cffcef8c585/src/types.ts#L79)

Entities record grouped by entity type (top-level key) to inner entity maps.
Conforms to the specification alias name.

## Type Parameters

### K

`K` *extends* `string` \| `symbol` = `string` \| `symbol`

### V

`V` = `unknown`

The value type stored in entity maps
