[immutable-plugin-system](../../README.md) / [index](../README.md) / isEntitiesRecord

# Function: isEntitiesRecord()

> **isEntitiesRecord**(`value`): value is Readonly\<Record\<PropertyKey, Readonly\<Record\<string \| symbol, \{\}\>\>\>\>

Defined in: [guards/entities-record.ts:10](https://github.com/agladysh/immutable-plugin-system/blob/6e42ed226f57386126fa674261cc4cffcef8c585/src/guards/entities-record.ts#L10)

Predicate that checks whether a value is an `ImmutableEntitiesRecord`.
Value must be a plain object where each own property value is a valid inner
entity record.

## Parameters

### value

`unknown`

## Returns

value is Readonly\<Record\<PropertyKey, Readonly\<Record\<string \| symbol, \{\}\>\>\>\>
