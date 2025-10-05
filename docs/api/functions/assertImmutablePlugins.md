[immutable-plugin-system](../README.md) / assertImmutablePlugins

# Function: assertImmutablePlugins()

> **assertImmutablePlugins**(`plugins`): asserts plugins is Record\<string, ImmutablePlugin\<Readonly\<Record\<PropertyKey, Readonly\<Record\<string \| symbol, \{\}\>\>\>\>\>\>

Defined in: [guards/plugins.ts:38](https://github.com/agladysh/immutable-plugin-system/blob/main/src/guards/plugins.ts#L38)

Assertion over a plugins record. Ensures each plugin is structurally valid
and its `name` matches its URN key.

## Parameters

### plugins

`Record`\<[`PluginURN`](../type-aliases/PluginURN.md), `unknown`\>

Record of plugins by URN

## Returns

asserts plugins is Record\<string, ImmutablePlugin\<Readonly\<Record\<PropertyKey, Readonly\<Record\<string \| symbol, \{\}\>\>\>\>\>\>

## Throws

TypeError if any plugin is invalid, has mismatched URN, or contains an
 invalid entities record
