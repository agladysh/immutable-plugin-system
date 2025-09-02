[immutable-plugin-system](../README.md) / ImmutablePlugins

# Type Alias: ImmutablePlugins\<P\>

> **ImmutablePlugins**\<`P`\> = `Readonly`\<`Record`\<[`PluginURN`](PluginURN.md), `P`\>\>

Defined in: [types.ts:112](https://github.com/agladysh/immutable-plugin-system/blob/main/src/types.ts#L112)

Type representing a record of plugins mapped by their URNs.
This type is used to define collections of plugins for the host.

## Type Parameters

### P

`P` *extends* [`ImmutablePlugin`](../interfaces/ImmutablePlugin.md) = [`ImmutablePlugin`](../interfaces/ImmutablePlugin.md)

The plugin type, must extend ImmutablePlugin
