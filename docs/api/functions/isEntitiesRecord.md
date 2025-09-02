[immutable-plugin-system](../README.md) / isEntitiesRecord

# Function: isEntitiesRecord()

> **isEntitiesRecord**(`value`): value is Readonly\<Record\<PropertyKey, Readonly\<Record\<string \| symbol, \{\}\>\>\>\>

Defined in: [guards/entities-record.ts:10](https://github.com/agladysh/immutable-plugin-system/blob/1e3844304b71a6cb1d44c2f57e31e6fc81a4ed82/src/guards/entities-record.ts#L10)

Predicate that checks whether a value is an `ImmutableEntitiesRecord`.
Value must be a plain object where each own property value is a valid inner
entity record.

## Parameters

### value

`unknown`

## Returns

value is Readonly\<Record\<PropertyKey, Readonly\<Record\<string \| symbol, \{\}\>\>\>\>
