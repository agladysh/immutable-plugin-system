[immutable-plugin-system](../../README.md) / [index](../README.md) / assertEntitiesRecord

# Function: assertEntitiesRecord()

> **assertEntitiesRecord**(`value`): asserts value is Readonly\<Record\<PropertyKey, Readonly\<Record\<string \| symbol, \{\}\>\>\>\>

Defined in: [guards/entities-record.ts:36](https://github.com/agladysh/immutable-plugin-system/blob/6e42ed226f57386126fa674261cc4cffcef8c585/src/guards/entities-record.ts#L36)

Assertion variant of `isEntitiesRecord` that throws on failure.

## Parameters

### value

`unknown`

Runtime candidate for entities record

## Returns

asserts value is Readonly\<Record\<PropertyKey, Readonly\<Record\<string \| symbol, \{\}\>\>\>\>

## Throws

TypeError if validation fails
