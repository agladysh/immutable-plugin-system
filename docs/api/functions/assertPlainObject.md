[immutable-plugin-system](../README.md) / assertPlainObject

# Function: assertPlainObject()

> **assertPlainObject**(`value`): `asserts value is Record<PropertyKey, unknown>`

Defined in: [guards/plain-object.ts:31](https://github.com/agladysh/immutable-plugin-system/blob/main/src/guards/plain-object.ts#L31)

Assertion variant of isPlainObject that throws on failure.

## Parameters

### value

`unknown`

Candidate value

## Returns

`asserts value is Record<PropertyKey, unknown>`

## Throws

TypeError if value is not a plain object
