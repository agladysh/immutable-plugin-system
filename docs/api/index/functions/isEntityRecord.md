[immutable-plugin-system](../../README.md) / [index](../README.md) / isEntityRecord

# Function: isEntityRecord()

> **isEntityRecord**(`value`): `value is Record<symbol, unknown>`

Defined in: [guards/entity-record.ts:53](https://github.com/agladysh/immutable-plugin-system/blob/6e42ed226f57386126fa674261cc4cffcef8c585/src/guards/entity-record.ts#L53)

Type guard for inner entity maps: requires a plain object with only symbol or
non-numeric, non-empty string keys.

Rationale: Avoid ambiguity with numeric object keys (coerced to strings in JS)
and ensure predictable textual identifiers for entity keys. Matches the API
contract where inner map keys exclude `number`.

## Parameters

### value

`unknown`

Candidate value

## Returns

`value is Record<symbol, unknown>`

True if value is a valid entity record (plain + no invalid keys)
