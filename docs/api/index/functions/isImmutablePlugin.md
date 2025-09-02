[immutable-plugin-system](../../README.md) / [index](../README.md) / isImmutablePlugin

# Function: isImmutablePlugin()

> **isImmutablePlugin**(`plugin`, `options?`): plugin is ImmutablePlugin\<Readonly\<Record\<PropertyKey, Readonly\<Record\<string \| symbol, \{\}\>\>\>\>\>

Defined in: [guards/plugin.ts:23](https://github.com/agladysh/immutable-plugin-system/blob/6e42ed226f57386126fa674261cc4cffcef8c585/src/guards/plugin.ts#L23)

Type guard for ImmutablePlugin shape with optional enforcement of required entity types.

Validates:
- `name` exists and is a non-empty string.
- `entities` is a plain object (container-level validation).
- Each inner entity map is a valid entity record (plain + no invalid keys), for both string and symbol keys.
- Optionally enforces that specific entity types are present and valid when `options.requiredEntityTypes` is provided.

## Parameters

### plugin

`unknown`

Runtime candidate

### options?

Optional validation options. Typing note: `requiredEntityTypes`
  is provided as `readonly PropertyKey[]` here because no generic plugin
  context exists in standalone guards. The `ImmutableHost` constructor accepts
  a compile-time typed list `readonly (keyof P['entities'])[]` for the same
  semantics.

#### requiredEntityTypes?

readonly `PropertyKey`[]

## Returns

plugin is ImmutablePlugin\<Readonly\<Record\<PropertyKey, Readonly\<Record\<string \| symbol, \{\}\>\>\>\>\>

True if candidate matches ImmutablePlugin runtime contract
