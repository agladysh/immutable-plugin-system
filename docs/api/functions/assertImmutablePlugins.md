[immutable-plugin-system](../README.md) / assertImmutablePlugins

# Function: assertImmutablePlugins()

> **assertImmutablePlugins**(`plugins`, `options?`): asserts plugins is Record\<string, ImmutablePlugin\<Readonly\<Record\<PropertyKey, Readonly\<Record\<string \| symbol, \{\}\>\>\>\>\>\>

Defined in: [guards/plugins.ts:46](https://github.com/agladysh/immutable-plugin-system/blob/1e3844304b71a6cb1d44c2f57e31e6fc81a4ed82/src/guards/plugins.ts#L46)

Assertion over a plugins record. Ensures each plugin is structurally valid
and its `name` matches its URN key. Optionally enforces presence and
validity of `options.requiredEntityTypes` for each plugin. Typing note:
see `isImmutablePlugins` on the rationale for using `PropertyKey[]` in
guards vs. a typed list in the host constructor.

## Parameters

### plugins

`Record`\<[`PluginURN`](../type-aliases/PluginURN.md), `unknown`\>

Record of plugins by URN

### options?

Optional validation options

#### requiredEntityTypes?

readonly `PropertyKey`[]

## Returns

asserts plugins is Record\<string, ImmutablePlugin\<Readonly\<Record\<PropertyKey, Readonly\<Record\<string \| symbol, \{\}\>\>\>\>\>\>

## Throws

TypeError if any plugin is invalid or has mismatched URN, or if required entity types are missing/invalid
