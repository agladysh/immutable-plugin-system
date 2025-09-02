[immutable-plugin-system](../README.md) / isPlainObject

# Function: isPlainObject()

> **isPlainObject**(`value`): `value is Record<PropertyKey, unknown>`

Defined in: [guards/plain-object.ts:15](https://github.com/agladysh/immutable-plugin-system/blob/1e3844304b71a6cb1d44c2f57e31e6fc81a4ed82/src/guards/plain-object.ts#L15)

Plain-object guard used for container validation.

Accepts objects with prototype `Object.prototype` or `null` and rejects arrays,
class instances, and exotic built-ins implicitly via the prototype check.

Rationale: We use this for validating the top-level `plugin.entities` map where
key type is intentionally broader (strings, numbers, symbols) and we only need
to establish the "plain object" container shape. Specific key constraints are
applied by more specialized guards.

## Parameters

### value

`unknown`

The runtime value to validate

## Returns

`value is Record<PropertyKey, unknown>`

True if the value is a plain object
