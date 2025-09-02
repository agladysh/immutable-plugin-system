[immutable-plugin-system](../README.md) / NonEmptyString

# Type Alias: NonEmptyString\<S\>

> **NonEmptyString**\<`S`\> = `""` *extends* `S` ? `never` : `S`

Defined in: [types.ts:18](https://github.com/agladysh/immutable-plugin-system/blob/main/src/types.ts#L18)

Compile-time erasure of the empty string literal from a string type.

## Type Parameters

### S

`S` *extends* `string` = `string`

## Remarks

- For the broad `string`, the empty string remains allowed at the type level
  for ergonomics; runtime guards still reject empty keys where applicable.
- For literal unions, `''` is excluded precisely.
