[immutable-plugin-system](../README.md) / NonEmptyString

# Type Alias: NonEmptyString\<S\>

> **NonEmptyString**\<`S`\> = `""` *extends* `S` ? `never` : `S`

Defined in: [types.ts:18](https://github.com/agladysh/immutable-plugin-system/blob/1e3844304b71a6cb1d44c2f57e31e6fc81a4ed82/src/types.ts#L18)

Compile-time erasure of the empty string literal from a string type.

Notes:
- For the broad `string`, the empty string remains allowed at the type level
  (ergonomics). Runtime guards still reject empty keys where applicable.
- For literal unions, `''` is excluded precisely.

## Type Parameters

### S

`S` *extends* `string` = `string`
