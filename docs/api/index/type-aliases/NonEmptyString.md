[immutable-plugin-system](../../README.md) / [index](../README.md) / NonEmptyString

# Type Alias: NonEmptyString\<S\>

> **NonEmptyString**\<`S`\> = `""` *extends* `S` ? `never` : `S`

Defined in: [types.ts:18](https://github.com/agladysh/immutable-plugin-system/blob/6e42ed226f57386126fa674261cc4cffcef8c585/src/types.ts#L18)

Compile-time erasure of the empty string literal from a string type.

Notes:
- For the broad `string`, the empty string remains allowed at the type level
  (ergonomics). Runtime guards still reject empty keys where applicable.
- For literal unions, `''` is excluded precisely.

## Type Parameters

### S

`S` *extends* `string` = `string`
