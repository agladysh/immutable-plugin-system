[immutable-plugin-system](../README.md) / ImmutablePlugins

# Type Alias: ImmutablePlugins\<P\>

> **ImmutablePlugins**\<`P`\> = `Readonly`\<`Record`\<[`PluginURN`](PluginURN.md), `P`\>\>

Defined in: [types.ts:111](https://github.com/agladysh/immutable-plugin-system/blob/1e3844304b71a6cb1d44c2f57e31e6fc81a4ed82/src/types.ts#L111)

Type representing a record of plugins mapped by their URNs.
This type is used to define collections of plugins for the host.

## Type Parameters

### P

`P` *extends* [`ImmutablePlugin`](../interfaces/ImmutablePlugin.md) = [`ImmutablePlugin`](../interfaces/ImmutablePlugin.md)

The plugin type, must extend ImmutablePlugin
