[immutable-plugin-system](../README.md) / isImmutablePlugins

# Function: isImmutablePlugins()

> **isImmutablePlugins**(`plugins`): plugins is Record\<string, ImmutablePlugin\<Readonly\<Record\<PropertyKey, Readonly\<Record\<string \| symbol, \{\}\>\>\>\>\>\>

Defined in: [guards/plugins.ts:13](https://github.com/agladysh/immutable-plugin-system/blob/main/src/guards/plugins.ts#L13)

Predicate that checks if a value is a record of immutable plugins keyed by
URN and each plugin's `name` matches its key.

## Parameters

### plugins

`unknown`

## Returns

plugins is Record\<string, ImmutablePlugin\<Readonly\<Record\<PropertyKey, Readonly\<Record\<string \| symbol, \{\}\>\>\>\>\>\>
