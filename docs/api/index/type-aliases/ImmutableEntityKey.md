[immutable-plugin-system](../../README.md) / [index](../README.md) / ImmutableEntityKey

# Type Alias: ImmutableEntityKey

> **ImmutableEntityKey** = `symbol` \| [`NonEmptyString`](NonEmptyString.md)

Defined in: [types.ts:31](https://github.com/agladysh/immutable-plugin-system/blob/6e42ed226f57386126fa674261cc4cffcef8c585/src/types.ts#L31)

Alias for the allowed inner map keys (symbol or non-empty string).
Numeric keys are intentionally excluded by design; numeric-like strings are
rejected by runtime guards to avoid JS coercion ambiguity.
