[immutable-plugin-system](../../README.md) / [index](../README.md) / isImmutablePlugins

# Function: isImmutablePlugins()

> **isImmutablePlugins**(`plugins`, `options?`): plugins is Record\<string, ImmutablePlugin\<Readonly\<Record\<PropertyKey, Readonly\<Record\<string \| symbol, \{\}\>\>\>\>\>\>

Defined in: [guards/plugins.ts:17](https://github.com/agladysh/immutable-plugin-system/blob/6e42ed226f57386126fa674261cc4cffcef8c585/src/guards/plugins.ts#L17)

Predicate that checks if a value is a record of immutable plugins keyed by
URN and each plugin's `name` matches its key. Optionally enforces required
entity types on each plugin when provided via `options.requiredEntityTypes`.
Typing note: `requiredEntityTypes` is `readonly PropertyKey[]` here (no
generic plugin context). The `ImmutableHost` constructor accepts a compile‑time
typed `readonly (keyof P['entities'])[]` list for the same semantics.

## Parameters

### plugins

`unknown`

### options?

#### requiredEntityTypes?

readonly `PropertyKey`[]

## Returns

plugins is Record\<string, ImmutablePlugin\<Readonly\<Record\<PropertyKey, Readonly\<Record\<string \| symbol, \{\}\>\>\>\>\>\>
