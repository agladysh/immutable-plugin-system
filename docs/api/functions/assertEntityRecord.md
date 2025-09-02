[immutable-plugin-system](../README.md) / assertEntityRecord

# Function: assertEntityRecord()

> **assertEntityRecord**(`value`): `asserts value is Record<symbol, unknown>`

Defined in: [guards/entity-record.ts:64](https://github.com/agladysh/immutable-plugin-system/blob/main/src/guards/entity-record.ts#L64)

Assertion variant of isEntityRecord that throws on failure.

## Parameters

### value

`unknown`

Candidate value

## Returns

`asserts value is Record<symbol, unknown>`

## Throws

TypeError if value is not a valid entity record
