[immutable-plugin-system](../README.md) / assertEntityRecord

# Function: assertEntityRecord()

> **assertEntityRecord**(`value`): `asserts value is Record<symbol, unknown>`

Defined in: [guards/entity-record.ts:64](https://github.com/agladysh/immutable-plugin-system/blob/1e3844304b71a6cb1d44c2f57e31e6fc81a4ed82/src/guards/entity-record.ts#L64)

Assertion variant of isEntityRecord that throws on failure.

## Parameters

### value

`unknown`

Candidate value

## Returns

`asserts value is Record<symbol, unknown>`

## Throws

TypeError if value is not a valid entity record
