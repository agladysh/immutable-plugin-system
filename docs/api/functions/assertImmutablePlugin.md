[immutable-plugin-system](../README.md) / assertImmutablePlugin

# Function: assertImmutablePlugin()

> **assertImmutablePlugin**(`plugin`, `options?`): asserts plugin is ImmutablePlugin\<Readonly\<Record\<PropertyKey, Readonly\<Record\<string \| symbol, \{\}\>\>\>\>\>

Defined in: [guards/plugin.ts:67](https://github.com/agladysh/immutable-plugin-system/blob/main/src/guards/plugin.ts#L67)

Assertion over a single plugin. Structural validation only by default;
optionally enforces presence and validity of `options.requiredEntityTypes`.
Typing note: see `isImmutablePlugin` for rationale on the `PropertyKey[]`
shape of `requiredEntityTypes` in guards vs host constructor typing.

## Parameters

### plugin

`unknown`

### options?

#### requiredEntityTypes?

readonly `PropertyKey`[]

## Returns

asserts plugin is ImmutablePlugin\<Readonly\<Record\<PropertyKey, Readonly\<Record\<string \| symbol, \{\}\>\>\>\>\>
