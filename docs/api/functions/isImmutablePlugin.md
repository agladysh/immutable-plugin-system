[immutable-plugin-system](../README.md) / isImmutablePlugin

# Function: isImmutablePlugin()

> **isImmutablePlugin**(`plugin`): plugin is ImmutablePlugin\<Readonly\<Record\<PropertyKey, Readonly\<Record\<string \| symbol, \{\}\>\>\>\>\>

Defined in: [guards/plugin.ts:17](https://github.com/agladysh/immutable-plugin-system/blob/main/src/guards/plugin.ts#L17)

Type guard for ImmutablePlugin shape.

Validates:
- `name` exists and is a non-empty string.
- `entities` is a plain object (container-level validation).
- Each inner entity map is a valid entity record (plain + no invalid keys), for both string and symbol keys.

## Parameters

### plugin

`unknown`

Runtime candidate

## Returns

plugin is ImmutablePlugin\<Readonly\<Record\<PropertyKey, Readonly\<Record\<string \| symbol, \{\}\>\>\>\>\>

True if candidate matches ImmutablePlugin runtime contract
